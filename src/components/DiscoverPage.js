import React, { Component } from 'react';
import { Row, Col, Nav, Button, ButtonGroup, Image, ButtonToolbar  } from 'react-bootstrap';

class DiscoverPage extends Component {
  render() {
    const categories = ["Artistas", "Clubs", "Dancers", "Directors", "Restaurants"];
    const filters = [
      { label: "Country", icon: "🌍" },
      { label: "Cumbia", icon: "💃" },
      { label: "Salsa", icon: "🎷" },
      { label: "Electro Tropical", icon: "🌴" },
      { label: "Samba", icon: "🇧🇷" },
      { label: "Rock", icon: "🎸" },
      { label: "Merengue", icon: "💃" },
      { label: "Salsa Cubana", icon: "🎺" }
    ];
    const artists = [
      { name: "Kumbia Boruka", imageUrl: "artist1.jpg" },
      { name: "The Bongo Hop", imageUrl: "artist2.jpg" },
      { name: "Caribombo", imageUrl: "artist3.jpg" },
      { name: "Sabor a Mi", imageUrl: "artist4.jpg" },
      { name: "Onda Ya", imageUrl: "artist5.jpg" },
      { name: "Amankaya", imageUrl: "artist6.jpg" },
      { name: "JETLAB", imageUrl: "artist7.jpg" },
      { name: "Montoya", imageUrl: "artist8.jpg" },
      { name: "Mitù", imageUrl: "artist9.jpg" },
      { name: "Tropicana Club", imageUrl: "artist10.jpg" },
    ];

    return (
      <>
        {/* Category Navigation */}
        <Nav className="justify-content-center mb-3">
          {categories.map((category, index) => (
            <Nav.Item key={index}>
              <Nav.Link href="#" className={index === 0 ? "text-danger fw-bold" : ""}>
                {category}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* Filters */}
        <ButtonToolbar className="justify-content-center mb-4">
          <ButtonGroup>
            {filters.map((filter, index) => (
              <Button
                key={index}
                variant="outline-secondary"
                className="mx-1"
                style={{
                  borderRadius: '20px',
                  padding: '5px 15px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {filter.icon} {filter.label}
              </Button>
            ))}
          </ButtonGroup>
        </ButtonToolbar>

        <Row className="text-center">
          {artists.map((artist, index) => (
            <Col xs={6} sm={4} md={3} lg={2} key={index} className="mb-4">
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                roundedCircle
                fluid
                style={{ width: "100px", height: "100px" }}
              />
              <p className="mt-2">{artist.name}</p>
            </Col>
          ))}
        </Row>
      </>
    );
  }
}

export default DiscoverPage;
