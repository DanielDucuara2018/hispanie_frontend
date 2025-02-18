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
import ProfilePage from './components/login/ProfilePage';
import EventCreateForm from './components/login/EventCreateForm';
import DiscoverCreateForm from './components/login/DiscoverCreateForm';
import TagCreateForm from './components/login/TagCreateForm';
import AboutPage from './components/AboutPage';
import BlogPage from './components/BlogPage';
import { connect } from "react-redux";

import 'bootstrap/dist/css/bootstrap.min.css';
import "leaflet/dist/leaflet.css";
import AccountCreationForm from './components/login/AccountCreateForm';
import Search from './components/Search';
import ForgotPassword from './components/login/ForgotPassword';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      businesses: [],
      tags: []
    };
  }

  async componentDidMount() {
    try {
      // Fetch events data
      const publicEvents = await Api.get('/events/public/read');
      const publicBusinesses = await Api.get('/businesses/public/read');

      this.setState({
        events: publicEvents.data,
        businesses: publicBusinesses.data,
      });

      if (this.props.isLoggedIn){
        const privateTags = await Api.get('/tags/private/read', {withCredentials: true} );
        this.setState({
          tags: privateTags.data,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  render() {
    const { events, businesses, tags } = this.state;
    const agenda = "/agenda"
    const discover = "/discover"
    // Define your routes in an array
    const routes = [
      { path: `/`, element: <WelcomePage businesses={businesses}/> },
      { path: `/profile`, element: <ProfilePage/> },
      { path: `${agenda}`, element: <AgendaPage events={events} /> },
      { path: `${agenda}/all`, element: <AgendaPage events={events} /> },
      { path: `${agenda}/cinemas`, element: <AgendaPage events={[]} /> },
      { path: `${agenda}/courses`, element: <AgendaPage events={[]} /> },
      { path: `${agenda}/concerts`, element: <AgendaPage events={[]} /> },
      { path: `${agenda}/parties`, element: <AgendaPage events={[]} /> },
      { path: `${agenda}/event/:id`, element: <EventDetail events={events} /> },
      { path: `/event/create`, element: <EventCreateForm tags={tags} />},
      { path: `${discover}`, element: <DiscoverPage businesses={businesses} /> },
      { path: `${discover}/all`, element: <DiscoverPage businesses={businesses} /> },
      { path: `${discover}/artists`, element: <DiscoverPage businesses={businesses} /> },
      { path: `${discover}/clubs`, element: <DiscoverPage businesses={[]} /> },
      { path: `${discover}/dancers`, element: <DiscoverPage businesses={[]} /> },
      { path: `${discover}/directors`, element: <DiscoverPage businesses={[]} /> },
      { path: `${discover}/restaurants`, element: <DiscoverPage businesses={[]} /> },
      { path: `${discover}/business/:id`, element: <DiscoverDetail businesses={businesses} /> },
      { path: `/business/create`, element: <DiscoverCreateForm tags={tags} />},
      { path: `/tag/create`, element: <TagCreateForm />},
      { path: `/account/create`, element: <AccountCreationForm />},
      { path: '/maps', element: <MapView events={events} businesses={businesses}/> },
      { path: '/login', element: <Login />},
      { path: '/about', element: <AboutPage />},
      { path: '/blog', element: <BlogPage />},
      { path: '/search', element: <Search events={events} businesses={businesses} />},
      { path: '/forgot_password', element: <ForgotPassword />},
    ];
    const custom_style = {fontSize: "0.9rem", fontFamily: "Figtree, sans-serif"}
    return (
      <Router>
        <div  style={custom_style} className="container-fluid p-0 d-flex flex-column min-vh-100">
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

const mapStateToProps = (state) => ({
  isLoggedIn: state.appRootReducer.isLoggedIn,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(App);
