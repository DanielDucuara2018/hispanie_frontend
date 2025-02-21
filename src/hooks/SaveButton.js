import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class SaveButton extends Component {
  constructor(props) {
    super(props);
    // Initialize state based on session storage
    const isSaved = sessionStorage.getItem(`saved_${this.props.eventId}`) === 'true';
    this.state = { isSaved };
  }

  handleSave = () => {
    const { isSaved } = this.state;
    const { eventId } = this.props;

    // Toggle the saved state
    this.setState({ isSaved: !isSaved }, () => {
      // Update session storage
      sessionStorage.setItem(`saved_${eventId}`, this.state.isSaved);
    });
  };

  render() {
    const { isSaved } = this.state;
    return (
      <Button
        variant={isSaved ? 'secondary' : 'dark'}
        onClick={this.handleSave}
      >
        {isSaved ? 'Saved' : 'Save'}
      </Button>
    );
  }
}

export default SaveButton;