import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MapView from './components/map/MapView';
import AgendaPage from './components/agenda/AgendaPage';
import DiscoverPage from './components/discover/DiscoverPage';
import EventDetail from './components/agenda/EventDetail';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import JSON data
import eventsData from './data/events.json';
import artistsData from './data/artists.json'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      artists: [],
    };
  }

  componentDidMount() {
    this.setState({ events: eventsData, artists: artistsData });
  }

  render() {
    const { events, artists } = this.state;

    return (
      <Router>
        <div className="container-fluid p-0 d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              {/* Routes for Agenda */}
              <Route path="/" element={<AgendaPage events={events} />} />
              <Route path="/agenda" element={<AgendaPage events={events} />} />
              <Route path="/all" element={<AgendaPage events={events} />} />
              <Route path="/events" element={<AgendaPage events={[]} />} />
              <Route path="/cinema" element={<AgendaPage events={[]} />} />
              <Route path="/courses" element={<AgendaPage events={[]} />} />
              <Route path="/event/:id" element={<EventDetail />} />
              {/* Routes for Discovey */}
              <Route path="/discover" element={<DiscoverPage artists={artists} />} />
              <Route path="/artistas" element={<DiscoverPage artists={artists} />} />
              <Route path="/clubs" element={<DiscoverPage artists={[]} />} />
              <Route path="/dancers" element={<DiscoverPage artists={[]} />} />
              <Route path="/directors" element={<DiscoverPage artists={[]} />} />
              <Route path="/restaurants" element={<DiscoverPage artists={[]} />} />
              {/* Routes for maps */}
              <Route path="/maps" element={<MapView />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
