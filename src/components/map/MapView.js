import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapView = () => {
  const position = [4.60971, -74.08175]; // Coordenadas de Bogotá, Colombia

  return (
    <MapContainer center={position} zoom={13} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          ¡Aquí está Bogotá! <br /> Ciudad Capital.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapView;
