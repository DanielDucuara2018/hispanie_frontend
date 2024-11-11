import React from 'react';
import NavCategories from './NavCategories';
import HomePage from './HomePage';

const AgendaCategories = ({ events }) => (
  <>
    <NavCategories />
    <HomePage events={events} />
  </>
);

export default AgendaCategories;
