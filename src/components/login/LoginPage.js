import React, { Component } from 'react';
import Api from '../../Api';

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
    await Api.post('/accounts/login', {
        username: this.state.username,
        password: this.state.password,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((res) => {
      console.log(res);
      const acces_token = res.data.access_token;
      console.log(acces_token);
      // this.props.setToken(acces_token);
      // this.setState({ isloggingin: false });
    })
    .catch((error) => {
      this.setState({
        errorMessage: "Invalid username or password",
        // isloggingin: false,
      });
    });
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