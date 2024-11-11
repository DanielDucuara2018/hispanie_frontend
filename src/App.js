import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import NavCategories from './components/NavCategories';
import HomePage from './components/HomePage';
import Footer from './components/Footer';
import MapView from './components/MapView';
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
    return (
      <Router>
        <div className="App">
          <Header />
          <NavCategories />
          <Routes>
            <Route path="/" element={<HomePage events={this.state.events} />} />
            <Route path="/all" element={<HomePage events={this.state.events} />} />
            <Route path="/events" element={<HomePage events={[]} />} />
            <Route path="/cinema" element={<HomePage events={[]} />} />
            <Route path="/courses" element={<HomePage events={[]} />} />
            <Route path="/maps" element={<MapView />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    );
  }
}

export default App;
