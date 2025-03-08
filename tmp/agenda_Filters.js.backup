import React, { Component } from 'react';
import { FaFilter } from 'react-icons/fa';
import { Row, Col, Dropdown } from 'react-bootstrap';

class Filters extends Component {
  state = {
    selectedCity: '',
    selectedDateFilter: 'Any Date',
    startDate: null,
    endDate: null,
  };

  handleCityFilter = (selectedCity) => {
    this.setState({ selectedCity }, () => {
      this.props.onFilterChange(this.state);
    });
  };

  handleDateFilterChange = (selectedDateFilter) => {
    const { startDate, endDate } = this.getDateRange(selectedDateFilter);
    this.setState({ selectedDateFilter, startDate, endDate }, () => {
      this.props.onFilterChange(this.state);
    });
  };

  getDateRange = (selectedDateFilter) => {
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
  };

  render() {
    const { selectedCity, selectedDateFilter } = this.state;
    const { cities } = this.props;

    return (
      <Row className="justify-content-center text-center">
        {/* City Filter Dropdown */}
        <Col xs={6} md={4} className="mb-2">
          <Dropdown onSelect={this.handleCityFilter}>
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
          <Dropdown onSelect={this.handleDateFilterChange}>
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
  }
}

export default Filters;
