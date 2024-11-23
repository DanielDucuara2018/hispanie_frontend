import React, { Component } from 'react';
import axios from 'axios';

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
      const response = await axios.post('http://localhost:8000/login', {
        username: this.state.username,
        password: this.state.password,
      });
      if (response.data.success) {
        alert('Login successful!');
      } else {
        this.setState({ errorMessage: 'Invalid credentials' });
      }
    } catch (error) {
      this.setState({ errorMessage: 'Error connecting to server' });
    }
  };

  render() {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title text-center">Login</h3>
                {this.state.errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {this.state.errorMessage}
                  </div>
                )}
                <form onSubmit={this.handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={this.state.username}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;