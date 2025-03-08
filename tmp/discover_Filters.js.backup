import React, { Component } from 'react';
import { Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';

class Filters extends Component {
  render() {
    const filters = [
      { label: "Country", icon: "🌍" },
      { label: "Cumbia", icon: "💃" },
      { label: "Salsa", icon: "🎷" },
      { label: "Electro Tropical", icon: "🌴" },
      { label: "Samba", icon: "🇧🇷" },
      { label: "Rock", icon: "🎸" },
      { label: "Merengue", icon: "💃" },
      { label: "Salsa Cubana", icon: "🎺" },
    ];

    return (
      <ButtonToolbar className="justify-content-center mb-4">
        <ButtonGroup>
          {filters.map((filter, index) => (
            <Button
              key={index}
              variant="outline-secondary"
              className="mx-1"
              style={{
                borderRadius: "20px",
                padding: "5px 15px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {filter.icon} {filter.label}
            </Button>
          ))}
        </ButtonGroup>
      </ButtonToolbar>
    );
  }
}

export default Filters;