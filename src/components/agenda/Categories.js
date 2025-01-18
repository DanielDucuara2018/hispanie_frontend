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
      { path: '/agenda/courses', label: 'Courses' },
      { path: '/agenda/concerts', label: 'Concerts' },
      { path: '/agenda/parties', label: 'Parties' },
      // { path: '/agenda/expositions', label: 'Expositions' },
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
              className={category === path ? 'text-danger fw-bold' : ''}
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
