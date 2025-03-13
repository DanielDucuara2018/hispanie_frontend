import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { Form, Button, Container, Card, ListGroup, Badge, Col, Row } from "react-bootstrap";
import { connect } from "react-redux";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from "react-router-dom";
import ImageCategoryMapping from "../../hooks/ImageCategoryMapping";
import axios from "axios";
import Api from "../../Api";
import sleep from "../../hooks/Sleep";

const EventCreateFormWithParams = (props) => <EventCreateForm {...props} params={useParams()} />;

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
  // { label: "Dance", value: "dance" },
];


const EVENT_FRECUENCIES = [
  { label: "None", value: "none" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Monthly", value: "monthly" },
];

const TICKET_CURRENCIES = [
  { label: "UAE Dirham (AED)", value: "AED" },
  { label: "Colombian Peso (COP)", value: "COP" },
  { label: "Euro (€)", value: "EUR" },
  { label: "British Pound (£)", value: "GBP" },
  { label: "Japanese Yen (¥)", value: "JPY" },
  { label: "Peruvian Sol (PEN)", value: "PEN" },
  { label: "Qatari Riyal (QAR)", value: "QAR" },
  { label: "US Dollar ($)", value: "USD" },
];

class EventCreateForm extends Component {
  initialState = {
    eventData: null,
    name: "",
    city: "",
    address: "",
    country: "",
    municipality: "",
    postcode: "",
    region: "",
    latitude: "",
    longitude: "",
    category: "",
    frequency: "none",
    is_public: true,
    description: "",
    start_date: "",
    end_date: "",
    tags: [],
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
    files : [],
    selectedAddress: false,
    activities: [],
    tickets: [],
    mode: null,
  };

  constructor(props) {
    super(props);
    const { id } = this.props.params;
    const { formMode } = this.props;
    let initialState = this.initialState
    if (id && formMode === "update") {
      const eventData = this.props.events.find(event => event.id === id);
      if (eventData) {
        initialState = {
          ...this.initialState,
          ...eventData,
          profileImagePreview: eventData.files.find(x => x.category === "profile_image")?.path || "",
          coverImagePreview: eventData.files.find(x => x.category === "cover_image")?.path || "",
          selectedAddress: eventData.address,
        };
      }
    } else if (formMode === "create") {
      initialState = {
        ...this.initialState,
        description: "",
        // Add other properties that need to be reset for creation
      };
    }
    this.state = initialState;
  }

  componentDidUpdate() {
    const { id } = this.props.params;
    const { formMode } = this.props;
    const { mode } = this.state;

    if (formMode !== mode) {
      let newState = { mode: formMode };
      if (id && formMode === "update") {
        const eventData = this.props.events.find(event => event.id === id);
        if (eventData) {
          newState = {
            ...newState,
            ...eventData,
            profileImagePreview: eventData.files.find(x => x.category === "profile_image")?.path || "",
            coverImagePreview: eventData.files.find(x => x.category === "cover_image")?.path || "",
            selectedAddress: eventData.address,
            mode: formMode,
          };
        }
      } else if (formMode === "create") {
        newState = {
          ...this.initialState,
          ...newState,
          mode: formMode,
          description: "",
          // Add other properties that need to be reset for creation
        };
      }

      this.setState(newState);
    }
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
          // coverImagePreview: download_url,
        }));

      } catch (error) {
        this.setState({
          message: `Error submitting form. Please try again. Details ${error}`,
          messageType: "error",
        });
      }
    }
  };

  calculateFileHash = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }

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
      selectedAddress: true,
    });
  };

  // Handle activities change
  handleLineupChange = (index, e) => {
    const { name, value } = e.target;
    const updatedLineup = [...this.state.activities];
    updatedLineup[index][name] = value;
    this.setState({ activities: updatedLineup });
  };

  // Add new activities item
  addLineupItem = () => {
    this.setState((prevState) => ({
      activities: [...prevState.activities, { name: "", start_date: "", end_date: "" }],
    }));
  };

  // Remove activities item
  removeLineupItem = (index) => {
    this.setState((prevState) => ({
      activities: prevState.activities.filter((_, i) => i !== index),
    }));
  };

  // Handle tickets change
  handleTicketsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTickets = [...this.state.tickets];
    updatedTickets[index][name] = value;
    this.setState({ tickets: updatedTickets });
  };

  // Add new tickets item
  addTicketsItem = () => {
    this.setState((prevState) => ({
      tickets: [...prevState.tickets, { name: "", cost: 0, currency: "EUR" }],
    }));
  };

  // Remove tickets item
  removeTicketsItem = (index) => {
    this.setState((prevState) => ({
      tickets: prevState.tickets.filter((_, i) => i !== index),
    }));
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
  handleSubmit = async (formMode, id=null, e) => {
    e.preventDefault();
    let message = ""
    try {
      if (formMode === "create") {
        await Api.post(
          "/events/private/create",
          this.state,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        message = "Event created successfully!"
      } else {
        await Api.put(
          `/events/private/update/${id}`,
          this.state,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        message = "Event updated successfully!"
      }
      // Show success message
      this.setState({
        message: message,
        messageType: "success",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await sleep(2000)
      window.location.reload();
    } 
    catch (error) {
      // Show error message
      this.setState({
        message: `Error submitting form. Please try again. Details ${error}`,
        messageType: "error",
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (error.response && error.response.status === 401) {
        this.props.setIsLoggedIn(false);
      }
    }
  };

  render() {  

    const { isLoggedIn, activeCategoryAgenda, params, formMode } = this.props;
    const { message, messageType, isLoading, addressSuggestions, 
      is_public, name, category, frequency, start_date, end_date, selectedAddress,
      address, country, city, municipality, postcode, region, latitude, longitude,
      tags, tagValue, filteredSuggestions, description, coverImagePreview, 
      profileImagePreview, activities, tickets } = this.state;
    const { id } = params;

    if (!isLoggedIn) {
      this.props.setActiveCategoryHeader("agenda");
      return <Navigate to={activeCategoryAgenda} replace />;
    }

    return (
      <Container className="my-4">
        {/* Event Form */}
        <Card className="shadow-lg p-5 rounded-4 border-0 bg-light">
          <h3 className="fw-bold text-center mb-4 text-dark">{(formMode === "update" ? "Update" : "Create")} Event</h3>

          {/* Success/Error Message */}
          {message && (
            <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`} role="alert">
              {message}
            </div>
          )}

          <Form onSubmit={(e) => this.handleSubmit(formMode, id, e)}>
            <Form.Group className="mb-3" controlId="formIsPublic">
              <Form.Check
                type="checkbox"
                name="is_public"
                checked={ is_public }
                onChange={this.handleChange} 
                label="Is Public"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Category</Form.Label>
              <Form.Select 
                name="category" 
                value={ category } 
                onChange={this.handleChange} 
                required
              >
                <option value="">Select Category</option>
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">frequency</Form.Label>
              <Form.Select 
                name="frequency" 
                value={ frequency } 
                onChange={this.handleChange}
                required
              >
                <option value="">Select frequency</option>
                {EVENT_FRECUENCIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={name} 
                onChange={this.handleChange} 
                placeholder="Event Name" 
                required 
              />
            </Form.Group>
            
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formStartDate">
                  <Form.Label className="fw-bold">Start Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="start_date"
                    value={start_date}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              
              <Col>
                <Form.Group className="mb-3" controlId="formEndDate">
                  <Form.Label className="fw-bold">End Date</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="end_date"
                    value={end_date}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Address Input with Autocomplete */}
            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label className="fw-bold">Address</Form.Label>
              <Form.Control
                type="text"
                value={address}
                onChange={this.handleAddressChange}
                placeholder="Start typing an address..."
                required
              />
              {isLoading && <small>Loading...</small>}
              
              {/* Suggestions Dropdown */}
              {addressSuggestions.length > 0 && (
                <ListGroup className="mt-1">
                  {addressSuggestions.map((place, index) => (
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

            {selectedAddress && (
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Selected Address Details</Card.Title>
                  <Card.Text>
                    <strong>Address:</strong> {address} <br />
                    <strong>Country:</strong> {country} <br />
                    <strong>City:</strong> {city} <br />
                    <strong>Municipality:</strong> {municipality} <br />
                    <strong>Postcode:</strong> {postcode} <br />
                    <strong>Region:</strong> {region} <br />
                    <strong>Latitude:</strong> {latitude} <br />
                    <strong>Longitude:</strong> {longitude} <br />
                  </Card.Text>
                </Card.Body>
              </Card>
            )}

            {/* Lineup Input */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Event activities</Form.Label>
              {activities.map((item, index) => (
                <Row key={index} className="mb-2">
                  <Col>
                    <Form.Control
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => this.handleLineupChange(index, e)}
                      placeholder="Activity Name"
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="datetime-local"
                      name="start_date"
                      value={item.start_date}
                      onChange={(e) => this.handleLineupChange(index, e)}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="datetime-local"
                      name="end_date"
                      value={item.end_date}
                      onChange={(e) => this.handleLineupChange(index, e)}
                      required
                    />
                  </Col>
                  <Col xs="auto">
                    <Button variant="danger" onClick={() => this.removeLineupItem(index)}>
                      ✖
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button className="mx-3" variant="dark" onClick={this.addLineupItem}>
                + Add Item
              </Button>
            </Form.Group>


            {/* tickets Input */}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Event Tickets</Form.Label>
              {tickets.map((item, index) => (
                <Row key={index} className="mb-2">
                  <Col>
                    <Form.Control
                      type="text"
                      name="name"
                      value={item.name}
                      onChange={(e) => this.handleTicketsChange(index, e)}
                      placeholder="Ticket Name"
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      name="cost"
                      value={item.cost}
                      onChange={(e) => this.handleTicketsChange(index, e)}
                      placeholder="Enter price"
                      step="0.01" // Allows decimal values
                      min="0" // Prevents negative values
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Select
                      name="currency"
                      value={item.currency}
                      onChange={(e) => this.handleTicketsChange(index, e)}
                      required
                    >
                      <option value="">Select Currency</option>
                      {TICKET_CURRENCIES.map((currency) => (
                        <option key={currency.value} value={currency.value}>
                          {currency.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col xs="auto">
                    <Button variant="danger" onClick={() => this.removeTicketsItem(index)}>
                      ✖
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button className="mx-3" variant="dark" onClick={this.addTicketsItem}>
                + Add Item
              </Button>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Tags</Form.Label>
              <div className="border p-2 rounded">
                {tags.map((tag) => (
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
                  value={tagValue}
                  onChange={this.handleTagInputChange}
                  placeholder="Type to search tags..."
                />
              </div>
              {filteredSuggestions.length > 0 && (
                <ListGroup className="mt-1">
                  {filteredSuggestions.map((tag) => (
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
                value={description}
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
              {coverImagePreview && (
                <div className="d-flex justify-content-center">
                  <img
                    src={coverImagePreview}
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
              {profileImagePreview && (
                <div className="d-flex justify-content-center">
                  <img
                    src={profileImagePreview}
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

export default connect(mapStateToProps, mapDispatchToProps)(EventCreateFormWithParams);
