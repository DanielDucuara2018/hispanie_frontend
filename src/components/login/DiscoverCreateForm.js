import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Form, Button, Container, Card, ListGroup, Badge, InputGroup } from "react-bootstrap";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import ImageCategoryMapping from "../../hooks/ImageCategoryMapping";
import axios from "axios";
import Api from "../../Api";
import sleep from "../../hooks/Sleep";
import { sanitizeUrl } from "../../utils/urlSanitizer";

// Enum for Social Network Categories
const SocialNetworkCategory = {
  FACEBOOK: "facebook",
  INSTAGRAM: "instagram",
  TIKTOK: "tiktok",
  TWITTER: "twitter",
  WEB: "web",
};

const DISCOVER_CATEGORIES = [
  { label: "Artist", value: "artist" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Cafe", value: "cafe" },
  { label: "Boutique", value: "boutique" },
  { label: "Exposition", value: "exposition" },
  { label: "Association", value: "association" },
  { label: "Academy", value: "academy" },
];

const DiscoverCreateForm = ({ formMode, businesses, tags }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.appRootReducer.isLoggedIn);
  const activeCategoryAgenda = useSelector(state => state.appRootReducer.activeCategoryAgenda);

  const initialState = useMemo(() => ({
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
    description: "",
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
    currentUrl: "",
    social_networks: [],
  }), []);

  const [formState, setFormState] = useState(initialState);

  // Initialize form state based on mode
  useEffect(() => {
    const { id } = params;
    
    if (id && formMode === "update" && businesses) {
      const businessData = businesses.find(event => event.id === id);
      if (businessData) {
        setFormState({
          ...initialState,
          ...businessData,
          profileImagePreview: businessData.files?.find(x => x.category === "profile_image")?.path || "",
          coverImagePreview: businessData.files?.find(x => x.category === "cover_image")?.path || "",
          selectedAddress: businessData.address,
        });
      }
    } else if (formMode === "create") {
      setFormState({
        ...initialState,
        description: "",
      });
    }
  }, [formMode, params, businesses, initialState]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const calculateFileHash = useCallback(async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
        console.error("Error uploading file:", error);
        setFormState(prev => ({
          ...prev,
          message: "Error uploading image. Please try again.",
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

  const handleUrlChange = useCallback((e) => {
    setFormState(prev => ({ ...prev, currentUrl: e.target.value }));
  }, []);

  const categorizeUrl = useCallback((url) => {
    if (url.includes("facebook.com")) return SocialNetworkCategory.FACEBOOK;
    if (url.includes("instagram.com")) return SocialNetworkCategory.INSTAGRAM;
    if (url.includes("tiktok.com")) return SocialNetworkCategory.TIKTOK;
    if (url.includes("twitter.com")) return SocialNetworkCategory.TWITTER;
    return SocialNetworkCategory.WEB;
  }, []);

  const addUrl = useCallback(() => {
    setFormState(prev => {
      const { currentUrl, social_networks } = prev;
      if (currentUrl.trim() === "") return prev;

      const category = categorizeUrl(currentUrl);
      return {
        ...prev,
        social_networks: [...social_networks, { url: currentUrl, category }],
        currentUrl: "",
      };
    });
  }, [categorizeUrl]);

  const removeUrl = useCallback((index) => {
    setFormState(prevState => ({
      ...prevState,
      social_networks: prevState.social_networks.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const { id } = params;
    let message = "";
    
    try {
      if (formMode === "create") {
        await Api.post(
          "/businesses/private/create",
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
          `/businesses/private/update/${id}`,
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
    is_public, name, category, email, phone, selectedAddress,
    address, country, city, municipality, postcode, region, latitude, longitude,
    currentUrl, tagValue, filteredSuggestions, description, coverImagePreview, 
    profileImagePreview } = formState;

  if (!isLoggedIn) {
    dispatch(setActiveCategoryHeader("agenda"));
    return <Navigate to={activeCategoryAgenda} replace />;
  }

  return (
    <Container className="my-4">
      <Card className="shadow-lg p-5 rounded-4 border-0 bg-light">
        <h3 className="fw-bold text-center mb-4 text-dark">{formMode === "update" ? "Update" : "Create"} Business</h3>

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
            <Form.Select name="category" value={category} onChange={handleChange} required>
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
            <Form.Control type="text" name="name" value={name} onChange={handleChange} placeholder="Business Name" required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Email</Form.Label>
            <Form.Control type="email" name="email" value={email} onChange={handleChange} placeholder="example@email.com" required/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Phone</Form.Label>
            <Form.Control type="tel" name="phone" value={phone} onChange={handleChange} placeholder="+1 234 567 890" required/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAddress">
            <Form.Label className="fw-bold">Address</Form.Label>
            <Form.Control
              type="text"
              value={address}
              onChange={handleAddressChange}
              placeholder="Start typing an address..."
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
            <Form.Label className="fw-bold">Add Social Network or Website URL</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                value={currentUrl}
                onChange={handleUrlChange}
                placeholder="https://example.com"
              />
              <Button variant="dark" onClick={addUrl}>
                Add URL
              </Button>
            </InputGroup>
          </Form.Group>

          {formState.social_networks.length > 0 && (
            <ListGroup className="mb-3">
              {formState.social_networks.map((item, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <div>
                    <a href={sanitizeUrl(item.url)} target="_blank" rel="noopener noreferrer">
                      {item.url}
                    </a>
                    <Badge bg="secondary" className="ms-2">
                      {item.category}
                    </Badge>
                  </div>
                  <Button variant="danger" size="sm" onClick={() => removeUrl(index)}>
                    Remove
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

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

export default DiscoverCreateForm;