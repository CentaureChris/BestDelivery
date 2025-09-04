import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import NewRoundPage from "./pages/NewRoundPage";
import OptimizeRoundPage from "./pages/OptimizeRoundPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import RoundEditPage from "./pages/RoundEditPage";
import PrivateRoute from "./components/PrivateRoute";
import { setAuthToken } from "./api/apiAuth"; // <-- import your token util

// Initialize the token ONCE at app start
const token = localStorage.getItem("token");
setAuthToken(token);

const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/round/new" element={<NewRoundPage />} />
        <Route path="/round/:id/optimize" element={<OptimizeRoundPage />} />
        <Route path="/round/:id/edit" element={<RoundEditPage />} />
      </Route>
      {/* Add RoundDetailsPage, etc. */}
    </Routes>
  </BrowserRouter>
);

export default App;