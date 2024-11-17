import React from 'react';
import Categories from './Categories';
import HomePage from './HomePage';

const DiscoverPage = ({ artists }) => (
  <>
    <Categories />
    <HomePage artists={artists}/>
  </>
);

export default DiscoverPage;