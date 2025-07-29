import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import NewRoundPage from "./pages/NewRoundPage";
import OptimizeRoundPage from "./pages/OptimizeRoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/round/new" element={<NewRoundPage />} />
      <Route path="/round/:id/optimize" element={<OptimizeRoundPage />} />
      {/* Add RoundDetailsPage, etc. */}
    </Routes>
  </BrowserRouter>
);

export default App;