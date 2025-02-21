import React, { Component } from 'react';
import { FaFilter, FaSort } from 'react-icons/fa';
import { Row, Col, Dropdown } from "react-bootstrap";

class Filters extends Component {
  state = {
    searchQuery: "",
    selectedCity: "",
  };

  render() {
    const { selectedCity } = this.state;

    return (
      <Row className="justify-content-center">
        <Col xs={6} md={4} className="mb-2">
          <Dropdown onSelect={this.handleCityFilter}>
            <Dropdown.Toggle variant="outline-dark">
              {selectedCity || "City"} <FaFilter />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item eventKey="">All Cities</Dropdown.Item>
              <Dropdown.Item eventKey="Nantes">Nantes</Dropdown.Item>
              <Dropdown.Item eventKey="Paris">Paris</Dropdown.Item>
              <Dropdown.Item eventKey="Marseille">Marseille</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={6} md={4}>
          <Dropdown>
            <Dropdown.Toggle variant="outline-dark">
              Sort by: Relevance <FaSort />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Price: Low to High</Dropdown.Item>
              <Dropdown.Item>Price: High to Low</Dropdown.Item>
              <Dropdown.Item>Newest</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    );
  }
}

export default Filters;