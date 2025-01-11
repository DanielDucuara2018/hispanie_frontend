import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaCompass, FaMapMarkedAlt, FaStore, FaUserCircle } from 'react-icons/fa';
import { connect } from "react-redux";
import { setIsLoggedIn, setActiveCategoryHeader } from "../actions/appActions";

class Header extends Component {
  handleCategoryChange = (category) => {
    this.props.setActiveCategoryHeader(category);
  };

  handleLogout = () => {
    this.props.setIsLoggedIn(!this.props.isLoggedIn);
  };

  render() {
    const category = this.props.activeCategoryHeader;
    // Navigation items with their labels, paths, and icons
    const agenda_path = this.props.activeCategoryAgenda ? this.props.activeCategoryAgenda: '/agenda'
    const discover_path = this.props.activeCategoryDiscover ? this.props.activeCategoryDiscover : '/discover'
    const navItems = [
      { label: 'Agenda', path: agenda_path, icon: <FaCalendarAlt />, show: true },
      { label: 'Discover', path: discover_path, icon: <FaCompass />, show: true },
      { label: 'Map', path: '/maps', icon: <FaMapMarkedAlt />, show: true },
      { label: 'Store', path: '/store', icon: <FaStore />, show: true },
      { label: 'Profile', path: '/profile', icon: <FaUserCircle />, show: this.props.isLoggedIn },
      {
        label: 'Login',
        path: '/login',
        className: 'ms-3 btn btn-outline-primary',
        show: !this.props.isLoggedIn,
      },
      {
        label: 'Logout',
        path: '',
        className: 'ms-3 btn btn-outline-danger',
        onClick: () => this.handleLogout(),
        show: this.props.isLoggedIn,
      },
    ];

    return (
      <Navbar bg="light" expand="lg" className="border-bottom px-3">
        <Navbar.Brand href="#home">
          <img
            src="https://w7.pngwing.com/pngs/402/203/png-transparent-picasa-encapsulated-postscript-logo-random-icons-miscellaneous-angle-text.png"
            alt="Logo"
            height="40"
          />
        </Navbar.Brand>
        <Form className="d-flex ms-auto me-3">
          <FormControl type="search" placeholder="Buscar" className="me-2" />
        </Form>
        <Nav>
          {navItems
            .filter((item) => item.show) // Only display items where `show` is true
            .map((item, index) => (
              <Nav.Link
                key={index}
                as={Link}
                to={item.path}
                onClick={
                  item.onClick
                    ? item.onClick
                    : () => this.handleCategoryChange(item.label.toLowerCase())
                }
                className={
                  item.className ||
                  (category === item.label.toLowerCase()
                    ? 'text-danger fw-bold d-flex align-items-center'
                    : 'd-flex align-items-center')
                }
              >
                {item.icon} <span className="ms-2">{item.label}</span>
              </Nav.Link>
            ))}
        </Nav>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => ({
  isLoggedIn: state.appRootReducer.isLoggedIn,
  activeCategoryHeader: state.appRootReducer.activeCategoryHeader,
  activeCategoryAgenda: state.appRootReducer.activeCategoryAgenda,
  activeCategoryDiscover: state.appRootReducer.activeCategoryDiscover,
});

const mapDispatchToProps = {
  setIsLoggedIn,
  setActiveCategoryHeader,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
