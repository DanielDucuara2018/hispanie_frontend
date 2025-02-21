import React, { Component } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Offcanvas, Card, Button, Badge } from "react-bootstrap";
import CATEGORY_EMOJIS from "../../hooks/CategoryEmojis";

import L from "leaflet";


class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedEvent: null,
      show: false,
    };
  }

  // Custom marker icons using Leaflet TODO centralize this is dupicated code
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
    const { events, businesses } = this.props
    const { selectedEvent } = this.state

    console.log(selectedEvent)

    return (
      <div className="map-container">
        <MapContainer center={[47.2184, -1.5536]} zoom={13} style={{ height: "100vh", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          {[...events, ...businesses].map((item) => (
            <Marker
              key={item.id}
              position={[item.latitude, item.longitude]}
              icon={this.createIcon(CATEGORY_EMOJIS[item.category])}
              eventHandlers={{
                click: () => this.handleMarkerClick(item),
              }}
            />
          ))}
        </MapContainer>

        {/* Offcanvas (Sidebar Popup) for Event Details */}
        <Offcanvas show={this.state.show} onHide={this.handleClose} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Event Details</Offcanvas.Title>
          </Offcanvas.Header>
          {selectedEvent && (
            <Offcanvas.Body>
              <Card>
                  <Card.Img
                    variant="top"
                    src={selectedEvent.files.find((x) => x.category === "profile_image").path}
                    className="img-fluid"
                    style={{ height: '200px', objectFit: 'cover' }}
                    alt={selectedEvent.name} // Always include an alt attribute for accessibility
                  />              
                  <Card.Body>
                  <Card.Title>{selectedEvent.name}</Card.Title>
                  <Card.Text>{selectedEvent.description}</Card.Text>
                  <div className="mb-2">
                    {selectedEvent.tags.map((tag, index) => (
                      <Badge key={index} bg="secondary" className="me-1">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  {/* <p className="fw-bold">💰 Adhesion: {selectedEvent.price}</p> */}
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