import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaCompass, FaMapMarkedAlt, FaStore, FaUserCircle } from 'react-icons/fa';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: 'agenda', // Default active category
    };
  }

  handleCategoryChange = (category) => {
    this.setState({ activeCategory: category });
  };

  render() {
    const { activeCategory } = this.state;

    // Navigation items with their labels, paths, and icons
    const navItems = [
      { label: 'Agenda', path: '/agenda', icon: <FaCalendarAlt /> },
      { label: 'Descubrir', path: '/discover', icon: <FaCompass /> },
      { label: 'Mapa', path: '/maps', icon: <FaMapMarkedAlt /> },
      { label: 'Store', path: '/store', icon: <FaStore /> },
      { label: 'Profile', path: '/profile', icon: <FaUserCircle /> },
      {
        label: 'Login',
        path: '/login',
        className: 'ms-3 btn btn-outline-primary', // Custom class for the login button
      },
    ];

    return (
      <Navbar bg="light" expand="lg" className="border-bottom px-3">
        <Navbar.Brand href="#home">
          {/* Random logo image */}
          <img
            src="https://w7.pngwing.com/pngs/402/203/png-transparent-picasa-encapsulated-postscript-logo-random-icons-miscellaneous-angle-text.png"
            alt="Logo"
            height="40"
          />
        </Navbar.Brand>
        <Form className="d-flex ms-auto me-3">
          <FormControl type="search" placeholder="Buscar" className="me-2" />
        </Form>
        <Nav>
          {/* Generate Nav items dynamically */}
          {navItems.map((item, index) => (
            <Nav.Link
              key={index}
              as={Link}
              to={item.path}
              onClick={() =>
                this.handleCategoryChange(item.label.toLowerCase())
              }
              className={
                item.className ||
                (activeCategory === item.label.toLowerCase()
                  ? 'text-danger fw-bold d-flex align-items-center'
                  : 'd-flex align-items-center')
              }
            >
              {item.icon} <span className="ms-2">{item.label}</span>
            </Nav.Link>
          ))}
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
