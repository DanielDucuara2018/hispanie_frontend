import React, { Component } from "react";
import { Container, Row, Col, Card, Button, Image, Nav } from "react-bootstrap";
import { connect } from "react-redux";
import { setActiveCategoryHeader, setIsLoggedIn } from "../../actions/appActions";
import { Navigate } from 'react-router-dom';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "posts", // Default tab
    };
  }

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  render() {
    const agenda_path = this.props.activeCategoryAgenda
    if (!this.props.isLoggedIn) {
      {/* TODO extact "agenda" value from agenda_path variable*/}
      this.props.setActiveCategoryHeader("agenda"); 
      return <Navigate to={ agenda_path } replace />;
    }

    return (
      <Container className="mt-4">
        {/* Cover Photo */}
        <Card className="mb-3">
          <Card.Img
            src="https://via.placeholder.com/1200x300" // Replace with user's cover image
            alt="Cover"
            className="img-fluid"
          />
        </Card>

        {/* Profile Section */}
        <Row className="mb-4">
          <Col md={4} className="text-center">
            <Image
              src="https://via.placeholder.com/150" // Replace with user's profile image
              roundedCircle
              width={150}
              height={150}
              className="border border-3 shadow-sm"
            />
            <h3 className="mt-3 fw-bold">John Doe</h3>
            <p className="text-muted">🎵 Latin Music | 🌮 Mexican Food Lover</p>
            <Button variant="dark" className="mt-2">Edit Profile</Button>
          </Col>
          <Col md={8}>
            <h5 className="fw-bold">About Me</h5>
            <p>
              Passionate about Latin music, food, and dance! 
              Bringing the best of Hispanic culture to the world. 🌎✨
            </p>
            <h6 className="fw-bold mt-3">Location</h6>
            <p>📍 Nantes, France</p>
            <h6 className="fw-bold mt-3">Social Links</h6>
            <p>
              <a href="#">Instagram</a> | <a href="#">Facebook</a> | <a href="#">YouTube</a>
            </p>
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Nav variant="tabs" defaultActiveKey="posts" className="mb-3">
          <Nav.Item>
            <Nav.Link
              eventKey="posts"
              onClick={() => this.handleTabChange("posts")}
            >
              Posts
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="events"
              onClick={() => this.handleTabChange("events")}
            >
              Events
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="favorites"
              onClick={() => this.handleTabChange("favorites")}
            >
              Favorites
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Tab Content */}
        <Card>
          <Card.Body>
            {this.state.activeTab === "posts" && <h5>📌 User's Posts</h5>}
            {this.state.activeTab === "events" && <h5>🎉 Upcoming Events</h5>}
            {this.state.activeTab === "favorites" && <h5>❤️ Favorite Places</h5>}
          </Card.Body>
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