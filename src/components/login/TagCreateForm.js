import { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from "react-router-dom";
import Api from "../../Api";
import sleep from "../../hooks/Sleep";

const TagCreateForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [redirect] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isLoggedIn, activeCategoryAgenda } = useSelector(state => ({
    isLoggedIn: state.appRootReducer.isLoggedIn,
    activeCategoryAgenda: state.appRootReducer.activeCategoryAgenda,
  }));
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    
    if (name === "name") setName(newValue);
    else if (name === "description") setDescription(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setMessage("");
    setMessageType("");

    try {
      await Api.post("/tags/private/create",
        { name, description },
        {
          headers: { 
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );
      
      setMessage("Tag created successfully!");
      setMessageType("success");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      await sleep(2000);
      window.location.reload();
    } catch (error) {
      setMessage("Error creating tag. Please try again.");
      setMessageType("error");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      if (error.response?.status === 401) {
        dispatch(setIsLoggedIn(false));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    dispatch(setActiveCategoryHeader("agenda"));
    return <Navigate to={activeCategoryAgenda} replace />;
  }

  if (redirect) {
    return <Navigate to="/tag/create" />;
  }

  return (
    <Container className="my-4">
      <Card className="shadow-lg p-5 rounded-4 border-0 bg-light">
        <h3 className="fw-bold text-center mb-4 text-dark">Create Tag</h3>

        {message && (
          <div 
            className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"} alert-dismissible fade show`} 
            role="alert"
          >
            {message}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setMessage("")} 
              aria-label="Close"
            ></button>
          </div>
        )}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Name</Form.Label>
            <Form.Control 
              type="text" 
              name="name" 
              value={name} 
              onChange={handleChange} 
              placeholder="Tag Name" 
              required 
              disabled={isSubmitting}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label className="fw-bold">Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={description || ""}
              onChange={handleChange}
              maxLength={500}
              placeholder="Enter description (optional)"
              disabled={isSubmitting}
            />
          </Form.Group>

          <div className="text-center">
            <Button variant="dark" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
};

export default TagCreateForm;
