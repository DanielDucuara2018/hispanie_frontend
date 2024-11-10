import React, { Component } from 'react';
import './ProductCard.css';

class ProductCard extends Component {
  render() {
    const { product } = this.props;

    return (
      <div className="product-card">
        <img src={product.imageUrl} alt={product.title} className="product-image" />
        <div className="product-info">
          <span className="product-status">{product.status}</span>
          <span className="product-time">{product.time}</span>
          <h2 className="product-title">{product.title}</h2>
          <p className="product-date">{product.date}</p>
          <p className="product-location">{product.location}</p>
          <p className="product-price">Tickets: €{product.price.toFixed(2)}</p>
          <div className="tags">
            {product.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ProductCard;
