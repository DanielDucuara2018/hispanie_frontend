import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class DiscoverCard extends Component {
  render() {
    const { id, title } = this.props;
    return (
      <Link to={`/business/${id}`} className="text-decoration-none text-dark">
        <Image
          src={""}
          alt={title}
          roundedCircle
          fluid
          style={{ width: "200px", height: "200px" }}
        />
        <p className="mt-2">{title}</p>
      </Link>
    );
  }
}

export default DiscoverCard;