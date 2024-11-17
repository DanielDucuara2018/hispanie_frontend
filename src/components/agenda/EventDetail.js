import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Badge, Row, Col, Container } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import eventsData from '../../data/events.json';

const EventDetailWithParams = (props) => <EventDetail {...props} params={useParams()} />;

class EventDetail extends Component {
  render() {
    const { id } = this.props.params;
    const data = eventsData.find(x => x.id === Number(id));

    if (!data) return <p>Evento no encontrado</p>;

    return (
      <Container className="my-5">
        {/* Header Image and Main Event Information */}
        <Card className="mb-4">
          <Card.Img variant="top" src={data.image} alt={data.title} />
          <Card.Body className="text-center">
            <h1 className="mb-1">{data.title}</h1>
            <h5 className="text-muted mb-3">{data.date}</h5>
            <p className="text-muted mb-4">{data.location}</p>
            <div className="d-flex justify-content-center gap-2 mb-3">
              <Badge bg="secondary">Concert</Badge>
              <Badge bg="secondary">Gastronomy</Badge>
            </div>
            <Button variant="dark" className="me-2">Asistiré</Button>
            <Button variant="outline-dark">Compartir</Button>
          </Card.Body>
        </Card>

        {/* Main Event Description */}
        <Row className="mb-4">
          <Col md={8}>
            <Card className="p-3">
              <h5 className="mb-3">Programación:</h5>
              <div className="d-flex align-items-center mb-3">
                <span className="me-3">20:30</span>
                <Badge bg="light" text="dark">{data.artistName}</Badge>
              </div>
              <h5 className="mb-3">Descripción:</h5>
              <p>{data.description}</p>
            </Card>
          </Col>

          {/* Map Location */}
          <Col md={4}>
            <Card className="p-3">
              <h5 className="mb-3">Ubicación:</h5>
              <MapContainer center={[data.latitude, data.longitude]} zoom={13} style={{ height: '200px', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[data.latitude, data.longitude]}>
                  <Popup>{data.location}</Popup>
                </Marker>
              </MapContainer>
              <p className="text-muted mt-2">{data.location}</p>
            </Card>
          </Col>
        </Row>

        {/* Tickets Section */}
        <Card className="p-3 mb-4">
          <h5 className="mb-3">Tickets:</h5>
          <p className="text-muted">Entrada libre</p>
        </Card>

        {/* Tags Section */}
        <div className="d-flex gap-2 mb-4">
          <Badge bg="light" text="dark">Cumbia</Badge>
          <Badge bg="light" text="dark">Tropical</Badge>
          <Badge bg="light" text="dark">Rock Hispano</Badge>
          <Badge bg="light" text="dark">Concierto</Badge>
          <Badge bg="light" text="dark">Gastronomía</Badge>
        </div>
      </Container>
    );
  }
}

export default EventDetailWithParams;
