import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import Api from '../../Api';
import { setIsLoggedIn } from '../../actions/appActions';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setEmail(e.target.value);
    // Clear errors on input change
    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      await Api.post('/accounts/public/forgot_password', { email });
      setMessage('Password reset link sent. Please check your email.');
      setEmail(''); // Clear email field on success
    } catch (error) {
      setError('Error sending password reset link. Please try again.');
      if (error.response?.status === 401) {
        dispatch(setIsLoggedIn(false));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="min-vh-100 d-flex flex-column justify-content-center">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center fw-bold">Forgot Password</Card.Title>
              {message && (
                <Alert variant="success" dismissible onClose={() => setMessage('')}>
                  {message}
                </Alert>
              )}
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label className="fw-bold">Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </Form.Group>
                <Button 
                  variant="dark" 
                  type="submit" 
                  className="w-100 mt-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;
