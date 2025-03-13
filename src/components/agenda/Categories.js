import React, { Component } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import { setActiveCategoryAgenda } from "../../actions/appActions";

class Categories extends Component {
  constructor(props) {
    super(props);
    // Define navigation categories
    this.categories = [
      { path: '/agenda/all', label: 'All' },
      { path: '/agenda/cinemas', label: 'Cinema' },
      { path: '/agenda/courses', label: 'Cours' },
      { path: '/agenda/concerts', label: 'Concert' },
      { path: '/agenda/parties', label: 'Party' },
      { path: '/agenda/expositions', label: 'Exposition' },
      { path: '/agenda/language_exchanges', label: 'Language Exchange' },
      { path: '/agenda/theaters', label: 'Theater' },
      { path: '/agenda/gastronomies', label: 'Gastronomy' },
    ];
  }

  handleCategoryChange = (category) => {
    this.props.setActiveCategoryAgenda(category);
  };

  render() {
    const category = this.props.activeCategoryAgenda;

    return (
      <Nav className="justify-content-center my-3">
        {this.categories.map(({ path, label }) => (
          <Nav.Item key={path}>
            <Nav.Link
              as={Link}
              to={path}
              onClick={() => this.handleCategoryChange(path)}
              className={category === path ? "text-danger fw-bold" : "text-dark fw-bold"}
              style={{fontSize: "1.2rem", fontFamily: "Figtree, sans-serif"}}
            >
              {label}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
    );
  }
}

const mapStateToProps = (state) => ({
  activeCategoryAgenda: state.appRootReducer.activeCategoryAgenda
});

const mapDispatchToProps = {
  setActiveCategoryAgenda
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
