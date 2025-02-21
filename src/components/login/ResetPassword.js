import React, { Component } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import Api from '../../Api';
import { Navigate } from 'react-router-dom';

class ResetPassword extends Component {
  state = {
    password: '',
    confirmPassword: '',
    message: '',
    error: '',
    redirect: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = this.state;
    const { token } = this.props.match.params; // Assumes you're using react-router

    if (password !== confirmPassword) {
      this.setState({ error: 'Passwords do not match.', message: '' });
      return;
    }

    try {
      await Api.post('/accounts/public/reset-password', { token, password });
      this.setState({ message: 'Password has been reset successfully.', error: '', redirect: true });
    } catch (error) {
      this.setState({ error: 'Error resetting password. Please try again.', message: '' });
      if (error.response.status === 401) {
        this.props.setIsLoggedIn(false);
      }
    }
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/login" />;
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
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label className="fw-bold">New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter new password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="formBasicConfirmPassword" className="mt-3">
                    <Form.Label className="fw-bold">Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm new password"
                      name="confirmPassword"
                      value={this.state.confirmPassword}
                      onChange={this.handleChange}
                      required
                    />
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
