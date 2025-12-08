import React, { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from 'react-router-dom';
import { Card, Col, Container, Form, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Api from '../../Api';
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoggedIn = useSelector((state) => state.appRootReducer.isLoggedIn);
  const activeCategoryAgenda = useSelector((state) => state.appRootReducer.activeCategoryAgenda);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      await Api.post('/accounts/public/login', 
        {
          username: username,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          }
        }
      );

      dispatch(setIsLoggedIn(true));
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.detail || "Invalid username or password");
      
      if (error.response?.status === 401) {
        dispatch(setIsLoggedIn(false));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoggedIn) {
    dispatch(setActiveCategoryHeader("agenda"));
    return <Navigate to={activeCategoryAgenda} replace />;
  }

  return (
    <Container className="min-vh-100 d-flex flex-column justify-content-center">
      <Row className="justify-content-center">
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Card.Title className="text-center fw-bold mb-4 fs-3">
                Login
              </Card.Title>
              
              {errorMessage && (
                <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
                  <span>{errorMessage}</span>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setErrorMessage('')}
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Username</Form.Label>
                  <Form.Control
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Password</Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={isSubmitting}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="btn btn-dark w-100 mb-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </Form>

              <div className="text-center">
                <Link to="/forgot_password" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>    
  );
};

export default Login;
