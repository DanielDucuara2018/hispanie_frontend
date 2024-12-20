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
          <div className="row g-4">
            {events.map(event => (
              <div key={event.id} className="col-6">
                <EventCard
                  id={event.id}
                  title={event.name}
                  date={event.start_date}
                  time={event.start_date}
                  location={event.location}
                  attendees={0}
                  tickets={event.price}
                  tags={event.tags}
                  image={""}
                />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

export default HomePage;
