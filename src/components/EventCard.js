import React, { Component } from 'react';
import { Card, Badge } from 'react-bootstrap';

class EventCard extends Component {
  render() {
    const { title, date, time, location, attendees, tickets, tags, image } = this.props;
    return (
      <Card className="mx-auto mb-3" style={{ maxWidth: '600px' }}>
        <Card.Img variant="top" src={image} alt={title} />
        <Card.Body>
          <Badge bg="secondary">EVENTO</Badge>
          <p className="text-muted">{date} a las {time}</p>
          <Card.Title>{title}</Card.Title>
          <Card.Text>
            {location}<br/>
            Asistentes: {attendees} | Tickets: {tickets}
          </Card.Text>
          <div className="d-flex gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} bg="light" text="dark">{tag}</Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default EventCard;