import React, { useState, useCallback, useMemo } from "react";
import { Navbar, Nav, Form, FormControl, Dropdown, Image, Container, Offcanvas, Button, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBars, FaCalendarAlt, FaCompass, FaMapMarkedAlt, FaUserCircle, FaHome } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoggedIn, setActiveCategoryHeader } from "../actions/appActions";
import Api from "../Api";

const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(state => state.appRootReducer.isLoggedIn);
  const activeCategoryHeader = useSelector(state => state.appRootReducer.activeCategoryHeader);
  const activeCategoryAgenda = useSelector(state => state.appRootReducer.activeCategoryAgenda);
  const activeCategoryDiscover = useSelector(state => state.appRootReducer.activeCategoryDiscover);

  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleShowSearch = useCallback(() => {
    setShowSearch(true);
  }, []);

  const handleCloseSearch = useCallback(() => {
    setShowSearch(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setShowSidebar(prev => !prev);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    dispatch(setActiveCategoryHeader(category));
  }, [dispatch]);

  const handleLogout = useCallback(async () => {
    try {
      await Api.post("/accounts/private/logout", null, { withCredentials: true });
      handleCategoryChange("");
      dispatch(setIsLoggedIn(!isLoggedIn));
    } catch (error) {
      if (error.response?.status === 401) {
        dispatch(setIsLoggedIn(false));
      }
    }
  }, [isLoggedIn, dispatch, handleCategoryChange]);

  const agenda_path = activeCategoryAgenda || "/agenda";
  const discover_path = activeCategoryDiscover || "/discover";
  const style = useMemo(() => ({ fontSize: "0.9rem", fontFamily: "Figtree, sans-serif" }), []);

  // Navigation items inside collapsed menu
  const noCollapsedNavItems = useMemo(() => [
    { label: "Agenda", path: agenda_path, icon: <FaCalendarAlt /> },
    { label: "Discover", path: discover_path, icon: <FaCompass /> },
    { label: "Map", path: "/maps", icon: <FaMapMarkedAlt /> },
  ], [agenda_path, discover_path]);

  const collapsedNavItems = useMemo(() => [ 
    { label: "Home", path: "/", icon: <FaHome /> },
    ...noCollapsedNavItems
  ], [noCollapsedNavItems]);

  return (
    <>
      {/* Top Navbar */}
      <Navbar bg="white" expand="lg" className="border-bottom px-3">
        <Container className="d-flex justify-content-start align-items-center">
          {/* Left-side menu toggle (visible only on small screens) */}
          <Button variant="link" className="p-0 me-3 d-lg-none" onClick={toggleSidebar} style={{ color: "black" }}>
            <FaBars size={24} />
          </Button>

          {/* Brand Logo */}
          <Navbar.Brand as={Link} to="/" onClick={() => handleCategoryChange("")} className="d-flex align-items-center">
            <Image src="https://d3skpo6i31hl4s.cloudfront.net/hispanie.avif" width={95} height={25} alt="Logo" />
          </Navbar.Brand>

          {/* Search Input for Large Screens */}
          <Form 
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
            }} 
            className="d-flex align-items-center ms-3 d-none d-md-block"
          >
            <InputGroup>
              <FormControl
                type="search"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                onClick={() => handleCategoryChange(item.label.toLowerCase())}
                className={activeCategoryHeader === item.label.toLowerCase() ? "text-danger fw-bold" : "text-dark"}
              >
                {item.icon} <span className="ms-2">{item.label}</span>
              </Nav.Link>
            ))}
          </Nav>

          {/* Search Icon for Small Screens */}
          <CiSearch size={24} onClick={handleShowSearch} className="border-0 d-md-none ms-auto" />

          {/* User Menu (Profile / Login / Logout) */}
          <Nav className="d-flex flex-row align-items-center flex-nowrap ms-auto">
            {isLoggedIn && (
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
            {!isLoggedIn ? (
              <Nav.Link as={Link} to="/login" className="btn btn-outline-secondary text-dark" style={style}>Login</Nav.Link>
            ) : (
              <Nav.Link onClick={handleLogout} className="btn btn-outline-secondary text-dark" style={style}>Logout</Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>

      {/* Left-Side Collapsible Menu (for Mobile) */}
      <Offcanvas 
        show={showSidebar} 
        onHide={toggleSidebar} 
        placement="start"
        style={{
          height: "100%",
          maxWidth: "200px",
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
                onClick={() => handleCategoryChange(item.label.toLowerCase())}
                className={activeCategoryHeader === item.label.toLowerCase() ? "text-danger fw-bold" : "text-dark"}
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
        onHide={handleCloseSearch}
        placement="top"
        style={{
          height: "25vh",
          maxHeight: "200px",
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
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </InputGroup>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
