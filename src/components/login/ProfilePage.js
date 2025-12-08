import React, { useState, useCallback } from "react";
import { Container, Row, Col, Card, Button, Image, Tabs, Tab } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from 'react-router-dom';
import ItemList from "./ItemList";
import Api from "../../Api";
import sleep from "../../hooks/Sleep";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("events");
  const [redirectTo, setRedirectTo] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  
  const { events, businesses, account, isLoggedIn, activeCategoryAgenda } = useSelector(state => ({
    events: state.appRootReducer.events,
    businesses: state.appRootReducer.businesses,
    account: state.appRootReducer.account,
    isLoggedIn: state.appRootReducer.isLoggedIn,
    activeCategoryAgenda: state.appRootReducer.activeCategoryAgenda,
  }));
  
  const dispatch = useDispatch();

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const handleDeleteEvent = useCallback(async (id) => {
    try {
      await Api.delete(`/events/private/delete/${id}`, {
        withCredentials: true
      });
      
      setMessage("Event deleted successfully!");
      setMessageType("success");
      
      await sleep(2000);
      window.location.reload();
    } catch (error) {
      setMessage(`Error deleting event. Please try again. Details: ${error.message}`);
      setMessageType("error");
      
      if (error.response?.status === 401) {
        dispatch(setIsLoggedIn(false));
      }
    }
  }, [dispatch]);

  const handleUpdateAccount = useCallback((id) => {
    setRedirectTo(`/account/update/${id}`);
  }, []);

  const handleUpdateEvent = useCallback((id) => {
    setRedirectTo(`/event/update/${id}`);
  }, []);

  const handleDeleteBusiness = useCallback(async (id) => {
    try {
      await Api.delete(`/businesses/private/delete/${id}`, {
        withCredentials: true
      });
      
      setMessage("Business deleted successfully!");
      setMessageType("success");
      
      await sleep(2000);
      window.location.reload();
    } catch (error) {
      setMessage(`Error deleting business. Please try again. Details: ${error.message}`);
      setMessageType("error");
      
      if (error.response?.status === 401) {
        dispatch(setIsLoggedIn(false));
      }
    }
  }, [dispatch]);

  const handleUpdateBusiness = useCallback((id) => {
    setRedirectTo(`/business/update/${id}`);
  }, []);

  // Early returns for redirects
  if (!isLoggedIn) {
    dispatch(setActiveCategoryHeader("agenda"));
    return <Navigate to={activeCategoryAgenda} replace />;
  }

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  const profileImage = account?.files?.find((x) => x.category === "profile_image")?.path;
  const coverImage = account?.files?.find((x) => x.category === "cover_image")?.path;

  return (
    <Container className="my-4">
      {/* Profile Card */}
      <Card className="shadow-lg p-5 rounded-4 border-0 bg-light">

        {/* Success/Error Message */}
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

        {/* Cover Photo */}
        {coverImage && (
          <Card className="mb-3">
            <Card.Img
              src={coverImage}
              alt="Cover"
              className="img-fluid"
            />
          </Card>
        )}

        {/* Profile Section */}
        <Row className="mb-4">
          <Col md={4} className="text-center">
            {profileImage && (
              <Image
                src={profileImage}
                roundedCircle
                width={150}
                height={150}
                className="border border-3 shadow-sm"
              />
            )}
            <h3 className="mt-3 fw-bold">{account?.username}</h3>
            <Button 
              variant="dark" 
              className="mt-2" 
              onClick={() => handleUpdateAccount(account?.id)}
            >
              Edit Profile
            </Button>
          </Col>
          <Col md={8}>
            <h5 className="fw-bold">About Me</h5>
            <p>{account?.description || "No description provided."}</p>
            <h6 className="fw-bold mt-3">Email</h6>
            <p>{account?.email}</p>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Tabs
          activeKey={activeTab}
          onSelect={handleTabChange}
          className="mb-3"
        >
          <Tab eventKey="events" title="Events">
            <ItemList
              items={events || []}
              onDelete={handleDeleteEvent}
              onUpdate={handleUpdateEvent}
            />
          </Tab>
          <Tab eventKey="businesses" title="Businesses">
            <ItemList
              items={businesses || []}
              onDelete={handleDeleteBusiness}
              onUpdate={handleUpdateBusiness}
            />
          </Tab>
        </Tabs>
      </Card>
    </Container>
  );
};

export default ProfilePage;