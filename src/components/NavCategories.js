import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class NavCategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: '/all' // Set the default active category
    };
  }

  handleCategoryChange = (category) => {
    this.setState({ activeCategory: category });
  };

  render() {
    const { activeCategory } = this.state;

    return (
      <Nav className="justify-content-center my-3">
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/all"
            onClick={() => this.handleCategoryChange('/all')}
            className={activeCategory === '/all' ? 'text-danger fw-bold' : ''}
          >
            Todo
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/events"
            onClick={() => this.handleCategoryChange('/events')}
            className={activeCategory === '/events' ? 'text-danger fw-bold' : ''}
          >
            Eventos
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/cinema"
            onClick={() => this.handleCategoryChange('/cinema')}
            className={activeCategory === '/cinema' ? 'text-danger fw-bold' : ''}
          >
            Cine
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/courses"
            onClick={() => this.handleCategoryChange('/courses')}
            className={activeCategory === '/courses' ? 'text-danger fw-bold' : ''}
          >
            Cursos
          </Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }
}

export default NavCategories;
