import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, GeoJSON, LayersControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const titleCase = (str) => {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const legend = {
  "area": { color: 'blue', weight: 1 },
  "lines": { color: 'red', weight: 8 },
}

const highlightLineStyle = {
  color: 'purple', // O qualsiasi colore che preferisci per l'evidenziazione
  weight: 12,       // Rendi la linea più spessa
  opacity: 0.8
};

const MapView = ({ onMapClick, pois, geoJsonData }) => {

  const [selectedFeatureInfo, setSelectedFeatureInfo] = useState(null);

  const lastSelectedLayerRef = useRef({});

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        onMapClick(e.latlng.lat, e.latlng.lng);
        setSelectedFeatureInfo(null);
      },
    });
    return null;
  };

  // -----------------------------------------------------
  const onEachFeature = (feature, layer) => {
    // Save Ref to layer
    if (feature.properties && feature.properties.id) {
      lastSelectedLayerRef.current[feature.properties.id] = layer;
    }

    layer.on({
      click: (e) => {
        console.log("Feature clicked:", feature);
        if (feature.properties && feature.properties.id) {
          // Update state of selected layer
          setSelectedFeatureInfo({
            id: feature.properties.id,
            latlng: [e.latlng.lat, e.latlng.lng],
            properties: feature.properties,
          });
        }
        L.DomEvent.stopPropagation(e);
      },
    });
  };

  useEffect(() => {
    console.log("useEffect running, selectedFeatureInfo:", selectedFeatureInfo);

    // 1. Reset style of last selected layer
    Object.values(lastSelectedLayerRef.current).forEach(layer => {
      if (layer && layer.setStyle) {
         layer.setStyle(legend['lines']);
      }
    });

    // 2. If there is a selected feature, apply highlight style
    if (selectedFeatureInfo && selectedFeatureInfo.id) {
      const selectedLayer = lastSelectedLayerRef.current[selectedFeatureInfo.id];
      if (selectedLayer && selectedLayer.setStyle) {
        selectedLayer.setStyle(highlightLineStyle);
        console.log("Highlighting layer with ID:", selectedFeatureInfo.id);
      }
    }
  }, [selectedFeatureInfo]);

  console.log("Selected", selectedFeatureInfo);

  return (
    <div style={{ width: '100%', height: '100%' }}>

      <MapContainer center={[45.069315805542246, 7.668238138353479]} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoJsonData &&
          (<LayersControl position="topright">
            {Object.keys(geoJsonData).map((key, index) => (
              <LayersControl.Overlay name={titleCase(key)} checked={true} key={index}>
                <GeoJSON key={JSON.stringify(geoJsonData[key])} data={geoJsonData[key]} style={legend[key]} onEachFeature={key == "area" ? null : onEachFeature} />
              </LayersControl.Overlay>))}
          </LayersControl>
          )
        }
        <MapClickHandler />
        {pois && pois.map((poi, index) =>
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
        {selectedFeatureInfo && selectedFeatureInfo.latlng && (
          <Popup
            key={`popup-${selectedFeatureInfo.id}`}
            position={selectedFeatureInfo.latlng}
            onClose={() => setSelectedFeatureInfo(null)}
          // autoPan={false} // Questa è la chiave! Impedisce alla mappa di spostarsi
          >
            {/* Popup content with line info */}
            <div>
              <strong>Route: </strong> {selectedFeatureInfo.properties['Route']}<br />
              <strong>Direction: </strong> {selectedFeatureInfo.properties['Direction']}
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
