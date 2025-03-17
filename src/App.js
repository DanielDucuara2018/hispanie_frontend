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
import { setIsLoggedIn } from "./actions/appActions";
import { Fade } from "react-awesome-reveal";

import 'bootstrap/dist/css/bootstrap.css';
import "leaflet/dist/leaflet.css";
import AccountCreationForm from './components/login/AccountCreateForm';
import Search from './components/Search';
import ForgotPassword from './components/login/ForgotPassword';
import ResetPassword from './components/login/ResetPassword';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      businesses: [],
      tags: [],
      account: null
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
        const account = await Api.get('/accounts/private/read', {withCredentials: true});
        this.setState({
          tags: privateTags.data, account: account.data
        });
      }
    } catch (error) {
      if (error.response.status === 401) {
        this.props.setIsLoggedIn(false);
      }
    }
  }

  render() {
    const { businesses, tags, account } = this.state;
    const availableEvents = this.state.events;
    const agenda = "/agenda"
    const discover = "/discover"

    // TODO add some filters to /events/public/read endpoint
    // Get today's date without time (for accurate comparison)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight

    // Filter events where end_date is greater than today
    const events = availableEvents.filter(event => new Date(event.end_date) > today);

    // Define your routes in an array
    const routes = [
      { path: `/`, element: <WelcomePage events={events} businesses={businesses}/> },
      { path: `/profile`, element: <ProfilePage account={account}  events={events} businesses={businesses} /> },
      { path: `${agenda}`, element: <AgendaPage events={events} /> },
      { path: `${agenda}/all`, element: <AgendaPage events={events} /> },
      { path: `${agenda}/cinemas`, element: <AgendaPage events={events.filter(x => x.category === "cinema")} /> },
      { path: `${agenda}/courses`, element: <AgendaPage events={events.filter((x) => x.category === "course")} /> },
      { path: `${agenda}/concerts`, element: <AgendaPage events={events.filter((x) => x.category === "concert")} /> },
      { path: `${agenda}/parties`, element: <AgendaPage events={events.filter((x) => x.category === "party")} /> },
      { path: `${agenda}/expositions`, element: <AgendaPage events={events.filter((x) => x.category === "exposition")} /> },
      { path: `${agenda}/language_exchanges`, element: <AgendaPage events={events.filter((x) => x.category === "language_exchange")} /> },
      { path: `${agenda}/theaters`, element: <AgendaPage events={events.filter((x) => x.category === "theater")} /> },
      { path: `${agenda}/gastronomies`, element: <AgendaPage events={events.filter((x) => x.category === "gastronomy")} /> },
      { path: `${agenda}/dances`, element: <AgendaPage events={events.filter((x) => x.category === "dance")} /> },
      { path: `${agenda}/event/:id`, element: <EventDetail events={events} /> },
      { path: `/event/create`, element: <EventCreateForm tags={tags} formMode="create" />},
      { path: `/event/update/:id`, element: <EventCreateForm tags={tags} events={events} formMode="update" />},
      { path: `${discover}`, element: <DiscoverPage businesses={businesses} /> },
      { path: `${discover}/all`, element: <DiscoverPage businesses={businesses} /> },
      { path: `${discover}/artists`, element: <DiscoverPage businesses={businesses.filter(x => x.category === "artist")} /> },
      { path: `${discover}/restaurants`, element: <DiscoverPage businesses={businesses.filter(x => x.category === "restaurant")} /> },
      { path: `${discover}/cafes`, element: <DiscoverPage businesses={businesses.filter(x => x.category === "cafe")} /> },
      { path: `${discover}/boutiques`, element: <DiscoverPage businesses={businesses.filter(x => x.category === "boutique")} /> },
      { path: `${discover}/expositions`, element: <DiscoverPage businesses={businesses.filter(x => x.category === "exposition")} /> },
      { path: `${discover}/associations`, element: <DiscoverPage businesses={businesses.filter(x => x.category === "association")} /> },
      { path: `${discover}/academies`, element: <DiscoverPage businesses={businesses.filter(x => x.category === "academy")} /> },
      { path: `${discover}/business/:id`, element: <DiscoverDetail businesses={businesses} /> },
      { path: `/business/create`, element: <DiscoverCreateForm tags={tags} formMode="create" />},
      { path: `/business/update/:id`, element: <DiscoverCreateForm tags={tags} businesses={businesses} formMode="update" />},
      { path: `/tag/create`, element: <TagCreateForm />},
      { path: `/account/create`, element: <AccountCreationForm formMode="create" />},
      { path: `/account/update/:id`, element: <AccountCreationForm account={account} formMode="update"  />},
      { path: '/maps', element: <MapView events={events} businesses={businesses.filter(x => x.address !== null)}/> },
      { path: '/login', element: <Login />},
      { path: '/about', element: <AboutPage />},
      { path: '/blog', element: <BlogPage />},
      { path: '/search', element: <Search events={events} businesses={businesses} />},
      { path: '/forgot_password', element: <ForgotPassword />},
      { path: '/reset_password', element: <ResetPassword />},
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
          <Fade>
            <Footer />
          </Fade>
        </div>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.appRootReducer.isLoggedIn,
});

const mapDispatchToProps = {
  setIsLoggedIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
