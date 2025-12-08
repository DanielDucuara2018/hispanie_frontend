import React, { useState, useCallback } from 'react';
import { FaFilter } from 'react-icons/fa';
import { Row, Col, Dropdown } from 'react-bootstrap';

const Filters = ({ cities = [], onFilterChange }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Any Date');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const getDateRange = useCallback((selectedDateFilter) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const nextWeekStart = new Date(endOfWeek);
    nextWeekStart.setDate(nextWeekStart.getDate() + 1);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    switch (selectedDateFilter) {
      case 'Today':
        return { startDate: today, endDate: today };
      case 'Tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return { startDate: tomorrow, endDate: tomorrow };
      case 'This Week':
        return { startDate: startOfWeek, endDate: endOfWeek };
      case 'On Weekend':
        const weekendStart = new Date(startOfWeek);
        weekendStart.setDate(startOfWeek.getDate() + 5);
        const weekendEnd = new Date(weekendStart);
        weekendEnd.setDate(weekendStart.getDate() + 1);
        return { startDate: weekendStart, endDate: weekendEnd };
      case 'Next Week':
        return { startDate: nextWeekStart, endDate: nextWeekEnd };
      case 'Next Month':
        return { startDate: nextMonthStart, endDate: nextMonthEnd };
      default:
        return { startDate: null, endDate: null };
    }
  }, []);

  const handleCityFilter = useCallback((selectedCity) => {
    setSelectedCity(selectedCity);
    onFilterChange({ selectedCity, selectedDateFilter, startDate, endDate });
  }, [onFilterChange, selectedDateFilter, startDate, endDate]);

  const handleDateFilterChange = useCallback((selectedDateFilter) => {
    const { startDate: newStartDate, endDate: newEndDate } = getDateRange(selectedDateFilter);
    setSelectedDateFilter(selectedDateFilter);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    onFilterChange({ selectedCity, selectedDateFilter, startDate: newStartDate, endDate: newEndDate });
  }, [getDateRange, onFilterChange, selectedCity]);

  return (
    <Row className="justify-content-center text-center">
      {/* City Filter Dropdown */}
      <Col xs={6} md={4} className="mb-2">
        <Dropdown onSelect={handleCityFilter}>
          <Dropdown.Toggle variant="outline-dark">
            {selectedCity || 'City'} <FaFilter />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="">All Cities</Dropdown.Item>
            {cities.map((city, index) => (
              <Dropdown.Item key={index} eventKey={city}>
                {city}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>

      {/* Date Filter Dropdown */}
      <Col xs={6} md={4}>
        <Dropdown onSelect={handleDateFilterChange}>
          <Dropdown.Toggle variant="outline-dark">
            {selectedDateFilter} <FaFilter />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {['Any Date', 'Today', 'Tomorrow', 'This Week', 'On Weekend', 'Next Week', 'Next Month'].map((option) => (
              <Dropdown.Item key={option} eventKey={option}>
                {option}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Row>
  );
};

export default Filters;
