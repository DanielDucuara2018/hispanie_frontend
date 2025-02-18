import React, { Component } from "react";
import { Form, Button, Container, Row, Col, Card, ListGroup, Badge } from "react-bootstrap";
import { connect } from "react-redux";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from "react-router-dom";
import imageCategoryMapping from "../../hooks/imageCategoryMapping";
import axios from "axios";
import Api from "../../Api";

// TODO Merged DiscoverCreateForn and EventCreateForm both are similar
// TODO CATEGOTIES change
const EVENT_CATEGORIES = [
  { label: "Course", value: "course" },
  { label: "Cinema", value: "cinema" },
  { label: "Concert", value: "concert" },
  { label: "Party", value: "party" },
  { label: "Expositions", value:    "expositions" },
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
      addressSuggestions: [],
      isLoading: false,
      profileImage: null,
      coverImage: null,
      profileImagePreview: "",
      coverImagePreview: "",
      message: "", // Success/Error message
      messageType: "", // "success" or "error"
      tagValue: "",
      filteredSuggestions: [],
      files : []
    };
  }

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      [name]: type === "checkbox" ? checked : value,
    });
  };

  handleFileChange = async (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file) {
      try {
        // 1. Solicitar una URL prefirmada al backend to upload file
        const upload_response = await Api.get("/files/private/generate-upload-presigned-url", { 
          params: {
            filename: file.name,
            content_type: file.type
          },
          withCredentials: true
        });

        const upload_url = upload_response.data.url;

        // 2. Subir el archivo a la URL prefirmada
        await axios.put(upload_url, file, {
          headers: { "Content-Type": file.type },
        });

        // 3. Solicitar una URL prefirmada al backend to download file
        const download_url = "https://d3skpo6i31hl4s.cloudfront.net/" + file.name

        // 4. Guardar la URL pública de la imagen
        this.setState((prevState) => ({
          [name]: download_url,
          [`${name}Preview`]: URL.createObjectURL(file),
          files: [
            ...(prevState.files || []), // Keep previous files
            {
              filename: file.name,
              content_type: file.type,
              category: imageCategoryMapping[name] || "other",
              path: download_url,
              description: name,
            },
          ],
        }));

      } catch (error) {
        console.error("Error uploading file:", error);
        this.setState({
          message: "Error uploading image. Please try again.",
          messageType: "error",
        });
      }
    }
  };

  // handle addresses
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
        this.setState({ addressSuggestions: response.data, isLoading: false });
      } catch (error) {
        console.error("Error fetching address:", error);
        this.setState({ isLoading: false });
      }
    } else {
      this.setState({ addressSuggestions: [], isLoading: false });
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
      addressSuggestions: [],
    });
  };

  // handle tags
  handleTagInputChange = (e) => {
    const tagValue = e.target.value;
    const filteredSuggestions = this.props.tags.filter(
      (tag) => tag.name.toLowerCase().includes(tagValue.toLowerCase())
    );

    this.setState({ tagValue, filteredSuggestions });
  };

  handleTagSelect = (tag) => {
    this.setState((prevState) => ({
      tags: [...prevState.tags, tag],
      tagValue: "",
      filteredSuggestions: [],
    }));
  };

  handleTagRemove = (tagId) => {
    this.setState((prevState) => ({
      tags: prevState.tags.filter((tag) => tag.id !== tagId),
    }));
  };

  // handle submit form
  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.post("/events/private/create",
      this.state,
      {
        headers: { 
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
      // Show success message
      this.setState({
        message: "Event created successfully!",
        messageType: "success",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      // Show error message
      this.setState({
        message: "Error creating Event. Please try again.",
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
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Name</Form.Label>
                  <Form.Control type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Event Name" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Email</Form.Label>
                  <Form.Control type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="example@email.com (Optional)" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Phone</Form.Label>
                  <Form.Control type="tel" name="phone" value={this.state.phone} onChange={this.handleChange} placeholder="+1 234 567 890 (Optional)" />
                </Form.Group>

                {/* Address Input with Autocomplete */}
                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label className="fw-bold">Address</Form.Label>
                  <Form.Control
                    type="text"
                    value={this.state.address}
                    onChange={this.handleAddressChange}
                    placeholder="Start typing an address..."
                  />
                  {this.state.isLoading && <small>Loading...</small>}
                  
                  {/* Suggestions Dropdown */}
                  {this.state.addressSuggestions.length > 0 && (
                    <ListGroup className="mt-1">
                      {this.state.addressSuggestions.map((place, index) => (
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
                  <Form.Label className="fw-bold">Country</Form.Label>
                  <Form.Control type="text" name="country" value={this.state.country} onChange={this.handleChange} placeholder="France" required readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">City</Form.Label>
                  <Form.Control type="text" name="city" value={this.state.city} onChange={this.handleChange} placeholder="Issy-les-Moulineaux" required readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Municipality</Form.Label>
                  <Form.Control type="text" name="municipality" value={this.state.municipality} onChange={this.handleChange} placeholder="Issy-les-Moulineaux" required readOnly />
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
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Postcode</Form.Label>
                  <Form.Control type="text" name="postcode" value={this.state.postcode} onChange={this.handleChange} placeholder="92130" required readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Region</Form.Label>
                  <Form.Control type="text" name="region" value={this.state.region} onChange={this.handleChange} placeholder="Ile de France" required readOnly />
                </Form.Group>


                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Category</Form.Label>
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
                  <Form.Label className="fw-bold">Price</Form.Label>
                  <Form.Control type="number" name="price"value={this.state.price} onChange={this.handleChange}  placeholder="Enter price" required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formStartDate">
                  <Form.Label className="fw-bold">Start Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="start_date"
                    value={this.state.start_date}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEndDate">
                  <Form.Label className="fw-bold">End Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="end_date"
                    value={this.state.end_date}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">URLs (comma-separated)</Form.Label>
                  <Form.Control type="text" name="urls" value={this.state.urls} onChange={this.handleChange} placeholder="https://example.com, https://event.com (Optional)" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tags</Form.Label>
              <div className="border p-2 rounded">
                {this.state.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    pill
                    bg="secondary"
                    className="me-2 mb-2 px-3 py-2 fs-6"
                    style={{ cursor: "pointer" }}
                    onClick={() => this.handleTagRemove(tag.id)}
                  >
                    {tag.name} ✖
                  </Badge>
                ))}
                <Form.Control
                  type="text"
                  value={this.state.tagValue}
                  onChange={this.handleTagInputChange}
                  placeholder="Type to search tags..."
                />
              </div>
              {this.state.filteredSuggestions.length > 0 && (
                <ListGroup className="mt-1">
                  {this.state.filteredSuggestions.map((tag) => (
                    <ListGroup.Item
                      key={tag.id}
                      action
                      onClick={() => this.handleTagSelect(tag)}
                    >
                      {tag.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
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

            {/* Cover Image Upload */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Cover Image</Form.Label>
              <div
                className="border border-dashed p-4 text-center d-flex justify-content-center align-items-center"
                style={{ borderRadius: "5px", height: "120px", borderColor: "#ccc", cursor: "pointer" }}
                onClick={() => document.getElementById("coverImageUpload").click()} // Trigger input on click
              >
                <Form.Control
                  type="file"
                  id="coverImageUpload"
                  name="coverImage"
                  accept="image/*"
                  onChange={this.handleFileChange}
                  className="d-none"
                />
                <Button className="btn btn-dark btn-sm">Upload Cover Image</Button>
              </div>
              {this.state.coverImagePreview && (
                <div className="d-flex justify-content-center">
                  <img
                    src={this.state.coverImagePreview}
                    alt="Cover Preview"
                    className="img-fluid mt-2"
                    style={{ maxHeight: "150px" }}
                  />
                </div>
              )}
            </Form.Group> 

            {/* Profile Image Upload */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Profile Image</Form.Label>
              <div
                className="border border-dashed p-4 text-center d-flex justify-content-center align-items-center"
                style={{ borderRadius: "5px", height: "120px", borderColor: "#ccc", cursor: "pointer" }}
                onClick={() => document.getElementById("profileImageUpload").click()} // Trigger input on click
              >
                <Form.Control
                  type="file"
                  id="profileImageUpload"
                  name="profileImage"
                  accept="image/*"
                  onChange={this.handleFileChange}
                  className="d-none"
                />
                <Button className="btn btn-dark btn-sm">Upload Profile Image</Button>
              </div>
              {this.state.profileImagePreview && (
                <div className="d-flex justify-content-center">
                  <img
                    src={this.state.profileImagePreview}
                    alt="Profile Preview"
                    className="img-fluid mt-2"
                    style={{ maxHeight: "150px" }}
                  />
                </div>
              )}
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

export default connect(mapStateToProps, mapDispatchToProps)(EventCreateForm);
