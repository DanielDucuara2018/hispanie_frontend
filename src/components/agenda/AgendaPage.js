import React from 'react';
import Categories from './Categories';
import HomePage from './HomePage';

const AgendaPage = ({ events }) => (


  <>
    <Categories />
    <HomePage events={events} cities={[...new Set(events.map(event => event.city))]} />
  </>
);

export default AgendaPage;
