import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { setActiveCategoryDiscover } from "../../actions/appActions";

class Categories extends Component {
  constructor(props) {
    super(props);
    // Define navigation categories
    this.categories = [
      { label: 'All', path: '/discover/all' },
      { label: "Artist", path: "/discover/artists" },
      { label: "Restaurant", path: "/discover/restaurants" },
      { label: "Cafe", path: "/discover/cafes" },
      { label: "Boutique", path: "/discover/boutiques" },
      { label: "Exposition", path: "/discover/expositions" },
      { label: "Association", path: "/discover/associations" },
      { label: "Academy", path: "/discover/academies" },
    ];
  }

  handleCategoryChange = (category) => {
    this.props.setActiveCategoryDiscover(category)
  };

  render() {
    const activeCategory = this.props.activeCategoryDiscover;

    return (
      <Nav className="justify-content-center my-3">
        {this.categories.map((data, index) => (
          <Nav.Item key={index}>
            <Nav.Link
              as={Link}
              to={data.path}
              onClick={() => this.handleCategoryChange(data.path)}
              className={activeCategory === data.path ? "text-danger fw-bold" : "text-dark fw-bold"}
              style={{fontSize: "1.2rem", fontFamily: "Figtree, sans-serif"}}
            >
              {data.label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    );
  }
}

const mapStateToProps = (state) => ({
  activeCategoryDiscover: state.appRootReducer.activeCategoryDiscover
});

const mapDispatchToProps = {
  setActiveCategoryDiscover
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
