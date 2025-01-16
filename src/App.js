import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Api from './Api';
import WelcomePage from './WelcomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import MapView from './components/map/MapView';
import AgendaPage from './components/agenda/AgendaPage';
import DiscoverPage from './components/discover/DiscoverPage';
import EventDetail from './components/agenda/EventDetail';
import DiscoverDetail from './components/discover/DiscoverDetail';
import Login from './components/login/LoginPage';
import EventCreateForm from './components/agenda/EventCreateForm';

import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      businesses: [],
    };
  }

  async componentDidMount() {
    try {
      // Fetch events data
      const eventsResponse = await Api.get('/events/public/read');
      const businessesResponse = await Api.get('/businesses/public/read');

      this.setState({
        events: eventsResponse.data,
        businesses: businessesResponse.data,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  render() {
    const { events, businesses } = this.state;
    const agenda = "/agenda"
    const discover = "/discover"
    // Define your routes in an array
    const routes = [
      { path: `/`, element: <WelcomePage/> },
      { path: `${agenda}`, element: <AgendaPage events={events} /> },
      { path: `${agenda}/all`, element: <AgendaPage events={events} /> },
      { path: `${agenda}/events`, element: <AgendaPage events={[]} /> },
      { path: `${agenda}/cinema`, element: <AgendaPage events={[]} /> },
      { path: `${agenda}/courses`, element: <AgendaPage events={[]} /> },
      { path: `${agenda}/event/:id`, element: <EventDetail events={events} /> },
      { path: `${agenda}/event/create`, element: <EventCreateForm />},
      { path: `${discover}`, element: <DiscoverPage businesses={businesses} /> },
      { path: `${discover}/artistas`, element: <DiscoverPage businesses={businesses} /> },
      { path: `${discover}/clubs`, element: <DiscoverPage businesses={[]} /> },
      { path: `${discover}/dancers`, element: <DiscoverPage businesses={[]} /> },
      { path: `${discover}/directors`, element: <DiscoverPage businesses={[]} /> },
      { path: `${discover}/restaurants`, element: <DiscoverPage businesses={[]} /> },
      { path: `${discover}/business/:id`, element: <DiscoverDetail businesses={businesses} /> },
      { path: '/maps', element: <MapView /> },
      { path: '/login', element: <Login />},
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
