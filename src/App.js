import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Api from './Api';
import Header from './components/Header';
import Footer from './components/Footer';
import MapView from './components/map/MapView';
import AgendaPage from './components/agenda/AgendaPage';
import DiscoverPage from './components/discover/DiscoverPage';
import EventDetail from './components/agenda/EventDetail';
import DiscoverDetail from './components/discover/DiscoverDetail';
import Login from './components/login/LoginPage';
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
      const header = {
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkYW5pZWwuZHVjdWFyYSIsImV4cCI6MTc2Nzc1OTE4MX0.brJGrsJsa_XCdGWuXL1uqmz-BeqHSZt1oooxADOsYNI",
        },
      }
      // Fetch events data
      const eventsResponse = await Api.get('/events', header);
      const businessesResponse = await Api.get('/businesses', header);

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

    // Define your routes in an array
    const routes = [
      { path: '/', element: <AgendaPage events={[]} /> },
      { path: '/agenda', element: <AgendaPage events={events} /> },
      { path: '/all', element: <AgendaPage events={[]} /> },
      { path: '/events', element: <AgendaPage events={[]} /> },
      { path: '/cinema', element: <AgendaPage events={[]} /> },
      { path: '/courses', element: <AgendaPage events={[]} /> },
      { path: '/event/:id', element: <EventDetail events={events} /> },
      { path: '/discover', element: <DiscoverPage businesses={businesses} /> },
      { path: '/artistas', element: <DiscoverPage businesses={[]} /> },
      { path: '/clubs', element: <DiscoverPage businesses={[]} /> },
      { path: '/dancers', element: <DiscoverPage businesses={[]} /> },
      { path: '/directors', element: <DiscoverPage businesses={[]} /> },
      { path: '/restaurants', element: <DiscoverPage businesses={[]} /> },
      { path: '/business/:id', element: <DiscoverDetail businesses={businesses} /> },
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
