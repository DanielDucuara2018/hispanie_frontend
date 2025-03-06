import React, { Component } from 'react';
import EventCard from './agenda/EventCard';
import { Row, Col, Form, InputGroup, FormControl, Button, Dropdown, Container } from "react-bootstrap";
import { FaSearch, FaFilter, FaSort } from "react-icons/fa";
import DiscoverCard from './discover/DiscoverCard';

class Search extends Component {
  state = {
    searchQuery: "",
    selectedCity: "",
  };

  // Inside your Search component
  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const searchQuery = queryParams.get('q') || '';
    this.setState({ searchQuery });
  }

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  handleCityFilter = (city) => {
    this.setState({ selectedCity: city });
  };

  applyFilters = (data, query, city) => {
    const normalizedQuery = query?.toLowerCase() || '';
  
    return data
      .filter(item => {
        const nameMatches = item.name?.toLowerCase().includes(normalizedQuery);
        const cityMatches = item.city?.toLowerCase().includes(normalizedQuery);
        const descriptionMatches = item.description?.toLowerCase().includes(normalizedQuery);
        return nameMatches || cityMatches || descriptionMatches;
      })
      .filter(item => !city || item.city?.toLowerCase() === city.toLowerCase());
  };

  render() {
    const { events, businesses } = this.props;
    const { searchQuery, selectedCity } = this.state;

    // Apply filters in order
    const filteredEvents = this.applyFilters(events, searchQuery, selectedCity);
    const filteredBusinesses = this.applyFilters(businesses, searchQuery, selectedCity);

    return (
      <Container className="mt-4">
        {/* Centered Title, Search Bar, and Filters */}
        <Row className="justify-content-center text-center">
          <Col md={8} lg={6}>
            <h2 className="mb-3">Search Results</h2>

            {/* Search Bar */}
            <Form onSubmit={this.handleSearchSubmit} className="mb-3">
              <InputGroup>
                <FormControl
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={this.handleSearchChange}
                />
                <Button variant="outline-secondary" type="submit">
                  <FaSearch />
                </Button>
              </InputGroup>
            </Form>

            {/* Filters */}
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
          </Col>
        </Row>

        {/* Events Section */}
        <h3 className="mt-4">Events</h3>
        <Row className="mb-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <Col xs={12} sm={6} md={4} key={event.id}>
                <EventCard {...event} />
              </Col>
            ))
          ) : (
            <p className="text-center">No events found.</p>
          )}
        </Row>

        {/* Business Section */}
        <h3 className="mt-4">Businesses</h3>
        <Row>
          {filteredBusinesses.length > 0 ? (
            filteredBusinesses.map(business => (
              <Col xs={6} sm={4} md={3} lg={2} key={business.id} className="mb-4">
                <DiscoverCard {...business} />
              </Col>
            ))
          ) : (
            <p className="text-center">No businesses found.</p>
          )}
        </Row>
      </Container>
    );
  }
}

export default Search;
