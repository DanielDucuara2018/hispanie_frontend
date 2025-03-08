import React, { Component } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from "react-router-dom";
import Api from "../../Api";
import sleep from "../../hooks/Sleep";

// TODO Merged with DiscoverCreateForn and EventCreateForm both are similar
class TagCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: null,
      message: "", // Success/Error message
      messageType: "", // "success" or "error"
      redirect: false
    };
  }

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      [name]: type === "checkbox" ? checked : value,
    });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.post("/tags/private/create",
      this.state,
      {
        headers: { 
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
      // Show success message
      this.setState({
        message: "Business created successfully!",
        messageType: "success",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await sleep(2000)
      window.location.reload();
    } catch (error) {
      // Show error message
      this.setState({
        message: "Error creating business. Please try again.",
        messageType: "error",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (error.response.status === 401) {
        this.props.setIsLoggedIn(false);
      }
    }
  };

  render() {
    const { name, description, message, messageType, redirect } = this.state;
    const { isLoggedIn, activeCategoryAgenda } = this.props;

    if (!isLoggedIn) {
      this.props.setActiveCategoryHeader("agenda");
      return <Navigate to={activeCategoryAgenda} replace />;
    }

    if (redirect) {
      return <Navigate to="/tag/create" />;
    }

    return (
      <Container className="my-4">
        {/* Event Form */}
        <Card className="shadow-lg p-5 rounded-4 border-0 bg-light">
          <h3 className="fw-bold text-center mb-4 text-dark">Create Event</h3>

          {/* Success/Error Message */}
          {message && (
            <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`} role="alert">
              {message}
            </div>
          )}

          <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Name</Form.Label>
                <Form.Control type="text" name="name" value={name} onChange={this.handleChange} placeholder="Tag Name" required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label className="fw-bold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={description}
                  onChange={this.handleChange}
                  maxLength={500}
                  placeholder="Enter description (optional)"
                />
              </Form.Group>

            <div className="text-center">
              <Button variant="dark" type="submit">Submit</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(TagCreateForm);
