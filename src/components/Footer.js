import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

class Footer extends Component {
  render() {
    return (
      <footer className="bg-light border-top py-3 mt-4">
        <Container className="text-center">
          <p className="mb-0">© 2024 Hispanie. <a href="#language">Español (ES)</a></p>
          <p>Hecho con <span role="img" aria-label="heart">❤️</span> por hispanos en Nantes, Francia</p>
        </Container>
      </footer>
    );
  }
}

export default Footer;