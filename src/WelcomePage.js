import React, { Component } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setActiveCategoryHeader, setActiveCategoryDiscover } from "./actions/appActions";

class WelcomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date().toLocaleDateString("en-FR", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      startIndex: 0, 
      visibleCount: 4, // Adjusted for better responsiveness
    };
  }
  
  handleCategoryChange = (headerCategory, discoverCategory) => {
    this.props.setActiveCategoryHeader(headerCategory);
    this.props.setActiveCategoryDiscover(discoverCategory);
  };

  handleNext = () => {
    this.setState((prevState) => ({
      startIndex: Math.min(prevState.startIndex + 1, this.props.businesses.length - prevState.visibleCount),
    }));
  };

  handlePrev = () => {
    this.setState((prevState) => ({
      startIndex: Math.max(prevState.startIndex - 1, 0),
    }));
  };

  render() {
    const { businesses } = this.props;
    const { startIndex, visibleCount } = this.state;
    const visibleBusinesses = businesses.slice(startIndex, startIndex + visibleCount);
    
    return (
      <div className="bg-light min-vh-100">
        {/* HEADER SECTION */}
        <Container 
          fluid 
          className="py-5 text-center text-md-start"
          style={{ background: "linear-gradient(145deg, #fff 0, #f5f1f7 20%, #f0f5ff 50%, #fff 100%)" }}
        >
          <Row className="justify-content-center">
            <Col md={8}>
              <p className="text-muted small fw-bold">{this.state.currentDate}</p>
              <h1 className="fw-bold animate__animated animate__slideInDown">
                Yo traigo alegría, pa' tu corazón ❤️‍🔥, pa' los corazones 😌.
              </h1>
              <p className="text-secondary animate__animated animate__fadeIn">
                I bring joy, for your heart ❤️‍🔥, for the hearts 😌.
              </p>
            </Col>
          </Row>
        </Container>

        {/* DISCOVER EVENTS SECTION */}
        <Container className="mt-5">
          <Row>
            <Col className="text-center text-md-start">
              <h4 className="fw-bold">Discover local events:</h4>
              <Button variant="outline-dark" className="rounded-pill px-4 mt-2">
                France 🇫🇷
              </Button>
              <div className="d-flex align-items-center mt-4">
                <Image
                  src="https://d3skpo6i31hl4s.cloudfront.net/AdobeStock_299134759_Photo_elephant_sansombre-scaled.webp"
                  roundedCircle
                  className="me-3"
                  width={75}
                  height={75}
                />
                <div>
                  <h5 className="fw-bold mb-0">Nantes ❤️</h5>
                  <p className="text-muted">15 Events</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        {/* DISCOVER ARTISTS SECTION */}
        <Container className="mt-5">
          <Row className="d-flex justify-content-between align-items-center">
            <Col>
              <h4 className="fw-bold">Artistas de la semana</h4>
            </Col>
            <Col xs="auto">
              <Link to="/discover">
                <Button 
                  variant="light" 
                  className="rounded-pill shadow-sm" 
                  onClick={() => this.handleCategoryChange("discover", "/discover/artists")}
                >
                  See More
                </Button>
              </Link>
            </Col>
          </Row>
          
          {/* ARTISTS SCROLLER */}
          <Row className="align-items-center mt-3">
            {/* Left Button */}
            <Col xs="auto" className="d-none d-md-block">
              <Button
                variant="light"
                className="rounded-circle shadow-sm"
                onClick={this.handlePrev}
                disabled={startIndex === 0}
              >
                {"<"}
              </Button>
            </Col>

            {/* Artists Display */}
            <Col>
              <Row className="d-flex justify-content-center g-3">
                {visibleBusinesses.map((business) => (
                  <Col key={business.id} xs={6} sm={4} md={3} lg={2} className="text-center px-3">
                    <Link 
                      to={`/discover/business/${business.id}`} 
                      className="text-decoration-none text-dark"
                      onClick={() => this.handleCategoryChange("discover", "/discover/artists")}
                    >
                      <Image 
                        src={business.files.find((x) => x.category === "profile_image").path}
                        roundedCircle
                        className="mb-3 shadow-sm"
                        style={{
                          width: "100%",
                          maxWidth: "165px",
                          height: "165px",
                          maxHeight: "100%",
                          objectFit: "cover", 
                          border: "2px solid rgba(0, 0, 0, 0.1)"
                        }}
                      />
                      <p className="small fw-bold">{business.name}</p>
                    </Link>
                  </Col>
                ))}
              </Row>
            </Col>

            {/* Right Button */}
            <Col xs="auto" className="d-none d-md-block">
              <Button
                variant="light"
                className="rounded-circle shadow-sm"
                onClick={this.handleNext}
                disabled={startIndex >= businesses.length - visibleCount}
              >
                {">"}
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  activeCategoryHeader: state.appRootReducer.activeCategoryHeader,
  activeCategoryDiscover: state.appRootReducer.activeCategoryDiscover,
});

const mapDispatchToProps = {
  setActiveCategoryHeader,
  setActiveCategoryDiscover,
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
