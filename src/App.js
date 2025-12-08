import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { Fade } from "react-awesome-reveal";
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
import AccountCreationForm from './components/login/AccountCreateForm';
import Search from './components/Search';
import ForgotPassword from './components/login/ForgotPassword';
import ResetPassword from './components/login/ResetPassword';
import { setIsLoggedIn } from "./actions/appActions";

import 'bootstrap/dist/css/bootstrap.css';
import "leaflet/dist/leaflet.css";
import './App.css';

const App = () => {
  const [events, setEvents] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [tags, setTags] = useState([]);
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isLoggedIn = useSelector((state) => state.appRootReducer.isLoggedIn);
  const dispatch = useDispatch();

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch public data in parallel
        const [publicEventsRes, publicBusinessesRes] = await Promise.all([
          Api.get('/events/public/read'),
          Api.get('/businesses/public/read')
        ]);

        setEvents(publicEventsRes.data);
        setBusinesses(publicBusinessesRes.data);

        // Fetch private data if logged in
        if (isLoggedIn) {
          const [privateTagsRes, accountRes] = await Promise.all([
            Api.get('/tags/private/read'),
            Api.get('/accounts/private/read')
          ]);
          
          setTags(privateTagsRes.data);
          setAccount(accountRes.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError(error.message);
        
        if (error.response?.status === 401) {
          dispatch(setIsLoggedIn(false));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, dispatch]);

  // Filter and format events
  const processedEvents = useMemo(() => {
    const today = new Date();
    
    // Filter public events that haven't ended
    const eventsToDisplay = events
      .filter(event => event.is_public === true)
      .filter(event => new Date(event.end_date) > today);

    // Format and sort events
    const formattedEvents = eventsToDisplay.map((event) => ({
      ...event,
      formatted_start_date: new Date(event.start_date).toLocaleDateString('en-FR', {
        weekday: 'long',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    }));
    
    return formattedEvents.sort(
      (a, b) => new Date(a.start_date) - new Date(b.start_date)
    );
  }, [events]);

  // Filter public businesses
  const publicBusinesses = useMemo(() => 
    businesses.filter(business => business.is_public === true),
    [businesses]
  );

  // Filter events by category
  const filterEventsByCategory = useCallback((category) => {
    return processedEvents.filter(x => x.category === category);
  }, [processedEvents]);

  // Filter businesses by category
  const filterBusinessesByCategory = useCallback((category) => {
    return publicBusinesses.filter(x => x.category === category);
  }, [publicBusinesses]);

  // Define route paths
  const agenda = "/agenda";
  const discover = "/discover";

  // Loading state
  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="app-error">
        <div className="alert alert-danger" role="alert">
          <h4>Error loading application</h4>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Define your routes in an array
  const routes = [
    { path: `/`, element: <WelcomePage events={processedEvents} businesses={publicBusinesses}/> },
    { path: `/profile`, element: <ProfilePage account={account} events={events} businesses={businesses} /> },
    { path: `${agenda}`, element: <AgendaPage events={processedEvents} /> },
    { path: `${agenda}/all`, element: <AgendaPage events={processedEvents} /> },
    { path: `${agenda}/cinemas`, element: <AgendaPage events={filterEventsByCategory("cinema")} /> },
    { path: `${agenda}/courses`, element: <AgendaPage events={filterEventsByCategory("course")} /> },
    { path: `${agenda}/concerts`, element: <AgendaPage events={filterEventsByCategory("concert")} /> },
    { path: `${agenda}/parties`, element: <AgendaPage events={filterEventsByCategory("party")} /> },
    { path: `${agenda}/expositions`, element: <AgendaPage events={filterEventsByCategory("exposition")} /> },
    { path: `${agenda}/language_exchanges`, element: <AgendaPage events={filterEventsByCategory("language_exchange")} /> },
    { path: `${agenda}/theaters`, element: <AgendaPage events={filterEventsByCategory("theater")} /> },
    { path: `${agenda}/gastronomies`, element: <AgendaPage events={filterEventsByCategory("gastronomy")} /> },
    { path: `${agenda}/dances`, element: <AgendaPage events={filterEventsByCategory("dance")} /> },
    { path: `${agenda}/event/:id`, element: <EventDetail events={processedEvents} /> },
    { path: `/event/create`, element: <EventCreateForm tags={tags} formMode="create" />},
    { path: `/event/update/:id`, element: <EventCreateForm tags={tags} events={events} formMode="update" />},
    { path: `${discover}`, element: <DiscoverPage businesses={publicBusinesses} /> },
    { path: `${discover}/all`, element: <DiscoverPage businesses={publicBusinesses} /> },
    { path: `${discover}/artists`, element: <DiscoverPage businesses={filterBusinessesByCategory("artist")} /> },
    { path: `${discover}/restaurants`, element: <DiscoverPage businesses={filterBusinessesByCategory("restaurant")} /> },
    { path: `${discover}/cafes`, element: <DiscoverPage businesses={filterBusinessesByCategory("cafe")} /> },
    { path: `${discover}/boutiques`, element: <DiscoverPage businesses={filterBusinessesByCategory("boutique")} /> },
    { path: `${discover}/expositions`, element: <DiscoverPage businesses={filterBusinessesByCategory("exposition")} /> },
    { path: `${discover}/associations`, element: <DiscoverPage businesses={filterBusinessesByCategory("association")} /> },
    { path: `${discover}/academies`, element: <DiscoverPage businesses={filterBusinessesByCategory("academy")} /> },
    { path: `${discover}/business/:id`, element: <DiscoverDetail businesses={publicBusinesses} /> },
    { path: `/business/create`, element: <DiscoverCreateForm tags={tags} formMode="create" />},
    { path: `/business/update/:id`, element: <DiscoverCreateForm tags={tags} businesses={businesses} formMode="update" />},
    { path: `/tag/create`, element: <TagCreateForm />},
    { path: `/account/create`, element: <AccountCreationForm formMode="create" />},
    { path: `/account/update/:id`, element: <AccountCreationForm account={account} formMode="update" />},
    { path: '/maps', element: <MapView events={processedEvents} businesses={publicBusinesses.filter(x => x.address !== null)}/> },
    { path: '/login', element: <Login />},
    { path: '/about', element: <AboutPage />},
    { path: '/blog', element: <BlogPage />},
    { path: '/search', element: <Search events={processedEvents} businesses={publicBusinesses} />},
    { path: '/forgot_password', element: <ForgotPassword />},
    { path: '/reset_password', element: <ResetPassword />},
  ];

  const customStyle = {fontSize: "0.9rem", fontFamily: "Figtree, sans-serif"};

  return (
    <Router>
      <div style={customStyle} className="container-fluid p-0 d-flex flex-column min-vh-100">
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
};

export default App;
