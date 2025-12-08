import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const SaveButton = ({ eventId }) => {
  const [isSaved, setIsSaved] = useState(false);

  // Initialize state from sessionStorage on mount
  useEffect(() => {
    const savedState = sessionStorage.getItem(`saved_${eventId}`) === 'true';
    setIsSaved(savedState);
  }, [eventId]);

  const handleSave = () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    sessionStorage.setItem(`saved_${eventId}`, newSavedState);
  };

  return (
    <Button
      variant={isSaved ? 'secondary' : 'dark'}
      onClick={handleSave}
      className="transition-all"
    >
      {isSaved ? '✓ Saved' : 'Save'}
    </Button>
  );
};

export default SaveButton;