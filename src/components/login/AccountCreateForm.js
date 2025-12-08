import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import ImageCategoryMapping from "../../hooks/ImageCategoryMapping";
import axios from "axios";
import Api from "../../Api";
import sleep from "../../hooks/Sleep";

const AccountCreationForm = ({ formMode, account }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.appRootReducer.isLoggedIn);
  const activeCategoryAgenda = useSelector(state => state.appRootReducer.activeCategoryAgenda);

  const initialState = useMemo(() => ({
    username: "",
    email: "",
    old_password: undefined,
    password: undefined,
    confirmPassword: undefined,
    type: "USER",
    description: "",
    profileImage: null,
    coverImage: null,
    profileImagePreview: "",
    coverImagePreview: "",
    message: "",
    messageType: "",
    oldPasswordError: "",
    passwordError: "",
    files: [],
  }), []);

  const [formState, setFormState] = useState(initialState);

  // Initialize form state based on mode
  useEffect(() => {
    const { id } = params;
    
    if (id && formMode === "update" && account) {
      setFormState({
        ...initialState,
        ...account,
        profileImagePreview: account.files?.find(x => x.category === "profile_image")?.path || "",
        coverImagePreview: account.files?.find(x => x.category === "cover_image")?.path || "",
      });
    } else if (formMode === "create") {
      setFormState({
        ...initialState,
        description: "",
      });
    }
  }, [formMode, params, account, initialState]);

  // Validate passwords match
  const validatePasswords = useCallback((password, confirmPassword) => {
    if (confirmPassword && password !== confirmPassword) {
      setFormState(prev => ({ ...prev, passwordError: "Passwords do not match!" }));
    } else {
      setFormState(prev => ({ ...prev, passwordError: "" }));
    }
  }, []);

  // Validate old password different from new
  const validateOldPasswords = useCallback((oldPassword, password) => {
    if (password && password === oldPassword) {
      setFormState(prev => ({ ...prev, oldPasswordError: "New password can't be the same!" }));
    } else {
      setFormState(prev => ({ ...prev, oldPasswordError: "" }));
    }
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormState(prev => {
      const newState = { ...prev, [name]: value };
      
      // Validate passwords when they change
      if (name === "password" || name === "confirmPassword") {
        validatePasswords(
          name === "password" ? value : prev.password,
          name === "confirmPassword" ? value : prev.confirmPassword
        );
      }
      
      if (name === "password" || name === "old_password") {
        validateOldPasswords(
          name === "old_password" ? value : prev.old_password,
          name === "password" ? value : prev.password
        );
      }
      
      return newState;
    });
  }, [validatePasswords, validateOldPasswords]);

  const calculateFileHash = useCallback(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }, []);

  const handleFileChange = useCallback(async (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file) {
      try {
        // 1. Request presigned upload URL
        const upload_response = await Api.get("/files/private/generate-upload-presigned-url", { 
          params: {
            filename: file.name,
            content_type: file.type
          },
          withCredentials: true
        });

        const upload_url = upload_response.data.url;

        // 2. Upload file to presigned URL
        await axios.put(upload_url, file, {
          headers: { "Content-Type": file.type },
        });

        // 3. Generate download URL
        const download_url = "https://d3skpo6i31hl4s.cloudfront.net/" + file.name;

        // 4. Save public image URL
        const hash = await calculateFileHash(file);
        setFormState(prevState => ({
          ...prevState,
          [name]: download_url,
          [`${name}Preview`]: URL.createObjectURL(file),
          files: [
            ...(prevState.files || []),
            {
              filename: file.name,
              content_type: file.type,
              category: ImageCategoryMapping[name] || "other",
              path: download_url,
              hash: hash,
              description: name,
            },
          ],
        }));

      } catch (error) {
        console.error("Error uploading file:", error);
        setFormState(prev => ({
          ...prev,
          message: "Error uploading image. Please try again.",
          messageType: "error",
        }));
      }
    }
  }, [calculateFileHash]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { old_password, password, confirmPassword } = formState;
    
    if (old_password != null && !(password != null && confirmPassword != null)) {
      setFormState(prev => ({ 
        ...prev, 
        message: "Please enter all the fields to change password.", 
        messageType: "error" 
      }));
      return;
    }

    if (password !== confirmPassword) {
      setFormState(prev => ({ 
        ...prev, 
        message: "Passwords do not match.", 
        messageType: "error" 
      }));
      return;
    }

    if (old_password != null && password != null && old_password === password) {
      setFormState(prev => ({ 
        ...prev, 
        message: "New and old password can be the same", 
        messageType: "error" 
      }));
      return;
    }

    let message = "";
    try {
      if (formMode === "create") {
        await Api.post("/accounts/private/create", 
          formState, 
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }
        );
        message = "Account created successfully!";
      } else {
        await Api.put(
          "/accounts/private/update",
          formState,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        message = "Account updated successfully!";
      }
      setFormState(prev => ({
        ...prev,
        message: message,
        messageType: "success",
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await sleep(2000);
      window.location.reload();
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        message: `Error submitting form. Please try again. Details ${error}`,
        messageType: "error",
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (error.response?.status === 401) {
        dispatch(setIsLoggedIn(false));
      }
    }
  }, [formState, formMode, dispatch]);

  const { message, messageType, username, email, old_password, password, confirmPassword, 
    passwordError, oldPasswordError, type, description, coverImagePreview, 
    profileImagePreview } = formState;

  if (!isLoggedIn) {
    dispatch(setActiveCategoryHeader("agenda"));
    return <Navigate to={activeCategoryAgenda} replace />;
  }

  return (
    <Container className="my-4">
      <Card className="shadow-lg p-5 rounded-4 border-0 bg-light">
        <h3 className="fw-bold text-center mb-4 text-dark">{formMode === "update" ? "Update" : "Create"} Account</h3>

        {message && (
          <div
            className={`alert ${
              messageType === "success"
                ? "alert-success"
                : "alert-danger"
            }`}
            role="alert"
          >
            {message}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
              placeholder="Enter your username"
              minLength={3}
              maxLength={50}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          {formMode === 'update' && (
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Old Password</Form.Label>
              <Form.Control
                type="password"
                name="old_password"
                value={old_password}
                onChange={handleChange}
                minLength="6"
                maxLength="100"
                placeholder="Enter your old password"
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              minLength="6"
              maxLength="100"
              placeholder="Enter your password"
              required={formMode === "create"}
            />
            {oldPasswordError && (
              <Alert variant="danger" className="mt-2 p-2">
                {oldPasswordError}
              </Alert>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required={formMode === "create"}
            />
            {passwordError && (
              <Alert variant="danger" className="mt-2 p-2">
                {passwordError}
              </Alert>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Account Type</Form.Label>
            <Form.Select
              name="type"
              value={type}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Description (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={description}
              onChange={handleChange}
              maxLength={1000}
              placeholder="Tell us about yourself"
            />
          </Form.Group>

          {/* Cover Image Upload */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Cover Image</Form.Label>
            <div
              className="border border-dashed p-4 text-center d-flex justify-content-center align-items-center"
              style={{ borderRadius: "5px", height: "120px", borderColor: "#ccc", cursor: "pointer" }}
              onClick={() => document.getElementById("coverImageUpload").click()}
            >
              <Form.Control
                type="file"
                id="coverImageUpload"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
                className="d-none"
              />
              <Button className="btn btn-dark btn-sm">Upload Cover Image</Button>
            </div>
            {coverImagePreview && (
              <div className="d-flex justify-content-center">
                <img
                  src={coverImagePreview}
                  alt="Cover Preview"
                  className="img-fluid mt-2"
                  style={{ maxHeight: "150px" }}
                />
              </div>
            )}
          </Form.Group> 

          {/* Profile Image Upload */}
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Profile Image</Form.Label>
            <div
              className="border border-dashed p-4 text-center d-flex justify-content-center align-items-center"
              style={{ borderRadius: "5px", height: "120px", borderColor: "#ccc", cursor: "pointer" }}
              onClick={() => document.getElementById("profileImageUpload").click()}
            >
              <Form.Control
                type="file"
                id="profileImageUpload"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="d-none"
              />
              <Button className="btn btn-dark btn-sm">Upload Profile Image</Button>
            </div>
            {profileImagePreview && (
              <div className="d-flex justify-content-center">
                <img
                  src={profileImagePreview}
                  alt="Profile Preview"
                  className="img-fluid mt-2"
                  style={{ maxHeight: "150px" }}
                />
              </div>
            )}
          </Form.Group> 

          <div className="text-center">
            <Button variant="dark" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default AccountCreationForm;
