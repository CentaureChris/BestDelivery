import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import NewRoundPage from "./pages/NewRoundPage";
import OptimizeRoundPage from "./pages/OptimizeRoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import PrivateRoute from "./components/PrivateRoute";

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/round/new" element={<NewRoundPage />} />
        <Route path="/round/:id/optimize" element={<OptimizeRoundPage />} />
      </Route>
      {/* Add RoundDetailsPage, etc. */}
    </Routes>
  </BrowserRouter>
);

export default App;