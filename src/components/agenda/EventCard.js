import React, { Component } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class EventCard extends Component {
  render() {
    const { id, title, date, time, location, attendees, tickets, tags, image } = this.props;
    return (
      <Link to={`/agenda/event/${id}`} className="text-decoration-none text-dark">
        <Card className="h-100">
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
      </Link>
    );
  }
}

export default EventCard;