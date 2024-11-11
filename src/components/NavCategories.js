import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';

class NavCategories extends Component {
  render() {
    return (
      <Nav className="justify-content-center my-3">
        <Nav.Item>
          <Nav.Link href="#all" className="text-danger fw-bold">Todo</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#events">Eventos</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#cinema">Cine</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="#courses">Cursos</Nav.Link>
        </Nav.Item>
      </Nav>
    );
  }
}

export default NavCategories;