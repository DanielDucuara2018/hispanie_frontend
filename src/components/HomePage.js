import React, { Component } from 'react';
import Filters from './Filters';
import EventCard from './EventCard';

class HomePage extends Component {
  render() {
    const { events } = this.props;
    
    return (
      <>
        <Filters />
        <div className="container my-4">
          {events.map(event => (
            <EventCard
              key={event.id}
              title={event.title}
              date={event.date}
              time={event.time}
              location={event.location}
              attendees={event.attendees}
              tickets={event.tickets}
              tags={event.tags}
              image={event.image}
            />
          ))}
        </div>
      </>
    );
  }
}

export default HomePage;
