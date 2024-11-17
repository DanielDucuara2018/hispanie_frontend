import React, { Component } from 'react';
import Filters from './Filters';
import { Col, Row, Image } from 'react-bootstrap';

class HomePage extends Component {
  render() {
    const { artists } = this.props;
        
    return (
      <>
        <Filters />
        <Row className="text-center">
          {artists.map((artist, index) => (
            <Col xs={6} sm={4} md={3} lg={2} key={index} className="mb-4">
              <Image
                src={artist.imageUrl}
                alt={artist.name}
                roundedCircle
                fluid
                style={{ width: "200px", height: "200px" }}
              />
              <p className="mt-2">{artist.name}</p>
            </Col>
          ))}
        </Row>
      </>
    );
  }
}

export default HomePage;
