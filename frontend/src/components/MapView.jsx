import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
  GeoJSON,
  LayersControl,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const titleCase = (str) =>
  str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());

const defaultIcon = L.icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const activeIcon = L.divIcon({
  className: "",
  html: `<div class="pulsing-marker"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -14],
});

const legend = {
  area: { color: "blue", weight: 1 },
  lines: { color: "red", weight: 8, opacity: 1 },
};

const highlightLineStyle = {
  color: "purple",
  weight: 12,
  opacity: 0.8,
};

const MapView = ({ onMapClick, pois, geoJsonData, activeIndex }) => {
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

  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.id) {
      lastSelectedLayerRef.current[feature.properties.id] = layer;
    }
    layer.on({
      click: (e) => {
        if (feature.properties && feature.properties.id) {
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
    const selectedId = selectedFeatureInfo?.id;
    Object.entries(lastSelectedLayerRef.current).forEach(([id, layer]) => {
      if (!layer?.setStyle) return;
      if (!selectedId) {
        layer.setStyle(legend["lines"]);
      } else if (String(id) === String(selectedId)) {
        layer.setStyle(highlightLineStyle);
      } else {
        layer.setStyle({ opacity: 0, fillOpacity: 0 });
      }
    });
  }, [selectedFeatureInfo]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <MapContainer
        center={[45.069315805542246, 7.668238138353479]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {geoJsonData && (
          <LayersControl position="topright">
            {Object.keys(geoJsonData).map((key, index) => (
              <LayersControl.Overlay name={titleCase(key)} checked key={index}>
                <GeoJSON
                  key={JSON.stringify(geoJsonData[key])}
                  data={geoJsonData[key]}
                  style={legend[key]}
                  onEachFeature={key === "area" ? null : onEachFeature}
                />
              </LayersControl.Overlay>
            ))}
          </LayersControl>
        )}

        <MapClickHandler />

        {pois &&
          pois.map((poi, index) => {
            if (!poi.point) return null;
            const position = [poi.point[1], poi.point[0]];
            const isActive = index === activeIndex;
            return (
              <React.Fragment key={index}>
                {poi.tolerance > 0 && (
                  <Circle
                    center={position}
                    radius={poi.tolerance}
                    pathOptions={{
                      color: "#f57c00",
                      fillColor: "#f57c00",
                      fillOpacity: 0.08,
                      weight: 1.5,
                      dashArray: "6 4",
                    }}
                  />
                )}
                <Marker
                  position={position}
                  icon={isActive ? activeIcon : defaultIcon}
                >
                  <Popup>
                    <div className="popup-header">
                      {poi.name || `POI ${index + 1}`}
                    </div>
                    <div className="popup-body">
                      <div className="popup-row">
                        <span className="popup-label">Walk to stop</span>
                        <span className="popup-value">
                          {poi.walk > 0 ? `${poi.walk} m` : "—"}
                        </span>
                      </div>
                      <div className="popup-row">
                        <span className="popup-label">Stop → POI</span>
                        <span className="popup-value">
                          {poi.tolerance > 0 ? `${poi.tolerance} m` : "—"}
                        </span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}

        {selectedFeatureInfo && selectedFeatureInfo.latlng && (
          <Popup
            key={`popup-${selectedFeatureInfo.id}`}
            position={selectedFeatureInfo.latlng}
            eventHandlers={{ remove: () => setSelectedFeatureInfo(null) }}
          >
            <div className="popup-header">
              {selectedFeatureInfo.properties["Route"]}
            </div>
            <div className="popup-body" style={{ minWidth: 220 }}>
              <div className="popup-row" style={{ alignItems: "flex-start" }}>
                <span className="popup-label" style={{ flexShrink: 0 }}>Direction</span>
                <span className="popup-value" style={{ whiteSpace: "normal", wordBreak: "break-word", textAlign: "right" }}>
                  {selectedFeatureInfo.properties["Direction"]}
                </span>
              </div>
            </div>
          </Popup>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
