import React, { Component } from 'react';
import Api from '../../Api';
import { connect } from "react-redux";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from 'react-router-dom';
import { Card, Col, Container, Form, Row, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import sleep from '../../hooks/Sleep';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessage: '',
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.post('/accounts/public/login', 
        {
          username: this.state.username,
          password: this.state.password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true
        },
      )
      this.props.setIsLoggedIn(!this.props.isLoggedIn)
      window.location.reload();
    } catch (error) {
      this.setState({
        errorMessage: "Invalid username or password",
      });
      if (error.response.status === 401) {
        this.props.setIsLoggedIn(false);
      }
    }
  };

  render() {
    const agenda_path = this.props.activeCategoryAgenda
    if (this.props.isLoggedIn) {
      this.props.setActiveCategoryHeader("agenda"); // TODO extact "agenda" value from agenda_path variable
      return <Navigate to={ agenda_path } replace />;
    }

    return (
      <Container className="min-vh-100 d-flex flex-column justify-content-center">
        <Row className="row justify-content-center">
          <Col className="col-md-4">
            <Card className="card">
              <Card.Body className="card-body">
                <Card.Title className="text-center fw-bold">Login</Card.Title>
                {this.state.errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {this.state.errorMessage}
                  </div>
                )}
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Username
                    </Form.Label>
                    <Form.Control
                      type="text"
                      id="username"
                      name="username"
                      value={this.state.username}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      id="password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      required
                    />
                  </Form.Group>
                  <Button type="submit" className="btn btn-dark w-100">
                    Login
                  </Button>
                </Form>
                <div className="text-center mt-3">
                  <Link to="/forgot_password" >Forgot Password?</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
