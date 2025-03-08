import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class DiscoverCard extends Component {
  render() {
    const { id, title, files } = this.props;
    return (
      <Link 
        to={`/discover/business/${id}`} 
        className="text-decoration-none text-dark d-flex flex-column align-items-center text-center"
      >
        <Image
          src={files.find((x) => x.category === "profile_image").path}
          alt={title}
          roundedCircle
          fluid
          className="mb-3 shadow-sm"
          style={{
            width: "165px", // Fixed width
            height: "165px", // Fixed height to ensure a perfect circle
            objectFit: "cover",
            borderRadius: "50%", // Ensures it remains a perfect circle
            border: "2px solid rgba(0, 0, 0, 0.1)",
          }}
        />
        <p className="mt-2">{title}</p>
      </Link>
    );
  }
}

export default DiscoverCard;