import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import theme from "./theme";
import "./index.css";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="main-layout">
            <Sidebar />
            <div className="page-content">
              <Routes>
                <Route path="/" element={<Navigate to="/homes" replace />} />
                <Route path="/homes" element={<Home />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
