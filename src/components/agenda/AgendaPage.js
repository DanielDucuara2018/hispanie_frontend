import React from 'react';
import Categories from './Categories';
import HomePage from './HomePage';

const AgendaPage = ({ events }) => (
  <>
    <Categories />
    <HomePage events={events} />
  </>
);

export default AgendaPage;
