import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Container, Card, ListGroup, Badge, Col, Row } from "react-bootstrap";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import ImageCategoryMapping from "../../hooks/ImageCategoryMapping";
import axios from "axios";
import Api from "../../Api";
import sleep from "../../hooks/Sleep";

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

const EventCreateForm = ({ formMode, events, tags }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.appRootReducer.isLoggedIn);
  const activeCategoryAgenda = useSelector(state => state.appRootReducer.activeCategoryAgenda);

  const initialState = useMemo(() => ({
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
    message: "",
    messageType: "",
    tagValue: "",
    filteredSuggestions: [],
    files: [],
    selectedAddress: false,
    activities: [],
    tickets: [{ name: "Free entry", cost: 0, currency: "EUR" }],
  }), []);

  const [formState, setFormState] = useState(initialState);

  // Initialize form state based on mode
  useEffect(() => {
    const { id } = params;
    
    if (id && formMode === "update" && events) {
      const eventData = events.find(event => event.id === id);
      if (eventData) {
        setFormState({
          ...initialState,
          ...eventData,
          profileImagePreview: eventData.files?.find(x => x.category === "profile_image")?.path || "",
          coverImagePreview: eventData.files?.find(x => x.category === "cover_image")?.path || "",
          selectedAddress: eventData.address,
        });
      }
    } else if (formMode === "create") {
      setFormState({
        ...initialState,
        description: "",
      });
    }
  }, [formMode, params, events, initialState]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const calculateFileHash = useCallback(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }, []);

  const handleFileChange = useCallback(async (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file) {
      try {
        // 1. Request presigned upload URL
        const upload_response = await Api.get("/files/private/generate-upload-presigned-url", { 
          params: {
            filename: file.name,
            content_type: file.type
          },
          withCredentials: true
        });

        const upload_url = upload_response.data.url;

        // 2. Upload file to presigned URL
        await axios.put(upload_url, file, {
          headers: { "Content-Type": file.type },
        });

        // 3. Generate download URL
        const download_url = "https://d3skpo6i31hl4s.cloudfront.net/" + file.name;

        // 4. Save public image URL
        const hash = await calculateFileHash(file);
        setFormState(prevState => ({
          ...prevState,
          [name]: download_url,
          [`${name}Preview`]: URL.createObjectURL(file),
          files: [
            ...(prevState.files || []),
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
        setFormState(prev => ({
          ...prev,
          message: `Error submitting form. Please try again. Details ${error}`,
          messageType: "error",
        }));
      }
    }
  }, [calculateFileHash]);

  const handleAddressChange = useCallback(async (e) => {
    const address = e.target.value;
    setFormState(prev => ({ ...prev, address, isLoading: true }));

    if (address.length > 3) {
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
        setFormState(prev => ({ 
          ...prev, 
          addressSuggestions: response.data, 
          isLoading: false 
        }));
      } catch (error) {
        console.error("Error fetching address:", error);
        setFormState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setFormState(prev => ({ ...prev, addressSuggestions: [], isLoading: false }));
    }
  }, []);

  const handleSelectAddress = useCallback((place) => {
    setFormState(prev => ({
      ...prev,
      address: place.display_name,
      latitude: place.lat,
      longitude: place.lon,
      country: place.address?.country,
      city: place.address?.city || place.address?.municipality,
      municipality: place.address?.municipality,
      postcode: place.address?.postcode,
      region: place.address?.state,
      addressSuggestions: [],
      selectedAddress: true,
    }));
  }, []);

  const handleLineupChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setFormState(prev => {
      const updatedLineup = [...prev.activities];
      updatedLineup[index][name] = value;
      return { ...prev, activities: updatedLineup };
    });
  }, []);

  const addLineupItem = useCallback(() => {
    setFormState(prevState => ({
      ...prevState,
      activities: [...prevState.activities, { name: "", start_date: "", end_date: "" }],
    }));
  }, []);

  const removeLineupItem = useCallback((index) => {
    setFormState(prevState => ({
      ...prevState,
      activities: prevState.activities.filter((_, i) => i !== index),
    }));
  }, []);

  const handleTicketsChange = useCallback((index, e) => {
    const { name, value } = e.target;
    setFormState(prev => {
      const updatedTickets = [...prev.tickets];
      updatedTickets[index][name] = value;
      return { ...prev, tickets: updatedTickets };
    });
  }, []);

  const addTicketsItem = useCallback(() => {
    setFormState(prevState => ({
      ...prevState,
      tickets: [...prevState.tickets, { name: "", cost: 0, currency: "EUR" }],
    }));
  }, []);

  const removeTicketsItem = useCallback((index) => {
    setFormState(prevState => ({
      ...prevState,
      tickets: prevState.tickets.filter((_, i) => i !== index),
    }));
  }, []);

  const handleTagInputChange = useCallback((e) => {
    const tagValue = e.target.value;
    const filteredSuggestions = (tags || []).filter(
      (tag) => tag.name.toLowerCase().includes(tagValue.toLowerCase())
    );

    setFormState(prev => ({ ...prev, tagValue, filteredSuggestions }));
  }, [tags]);

  const handleTagSelect = useCallback((tag) => {
    setFormState(prevState => ({
      ...prevState,
      tags: [...prevState.tags, tag],
      tagValue: "",
      filteredSuggestions: [],
    }));
  }, []);

  const handleTagRemove = useCallback((tagId) => {
    setFormState(prevState => ({
      ...prevState,
      tags: prevState.tags.filter((tag) => tag.id !== tagId),
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { id } = params;
    let message = "";
    
    try {
      if (formMode === "create") {
        await Api.post(
          "/events/private/create",
          formState,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        message = "Event created successfully!";
      } else {
        await Api.put(
          `/events/private/update/${id}`,
          formState,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        message = "Event updated successfully!";
      }
      
      setFormState(prev => ({
        ...prev,
        message: message,
        messageType: "success",
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await sleep(2000);
      window.location.reload();
    } 
    catch (error) {
      setFormState(prev => ({
        ...prev,
        message: `Error submitting form. Please try again. Details ${error}`,
        messageType: "error",
      }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (error.response?.status === 401) {
        dispatch(setIsLoggedIn(false));
      }
    }
  }, [formState, formMode, params, dispatch]);

  const { message, messageType, isLoading, addressSuggestions, 
    is_public, name, category, frequency, start_date, end_date, selectedAddress,
    address, country, city, municipality, postcode, region, latitude, longitude,
    tagValue, filteredSuggestions, description, coverImagePreview, 
    profileImagePreview, activities, tickets } = formState;

  if (!isLoggedIn) {
    dispatch(setActiveCategoryHeader("agenda"));
    return <Navigate to={activeCategoryAgenda} replace />;
  }

  return (
    <Container className="my-4">
      <Card className="shadow-lg p-5 rounded-4 border-0 bg-light">
        <h3 className="fw-bold text-center mb-4 text-dark">{formMode === "update" ? "Update" : "Create"} Event</h3>

        {message && (
          <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`} role="alert">
            {message}
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formIsPublic">
            <Form.Check
              type="checkbox"
              name="is_public"
              checked={is_public}
              onChange={handleChange} 
              label="Is Public"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Category</Form.Label>
            <Form.Select 
              name="category" 
              value={category} 
              onChange={handleChange} 
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
            <Form.Label className="fw-bold">Frequency</Form.Label>
            <Form.Select 
              name="frequency" 
              value={frequency} 
              onChange={handleChange}
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
              onChange={handleChange} 
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label className="fw-bold">Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Start typing an address..."
              required
            />
            {isLoading && <small>Loading...</small>}
            
            {addressSuggestions.length > 0 && (
              <ListGroup className="mt-1">
                {addressSuggestions.map((place, index) => (
                  <ListGroup.Item
                    key={index}
                    action
                    onClick={() => handleSelectAddress(place)}
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

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Event Activities</Form.Label>
            {activities.map((item, index) => (
              <Row key={index} className="mb-2 g-2">
                <Col xs={12} md={4}>
                  <Form.Control
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleLineupChange(index, e)}
                    placeholder="Activity Name"
                    required
                  />
                </Col>
                <Col xs={12} md={3}>
                  <Form.Control
                    type="datetime-local"
                    name="start_date"
                    value={item.start_date}
                    onChange={(e) => handleLineupChange(index, e)}
                    required
                  />
                </Col>
                <Col xs={12} md={3}>
                  <Form.Control
                    type="datetime-local"
                    name="end_date"
                    value={item.end_date}
                    onChange={(e) => handleLineupChange(index, e)}
                    required
                  />
                </Col>
                <Col xs="auto">
                  <Button variant="danger" onClick={() => removeLineupItem(index)}>
                    ✖
                  </Button>
                </Col>
              </Row>
            ))}
            <Button className="mt-2" variant="dark" onClick={addLineupItem}>
              + Add Item
            </Button>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Event Tickets</Form.Label>
            {tickets.map((item, index) => (
              <Row key={index} className="mb-2 g-2">
                <Col xs={12} md={4}>
                  <Form.Control
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={(e) => handleTicketsChange(index, e)}
                    placeholder="Ticket Name"
                    required
                  />
                </Col>
                <Col xs={6} md={3}>
                  <Form.Control
                    type="number"
                    name="cost"
                    value={item.cost}
                    onChange={(e) => handleTicketsChange(index, e)}
                    placeholder="Enter price"
                    step="0.01"
                    min="0"
                    required
                  />
                </Col>
                <Col xs={6} md={3}>
                  <Form.Select
                    name="currency"
                    value={item.currency}
                    onChange={(e) => handleTicketsChange(index, e)}
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
                  <Button variant="danger" onClick={() => removeTicketsItem(index)}>
                    ✖
                  </Button>
                </Col>
              </Row>
            ))}
            <Button className="mt-2" variant="dark" onClick={addTicketsItem}>
              + Add Item
            </Button>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Tags</Form.Label>
            <div className="border p-2 rounded">
              {formState.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  pill
                  bg="secondary"
                  className="me-2 mb-2 px-3 py-2 fs-6"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleTagRemove(tag.id)}
                >
                  {tag.name} ✖
                </Badge>
              ))}
              <Form.Control
                type="text"
                value={tagValue}
                onChange={handleTagInputChange}
                placeholder="Type to search tags..."
              />
            </div>
            {filteredSuggestions.length > 0 && (
              <ListGroup className="mt-1">
                {filteredSuggestions.map((tag) => (
                  <ListGroup.Item
                    key={tag.id}
                    action
                    onClick={() => handleTagSelect(tag)}
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
              onChange={handleChange}
              maxLength={2000}
              placeholder="Enter description (optional)"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Cover Image</Form.Label>
            <div
              className="border border-dashed p-4 text-center d-flex justify-content-center align-items-center"
              style={{ borderRadius: "5px", height: "120px", borderColor: "#ccc", cursor: "pointer" }}
              onClick={() => document.getElementById("coverImageUpload").click()}
            >
              <Form.Control
                type="file"
                id="coverImageUpload"
                name="coverImage"
                accept="image/*"
                onChange={handleFileChange}
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

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Profile Image</Form.Label>
            <div
              className="border border-dashed p-4 text-center d-flex justify-content-center align-items-center"
              style={{ borderRadius: "5px", height: "120px", borderColor: "#ccc", cursor: "pointer" }}
              onClick={() => document.getElementById("profileImageUpload").click()}
            >
              <Form.Control
                type="file"
                id="profileImageUpload"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
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
};

export default EventCreateForm;
