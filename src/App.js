import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MapView from './components/MapView';
import AgendaCategories from './components/AgendaCategories';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import JSON data
import eventsData from './data/events.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  componentDidMount() {
    this.setState({ events: eventsData });
  }

  render() {
    const { events } = this.state;

    return (
      <Router>
        <div className="App">
          <Header />
          <Routes>
            {/* Similar Routes Using CategoryPage */}
            <Route path="/" element={<AgendaCategories events={events} />} />
            <Route path="/agenda" element={<AgendaCategories events={events} />} />
            <Route path="/all" element={<AgendaCategories events={events} />} />
            <Route path="/events" element={<AgendaCategories events={[]} />} />
            <Route path="/cinema" element={<AgendaCategories events={[]} />} />
            <Route path="/courses" element={<AgendaCategories events={[]} />} />
            {/* Unique Route for MapView */}
            <Route path="/maps" element={<MapView />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
