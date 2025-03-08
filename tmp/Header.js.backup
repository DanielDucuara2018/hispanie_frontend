import React, { Component } from "react";
import { Navbar, Nav, Form, FormControl, Dropdown, Image, Container, Offcanvas, Button, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBars, FaCalendarAlt, FaCompass, FaMapMarkedAlt, FaUserCircle, FaHome } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { connect } from "react-redux";
import { setIsLoggedIn, setActiveCategoryHeader } from "../actions/appActions";
import Api from "../Api";

class Header extends Component {
  state = {
    showSidebar: false,
    showSearch: false,
    searchQuery: "",
  };

  handleShowSearch = () => {
    this.setState({ showSearch: true });
  };

  handleCloseSearch = () => {
    this.setState({ showSearch: false });
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
      if (error.response.status === 401) {
        this.props.setIsLoggedIn(false);
      }
    }
  };

  render() {
    const { showSidebar, showSearch, searchQuery } = this.state;
    const category = this.props.activeCategoryHeader;
    const agenda_path = this.props.activeCategoryAgenda || "/agenda";
    const discover_path = this.props.activeCategoryDiscover || "/discover";
    const style = { fontSize: "0.9rem", fontFamily: "Figtree, sans-serif" };

    // Navigation items inside collapsed menu
    const noCollapsedNavItems = [
      { label: "Agenda", path: agenda_path, icon: <FaCalendarAlt /> },
      { label: "Discover", path: discover_path, icon: <FaCompass /> },
      { label: "Map", path: "/maps", icon: <FaMapMarkedAlt /> },
    ];

    const collapsedNavItems = [ 
      { label: "Home", path: "/", icon: <FaHome /> },
      ...noCollapsedNavItems
    ];

    return (
      <>
        {/* Top Navbar */}
        <Navbar bg="white" expand="lg" className="border-bottom px-3">
          <Container className="d-flex justify-content-start align-items-center">
            {/* Left-side menu toggle (visible only on small screens) */}
            <Button variant="link" className="p-0 me-3 d-lg-none" onClick={this.toggleSidebar} style={{ color: "black" }}>
              <FaBars size={24} />
            </Button>

            {/* Brand Logo */}
            <Navbar.Brand as={Link} to="/" onClick={() => this.handleCategoryChange("")} className="d-flex align-items-center">
              <Image src="https://d3skpo6i31hl4s.cloudfront.net/hispanie.avif" width={95} height={25} alt="Logo" />
            </Navbar.Brand>

            {/* Search Input for Large Screens */}
            <Form 
              onSubmit={(e) => {
                e.preventDefault(); // Prevent page reload
                window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
              }} 
              className="d-flex align-items-center ms-3 d-none d-md-block"
            >
              <InputGroup>
                <FormControl
                  type="search"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => this.setState({ searchQuery: e.target.value })}
                />
              </InputGroup>
            </Form>

            {/* Navigation Items (aligned left) */}
            <Nav className="d-flex justify-content-start align-items-center ms-3 d-none d-lg-flex">
              {noCollapsedNavItems.map((item, index) => (
                <Nav.Link
                  key={index}
                  as={Link}
                  to={item.path}
                  onClick={() => this.handleCategoryChange(item.label.toLowerCase())}
                  className={category === item.label.toLowerCase() ? "text-danger fw-bold" : "text-dark"}
                >
                  {item.icon} <span className="ms-2">{item.label}</span>
                </Nav.Link>
              ))}
            </Nav>

            {/* Search Icon for Small Screens */}
            <CiSearch  size={24} onClick={this.handleShowSearch} className="border-0 d-md-none ms-auto" />

            {/* User Menu (Profile / Login / Logout) */}
            <Nav className="d-flex flex-row align-items-center flex-nowrap ms-3 ms-auto">
              {this.props.isLoggedIn && (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="d-flex align-items-center text-dark text-decoration-none" style={style}>
                    <FaUserCircle size={20} className="me-2" /> <span className="d-none d-lg-flex">Profile</span>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ ...style, position: "absolute", zIndex: 1050 }}>
                    <Dropdown.Item as={Link} to="/profile">View Profile</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/account/create">Create Account</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/tag/create">Create Tag</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/event/create">Create Event</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/business/create">Create Business</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
              {!this.props.isLoggedIn ? (
                <Nav.Link as={Link} to="/login" className="btn btn-outline-secondary text-dark" style={style}>Login</Nav.Link>
              ) : (
                <Nav.Link onClick={this.handleLogout} className="btn btn-outline-secondary text-dark" style={style}>Logout</Nav.Link>
              )}
            </Nav>
          </Container>
        </Navbar>

        {/* Left-Side Collapsible Menu (for Mobile) */}
        <Offcanvas 
          show={showSidebar} 
          onHide={this.toggleSidebar} 
          placement="start"
          style={{
            height: "100%", // Small height
            maxWidth: "200px", // Ensures it doesn't take too much space
            width: "100vh",
          }}
          className="shadow-sm"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {/* Collapsed Menu Items */}
            <Nav className="flex-column">
              {collapsedNavItems.map((item, index) => (
                <Nav.Link
                  key={index}
                  as={Link}
                  to={item.path}
                  onClick={() => this.handleCategoryChange(item.label.toLowerCase())}
                  className={category === item.label.toLowerCase() ? "text-danger fw-bold" : "text-dark"}
                >
                  {item.icon} <span className="ms-2">{item.label}</span>
                </Nav.Link>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Offcanvas (Sliding Search Input from the Top) */}
        <Offcanvas
          show={showSearch}
          onHide={this.handleCloseSearch}
          placement="top"
          style={{
            height: "25vh", // Small height
            maxHeight: "200px", // Ensures it doesn't take too much space
            width: "100%",
          }}
          className="shadow-sm"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Search</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form 
              action={`/search?q=${encodeURIComponent(searchQuery)}`} 
              method="GET"
              className="w-100 px-3"
            >
              <InputGroup>
                <FormControl
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => this.setState({ searchQuery: e.target.value })}
                  autoFocus
                />
              </InputGroup>
            </Form>
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
