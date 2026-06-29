import React, { useState, useEffect } from "react";
import useBackend from "../hooks/use-backend";
import MapView from "./MapView";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import ParkIcon from "@mui/icons-material/Park";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlagIcon from "@mui/icons-material/Flag";
import MetroSvg from "../assets/metro.svg";

const FilterSlider = ({ icon, label, value, onChange }) => (
  <Box sx={{ mb: 1.5 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 0.5,
      }}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        {icon}
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Stack>
      <Typography variant="caption" color="text.secondary" fontWeight={500}>
        {value > 0 ? `${value} m` : "Off"}
      </Typography>
    </Box>
    <Slider
      value={value}
      step={100}
      marks
      min={0}
      max={2000}
      size="small"
      onChange={onChange}
    />
  </Box>
);

const Home = () => {
  const [selectedPois, setPois] = useState([]);
  const [metroValue, setMetroValue] = useState(0);
  const [greenAreaValue, setGreenAreaValue] = useState(0);
  const [pharmacyValue, setPharmacyValue] = useState(0);
  const [fitnessCenterValue, setFitnessCenterValue] = useState(0);
  const [groceryStoreValue, setGroceryStoreValue] = useState(0);
  const [activeIndex, setActiveIndex] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [requestState, sendRequest, resetState] = useBackend();

  useEffect(() => {
    if (requestState.error) setSnackbarOpen(true);
  }, [requestState.error]);

  const handleToleranceChange = (index, newValue) => {
    setPois((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], tolerance: newValue };
      return updated;
    });
  };

  const handleWalkChange = (index, newValue) => {
    setPois((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], walk: newValue };
      return updated;
    });
  };

  const handlePoiChange = (index, newName) => {
    const updated = [...selectedPois];
    updated[index] = { ...updated[index], name: newName };
    setPois(updated);
  };

  const handleLocationClick = (index) => {
    setActiveIndex(index);
  };

  const handleMapClick = (lat, lng) => {
    if (activeIndex !== null) {
      const updated = [...selectedPois];
      updated[activeIndex] = { ...updated[activeIndex], point: [lng, lat] };
      setPois(updated);
      setActiveIndex(null);
    }
  };

  const handleDeletePoi = (index) => {
    const updated = [...selectedPois];
    updated.splice(index, 1);
    setPois(updated);
    if (activeIndex === index) setActiveIndex(null);
  };

  const handleSend = () => {
    sendRequest({
      pois: selectedPois,
      metro: metroValue,
      osm: {
        green_area: greenAreaValue,
        pharmacy: pharmacyValue,
        fitness_center: fitnessCenterValue,
        grocery: groceryStoreValue,
      },
    });
  };

  const handleClear = () => {
    setPois([]);
    resetState();
    setActiveIndex(null);
    setMetroValue(0);
    setGreenAreaValue(0);
    setPharmacyValue(0);
    setFitnessCenterValue(0);
    setGroceryStoreValue(0);
  };

  const hasPois = selectedPois.length > 0;

  return (
    <Box sx={{ display: "flex", height: "100%", width: "100%" }}>
      {/* Overlay when waiting for map click */}
      {activeIndex !== null && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            top: 56,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Alert
            severity="info"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => setActiveIndex(null)}
              >
                Cancel
              </Button>
            }
          >
            Click on the map to set the POI location
          </Alert>
        </Paper>
      )}

      {/* Controls panel */}
      <Box className="controls">
        {/* Add button */}
        <Box sx={{ mb: 1.5, flexShrink: 0 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            size="small"
            onClick={() =>
              setPois([
                ...selectedPois,
                { name: "", point: null, tolerance: 0, walk: 0 },
              ])
            }
          >
            Add POI
          </Button>
        </Box>

        {/* Empty state */}
        {!hasPois && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              py: 4,
            }}
          >
            <AddLocationIcon sx={{ fontSize: 48, color: "text.disabled" }} />
            <Typography variant="body2" color="text.secondary" align="center">
              Add a point of interest to get started
            </Typography>
          </Box>
        )}

        {/* POI list */}
        <Box sx={{ overflowY: "auto", flex: 1 }}>
          {selectedPois.map((poi, index) => (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                p: 1.5,
                mb: 1,
                border:
                  activeIndex === index ? "2px solid #1976d2" : undefined,
                transition: "border-color 0.2s",
              }}
            >
              {/* Name + delete */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <TextField
                  label="Name"
                  value={poi.name}
                  variant="outlined"
                  fullWidth
                  size="small"
                  onChange={(e) => handlePoiChange(index, e.target.value)}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeletePoi(index)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>

              {/* Location */}
              {poi.point === null ? (
                <Button
                  variant="outlined"
                  startIcon={<AddLocationIcon />}
                  fullWidth
                  size="small"
                  onClick={() => handleLocationClick(index)}
                  sx={{ mb: 1, textTransform: "none" }}
                >
                  Click to select on map
                </Button>
              ) : (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.5}
                  sx={{ mb: 1 }}
                >
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ flex: 1 }}
                  >
                    {poi.point[1].toFixed(4)}°N, {poi.point[0].toFixed(4)}°E
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => handleLocationClick(index)}
                    sx={{ minWidth: "auto", px: 0.5, fontSize: "0.7rem" }}
                  >
                    Change
                  </Button>
                </Stack>
              )}

              {/* Walk slider */}
              <Box sx={{ px: 0.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <DirectionsWalkIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Home → stop
                    </Typography>
                  </Stack>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {poi.walk > 0 ? `${poi.walk} m` : "Off"}
                  </Typography>
                </Box>
                <Slider
                  value={poi.walk}
                  step={100}
                  marks
                  min={0}
                  max={2000}
                  size="small"
                  onChange={(_, v) => handleWalkChange(index, v)}
                />
              </Box>

              {/* Tolerance slider */}
              <Box sx={{ px: 0.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 0.5,
                  }}
                >
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <FlagIcon fontSize="small" color="action" />
                    <Typography variant="caption" color="text.secondary">
                      Stop → POI
                    </Typography>
                  </Stack>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {poi.tolerance > 0 ? `${poi.tolerance} m` : "Off"}
                  </Typography>
                </Box>
                <Slider
                  value={poi.tolerance}
                  step={100}
                  marks
                  min={0}
                  max={2000}
                  size="small"
                  onChange={(_, v) => handleToleranceChange(index, v)}
                />
              </Box>
            </Paper>
          ))}

          {/* Global filters */}
          {hasPois && (
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                mt: 0.5,
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" fontWeight={500}>
                  Neighborhood Filters
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mb: 1.5 }}
                >
                  Max walking distance to each amenity (0 = no filter)
                </Typography>
                <FilterSlider
                  icon={
                    <Box
                      component="img"
                      src={MetroSvg}
                      alt="Metro"
                      sx={{ width: 18, height: 18, opacity: 0.6 }}
                    />
                  }
                  label="Metro station"
                  value={metroValue}
                  onChange={(_, v) => setMetroValue(v)}
                />
                <FilterSlider
                  icon={<ParkIcon fontSize="small" color="action" />}
                  label="Green area"
                  value={greenAreaValue}
                  onChange={(_, v) => setGreenAreaValue(v)}
                />
                <FilterSlider
                  icon={<LocalPharmacyIcon fontSize="small" color="action" />}
                  label="Pharmacy"
                  value={pharmacyValue}
                  onChange={(_, v) => setPharmacyValue(v)}
                />
                <FilterSlider
                  icon={
                    <LocalGroceryStoreIcon fontSize="small" color="action" />
                  }
                  label="Grocery store"
                  value={groceryStoreValue}
                  onChange={(_, v) => setGroceryStoreValue(v)}
                />
                <FilterSlider
                  icon={<FitnessCenterIcon fontSize="small" color="action" />}
                  label="Fitness center"
                  value={fitnessCenterValue}
                  onChange={(_, v) => setFitnessCenterValue(v)}
                />
              </AccordionDetails>
            </Accordion>
          )}
        </Box>

        {/* Action buttons */}
        {hasPois && (
          <Stack direction="row" spacing={1} sx={{ pt: 1, flexShrink: 0 }}>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              loading={requestState.isLoading}
              fullWidth
              onClick={handleSend}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              loading={requestState.isLoading}
              onClick={handleClear}
            >
              Clear
            </Button>
          </Stack>
        )}
      </Box>

      {/* Map */}
      <Box className="map-view" sx={{ position: "relative" }}>
        {requestState.isLoading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              bgcolor: "rgba(255,255,255,0.45)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <CircularProgress size={52} />
          </Box>
        )}
        <MapView
          onMapClick={handleMapClick}
          pois={selectedPois}
          geoJsonData={requestState.isLoading ? null : requestState.result}
          activeIndex={activeIndex}
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
        >
          Request failed. Please check your inputs and try again.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
