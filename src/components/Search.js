import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import EventCard from './agenda/EventCard';
import { Row, Col, Form, InputGroup, FormControl, Button, Dropdown, Container } from "react-bootstrap";
import { FaSearch, FaFilter, FaSort } from "react-icons/fa";
import DiscoverCard from './discover/DiscoverCard';

const SearchlWithParams = (props) => <Search {...props} params={useParams()} />;

class Search extends Component {
  state = {
    searchQuery: "",
  }

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", this.state.searchQuery);
  };

  render() {
    const { events , businesses, params } = this.props;
    const { searchQuery } = this.state;
    const data = events.find(x => x.id === String(params.id));

    console.log(events)
    console.log(params)
    console.log(data)

    return (
    <Container className="mt-4">
      {/* Search Bar */}
      <h2 className="text-center mb-3">Search results</h2>
      <Row className="justify-content-center mb-4">
        <Col md={6}>
          <Form onSubmit={this.handleSearchSubmit}>
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
        </Col>
      </Row>

      {/* Filters */}
      <Row className="justify-content-center mb-4">
        <Col xs={6} md={3}>
          <Dropdown>
            <Dropdown.Toggle variant="outline-dark">
              City <FaFilter />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Nantes</Dropdown.Item>
              <Dropdown.Item>Paris</Dropdown.Item>
              <Dropdown.Item>Marseille</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={6} md={3}>
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
      
      {/* Events Section */}
      <Row className="my-4">
        {events.map(event => (
          <div key={event.id} className="col-md-4">
            <EventCard
              id={event.id}
              title={event.name}
              start_date={event.start_date}
              end_date={event.end_date}
              address={event.address}
              category={event.category}
              price={event.price}
              tags={event.tags}
              files={event.files}
            />
          </div>
        ))}
      </Row>

      {/* Business Section */}
      <Row className="my-4">
        {businesses.map((business) => (
          <Col xs={6} sm={4} md={3} lg={2} key={business.id} className="mb-4">
            <DiscoverCard 
              id={business.id}
              title={business.name}
              files={business.files}
            />
          </Col>
        ))}
      </Row>
    </Container>
    );
  }
}

export default SearchlWithParams;
