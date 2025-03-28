import React from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});


const MapView = ({ onMapClick, pois, geoJsonData }) => {

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        onMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  console.log("Data", geoJsonData);

  return (
    <div style={{ width: '100%', height: '100%' }}>

      <MapContainer center={[45.069315805542246, 7.668238138353479]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler />
        {pois.map((poi, index) =>
          poi.point ? (
            <Marker key={index} position={[poi.point[1], poi.point[0]]} icon={defaultIcon}>
              <Popup>
                <strong>{poi.name || "Unnamed POI"}</strong>
                <br />
                📍 {poi.point[0].toFixed(5)}, {poi.point[1].toFixed(5)}
              </Popup>
            </Marker>
          ) : null
        )}
        {geoJsonData && <GeoJSON key={JSON.stringify(geoJsonData)} data={geoJsonData} />}
      </MapContainer>
    </div>
  );
};

export default MapView;
