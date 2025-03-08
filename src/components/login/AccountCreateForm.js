import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import ImageCategoryMapping from "../../hooks/ImageCategoryMapping";
import axios from "axios";
import Api from "../../Api";
import sleep from "../../hooks/Sleep";

const AccountCreationFormWithParams = (props) => <AccountCreationForm {...props} params={useParams()} />;
// TOTO fix this form on update when refreshing
class AccountCreationForm extends Component {
  initialState = {
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
    mode: null,
  }

  constructor(props) {
    super(props);
    const { id } = this.props.params;
    const { formMode } = this.props;
    let initialState = this.initialState
    if (id && formMode === "update") {
      const accountData = this.props.account 
      if (accountData) {
        initialState = {
          ...this.initialState,
          ...accountData,
          profileImagePreview: accountData.files.find(x => x.category === "profile_image")?.path || "",
          coverImagePreview: accountData.files.find(x => x.category === "cover_image")?.path || "",
        };
      }
    } else if (formMode === "create") {
      initialState = {
        ...this.initialState,
        description: "",
        // Add other properties that need to be reset for creation
      };
    }

    this.state = initialState;
    
  }

  componentDidUpdate() {
    const { id } = this.props.params;
    const { formMode } = this.props;
    const { mode } = this.state;

    // console.log(formMode !== mode)
    // console.log(id)
    // console.log(formMode)
    // console.log(id && formMode === "update")
    // console.log(this.props.account)

    if (formMode !== mode) {
      let newState = { mode: formMode };
      console.log("aqui 1")
      if (id && formMode === "update") {
        const accountData = this.props.account
        console.log("aqui 2")
        console.log(accountData) 
        if (accountData) {
          console.log("aqui 3")
          newState = {
            ...newState,
            ...accountData,
            profileImagePreview: accountData.files.find(x => x.category === "profile_image")?.path || "",
            coverImagePreview: accountData.files.find(x => x.category === "cover_image")?.path || "",
            mode: formMode,
          };
        }
      } else if (formMode === "create") {
        newState = {
          ...this.initialState,
          ...newState,
          mode: formMode,
          description: "",
          // Add other properties that need to be reset for creation
        };
      }

      this.setState(newState);
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => {
      if (name === "password" || name === "confirmPassword") {
        this.validatePasswords();
      }

      if (name === "password" || name === "old_password") {
        this.validateOldPasswords();
      }
    });
  };

  handleFileChange = async (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file) {
      try {
        // 1. Solicitar una URL prefirmada al backend to upload file
        const upload_response = await Api.get("/files/private/generate-upload-presigned-url", { 
          params: {
            filename: file.name,
            content_type: file.type
          },
          withCredentials: true
        });

        const upload_url = upload_response.data.url;

        // 2. Subir el archivo a la URL prefirmada
        await axios.put(upload_url, file, {
          headers: { "Content-Type": file.type },
        });

        // 3. Solicitar una URL prefirmada al backend to download file
        const download_url = "https://d3skpo6i31hl4s.cloudfront.net/" + file.name

        // 4. Guardar la URL pública de la imagen
        const hash = await this.calculateFileHash(file);
        this.setState((prevState) => ({
          [name]: download_url,
          [`${name}Preview`]: URL.createObjectURL(file),
          files: [
            ...(prevState.files || []), // Keep previous files
            {
              filename: file.name,
              content_type: file.type,
              category: ImageCategoryMapping[name] || "other",
              path: download_url,
              hash: hash,
              description: name,
            },
          ],
          // coverImagePreview: download_url,
        }));

      } catch (error) {
        console.error("Error uploading file:", error);
        this.setState({
          message: "Error uploading image. Please try again.",
          messageType: "error",
        });
      }
    }
  };

  calculateFileHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }

  validatePasswords = () => {
    const { password, confirmPassword } = this.state;
    if (confirmPassword && password !== confirmPassword) {
      this.setState({ passwordError: "Passwords do not match!" });
    } else {
      this.setState({ passwordError: "" });
    }
  };

  validateOldPasswords = () => {
    const { old_password, password } = this.state;
    if (password && password === old_password) {
      this.setState({ oldPasswordError: "New password can't be the same!" });
    } else {
      this.setState({ oldPasswordError: "" });
    }
  };

  handleSubmit = async (formMode, id=null, e) => {
    e.preventDefault();
    const { old_password, password, confirmPassword } = this.state;
    
    if (old_password != null && !(password != null && confirmPassword != null)) {
      this.setState({ message: "Please enter all the fields to change password.", messageType: "error" });
      return;
    }

    if (password !== confirmPassword) {
      this.setState({ message: "Passwords do not match.", messageType: "error" });
      return;
    }

    if (old_password != null && password != null && old_password === password) {
      this.setState({ message: "New and old password can be the same", messageType: "error" });
      return;
    }

    let message = ""
    try {
      if (formMode === "create") {
        await Api.post("/accounts/private/create", 
          this.state, 
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }
        );
        message = "Account created successfully!"
      }else {
        await Api.put(
          "/accounts/private/update",
          this.state,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        message = "Account updated successfully!"
      }
      this.setState({
        message: message,
        messageType: "success",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await sleep(2000)
      window.location.reload();
    } catch (error) {
      this.setState({
        message: `Error submitting form. Please try again. Details ${error}`,
        messageType: "error",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (error.response.status === 401) {
        this.props.setIsLoggedIn(false);
      }
    }
  };

  render() {
    const { isLoggedIn, activeCategoryAgenda, params, formMode } = this.props;
    const { message, messageType, username, email, old_password, password, confirmPassword, 
      passwordError, oldPasswordError, type, description, coverImagePreview, 
      profileImagePreview } = this.state;
    const { id } = params;


    if (!isLoggedIn) {
      this.props.setActiveCategoryHeader("agenda");
      return <Navigate to={activeCategoryAgenda} replace />;
    }

    

    return (
      <Container className="my-4">
        <Card className="shadow-lg p-5 rounded-4 border-0 bg-light">
          <h3 className="fw-bold text-center mb-4 text-dark">{(formMode === "update" ? "Update" : "Create")} Account</h3>

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

          <Form onSubmit={(e) => this.handleSubmit(formMode, id, e)}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
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
                onChange={this.handleChange}
                placeholder="Enter your email"
                required
              />
            </Form.Group>

            {formMode === 'update' ? (
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Old Password</Form.Label>
                <Form.Control
                  type="password"
                  name="old_password"
                  value={old_password}
                  onChange={this.handleChange}
                  minLength="6"
                  maxLength="100"
                  placeholder="Enter your old password"
                  required={formMode === "update" ? false:true}
                />
              </Form.Group>
            ) : null}

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                minLength="6"
                maxLength="100"
                placeholder="Enter your password"
                required={formMode === "update" ? false:true}
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
                onChange={this.handleChange}
                placeholder="Confirm your password"
                required={formMode === "update" ? false:true}
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
                onChange={this.handleChange}
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
                onChange={this.handleChange}
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
                onClick={() => document.getElementById("coverImageUpload").click()} // Trigger input on click
              >
                <Form.Control
                  type="file"
                  id="coverImageUpload"
                  name="coverImage"
                  accept="image/*"
                  onChange={this.handleFileChange}
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
                onClick={() => document.getElementById("profileImageUpload").click()} // Trigger input on click
              >
                <Form.Control
                  type="file"
                  id="profileImageUpload"
                  name="profileImage"
                  accept="image/*"
                  onChange={this.handleFileChange}
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
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.appRootReducer.isLoggedIn,
  activeCategoryAgenda: state.appRootReducer.activeCategoryAgenda,
});

const mapDispatchToProps = {
  setIsLoggedIn,
  setActiveCategoryHeader,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountCreationFormWithParams);
