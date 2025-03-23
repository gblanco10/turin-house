import React from "react";
import MapView from "./MapView";

const RoutesPage = () => {
  return (
    <div className="page-layout">
      <div className="controls">
        <h2>Routes Page Controls</h2>
        <p>Qui puoi aggiungere controlli per gestire percorsi.</p>
      </div>
      <div className="map-view">
        <MapView />
      </div>
    </div>
  );
};

export default RoutesPage;
