import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: 'agenda' // Default active category
    };
  }

  handleCategoryChange = (category) => {
    this.setState({ activeCategory: category });
  };

  handleLogin = () => {
    // Add functionality for login, e.g., redirect to login page
    console.log('Login button clicked');
  };

  render() {
    const { activeCategory } = this.state;

    return (
      <Navbar bg="light" expand="lg" className="border-bottom">
        <Navbar.Brand href="#home" className="ms-3">
          <img src="logo-url" alt="Logo" height="40" />
        </Navbar.Brand>
        <Form className="d-flex ms-auto me-3">
          <FormControl type="search" placeholder="Buscar" className="me-2" />
        </Form>
        <Nav className="me-3">
          <Nav.Link
            as={Link}
            to="/agenda"
            onClick={() => this.handleCategoryChange('agenda')}
            className={activeCategory === 'agenda' ? 'text-danger fw-bold' : ''}
          >
            Agenda
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/discover"
            onClick={() => this.handleCategoryChange('discover')}
            className={activeCategory === 'discover' ? 'text-danger fw-bold' : ''}
          >
            Descubrir
          </Nav.Link>
          <Nav.Link
            as={Link}
            to="/maps"
            onClick={() => this.handleCategoryChange('map')}
            className={activeCategory === 'map' ? 'text-danger fw-bold' : ''}
          >
            Mapa
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
