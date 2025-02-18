import React, { Component } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import Api from '../../Api';

class ForgotPassword extends Component {
  state = {
    email: '',
    message: '',
    error: '',
  };

  handleChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.post('/accounts/public/forgot-password', { email: this.state.email });
      this.setState({ message: 'Password reset link sent. Please check your email.', error: '' });
    } catch (error) {
      this.setState({ error: 'Error sending password reset link. Please try again.', message: '' });
    }
  };

  render() {
    return (
      <Container className="min-vh-100 d-flex flex-column justify-content-center">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body>
                <Card.Title className="text-center fw-bold">Forgot Password</Card.Title>
                {this.state.message && <Alert variant="success">{this.state.message}</Alert>}
                {this.state.error && <Alert variant="danger">{this.state.error}</Alert>}
                <Form onSubmit={this.handleSubmit}>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label className="fw-bold">Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>
                  <Button variant="dark" type="submit" className="w-100 mt-3">
                    Send Reset Link
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

export default ForgotPassword;
