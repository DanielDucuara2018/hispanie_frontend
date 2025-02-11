import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class DiscoverCard extends Component {
  render() {
    const { id, title, files } = this.props;
    return (
      <Link to={`/discover/business/${id}`} className="text-decoration-none text-dark">
        <Image
          src={files.find((x) => x.category === "profile_image").path}
          alt={title}
          roundedCircle
          fluid
          width={180}
          height={180}
          style={{ border: "2px solid rgba(0, 0, 0, 0.1)" }}
          className="mb-3 shadow-sm"
        />
        <p className="mt-2">{title}</p>
      </Link>
    );
  }
}

export default DiscoverCard;