import { useState } from "react";
import useBackend from "../hooks/use-backend";
import React from "react";
import MapView from "./MapView";
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import AddLocationIcon from '@mui/icons-material/AddLocation';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Slider from '@mui/material/Slider';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import SubwayIcon from '@mui/icons-material/Subway';
import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';

const Home = () => {
  const [selectedPois, setPois] = useState([]);
  const [metroValue, setMetroValue] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null); // Tiene traccia di quale POI sta selezionando la posizione
  const [requestState, sendRequest] = useBackend('HOMES');

  const handleToleranceChange = (index, newValue) => {
    setPois((prevPois) => {
      const updatedPois = [...prevPois];
      updatedPois[index] = { ...updatedPois[index], tolerance: newValue };
      return updatedPois;
    });
  };

  const handleWalkChange = (index, newValue) => {
    setPois((prevPois) => {
      const updatedPois = [...prevPois];
      updatedPois[index] = { ...updatedPois[index], walk: newValue };
      return updatedPois;
    });
  };


  const handlePoiChange = (index, newName) => {
    const updatedPois = [...selectedPois];
    updatedPois[index].name = newName;
    setPois(updatedPois);
  };

  const handleLocationClick = (index) => {
    console.log("Location click", index);
    setActiveIndex(index);
  };

  // Funzione chiamata quando l'utente clicca sulla mappa
  const handleMapClick = (lat, lng) => {
    if (activeIndex !== null) {
      const updatedPois = [...selectedPois];
      updatedPois[activeIndex].point = [lng, lat];
      setPois(updatedPois);
      setActiveIndex(null); // Disattiva la modalità selezione dopo il click
    }
  };

  return (
    <div className="page-layout">
      <div className="controls">
        <Grid container direction={"column"}>
          {
            selectedPois.length === 0 ? (
              <Typography variant="body1">
                Click the button to start adding the first point of interest.
              </Typography>

            ) : (null
            )
          }
          <Grid container spacing={2} alignContent={"right"} direction={"row-reverse"}>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => {
              setPois([...selectedPois, { name: "", point: null, tolerance: 0, walk: 0 }]);
            }}>
              Add
            </Button>
          </Grid>
          <div style={{ overflowY: "auto", flexGrow: 1, maxHeight: "600px" }}>
            {
              selectedPois.map((poi, index) => (
                <Paper key={index} variant="outlined" style={{ padding: 10, margin: 10, width: "100%" }}>
                  <Grid container spacing={2}>
                    <Grid item>
                      <TextField
                        label="Name"
                        value={poi.name}
                        variant="outlined"
                        fullWidth
                        onChange={(e) => handlePoiChange(index, e.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        label="Location"
                        value={poi.point != null ? `${poi.point[0].toFixed(3)}, ${poi.point[1].toFixed(3)}` : "Click to select"}
                        variant="outlined"
                        fullWidth
                        disabled
                        slotProps={{ input: { endAdornment: <Button startIcon={<AddLocationIcon />} onClick={() => handleLocationClick(index)} /> } }}
                      />
                    </Grid>
                    <Grid item>
                      <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
                        <TransferWithinAStationIcon />
                        <Slider
                          aria-label="Tolerance"
                          value={poi.tolerance}
                          valueLabelDisplay="auto"
                          shiftStep={100}
                          step={100}
                          marks
                          min={0}
                          max={2000}
                          onChange={(event, newValue) => {
                            handleToleranceChange(index, newValue);
                          }}
                          sx={{ width: 200 }} // Assicura che occupi tutta la larghezza
                        />
                      </Stack>
                    </Grid>
                    <Grid item>
                      <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
                        <DirectionsWalkIcon />
                        <Slider
                          aria-label="Walk"
                          value={poi.walk}
                          valueLabelDisplay="auto"
                          shiftStep={100}
                          step={100}
                          marks
                          min={0}
                          max={2000}
                          onChange={(event, newValue) => {
                            handleWalkChange(index, newValue);
                          }}
                          sx={{ width: 200 }} // Assicura che occupi tutta la larghezza
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Button startIcon={<DeleteIcon />} onClick={() => {
                        const updatedPois = [...selectedPois];
                        updatedPois.splice(index, 1);
                        setPois(updatedPois);
                      }} />
                    </Grid>
                  </Grid>
                </Paper>
              ))
            }
            {
              selectedPois.length > 0 ? (
                <Grid item>
                  <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
                    <SubwayIcon />
                    <Slider
                      aria-label="Metro"
                      value={metroValue}
                      // getAriaValueText={poi.tolerance}
                      valueLabelDisplay="auto"
                      shiftStep={100}
                      step={100}
                      marks
                      min={0}
                      max={2000}
                      onChange={(event, newValue) => {
                        setMetroValue(newValue);
                      }}
                      sx={{ width: 200 }} // Assicura che occupi tutta la larghezza
                    />
                  </Stack>
                </Grid>
              ) : (null)
            }
          </div>
          {selectedPois.length > 0 ? (
            <Grid container direction={"column"}>
              <Grid container direction={"row"} alignContent={"center"} justify={"center"}>
                <Grid item>
                  <Button variant="contained" color="primary" loading={requestState.loading} startIcon={<SendIcon />} onClick={() => {
                    console.log("Send", selectedPois);
                    sendRequest({ pois: selectedPois, metro: metroValue });
                  }
                  }>
                    Send
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" color="secondary" startIcon={<DeleteIcon />} loading={requestState.loading} onClick={() => {
                    setPois([]);
                  }
                  }>
                    Clear
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : (null)}
        </Grid>
      </div>
      <div className="map-view">
        {activeIndex !== null && (
          <div style={{
            position: "fixed",  // Assicura che sia sempre visibile
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,  // Più alto di tutto
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
            fontSize: "16px",
            fontWeight: "bold",
          }}>
            🗺️ Click on the map to select a point
            <span
              onClick={() => setActiveIndex(null)}
              style={{
                textDecoration: "underline",
                cursor: "pointer",
                color: "#FFD700", // Giallo dorato per renderlo evidente
                fontSize: "14px",
              }}
            >
              Undo
            </span>
          </div>
        )}
        <MapView onMapClick={handleMapClick} pois={selectedPois} geoJsonData={requestState.loading ? null : requestState.result} />
      </div>
    </div >
  );
};

export default Home;
