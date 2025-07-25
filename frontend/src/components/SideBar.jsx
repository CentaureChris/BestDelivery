import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Dashboard</Link>
          </li>
          <li>
            <Link to="/tours/new" className={location.pathname === "/tours/new" ? "active" : ""}>Nouvelle tournée</Link>
          </li>
          <li>
            <Link to="/profile" className={location.pathname === "/profile" ? "active" : ""}>Profil</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;