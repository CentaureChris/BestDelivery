import React from "react";
const TopBar = ({ onLogout }) => (
  <header className="topbar">
    <h1>Optimiseur de Tournée</h1>
    <button onClick={onLogout}>Déconnexion</button>
  </header>
);
export default TopBar;