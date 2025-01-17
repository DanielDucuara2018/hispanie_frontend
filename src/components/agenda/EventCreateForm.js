import React, { Component } from "react";
import { Form, Button, Container, Row, Col, Card, Image, ListGroup  } from "react-bootstrap";
import { connect } from "react-redux";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Api from "../../Api";

const EVENT_CATEGORIES = [
  { label: "Course", value: "course" },
  { label: "Cinema", value: "cinema" },
  { label: "Concert", value: "concert" },
  { label: "Party", value: "party" },
  { label: "Expositions", value: "expositions" },
  { label: "Language Exchange", value: "language_exchange" },
  { label: "Theater", value: "theater" },
  { label: "Gastronomy", value: "gastronomy" },
  { label: "Dance", value: "dance" },
];

class EventCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: null,
      phone: null,
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
      description: null,
      price: 0,
      start_date: "",
      end_date: "",
      tags: [],
      urls: [],
      suggestions: [],
      isLoading: false,
      // profileImage: null,
      // coverImage: null,
      // profileImagePreview: "https://via.placeholder.com/150",
      // coverImagePreview: "https://via.placeholder.com/1200x300",
    };
  }

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      [name]: type === "checkbox" ? checked : value,
    });
  };

  handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file) {
      this.setState({
        [name]: file,
        [`${name}Preview`]: URL.createObjectURL(file),
      });
    }
  };

  handleAddressChange = async (e) => {
    const address = e.target.value;
    this.setState({ address, isLoading: true });

    if (address.length > 3) {  // Minimum characters before searching
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search`,
          {
            params: {
              q: address,
              format: "json",
              addressdetails: 1,
              limit: 5,
            },
          }
        );
        console.log(response.data)
        this.setState({ suggestions: response.data, isLoading: false });
      } catch (error) {
        console.error("Error fetching address:", error);
        this.setState({ isLoading: false });
      }
    } else {
      this.setState({ suggestions: [], isLoading: false });
    }
  };

  // 🏠 Select an address from suggestions
  handleSelectAddress = (place) => {
      this.setState({
        address: place.display_name,
        latitude: place.lat,
        longitude: place.lon,
        country: place.address.country,
        city: place.address.city,
        municipality: place.address.municipality,
        postcode: place.address.postcode,
        region: place.address.state,
        suggestions: [],
      });
    };

  handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // Object.keys(this.state).forEach((key) => {
    //   if (this.state[key] instanceof File) {
    //     formData.append(key, this.state[key]);
    //   } else if (key !== "profileImagePreview" && key !== "coverImagePreview") {
    //     formData.append(key, this.state[key]);
    //   }
    // });

    console.log(this.state)

    try {
      const response = await Api.post("/events/private/create",
      this.state,
      {
        headers: { 
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
      console.log("Form submitted successfully:", response.data);
      // alert("Event created successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      // alert("Error creating event. Please try again.");
    }
  };

  render() {
    if (!this.props.isLoggedIn) {
      this.props.setActiveCategoryHeader("agenda");
      return <Navigate to={this.props.activeCategoryAgenda} replace />;
    }

    return (
      <Container className="my-4">
        {/* Cover Image Upload */}
        <Card className="mb-3">
          <Card.Img
            src={this.state.coverImagePreview}
            alt="Cover"
            className="img-fluid"
            style={{ height: "250px", objectFit: "cover" }}
          />
          <Card.ImgOverlay className="d-flex justify-content-center align-items-center">
            <Form.Group>
              <Form.Label className="btn btn-dark btn-sm">Upload Cover Image</Form.Label>
              <Form.Control
                type="file"
                name="coverImage"
                accept="image/*"
                onChange={this.handleFileChange}
                className="d-none"
              />
            </Form.Group>
          </Card.ImgOverlay>
        </Card>

        {/* Profile Image Upload */}
        <Row className="mb-4">
          <Col md={4} className="text-center">
            <Image
              src={this.state.profileImagePreview}
              roundedCircle
              width={150}
              height={150}
              className="border border-3 shadow-sm"
            />
            <Form.Group className="mt-2">
              <Form.Label className="btn btn-dark btn-sm">Upload Profile Image</Form.Label>
              <Form.Control
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={this.handleFileChange}
                className="d-none"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Event Form */}
        <Card className="shadow p-4">
          <h4 className="fw-bold text-center mb-4">Create Event</h4>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Event Name" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="example@email.com (Optional)" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="tel" name="phone" value={this.state.phone} onChange={this.handleChange} placeholder="+1 234 567 890 (Optional)" />
                </Form.Group>

                {/* Address Input with Autocomplete */}
                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.address}
                    onChange={this.handleAddressChange}
                    placeholder="Start typing an address..."
                  />
                  {this.state.isLoading && <small>Loading...</small>}
                  
                  {/* Suggestions Dropdown */}
                  {this.state.suggestions.length > 0 && (
                    <ListGroup className="mt-1">
                      {this.state.suggestions.map((place, index) => (
                        <ListGroup.Item
                          key={index}
                          action
                          onClick={() => this.handleSelectAddress(place)}
                        >
                          {place.display_name}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control type="text" name="country" value={this.state.country} onChange={this.handleChange} placeholder="France" required readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" name="city" value={this.state.city} onChange={this.handleChange} placeholder="Issy-les-Moulineaux" required readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Municipality</Form.Label>
                  <Form.Control type="text" name="municipality" value={this.state.municipality} onChange={this.handleChange} placeholder="Issy-les-Moulineaux" required readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Postcode</Form.Label>
                  <Form.Control type="text" name="postcode" value={this.state.postcode} onChange={this.handleChange} placeholder="92130" required readOnly />
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

              </Col>

              <Col md={6}>
                {/* <Form.Group className="mb-3">
                  <Form.Label>Latitude</Form.Label>
                  <Form.Control type="number" step="any" name="latitude" value={this.state.latitude} onChange={this.handleChange} placeholder="Enter latitude" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Longitude</Form.Label>
                  <Form.Control type="number" step="any" name="longitude" value={this.state.longitude} onChange={this.handleChange} placeholder="Enter longitude" required />
                </Form.Group> */}

                <Form.Group className="mb-3">
                  <Form.Label>Region</Form.Label>
                  <Form.Control type="text" name="region" value={this.state.region} onChange={this.handleChange} placeholder="Ile de France" required readOnly />
                </Form.Group>


                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select name="category" value={this.state.category} onChange={this.handleChange} required>
                    <option value="">Select Category</option>
                    {EVENT_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control type="number" name="price"value={this.state.price} onChange={this.handleChange}  placeholder="Enter price" required />
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

                <Form.Group className="mb-3">
                  <Form.Label>Tags (comma-separated)</Form.Label>
                  <Form.Control type="text" name="tags" value={this.state.tags} onChange={this.handleChange} placeholder="music, food, outdoors (Optional)" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>URLs (comma-separated)</Form.Label>
                  <Form.Control type="text" name="urls" value={this.state.urls} onChange={this.handleChange} placeholder="https://example.com, https://event.com (Optional)" />
                </Form.Group>
              </Col>
            </Row>

            <div className="text-center">
              <Button variant="primary" type="submit">Submit</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(EventCreateForm);
