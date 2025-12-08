import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert, Card } from "react-bootstrap";
import { Navigate, useSearchParams } from "react-router-dom";
import { useDispatch } from 'react-redux';
import Api from "../../Api";
import sleep from "../../hooks/Sleep";
import { setIsLoggedIn } from '../../actions/appActions';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const dispatch = useDispatch();

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setRedirect(true);
        return;
      }

      try {
        const response = await Api.post("/accounts/public/validate_reset_token", { token });
        setIsTokenValid(response.data);
      } catch (error) {
        setIsTokenValid(true);
      }
    };

    validateToken();
  }, [token]);

  const validatePasswords = (newPwd, confirmPwd) => {
    if (confirmPwd && newPwd !== confirmPwd) {
      setPasswordError("Passwords do not match!");
    } else {
      setPasswordError("");
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    setError("");
    setMessage("");
    validatePasswords(value, confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setError("");
    setMessage("");
    validatePasswords(newPassword, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submission

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setMessage("");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      await Api.post("/accounts/public/reset_password", {
        token,
        new_password: newPassword,
        confirmPassword
      });
      setMessage("Password has been reset successfully.");
      await sleep(3000);
      setRedirect(true);
    } catch (error) {
      setError("Error resetting password. Please try again.");
      if (error.response?.status === 401) {
        dispatch(setIsLoggedIn(false));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
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
                <Form.Group controlId="formBasicNewPassword" className="mt-3">
                  <Form.Label className="fw-bold">New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    name="new_password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    required
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicconfirm_password" className="mt-3">
                  <Form.Label className="fw-bold">Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    disabled={isSubmitting}
                  />
                  {passwordError && (
                    <Alert variant="danger" className="mt-2 p-2">
                      {passwordError}
                    </Alert>
                  )}
                </Form.Group>
                <Button 
                  variant="dark" 
                  type="submit" 
                  className="w-100 mt-3"
                  disabled={isSubmitting || !!passwordError}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
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

export default ResetPassword;
