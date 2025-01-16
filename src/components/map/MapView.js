import React, { Component } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Offcanvas, Card, Button, Badge } from "react-bootstrap";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: null,
      show: false,
    };
  }

  locations = [
    {
      id: 1,
      name: "Taller de Danza Mexicana mx 💃",
      position: [47.2184, -1.5536], // Nantes, France
      image:
        "https://upload.wikimedia.org/wikipedia/commons/d/d4/Mexican_Folk_Dance.jpg",
      description: "Ecole Élémentaire Bois Saint-Louis, 18 Rue des Lilas, 44700, Orvault",
      tags: ["Dance 💃", "Mexico mx", "Traditional Dances"],
      price: "€0,00",
      icon: "💃",
    },
    {
      id: 2,
      name: "Mexican Food Market 🌮",
      position: [47.2102, -1.5641],
      image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Taco_mexicano.jpg",
      description: "Place du Commerce, Nantes",
      tags: ["Food", "Tacos", "Mexican"],
      price: "€5,00",
      icon: "🌮",
    },
    {
      id: 3,
      name: "Latin Music Night 🎶",
      position: [47.2163, -1.5535],
      image:
        "https://upload.wikimedia.org/wikipedia/commons/9/9b/Latin_music_dance.jpg",
      description: "Le Havana Bar, Nantes",
      tags: ["Music", "Latin", "Dance"],
      price: "€10,00",
      icon: "🎵",
    },
  ];

  // Custom marker icons using Leaflet
  createIcon = (emoji) =>
    new L.DivIcon({
      className: "custom-icon",
      html: `
        <div class="d-flex justify-content-center align-items-center bg-white border rounded-circle shadow"
             style="width: 40px; height: 40px; border: 2px solid #ccc;">
          <span style="font-size: 20px;">${emoji}</span>
        </div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

  handleMarkerClick = (event) => {
    this.setState({ selectedEvent: event, show: true });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  render() {
    return (
      <div className="map-container">
        <MapContainer center={[47.2184, -1.5536]} zoom={13} style={{ height: "100vh", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {this.locations.map((location) => (
            <Marker
              key={location.id}
              position={location.position}
              icon={this.createIcon(location.icon)}
              eventHandlers={{
                click: () => this.handleMarkerClick(location),
              }}
            />
          ))}
        </MapContainer>

        {/* Offcanvas (Sidebar Popup) for Event Details */}
        <Offcanvas show={this.state.show} onHide={this.handleClose} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Event Details</Offcanvas.Title>
          </Offcanvas.Header>
          {this.state.selectedEvent && (
            <Offcanvas.Body>
              <Card>
                <Card.Img variant="top" src={this.state.selectedEvent.image} />
                <Card.Body>
                  <Card.Title>{this.state.selectedEvent.name}</Card.Title>
                  <Card.Text>{this.state.selectedEvent.description}</Card.Text>
                  <div className="mb-2">
                    {this.state.selectedEvent.tags.map((tag, index) => (
                      <Badge key={index} bg="secondary" className="me-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <p className="fw-bold">💰 Adhesion: {this.state.selectedEvent.price}</p>
                  <Button variant="dark" className="w-100">See More</Button>
                </Card.Body>
              </Card>
            </Offcanvas.Body>
          )}
        </Offcanvas>
      </div>
    );
  }
}

export default MapView;