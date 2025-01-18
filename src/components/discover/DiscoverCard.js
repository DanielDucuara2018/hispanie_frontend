import React, { Component } from 'react';
import { Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class DiscoverCard extends Component {
  render() {
    const { id, title } = this.props;
    return (
      <Link to={`/discover/business/${id}`} className="text-decoration-none text-dark">
        <Image
          src="https://hispanie.com/cdn/shop/collections/103931085_2892442374157190_3440336142787089498_n.jpg?v=1734831647&width=750" //{""}
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