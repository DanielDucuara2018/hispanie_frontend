import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class NavCategories extends Component {
  render() {
    return (
      <Nav className="justify-content-center my-3">
        <Nav.Item>
          <Nav.Link as={Link} to="/all" className="text-danger fw-bold">Todo</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/events">Eventos</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/cinema">Cine</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link as={Link} to="/courses">Cursos</Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }
}

export default NavCategories;
