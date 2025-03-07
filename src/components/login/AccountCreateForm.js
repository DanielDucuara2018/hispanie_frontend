import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import Api from "../../Api";

const AccountCreationFormWithParams = (props) => <AccountCreationForm {...props} params={useParams()} />;

class AccountCreationForm extends Component {
  defaultState = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    type: "USER",
    description: "",
    profileImage: null,
    coverImage: null,
    message: "",
    messageType: "",
    passwordError: "",
    mode: null,
  }
  constructor(props) {
    super(props);
    this.state = this.defaultState;
  }

  resetState = () => {
    this.setState(this.defaultState);
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value }, () => {
      if (name === "password" || name === "confirmPassword") {
        this.validatePasswords();
      }
    });
  };

  validatePasswords = () => {
    const { password, confirmPassword } = this.state;
    if (confirmPassword && password !== confirmPassword) {
      this.setState({ passwordError: "Passwords do not match!" });
    } else {
      this.setState({ passwordError: "" });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      this.setState({ message: "Passwords do not match.", messageType: "error" });
      return;
    }

    try {
      await Api.post("/accounts/private/create", 
        this.state, 
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      this.setState({
        message: "Account created successfully!",
        messageType: "success",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      this.setState({
        message: "Error creating account. Please try again.",
        messageType: "error",
      });
      if (error.response.status === 401) {
        this.props.setIsLoggedIn(false);
      }
    }
  };

  render() {
    const { isLoggedIn, activeCategoryAgenda, params, formMode } = this.props;
    const { message, messageType, username, email, password, confirmPassword, 
      passwordError, type, description, coverImagePreview, 
      profileImagePreview, mode } = this.state;


    if (!isLoggedIn) {
      this.props.setActiveCategoryHeader("agenda");
      return <Navigate to={activeCategoryAgenda} replace />;
    }

    const { id } = params;
    if (id) {
      const accountData = this.props.account //.find(event => event.id === id);
      console.log(accountData)
      if (accountData && formMode === "update" && mode !== "update") {
        this.setState({ ...accountData, 
          profileImagePreview: accountData.files.length > 0 ? accountData.files.length.find((x) => x.category === "profile_image").path:"" , 
          coverImagePreview: accountData.files.length > 0 ? accountData.files?.find((x) => x.category === "cover_image").path:"", 
          mode: formMode });
      }
    }
    else if(formMode === "create" && mode !== "create") {
      this.resetState()
      this.setState({mode: formMode, description: ""})
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

          <Form onSubmit={this.handleSubmit}>
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
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={this.handleChange}
                placeholder="Confirm your password"
                required
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
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
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
                Create Account
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
