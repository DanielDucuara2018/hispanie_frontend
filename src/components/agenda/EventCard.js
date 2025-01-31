import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const EventCard = ({ id, title, start_date, end_date, address, category, price, tags, image }) => {
  // const custom_style = {fontSize: "0.9rem", fontFamily: "Figtree, sans-serif"}
  return (
    <Link to={`/agenda/event/${id}`} className="text-decoration-none text-dark">
      <Card className="mb-4 shadow-sm border-0">
        {/* Image */}
        <Card.Img
          variant="top"
          src="https://hispanie.com/cdn/shop/files/70921387_10157683039007716_7599387719042596864_n_600x600.png?v=1734460863" /*{image}*/
          alt={title}
          style={{ height: '100%', objectFit: 'cover', borderRadius: '0.5rem 0.5rem 0 0' }}
        />
        {/* Card Body */}
        <Card.Body>
          <Row className="mb-2">
            <Col>
              <Badge bg="secondary" className="me-2">{category}</Badge>
              <small className="text-muted">{start_date}</small>
            </Col>
          </Row>
          <Card.Title className="fs-5 fw-bold">{title}</Card.Title>
          <Card.Text className="text-muted small">{address}</Card.Text>
          <Card.Text className="fw-bold"> From €{price} EUR</Card.Text>
          {/* Tags */}
          <div className="d-flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                bg="light"
                text="dark"
                className="py-1 px-2"
                style={{ fontSize: '0.9rem' }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default EventCard;