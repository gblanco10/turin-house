import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./components/Home";
import RoutesPage from "./components/Routes";
import "./index.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="main-layout">
          <Sidebar />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Navigate to="/homes" replace />} />
              <Route path="/homes" element={<Home />} />
              <Route path="/routes" element={<RoutesPage />} />
            </Routes> 
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
