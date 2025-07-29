import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from '../assets/css/Sidebar.module.css';

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.title}>Optimiseur<br />de Tournee</div>
      <nav className={styles.menu}>
        <Link to="/round/new" 
          className={location.pathname === "/round/new"
            ? `${styles.menuItem} ${styles.menuItemActive}`
            : styles.menuItem} 
        >
          Nouvelle tournée
        </Link>
        <Link
          to="/"
          className={
            location.pathname === "/"
              ? `${styles.menuItem} ${styles.menuItemActive}`
              : styles.menuItem
          }
        >
          Historique
        </Link>
      </nav>
      <div className={styles.spacer}></div>
      {/* Optional: bottom links like Settings */}
      {/* <div className={styles.bottomLinks}> ... </div> */}
    </aside>
  );
};

export default Sidebar;