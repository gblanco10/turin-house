import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import stemmaTorino from "../assets/stemmaTorino.png";

const Navbar = () => (
  <AppBar position="static" elevation={2}>
    <Toolbar variant="dense">
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 1,
          px: 0.6,
          py: 0.3,
          mr: 1.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          component="img"
          src={stemmaTorino}
          alt="Stemma di Torino"
          sx={{ height: 30 }}
        />
      </Box>
      <Typography variant="h6" component="div" fontWeight={700} letterSpacing={0.5}>
        Turin House
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Navbar;
