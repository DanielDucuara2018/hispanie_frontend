import React, { useCallback, useMemo } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveCategoryDiscover } from '../../actions/appActions';

const Categories = () => {
  const activeCategoryDiscover = useSelector(state => state.appRootReducer.activeCategoryDiscover);
  const dispatch = useDispatch();

  // Define navigation categories as constant
  const categories = useMemo(() => [
    { label: 'All', path: '/discover/all' },
    { label: "Artist", path: "/discover/artists" },
    { label: "Restaurant", path: "/discover/restaurants" },
    { label: "Cafe", path: "/discover/cafes" },
    { label: "Boutique", path: "/discover/boutiques" },
    { label: "Exposition", path: "/discover/expositions" },
    { label: "Association", path: "/discover/associations" },
    { label: "Academy", path: "/discover/academies" },
  ], []);

  const handleCategoryChange = useCallback((category) => {
    dispatch(setActiveCategoryDiscover(category));
  }, [dispatch]);

  return (
    <Nav className="justify-content-center my-3">
      {categories.map((data, index) => (
        <Nav.Item key={index}>
          <Nav.Link
            as={Link}
            to={data.path}
            onClick={() => handleCategoryChange(data.path)}
            className={activeCategoryDiscover === data.path ? "text-danger fw-bold" : "text-dark fw-bold"}
            style={{fontSize: "1.2rem", fontFamily: "Figtree, sans-serif"}}
          >
            {data.label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Categories;
