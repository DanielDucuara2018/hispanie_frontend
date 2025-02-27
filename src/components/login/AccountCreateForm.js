import React, { Component } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from "react-router-dom";
import { connect } from "react-redux";
import Api from "../../Api";

class AccountCreationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
  }

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
    if (!this.props.isLoggedIn) {
      this.props.setActiveCategoryHeader("agenda");
      return <Navigate to={this.props.activeCategoryAgenda} replace />;
    }

    return (
      <Container className="my-4">
        <Card className="shadow-lg p-5 rounded-4 border-0 bg-light">
          <h3 className="fw-bold text-center mb-4 text-dark">Create Account</h3>

          {this.state.message && (
            <div
              className={`alert ${
                this.state.messageType === "success"
                  ? "alert-success"
                  : "alert-danger"
              }`}
              role="alert"
            >
              {this.state.message}
            </div>
          )}

          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={this.state.username}
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
                value={this.state.email}
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
                value={this.state.password}
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
                value={this.state.confirmPassword}
                onChange={this.handleChange}
                placeholder="Confirm your password"
                required
              />
              {this.state.passwordError && (
                <Alert variant="danger" className="mt-2 p-2">
                  {this.state.passwordError}
                </Alert>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Account Type</Form.Label>
              <Form.Select
                name="type"
                value={this.state.type}
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
                value={this.state.description}
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountCreationForm);
