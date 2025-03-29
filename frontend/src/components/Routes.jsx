import React from "react";
import MapView from "./MapView";
import Grid from '@mui/material/Grid2';

const RoutesPage = () => {
  return (
    <Grid container direction={'row'} className="page-layout">
      <Grid item xs={4} style={{ display: 'flex', flexDirection: 'column', height: "100%", overflowY: 'hidden' }} className="controls">
        <h2>Routes Page Controls</h2>
        <p>Qui puoi aggiungere controlli per gestire percorsi.</p>
      </Grid>
      <Grid container className="map-view">
        <MapView />
      </Grid>
    </Grid>
  );
};

export default RoutesPage;
