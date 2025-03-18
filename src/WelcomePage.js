import React, { Component } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setActiveCategoryHeader, setActiveCategoryDiscover } from "./actions/appActions";
import EventCard from "./components/agenda/EventCard";

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

  getStartOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  };
  
  getEndOfWeek = (startOfWeek) => {
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return endOfWeek;
  };
  
  filterEventsForCurrentWeek = (events) => {
    const today = new Date();
    const startOfWeek = this.getStartOfWeek(new Date(today));
    const endOfWeek = this.getEndOfWeek(startOfWeek);
  
    return events.filter((event) => {
      const eventDate = new Date(event.start_date);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });
  };

  render() {
    const { events, businesses } = this.props;
    const { startIndex, visibleCount } = this.state;
    const visibleBusinesses = businesses.slice(startIndex, startIndex + visibleCount).filter(x => x.category === "artist");
    const visibleEvents = this.filterEventsForCurrentWeek(events)

    return (
      <div className="d-flex flex-column bg-light">
        {/* HEADER SECTION */}
        <Container
          fluid
          className="py-5 text-center text-md-start"
          style={{ background: "linear-gradient(145deg, #fff 0, #f5f1f7 20%, #f0f5ff 50%, #fff 100%)" }}
        >
          <Row className="justify-content-center">
            <Col xs={12} md={8}>
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
        <Container className="py-5">
          <Row>
            <Col xs={12} className="text-center text-md-start">
              <h4 className="fw-bold">Discover local events:</h4>
              <Button variant="outline-dark" className="rounded-pill px-4 mt-2">
                France 🇫🇷
              </Button>
              <div className="d-flex align-items-center mt-4 justify-content-center justify-content-md-start">
                <Image
                  src="https://d3skpo6i31hl4s.cloudfront.net/AdobeStock_299134759_Photo_elephant_sansombre-scaled.webp"
                  roundedCircle
                  className="me-3"
                  width={75}
                  height={75}
                />
                <div>
                  <h5 className="fw-bold mb-0">Nantes ❤️</h5>
                  <p className="text-muted">{events.filter(x => x.city === "Nantes").length} Events</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        {/* DISCOVER ARTISTS SECTION */}
        {visibleBusinesses.length > 0 && (
          <Container className="py-5">
            <Row className="d-flex justify-content-between align-items-center">
              <Col>
                <h4 className="fw-bold">Popular Artists</h4>
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
                            border: "2px solid rgba(0, 0, 0, 0.1)",
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
        )}
                
        {/* AGENDA EVENTS SECTION */}
        {visibleEvents.length > 0 && (<Container className="py-5">
          <Row className="d-flex justify-content-between align-items-center">
            <Col>
              <h4 className="fw-bold">Events of the week</h4>
            </Col>
            <Col xs="auto">
              <Link to="/agenda">
                <Button
                  variant="light"
                  className="rounded-pill shadow-sm"
                  onClick={() => this.handleCategoryChange("agenda", "/agenda/all")}
                >
                  See More
                </Button>
              </Link>
            </Col>
          </Row>

          <Row className="mt-5">
            {visibleEvents.slice(0, 3).map((event) => (
              <Col key={event.id} xs={12} sm={6} md={4}>
                <EventCard
                  id={event.id}
                  title={event.name}
                  start_date={event.start_date}
                  end_date={event.end_date}
                  address={event.address}
                  category={event.category}
                  tickets={event.tickets}
                  tags={event.tags}
                  files={event.files}
                />
              </Col>
            ))}
          </Row>
        </Container>)}
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
