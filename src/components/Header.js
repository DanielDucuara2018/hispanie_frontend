import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
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

  handleLogin = () => {
    console.log('Login button clicked');
  };

  render() {
    const { activeCategory } = this.state;

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
          {/* Agenda */}
          <Nav.Link
            as={Link}
            to="/agenda"
            onClick={() => this.handleCategoryChange('agenda')}
            className={activeCategory === 'agenda' ? 'text-danger fw-bold d-flex align-items-center' : 'd-flex align-items-center'}
          >
            <FaCalendarAlt className="me-2" /> Agenda
          </Nav.Link>

          {/* Discover */}
          <Nav.Link
            as={Link}
            to="/discover"
            onClick={() => this.handleCategoryChange('discover')}
            className={activeCategory === 'discover' ? 'text-danger fw-bold d-flex align-items-center' : 'd-flex align-items-center'}
          >
            <FaCompass className="me-2" /> Descubrir
          </Nav.Link>

          {/* Maps */}
          <Nav.Link
            as={Link}
            to="/maps"
            onClick={() => this.handleCategoryChange('map')}
            className={activeCategory === 'map' ? 'text-danger fw-bold d-flex align-items-center' : 'd-flex align-items-center'}
          >
            <FaMapMarkedAlt className="me-2" /> Mapa
          </Nav.Link>

          {/* Store */}
          <Nav.Link
            as={Link}
            to="/store"
            onClick={() => this.handleCategoryChange('store')}
            className={activeCategory === 'store' ? 'text-danger fw-bold d-flex align-items-center' : 'd-flex align-items-center'}
          >
            <FaStore className="me-2" /> Store
          </Nav.Link>

          {/* Profile */}
          <Nav.Link
            as={Link}
            to="/profile"
            onClick={() => this.handleCategoryChange('profile')}
            className={activeCategory === 'profile' ? 'text-danger fw-bold d-flex align-items-center' : 'd-flex align-items-center'}
          >
            <FaUserCircle className="me-2" /> Profile
          </Nav.Link>

          <Button variant="outline-primary" onClick={this.handleLogin} className="ms-3">
            Login
          </Button>
        </Nav>
      </Navbar>
    );
  }
}

export default Header;
