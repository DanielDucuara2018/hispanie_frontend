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
import artistsData from './data/artists.json';

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

    // Define your routes in an array
    const routes = [
      { path: '/', element: <AgendaPage events={events} /> },
      { path: '/agenda', element: <AgendaPage events={events} /> },
      { path: '/all', element: <AgendaPage events={events} /> },
      { path: '/events', element: <AgendaPage events={[]} /> },
      { path: '/cinema', element: <AgendaPage events={[]} /> },
      { path: '/courses', element: <AgendaPage events={[]} /> },
      { path: '/event/:id', element: <EventDetail /> },
      { path: '/discover', element: <DiscoverPage artists={artists} /> },
      { path: '/artistas', element: <DiscoverPage artists={artists} /> },
      { path: '/clubs', element: <DiscoverPage artists={[]} /> },
      { path: '/dancers', element: <DiscoverPage artists={[]} /> },
      { path: '/directors', element: <DiscoverPage artists={[]} /> },
      { path: '/restaurants', element: <DiscoverPage artists={[]} /> },
      { path: '/maps', element: <MapView /> },
    ];

    return (
      <Router>
        <div className="container-fluid p-0 d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1">
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
