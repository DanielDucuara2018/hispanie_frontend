import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: '/all', // Set the default active category
    };

    // Define navigation categories
    this.categories = [
      { path: '/all', label: 'Todo' },
      { path: '/events', label: 'Eventos' },
      { path: '/cinema', label: 'Cine' },
      { path: '/courses', label: 'Cursos' },
    ];
  }

  handleCategoryChange = (category) => {
    this.setState({ activeCategory: category });
  };

  render() {
    const { activeCategory } = this.state;

    return (
      <Nav className="justify-content-center my-3">
        {this.categories.map(({ path, label }) => (
          <Nav.Item key={path}>
            <Nav.Link
              as={Link}
              to={path}
              onClick={() => this.handleCategoryChange(path)}
              className={activeCategory === path ? 'text-danger fw-bold' : ''}
            >
              {label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    );
  }
}

export default Categories;
