import React, { Component } from 'react';
import ProductCard from './ProductCard';
import './AgendaPage.css';

class AgendaPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [
        {
          id: 1,
          title: 'Concert Forró do Breizh\'il au Bal Pop avec Janayna Pereira',
          date: 'Domingo 3 Noviembre',
          status: 'Ha Finalizado',
          time: '23:00 - 23:00',
          location: 'Le Bal Pop\' : 91 Route de Vannes, 448000 Saint-Herblain, France',
          price: 18.00,
          tags: ['Brasil', 'Concierto', 'Forró'],
          imageUrl: '/path/to/image.jpg',
        },
        // Otros productos si es necesario
      ],
    };
  }

  render() {
    return (
      <div className="agenda-page">
        <h1>Agenda</h1>
        <button className="filter-button">🔍 Filtrar</button>
        <div className="product-list">
          {this.state.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <p className="product-count">{this.state.products.length} producto(s)</p>
      </div>
    );
  }
}

export default AgendaPage;
