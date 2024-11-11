import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { FaMapMarkerAlt, FaCalendarAlt, FaFilter } from 'react-icons/fa';

class Filters extends Component {
  render() {
    return (
      <div className="d-flex justify-content-center gap-2 my-3">
        <Button variant="outline-secondary" className="d-flex align-items-center">
          <FaMapMarkerAlt className="me-2" /> Nantes
        </Button>
        <Button variant="outline-secondary" className="d-flex align-items-center">
          <FaCalendarAlt className="me-2" /> Cualquier fecha
        </Button>
        <Button variant="outline-secondary" className="d-flex align-items-center">
          <FaFilter className="me-2" /> Filtrar
        </Button>
      </div>
    );
  }
}

export default Filters;