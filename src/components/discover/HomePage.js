import React, { Component } from 'react';
// import Filters from './Filters';
import { Col, Row } from 'react-bootstrap';
import DiscoverCard from './DiscoverCard';

class HomePage extends Component {
  render() {
    const { businesses } = this.props;
    return (
      <>
        {/* <Filters /> */}
          <div className="container my-4">
          <Row className="text-center">
            {businesses.map((business) => (
              <Col xs={6} sm={4} md={3} lg={2} key={business.id} className="mb-4">
                <DiscoverCard 
                  id={business.id}
                  title={business.name}
                />
              </Col>
            ))}
          </Row>
        </div>
      </>
    );
  }
}

export default HomePage;
