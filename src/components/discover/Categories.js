import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: '/artistas', // Set the default active category
    };

    // Define navigation categories
    this.categories = [
      { label: "Artistas", path: "/artistas" },
      { label: "Clubs", path: "/clubs" },
      { label: "Dancers", path: "/dancers" },
      { label: "Directors", path: "/directors" },
      { label: "Restaurants", path: "/restaurants" },
    ];
  }

  handleCategoryChange = (category) => {
    this.setState({ activeCategory: category });
  };

  render() {
    const { activeCategory } = this.state;

    return (
      <Nav className="justify-content-center mb-3">
        {this.categories.map((category, index) => (
          <Nav.Item key={index}>
            <Nav.Link
              as={Link}
              to={category.path}
              onClick={() => this.handleCategoryChange(category.path)}
              className={activeCategory === category.path ? "text-danger fw-bold" : ""}
            >
              {category.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    );
  }
}

export default Categories;
