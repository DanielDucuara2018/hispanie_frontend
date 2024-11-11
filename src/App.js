import React, { Component } from 'react';
import Header from './components/Header';
import NavCategories from './components/NavCategories';
import Filters from './components/Filters';
import EventCard from './components/EventCard';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

// Importar el archivo JSON con los datos de los eventos
import eventsData from './data/events.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  // Cargar los datos de eventos al montar el componente
  componentDidMount() {
    this.setState({ events: eventsData });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <NavCategories />
        <Filters />
        <div className="container my-4">
          {this.state.events.map(event => (
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
        <Footer />
      </div>
    );
  }
}

export default App;