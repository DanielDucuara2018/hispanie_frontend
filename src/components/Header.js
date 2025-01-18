import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaCompass, FaMapMarkedAlt, FaStore, FaUserCircle } from 'react-icons/fa';
import { connect } from "react-redux";
import { setIsLoggedIn, setActiveCategoryHeader } from "../actions/appActions";
import Api from '../Api';

class Header extends Component {
  handleCategoryChange = (category) => {
    this.props.setActiveCategoryHeader(category);
  };

  handleLogout = async () => {
    try {
      await Api.post('/accounts/private/logout', null, { withCredentials: true });
      this.handleCategoryChange("")
      this.props.setIsLoggedIn(!this.props.isLoggedIn); // Ensure the user is logged out
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  render() {
    const category = this.props.activeCategoryHeader;
    // Navigation items with their labels, paths, and icons
    const agenda_path = this.props.activeCategoryAgenda ? this.props.activeCategoryAgenda : '/agenda';
    const discover_path = this.props.activeCategoryDiscover ? this.props.activeCategoryDiscover : '/discover';
    const navItems = [
      { label: 'Agenda', path: agenda_path, icon: <FaCalendarAlt />, show: true },
      { label: 'Discover', path: discover_path, icon: <FaCompass />, show: true },
      { label: 'Map', path: '/maps', icon: <FaMapMarkedAlt />, show: true },
      { label: 'Store', path: '/store', icon: <FaStore />, show: true },
      {
        label: 'Profile',
        show: this.props.isLoggedIn,
        dropdown: true, // Flag to show dropdown
      },
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
        <Navbar.Brand 
          as={Link} 
          to="/"
          onClick={() => this.handleCategoryChange("")} 
          className="d-flex align-items-center"
        >
           <span className="fw-bold me-5">hispanie</span>
        </Navbar.Brand>
        <Form className="d-flex ms-auto me-3">
          <FormControl type="search" placeholder="Buscar" className="me-2" />
        </Form>
        <Nav>
          {navItems
            .filter((item) => item.show) // Only display items where `show` is true
            .map((item, index) =>
              item.dropdown ? (
                <Dropdown key={index} align="end">
                  <Dropdown.Toggle variant="link" className="d-flex align-items-center text-decoration-none">
                    <FaUserCircle size={20} className="me-2" />
                    Profile
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      View Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/event/create">
                      Create Event
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/business/create">
                      Create Business
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
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
              )
            )}
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
