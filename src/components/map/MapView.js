import React, { useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Offcanvas, Card, Button, Badge } from "react-bootstrap";
import CATEGORY_EMOJIS from "../../hooks/CategoryEmojis";
import L from "leaflet";

// Custom marker icon creator
const createIcon = (emoji) =>
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

const MapView = ({ events = [], businesses = [] }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [show, setShow] = useState(false);

  const handleMarkerClick = useCallback((item) => {
    setSelectedItem(item);
    setShow(true);
  }, []);

  const handleClose = useCallback(() => {
    setShow(false);
  }, []);

  const allItems = useMemo(() => [...events, ...businesses], [events, businesses]);

  const itemMetadata = useMemo(() => {
    if (!selectedItem) return null;
    const typeItem = selectedItem.id?.toLowerCase().includes("event") ? "Event" : "Business";
    const routeItem = typeItem === "Event" ? "/agenda/event" : "/discover/business";
    const profileImage = selectedItem.files?.find((x) => x.category === "profile_image")?.path;
    return { typeItem, routeItem, profileImage };
  }, [selectedItem]);

  return (
    <div className="map-container">
      <MapContainer center={[47.2184, -1.5536]} zoom={13} style={{ height: "100vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {allItems.map((item) => (
          <Marker
            key={item.id}
            position={[item.latitude, item.longitude]}
            icon={createIcon(CATEGORY_EMOJIS[item.category])}
            eventHandlers={{
              click: () => handleMarkerClick(item),
            }}
          />
        ))}
      </MapContainer>

      {/* Offcanvas (Sidebar Popup) for Item Details */}
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{itemMetadata?.typeItem} Details</Offcanvas.Title>
        </Offcanvas.Header>
        {selectedItem && itemMetadata && (
          <Offcanvas.Body>
            <Card>
              {itemMetadata.profileImage && (
                <Card.Img
                  variant="top"
                  src={itemMetadata.profileImage}
                  className="img-fluid"
                  style={{ height: '200px', objectFit: 'cover' }}
                  alt={selectedItem.name}
                />
              )}
              <Card.Body>
                <Card.Title>{selectedItem.name}</Card.Title>
                <Card.Text style={{ whiteSpace: 'pre-line' }}>{selectedItem.description}</Card.Text>
                <div className="mb-2">
                  {selectedItem.tags?.map((tag, index) => (
                    <Badge key={index} bg="secondary" className="me-1">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <a href={`${itemMetadata.routeItem}/${selectedItem.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="dark" className="w-100">See More</Button>
                </a>
              </Card.Body>
            </Card>
          </Offcanvas.Body>
        )}
      </Offcanvas>
    </div>
  );
};

export default MapView;