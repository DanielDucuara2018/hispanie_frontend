import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import FormattedDateRangeWrapper from '../../hooks/FormattedDateRangeWrapper';
import FormattedAddressWrapper from '../../hooks/FormattedAddressWrapper';

const EventCard = ({ id, title, start_date, end_date, address, category, price, tags, files }) => {
  return (
    <Link to={`/agenda/event/${id}`} className="text-decoration-none text-dark">
      <Card className="mb-4 shadow-sm border-0 h-100">
        {/* Image */}
        <Card.Img
          variant="top"
          src={files.find(x => x.category === "profile_image")?.path || ""}
          alt={title}
          style={{ height: '100%', objectFit: 'cover', borderRadius: '0.5rem 0.5rem 0 0' }}
        />
        {/* Card Body */}
        <Card.Body>
          <Row className="mb-2">
            <Col>
              <Badge bg="secondary" className="me-2">{category}</Badge>
              <FormattedDateRangeWrapper startDate={start_date} endDate={end_date}>
                {(formattedDateRange) => (
                  <small className="text-muted">
                  {formattedDateRange}
                  </small>
                )}
              </FormattedDateRangeWrapper>
            </Col>
          </Row>
          <Card.Title className="fs-5 fw-bold">{title}</Card.Title>
          <Card.Text className="text-muted small">
            <FormattedAddressWrapper address={address} />
          </Card.Text>
          <Card.Text className="fw-bold"> From €{price} EUR</Card.Text>
          {/* Tags */}
          <div className="d-flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                bg="light"
                text="dark"
                className="me-2"
                // style={{ fontSize: '0.9rem' }}
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default EventCard;