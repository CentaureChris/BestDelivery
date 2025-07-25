import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NewTour from "./pages/NewTour";
import TourDetail from "./pages/TourDetail";
import Login from "./pages/Login";

function App() {
  // TODO: Replace fake auth with real auth context
  const isAuthenticated = true;
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {isAuthenticated ? (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tours/new" element={<NewTour />} />
            <Route path="/tours/:id" element={<TourDetail />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}
export default App;