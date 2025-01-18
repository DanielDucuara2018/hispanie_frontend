import React from 'react';
import { Container, Row, Col, Nav, Dropdown } from 'react-bootstrap';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-light text-dark py-5 border-top">
      <Container>
        <Row className="mb-4">
          <Col md={3}>
            <h5 className="mb-3">hispanie™</h5>
          </Col>
          <Col md={3}>
            <h6 className="mb-3">Acerca:</h6>
            <Nav className="flex-column">
              <Nav.Link href="/about" className="text-dark">About</Nav.Link>
              <Nav.Link href="/blog" className="text-dark">Blog</Nav.Link>
              <Nav.Link href="/contact" className="text-dark">Contact</Nav.Link>
            </Nav>
          </Col>
          <Col md={3}>
            <h6 className="mb-3">Creator:</h6>
            <Nav className="flex-column">
              <Nav.Link href="/promote" className="text-dark">Promote my event</Nav.Link>
              <Nav.Link href="/companies" className="text-dark">Companies</Nav.Link>
              <Nav.Link href="/associations" className="text-dark">Associations</Nav.Link>
            </Nav>
          </Col>
          <Col md={3}>
            <h6 className="mb-3">Legal:</h6>
            <Nav className="flex-column">
              <Nav.Link href="/privacy" className="text-dark">Privacy Policy</Nav.Link>
              <Nav.Link href="/terms" className="text-dark">Terms and Conditions</Nav.Link>
            </Nav>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col className="text-center">
          <a href="https://www.instagram.com/nanteshablaespagnol/" target="_blank" rel="noopener noreferrer" className="text-dark">
            <FaInstagram size={24} className="me-3" />
          </a>
          <a href="https://www.linkedin.com/company/hispanie/" target="_blank" rel="noopener noreferrer" className="text-dark">
            <FaLinkedin size={24} />
          </a>
          </Col>
        </Row>
        <Row className="border-top pt-3">
          <Col md={4}>
            <Dropdown>
              <Dropdown.Toggle variant="light" className="w-100 text-start">
                Country/region
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>France | EUR €</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md={4}>
            <Dropdown>
              <Dropdown.Toggle variant="light" className="w-100 text-start">
                Language
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>English</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md={4} className="text-center">
            <span>© 2025, Hispanie All rights reserved</span>
            <div className="mt-2">
              <a href="/privacy" className="me-2">Privacy policy</a>·
              <a href="/terms" className="ms-2">Terms of service</a>
            </div>
          </Col>
        </Row>
        <Row className="mt-4 text-center">
          <Col>
            <p>
              Made with <span className="text-danger">❤️</span> by Hispanics in Nantes, France
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;