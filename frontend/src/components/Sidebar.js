import React from "react";
import { Link } from "react-router-dom";
import { Box, List, ListItem, IconButton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";

const Sidebar = () => {
  return (
    <Box
      sx={{
        width: 80,
        backgroundColor: "#f5f5f5",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "1rem",
      }}
    >
      <List sx={{ width: "100%" }}>
        <ListItem sx={{ justifyContent: "center" }}>
          <IconButton component={Link} to="/homes" color="primary">
            <HomeIcon />
          </IconButton>
        </ListItem>

        <ListItem sx={{ justifyContent: "center" }}>
          <IconButton component={Link} to="/routes" color="primary">
            <MapIcon />
          </IconButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
