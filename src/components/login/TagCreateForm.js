import React, { Component } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from "react-router-dom";
import Api from "../../Api";

// TODO Merged with DiscoverCreateForn and EventCreateForm both are similar
class TagCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: null,
      message: "", // Success/Error message
      messageType: "", // "success" or "error"
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
    } catch (error) {
      console.error("Error submitting form:", error);
      // Show error message
      this.setState({
        message: "Error creating business. Please try again.",
        messageType: "error",
      });
    }
  };

  render() {
    if (!this.props.isLoggedIn) {
      this.props.setActiveCategoryHeader("agenda");
      return <Navigate to={this.props.activeCategoryAgenda} replace />;
    }

    return (
      <Container className="my-4">
        {/* Event Form */}
        <Card className="shadow-lg p-5 rounded-4 border-0 bg-light">
          <h3 className="fw-bold text-center mb-4 text-dark">Create Event</h3>

          {/* Success/Error Message */}
          {this.state.message && (
            <div className={`alert ${this.state.messageType === "success" ? "alert-success" : "alert-danger"}`} role="alert">
              {this.state.message}
            </div>
          )}

          <Form onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Name</Form.Label>
                <Form.Control type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Tag Name" required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formDescription">
                <Form.Label className="fw-bold">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={this.state.description}
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
