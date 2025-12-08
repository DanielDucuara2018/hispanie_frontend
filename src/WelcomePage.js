import React, { useState, useCallback, useMemo } from "react";
import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveCategoryHeader, setActiveCategoryDiscover } from "./actions/appActions";
import EventCard from "./components/agenda/EventCard";
import DiscoverCard from "./components/discover/DiscoverCard";

const getStartOfWeek = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
};

const getEndOfWeek = (startOfWeek) => {
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  return endOfWeek;
};

const filterEventsForCurrentWeek = (events) => {
  const today = new Date();
  const startOfWeek = getStartOfWeek(new Date(today));
  const endOfWeek = getEndOfWeek(startOfWeek);

  return events.filter((event) => {
    const eventDate = new Date(event.start_date);
    return eventDate >= startOfWeek && eventDate <= endOfWeek;
  });
};

const WelcomePage = ({ events = [], businesses = [] }) => {
  const [currentDate] = useState(() => 
    new Date().toLocaleDateString("en-FR", {
      weekday: "long",
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  );
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 4;

  const dispatch = useDispatch();
  
  const handleCategoryChange = useCallback((headerCategory, discoverCategory) => {
    dispatch(setActiveCategoryHeader(headerCategory));
    dispatch(setActiveCategoryDiscover(discoverCategory));
  }, [dispatch]);

  const handleNext = useCallback(() => {
    setStartIndex(prev => Math.min(prev + 1, businesses.length - visibleCount));
  }, [businesses.length, visibleCount]);

  const handlePrev = useCallback(() => {
    setStartIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const visibleBusinesses = useMemo(() => {
    return businesses
      .slice(startIndex, startIndex + visibleCount)
      .filter(x => x.category === "artist");
  }, [businesses, startIndex, visibleCount]);

  const visibleEvents = useMemo(() => {
    return filterEventsForCurrentWeek(events);
  }, [events]);

  const nantesEventCount = useMemo(() => {
    return events.filter(x => x.city === "Nantes").length;
  }, [events]);

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
              <p className="text-muted small fw-bold">{currentDate}</p>
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
                  <p className="text-muted">{nantesEventCount} Events</p>
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
                    onClick={() => handleCategoryChange("discover", "/discover/artists")}
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
                  onClick={handlePrev}
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
                      <DiscoverCard 
                        id={business.id}
                        title={business.name}
                        files={business.files}
                      />
                    </Col>
                  ))}
                </Row>
              </Col>

              {/* Right Button */}
              <Col xs="auto" className="d-none d-md-block">
                <Button
                  variant="light"
                  className="rounded-circle shadow-sm"
                  onClick={handleNext}
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
                  onClick={() => handleCategoryChange("agenda", "/agenda/all")}
                >
                  See More
                </Button>
              </Link>
            </Col>
          </Row>

          <Row className="mt-4 g-4">
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
};

export default WelcomePage;
