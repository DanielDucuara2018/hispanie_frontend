import React, { Component } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";
import Api from "../../Api";
import { Navigate } from "react-router-dom";


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class ResetPassword extends Component {
  state = {
    old_password: "",
    new_password: "",
    confirmPassword: "",
    message: "",
    error: "",
    passwordError: "",
    redirect: false,
    token: "",
    isTokenValid: null,
  };

  async componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token') || '';
    this.setState({ token });

    if (!token) {
      this.setState({ redirect: true });
      return;
    }

    try {
      // Call backend to validate the token
      const response = await Api.post("/accounts/public/validate_reset_token", { token });
      this.setState({ isTokenValid: response.data });
    } catch (error) {
      this.setState({ isTokenValid: true });
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ error: "", message: "" });
    this.setState({ [name]: value }, () => {
      if (name === "new_password" || name === "confirmPassword") {
        this.validatePasswords();
      }
    });
  };

  validatePasswords = () => {
    const { new_password, confirmPassword } = this.state;
    if (confirmPassword && new_password !== confirmPassword) {
      this.setState({ passwordError: "Passwords do not match!" });
    } else {
      this.setState({ passwordError: "" });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { new_password, confirmPassword } = this.state;

    if (new_password !== confirmPassword) {
      this.setState({ error: "Passwords do not match.", message: "" });
      return;
    }

    try {
      await Api.post("/accounts/public/reset_password", this.state);
      this.setState({ message: "Password has been reset successfully.", error: "" });
      await sleep(3000)
      this.setState({ redirect: true });
    } catch (error) {
      this.setState({ error: "Error resetting new_password. Please try again.", message: "" });
      if (error.response.status === 401) {
        this.props.setIsLoggedIn(false);
      }
    }
  };

  render() {
    // TODO Check if not token passed then redirect elif token already used then redirect else show reset page
    const { redirect, isTokenValid } = this.state;
    
    if (redirect) {
      return <Navigate to="/" />;
    }

    if (isTokenValid === true) {
      return <Navigate to="/" />;
    }

    if (isTokenValid === null) {
      return (
        <Container className="min-vh-100 d-flex flex-column justify-content-center">
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="card">
                <Card.Body className="card-body text-center">
                  <h3 className="card-title">Validating Token...</h3>
                  <p>Please wait while we validate your request.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }

    return (
      <Container className="min-vh-100 d-flex flex-column justify-content-center">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="card">
              <Card.Body className="card-body">
                <h3 className="card-title text-center">Reset Password</h3>
                {this.state.message && <Alert variant="success">{this.state.message}</Alert>}
                {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
                <Form onSubmit={this.handleSubmit}>
                <Form.Group controlId="formBasicOldPassword">
                    <Form.Label className="fw-bold">Old Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter old password"
                      name="old_password"
                      value={this.state.old_password}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group controlId="formBasicNewPassword" className="mt-3">
                    <Form.Label className="fw-bold">New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      name="new_password"
                      value={this.state.new_password}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formBasicconfirm_password" className="mt-3">
                    <Form.Label className="fw-bold">Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      name="confirmPassword"
                      value={this.state.confirmPassword}
                      onChange={this.handleChange}
                      required
                    />
                      {this.state.passwordError && (
                        <Alert variant="danger" className="mt-2 p-2">
                          {this.state.passwordError}
                        </Alert>
                      )}
                  </Form.Group>
                  <Button variant="dark" type="submit" className="w-100 mt-3">
                    Reset Password
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default ResetPassword;
