import React, { useCallback, useMemo } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveCategoryAgenda } from '../../actions/appActions';

const Categories = () => {
  const activeCategoryAgenda = useSelector(state => state.appRootReducer.activeCategoryAgenda);
  const dispatch = useDispatch();

  // Define navigation categories as constant
  const categories = useMemo(() => [
    { path: '/agenda/all', label: 'All' },
    { path: '/agenda/cinemas', label: 'Cinema' },
    { path: '/agenda/courses', label: 'Course' },
    { path: '/agenda/concerts', label: 'Concert' },
    { path: '/agenda/parties', label: 'Party' },
    { path: '/agenda/expositions', label: 'Exposition' },
    { path: '/agenda/language_exchanges', label: 'Language Exchange' },
    { path: '/agenda/theaters', label: 'Theater' },
    { path: '/agenda/gastronomies', label: 'Gastronomy' },
    { path: '/agenda/dances', label: 'Dance' },
  ], []);

  const handleCategoryChange = useCallback((category) => {
    dispatch(setActiveCategoryAgenda(category));
  }, [dispatch]);

  return (
    <Nav className="justify-content-center my-3">
      {categories.map(({ path, label }) => (
        <Nav.Item key={path}>
          <Nav.Link
            as={Link}
            to={path}
            onClick={() => handleCategoryChange(path)}
            className={activeCategoryAgenda === path ? "text-danger fw-bold" : "text-dark fw-bold"}
            style={{fontSize: "1.2rem", fontFamily: "Figtree, sans-serif"}}
          >
            {label}
          </Nav.Link>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Categories;
