import React, { Component } from "react";
import { Container, Row, Col, Card, Button, Image, Tabs, Tab } from "react-bootstrap";
import { connect } from "react-redux";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from 'react-router-dom';
import ItemList from "./ItemList";
import Api from "../../Api";
import sleep from "../../hooks/Sleep";

// Main ProfilePage component
class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "events", // Default tab
      redirectTo: null,    // State variable for navigation
    };
  }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  handleDeleteEvent = async (id) => {
    try {
      await Api.delete(`/events/private/delete/${id}`, 
        {
          withCredentials: true
        },
      )
      this.setState({ message: "Password has been reset successfully.", error: "" });
      this.setState({
        message: "Event deleted successfully!",
        messageType: "success",
      });
      await sleep(2000)
      window.location.reload();
    } catch (error) {
      this.setState({
        message: `Error deleting event. Please try again. Details ${error}`,
        messageType: "error",
      });
      if (error.response.status === 401) {
        this.props.setIsLoggedIn(false);
      }
    }
  };

  handleUpdateaccount= async (id) => {
    this.setState({ redirectTo: `/account/update/${id}` });
  };

  handleUpdateEvent = async (id) => {
    this.setState({ redirectTo: `/event/update/${id}` });
  };

  handleDeleteBusiness = async (id) => {
    await Api.delete(`/businesses/private/delete/${id}`, 
      {
        withCredentials: true
      },
    )
    .then((res) => {
      // TODO show a message saying delete was sucessful
    })
    .catch((error) => {
      // TODO show a message saying there was a probleme deleting
      if (error.response.status === 401) {
        this.props.setIsLoggedIn(false);
      }
    });
  };

  handleUpdateBusiness = (id) => {
    this.setState({ redirectTo: `/business/update/${id}` });
  };

  render() {
    const { events, businesses, account, isLoggedIn, activeCategoryAgenda } = this.props;
    const { activeTab, redirectTo, message, messageType } = this.state;

    if (!isLoggedIn) {
      this.props.setActiveCategoryHeader("agenda");
      return <Navigate to={activeCategoryAgenda} replace />;
    }

    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    return (
      <Container className="my-4">
        {/* Profile Card */}
        <Card className="shadow-lg p-5 rounded-4 border-0 bg-light">

          {/* Success/Error Message */}
          {message && (
            <div className={`alert ${messageType === "success" ? "alert-success" : "alert-danger"}`} role="alert">
              {message}
            </div>
          )}

          {/* Cover Photo */}
          <Card className="mb-3">
            <Card.Img
              src={account.files?.find((x) => x.category === "cover_image")?.path}// Replace with user's cover image
              alt="Cover"
              className="img-fluid"
            />
          </Card>

          {/* Profile Section */}
          <Row className="mb-4">
            <Col md={4} className="text-center">
              <Image
                src={account.files?.find((x) => x.category === "profile_image")?.path} // Replace with user's profile image
                roundedCircle
                width={150}
                height={150}
                className="border border-3 shadow-sm"
              />
              <h3 className="mt-3 fw-bold">{account.username}</h3>
              {/* <p className="text-muted">🎵 Latin Music | 🌮 Mexican Food Lover</p> */}
              <Button variant="dark" className="mt-2" onClick={() => this.handleUpdateaccount(account.id)}>Edit Profile</Button>
            </Col>
            <Col md={8}>
              <h5 className="fw-bold">About Me</h5>
              <p>{account.description}</p>
              <h6 className="fw-bold mt-3">Email</h6>
              <p>{account.email}</p>
              {/* <h6 className="fw-bold mt-3">Social Links</h6>
              <p>
                <a href="https://www.instagram.com">Instagram</a> | <a href="https://www.facebook.com">Facebook</a> | <a href="https://www.linkedin.com">LinkedIn</a>
              </p> */}
            </Col>
          </Row>

          {/* Navigation Tabs */}
          <Tabs
            activeKey={activeTab}
            onSelect={this.handleTabChange}
            className="mb-3"
          >
            <Tab eventKey="events" title="Events">
              <ItemList
                items={events}
                onDelete={this.handleDeleteEvent}
                onUpdate={this.handleUpdateEvent}
              />
            </Tab>
            <Tab eventKey="businesses" title="Businesses">
              <ItemList
                items={businesses}
                onDelete={this.handleDeleteBusiness}
                onUpdate={this.handleUpdateBusiness}
              />
            </Tab>
          </Tabs>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);