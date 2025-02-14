import React, { Component } from "react";
import { Navbar, Nav, Form, FormControl, Dropdown, Image, Container, Offcanvas, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBars, FaCalendarAlt, FaCompass, FaMapMarkedAlt, FaUserCircle } from "react-icons/fa";
import { connect } from "react-redux";
import { setIsLoggedIn, setActiveCategoryHeader } from "../actions/appActions";
import Api from "../Api";

class Header extends Component {
  state = {
    showSidebar: false,
  };

  toggleSidebar = () => {
    this.setState((prevState) => ({ showSidebar: !prevState.showSidebar }));
  };

  handleCategoryChange = (category) => {
    this.props.setActiveCategoryHeader(category);
  };

  handleLogout = async () => {
    try {
      await Api.post("/accounts/private/logout", null, { withCredentials: true });
      this.handleCategoryChange("");
      this.props.setIsLoggedIn(!this.props.isLoggedIn);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  render() {
    const { showSidebar } = this.state;
    const category = this.props.activeCategoryHeader;
    const agenda_path = this.props.activeCategoryAgenda || "/agenda";
    const discover_path = this.props.activeCategoryDiscover || "/discover";
    const style = { fontSize: "0.9rem", fontFamily: "Figtree, sans-serif" }

    const navItems = [
      { label: "Agenda", path: agenda_path, icon: <FaCalendarAlt />, show: true },
      { label: "Discover", path: discover_path, icon: <FaCompass />, show: true },
      { label: "Map", path: "/maps", icon: <FaMapMarkedAlt />, show: true },
      {
        label: "Profile",
        show: this.props.isLoggedIn,
        dropdown: true,
      },
      {
        label: "Login",
        path: "/login",
        className: "btn btn-outline-secondary text-dark",
        show: !this.props.isLoggedIn,
        style: style,
      },
      {
        label: "Logout",
        path: "/",
        className: "btn btn-outline-secondary text-dark",
        onClick: this.handleLogout,
        show: this.props.isLoggedIn,
        style: style
      },
    ];

    return (
      <>
        {/* Top Navbar */}
        <Navbar bg="white" expand="lg" className="border-bottom px-3">
          <Container>
            {/* Left-side menu toggle */}
            <Button variant="link" className="p-0 me-3 d-lg-none" onClick={this.toggleSidebar} style={{ color: "black" }}>
              <FaBars size={24} />
            </Button>

            {/* Brand Logo */}
            <Navbar.Brand
              as={Link}
              to="/"
              onClick={() => this.handleCategoryChange("")}
              className="d-flex align-items-center"
            >
              <Image
                src="https://hispanie.com/cdn/shop/files/hispanie.png?v=1730648689&width=150"
                width={95}
                height={25}
                alt="Logo"
              />
            </Navbar.Brand>

            {/* Desktop Menu */}
            <Nav className="ms-auto d-none d-lg-flex align-items-center">
              <Form className="d-flex me-3">
                <FormControl type="search" placeholder="Search" className="me-2" />
              </Form>
              {navItems
                .filter((item) => item.show)
                .map((item, index) =>
                  item.dropdown ? (
                    <Dropdown key={index} align="end">
                      <Dropdown.Toggle 
                        variant="link" 
                        className="d-flex align-items-center text-dark text-decoration-none" 
                        style={style}
                      >
                        <FaUserCircle size={20} className="me-2" />
                        Profile
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={style}>
                        <Dropdown.Item as={Link} to="/profile">View Profile</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/account/create">Create Account</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/tag/create">Create Tag</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/event/create">Create Event</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/business/create">Create Business</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <Nav.Link
                      key={index}
                      as={Link}
                      to={item.path}
                      onClick={item.onClick ? item.onClick : () => this.handleCategoryChange(item.label.toLowerCase())}
                      className={item.className || (category === item.label.toLowerCase() ? "text-danger fw-bold" : "text-dark")}
                      style={index.style || {}}
                    >
                      {item.icon} <span className="ms-2">{item.label}</span>
                    </Nav.Link>
                  )
                )}
            </Nav>
          </Container>
        </Navbar>

        {/* Left-Side Collapsible Menu (for Mobile) */}
        <Offcanvas show={showSidebar} onHide={this.toggleSidebar} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form className="d-flex mb-3">
              <FormControl type="search" placeholder="Search" className="me-2" />
            </Form>

            <Nav className="flex-column">
              {navItems
                .filter((item) => item.show)
                .map((item, index) =>
                  item.dropdown ? (
                    <Dropdown key={index} align="end" className="mb-2">
                      <Dropdown.Toggle 
                        variant="link"
                        className="d-flex align-items-center text-dark text-decoration-none w-100"
                      >
                        <FaUserCircle size={20} className="me-2" />
                        Profile
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/profile" className="text-dark">View Profile</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/account/create" className="text-dark">Create Account</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/tag/create" className="text-dark">Create Tag</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/event/create" className="text-dark">Create Event</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/business/create" className="text-dark">Create Business</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <Nav.Link
                      key={index}
                      as={Link}
                      to={item.path}
                      onClick={item.onClick ? item.onClick : () => this.handleCategoryChange(item.label.toLowerCase())}
                      className={item.className || (category === item.label.toLowerCase() ? "text-danger fw-bold" : "text-dark")}
                    >
                      {item.icon} <span className="ms-2">{item.label}</span>
                    </Nav.Link>
                  )
                )}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </>
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
