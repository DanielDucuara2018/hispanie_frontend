import React, { Component } from "react";
import { Form, Button, Container, Card, ListGroup, Badge, InputGroup } from "react-bootstrap";
import { connect } from "react-redux";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from "react-router-dom";
import ImageCategoryMapping from "../../hooks/ImageCategoryMapping";
import axios from "axios";
import Api from "../../Api";


// Enum for Social Network Categories
const SocialNetworkCategory = {
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
  TIKTOK: "tiktok",
  TWITTER: "twitter",
  WEB: "web",
};

// TODO Merged DiscoverCreateForn and EventCreateForm both are similar
// TODO CATEGOTIES change and this form don't have price, start_date and end_date 
const DISCOVER_CATEGORIES = [
  { label: "Artist", value: "artist" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Cafe", value: "cafe" },
  { label: "Boutique", value: "boutique" },
  { label: "Exposition", value: "exposition" },
  { label: "Association", value: "association" },
  { label: "Academy", value: "academy" },
];

class DiscoverCreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      phone: "",
      city: null,
      address: null,
      country: null,
      municipality: null,
      postcode: null,
      region: null,
      latitude: null,
      longitude: null,
      category: "",
      is_public: true,
      description: null,
      tags: [],
      suggestions: [],
      isLoading: false,
      profileImage: null,
      coverImage: null,
      profileImagePreview: "",
      coverImagePreview: "",
      message: "", // Success/Error message
      messageType: "", // "success" or "error"
      tagValue: "",
      filteredSuggestions: [],
      files : [],
      selectedAddress: false,
      currentUrl: "",
      social_networks: [], // Array to hold { url: "", category: "" }
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
        const hash = await this.calculateFileHash(file);
        this.setState((prevState) => ({
          [name]: download_url,
          [`${name}Preview`]: URL.createObjectURL(file),
          files: [
            ...(prevState.files || []), // Keep previous files
            {
              filename: file.name,
              content_type: file.type,
              category: ImageCategoryMapping[name] || "other",
              path: download_url,
              hash: hash,
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

  calculateFileHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

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
      selectedAddress: true,
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


  // Handle URL input change
  handleUrlChange = (e) => {
    this.setState({ currentUrl: e.target.value });
  };

  // Determine the category of the URL
  categorizeUrl = (url) => {
    if (url.includes("facebook.com")) return SocialNetworkCategory.FACEBOOK;
    if (url.includes("instagram.com")) return SocialNetworkCategory.INSTAGRAM;
    if (url.includes("tiktok.com")) return SocialNetworkCategory.TIKTOK;
    if (url.includes("twitter.com")) return SocialNetworkCategory.TWITTER;
    return SocialNetworkCategory.WEB;
  };

  // Add URL to the list
  addUrl = () => {
    const { currentUrl, social_networks } = this.state;
    if (currentUrl.trim() === "") return;

    const category = this.categorizeUrl(currentUrl);
    this.setState({
      social_networks: [...social_networks, { url: currentUrl, category }],
      currentUrl: "", // Clear input after adding
    });
  };
  
    // Remove URL from the list
    removeUrl = (index) => {
      this.setState((prevState) => ({
        social_networks: prevState.social_networks.filter((_, i) => i !== index),
      }));
    };
  

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Api.post("/businesses/private/create",
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
      // Show error message
      this.setState({
        message: "Error creating business. Please try again.",
        messageType: "error",
      });
      if (error.response.status === 401) {
        this.props.setIsLoggedIn(false);
      }
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
        <h3 className="fw-bold text-center mb-4 text-dark">Create Business</h3>

          {/* Success/Error Message */}
          {this.state.message && (
            <div className={`alert ${this.state.messageType === "success" ? "alert-success" : "alert-danger"}`} role="alert">
              {this.state.message}
            </div>
          )}

          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-3" controlId="formIsPublic">
              <Form.Check
                type="checkbox"
                name="is_public"
                checked={this.state.is_public}
                onChange={this.handleChange}
                label="Is Public"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Category</Form.Label>
              <Form.Select name="category" value={this.state.category} onChange={this.handleChange} required>
                <option value="">Select Category</option>
                {DISCOVER_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Name</Form.Label>
              <Form.Control type="text" name="name" value={this.state.name} onChange={this.handleChange} placeholder="Business Name" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Email</Form.Label>
              <Form.Control type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="example@email.com" required/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Phone</Form.Label>
              <Form.Control type="tel" name="phone" value={this.state.phone} onChange={this.handleChange} placeholder="+1 234 567 890" required/>
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

            {this.state.selectedAddress && (
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Selected Address Details</Card.Title>
                  <Card.Text>
                    <strong>Address:</strong> {this.state.address} <br />
                    <strong>Country:</strong> {this.state.country} <br />
                    <strong>City:</strong> {this.state.city} <br />
                    <strong>Municipality:</strong> {this.state.municipality} <br />
                    <strong>Postcode:</strong> {this.state.postcode} <br />
                    <strong>Region:</strong> {this.state.region} <br />
                    <strong>Latitude:</strong> {this.state.latitude} <br />
                    <strong>Longitude:</strong> {this.state.longitude} <br />
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {/* URL Input */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Add Social Network or Website URL</Form.Label>
              <InputGroup>
                <Form.Control
                  type="text"
                  value={this.state.currentUrl}
                  onChange={this.handleUrlChange}
                  placeholder="https://example.com"
                />
                <Button variant="dark" onClick={this.addUrl}>
                  Add URL
                </Button>
              </InputGroup>
            </Form.Group>

            {/* Display Added URLs */}
            {this.state.social_networks.length > 0 && (
              <ListGroup className="mb-3">
                {this.state.social_networks.map((item, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <div>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.url}
                      </a>
                      <Badge bg="secondary" className="ms-2">
                        {item.category}
                      </Badge>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => this.removeUrl(index)}>
                      Remove
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}

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

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverCreateForm);
