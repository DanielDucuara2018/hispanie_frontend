import React from 'react';
import Categories from './Categories';
import HomePage from './HomePage';

const DiscoverPage = ({ businesses }) => (
  <>
    <Categories />
    <HomePage businesses={businesses}/>
  </>
);

export default DiscoverPage;