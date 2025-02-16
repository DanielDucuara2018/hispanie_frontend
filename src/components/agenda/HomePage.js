import React, { Component } from 'react';
// import Filters from './Filters';
import { Container, Row } from "react-bootstrap";
import EventCard from './EventCard';

class HomePage extends Component {
  render() {
    const { events } = this.props;

    // Sort events by start_date (descending order)
    const formattedEvents = events.map(event => ({
      ...event,
      formatted_start_date: new Date(event.start_date).toLocaleDateString("en-FR", {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    const sortedEvents = [...formattedEvents].sort((a, b) => new Date(b.start_date) - new Date(a.start_date));

    // Group events by start_date
    const groupedEvents = sortedEvents.reduce((acc, event) => {
      const date = event.formatted_start_date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});

    return (
      <>
        {/* <Filters /> */}
        <Container className="my-4">
          {Object.keys(groupedEvents).map(date => (
            <div key={date} className="mb-4">
              <h5 className="fw-bold mb-3">{date}</h5> {/* Section Header for the date */}
              <Row className="row g-4">
                {groupedEvents[date].map(event => (
                  <div key={event.id} className="col-md-4">
                    <EventCard
                      id={event.id}
                      title={event.name}
                      start_date={event.start_date}
                      end_date={event.end_date}
                      address={event.address}
                      category={event.category}
                      price={event.price}
                      tags={event.tags}
                      files={event.files}
                    />
                  </div>
                ))}
              </Row>
            </div>
          ))}
        </Container>
      </>
    );
  }
}

export default HomePage;