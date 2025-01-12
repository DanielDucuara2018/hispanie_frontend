import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";

class EventCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      city: "",
      address: "",
      country: "",
      municipality: "",
      postcode: "",
      region: "",
      latitude: "",
      longitude: "",
      category: "",
      is_public: false,
      description: "",
      price: "",
      start_date: "",
      end_date: "",
      tags: "",
      urls: "",
    };
  }

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      [name]: type === "checkbox" ? checked : value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", this.state);
    // Call API or handle form submission logic here
  };

  render() {
    return (
      <div className="container my-4">
        <div className="row g-4">
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
                required
                minLength={3}
                maxLength={100}
                placeholder="Enter event name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                placeholder="Enter email (optional)"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={this.state.phone}
                onChange={this.handleChange}
                pattern="^\+?[0-9\s-]+$"
                placeholder="Enter phone number (optional)"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCity">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={this.state.city}
                onChange={this.handleChange}
                required
                minLength={2}
                maxLength={50}
                placeholder="Enter city"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={this.state.address}
                onChange={this.handleChange}
                required
                minLength={5}
                maxLength={200}
                placeholder="Enter address"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                name="country"
                value={this.state.country}
                onChange={this.handleChange}
                required
                minLength={2}
                maxLength={50}
                placeholder="Enter country"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formMunicipality">
              <Form.Label>Municipality</Form.Label>
              <Form.Control
                type="text"
                name="municipality"
                value={this.state.municipality}
                onChange={this.handleChange}
                required
                minLength={2}
                maxLength={50}
                placeholder="Enter municipality"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPostcode">
              <Form.Label>Postcode</Form.Label>
              <Form.Control
                type="text"
                name="postcode"
                value={this.state.postcode}
                onChange={this.handleChange}
                required
                minLength={2}
                maxLength={20}
                placeholder="Enter postcode"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegion">
              <Form.Label>Region</Form.Label>
              <Form.Control
                type="text"
                name="region"
                value={this.state.region}
                onChange={this.handleChange}
                required
                minLength={2}
                maxLength={50}
                placeholder="Enter region"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLatitude">
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                type="number"
                name="latitude"
                value={this.state.latitude}
                onChange={this.handleChange}
                required
                min={-90.0}
                max={90.0}
                step="any"
                placeholder="Enter latitude"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLongitude">
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                type="number"
                name="longitude"
                value={this.state.longitude}
                onChange={this.handleChange}
                required
                min={-180.0}
                max={180.0}
                step="any"
                placeholder="Enter longitude"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={this.state.category}
                onChange={this.handleChange}
                required
                placeholder="Enter event category"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formIsPublic">
              <Form.Check
                type="checkbox"
                name="is_public"
                checked={this.state.is_public}
                onChange={this.handleChange}
                label="Is Public"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={this.state.description}
                onChange={this.handleChange}
                maxLength={500}
                placeholder="Enter description (optional)"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={this.state.price}
                onChange={this.handleChange}
                required
                min={0.0}
                step="any"
                placeholder="Enter price"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStartDate">
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="start_date"
                value={this.state.start_date}
                onChange={this.handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="end_date"
                value={this.state.end_date}
                onChange={this.handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formTags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={this.state.tags}
                onChange={this.handleChange}
                placeholder="Enter tags, separated by commas (optional)"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUrls">
              <Form.Label>URLs</Form.Label>
              <Form.Control
                type="text"
                name="urls"
                value={this.state.urls}
                onChange={this.handleChange}
                placeholder="Enter URLs, separated by commas (optional)"
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default EventCreateForm;
