import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Divider, Stack, Typography, Chip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

const NavItem = ({ to, icon, label, tag }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `nav-item${isActive ? " nav-item--active" : ""}`}
  >
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 2, py: 1.2 }}>
      {icon}
      <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
        {label}
      </Typography>
      {tag && (
        <Chip
          label={tag}
          size="small"
          sx={{ height: 18, fontSize: "0.6rem", color: "text.disabled" }}
          variant="outlined"
        />
      )}
    </Stack>
  </NavLink>
);

const Sidebar = () => (
  <Box className="sidebar">
    <Box sx={{ px: 2, pt: 2, pb: 1 }}>
      <Typography
        variant="overline"
        sx={{ fontSize: "0.65rem", color: "text.secondary", letterSpacing: 1 }}
      >
        Navigation
      </Typography>
    </Box>
    <Divider sx={{ mx: 1, mb: 0.5 }} />
    <Box sx={{ pt: 0.5 }}>
      <NavItem
        to="/homes"
        icon={<HomeIcon fontSize="small" />}
        label="Homes"
      />
    </Box>
  </Box>
);

export default Sidebar;
