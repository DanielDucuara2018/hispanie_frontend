import React, { Component } from "react";
import { Container, Row, Col, Button, Image, Carousel } from "react-bootstrap";

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
      artists: [
        { id: 1, name: "Alameda", img: "https://hispanie.com/cdn/shop/collections/326983212_720382779483957_8328956269607356202_n.jpg?v=1734408523&width=750" },
        { id: 2, name: "Association Mexicaine COMAL", img: "https://hispanie.com/cdn/shop/collections/422822287_416552314074408_573330835882904212_n.jpg?v=1734732019&width=750" },
        { id: 3, name: "AssoColombia", img: "https://hispanie.com/cdn/shop/collections/279623341_115922814438615_2837053763006482913_n.jpg?v=1734549500&width=750" },
        { id: 4, name: "Bailar Latino à Nantes", img: "https://hispanie.com/cdn/shop/collections/366290132_321982023493833_9139375071584274116_n.jpg?v=1734707825&width=750" },
        { id: 5, name: "Carlito Zuma", img: "https://hispanie.com/cdn/shop/collections/353653001_1894504897588922_5603763545973655979_n.jpg?v=1734706802&width=750" },
        { id: 6, name: "Cañas y Tapas Nantes", img: "https://hispanie.com/cdn/shop/collections/321436668_1328652091322104_4057458031450885744_n.jpg?v=1734741921&width=750" },
        { id: 7, name: "Comalix", img: "https://hispanie.com/cdn/shop/collections/408300349_215257264951612_8964474135256976800_n.jpg?v=1734386032&width=750" },
        { id: 8, name: "Danse Mama Nantes.", img: "https://hispanie.com/cdn/shop/collections/469340877_542305538616699_8142699608393478925_n.jpg?v=1736259738&width=750" },
      ],
      startIndex: 0, // Tracks the first visible artist
      visibleCount: 6, // Number of artists shown at a time
    };
  }

  handleNext = () => {
    this.setState((prevState) => ({
      startIndex: Math.min(prevState.startIndex + 1, prevState.artists.length - prevState.visibleCount),
    }));
  };

  handlePrev = () => {
    this.setState((prevState) => ({
      startIndex: Math.max(prevState.startIndex - 1, 0),
    }));
  };

  render() {
    const { artists, startIndex, visibleCount } = this.state;
    const visibleArtists = artists.slice(startIndex, startIndex + visibleCount);
    
    return (
      <div className="bg-light min-vh-100">
        {/* HEADER SECTION */}
        <Container fluid className="py-5 text-center bg-gradient bg-white">
          <p className="text-muted small">{this.state.currentDate}</p>
          <h1 className="fw-bold">
            Yo traigo alegría, pa' tu corazón{" "}
            <span role="img" aria-label="heart">💖</span>, pa' los corazones{" "}
            <span role="img" aria-label="smile">😊</span>.
          </h1>
          <p className="text-secondary">
            I bring joy, for your heart{" "}
            <span role="img" aria-label="heart">💖</span>, for the hearts{" "}
            <span role="img" aria-label="smile">😊</span>.
          </p>
        </Container>

        {/* DISCOVER EVENTS SECTION */}
        <Container className="mt-5">
          <Row>
            <Col>
              <h4 className="fw-bold">Discover local events:</h4>
              <Button variant="outline-dark" className="rounded-pill px-4 mt-2">
                France 🇫🇷
              </Button>
              <div className="d-flex align-items-center mt-4">
                <Image
                  src="https://hispanie.com/cdn/shop/files/AdobeStock_299134759_Photo_elephant_sansombre-scaled.jpg?v=1733974335&width=100"
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
            <Button variant="light" className="rounded-pill shadow-sm">
              See More {/* TODO this button redirects to discover/artists page */}
            </Button> 
          </Col>
        </Row>

        {/* ARTISTS SCROLLER */}
        <Row className="align-items-center mt-3">
          {/* Left Button */}
          <Col xs="auto">
            <Button
              variant="light"
              className="rounded-circle shadow-sm"
              onClick={this.handlePrev}
              disabled={startIndex === 0}
            >
              ◀
            </Button>
          </Col>

          {/* Artists Display */}
          <Col>
            <Row className="d-flex justify-content-center g-12 mt-6">
            {visibleArtists.map((artist) => (
                <Col
                key={artist.id}
                xs={6}
                sm={4}
                md={3}
                lg={2}
                className="text-center px-3"
                >
                <Image 
                    src={artist.img}
                    roundedCircle
                    width={180}
                    height={180}
                    className="mb-3 shadow-sm"
                /> {/* TODO this images redirect to Discover Details */}
                <p className="small fw-bold">{artist.name}</p>
                </Col>
            ))}
            </Row>
          </Col>

          {/* Right Button */}
          <Col xs="auto">
            <Button
              variant="light"
              className="rounded-circle shadow-sm"
              onClick={this.handleNext}
              disabled={startIndex >= artists.length - visibleCount}
            >
              ▶
            </Button>
          </Col>
        </Row>
      </Container>
      </div>
    );
  }
}

export default WelcomePage;
