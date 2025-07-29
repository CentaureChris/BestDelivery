import React from "react";
import styles from '../assets/css/Navbar.module.css';

const Navbar: React.FC = () => (
  <nav className={styles.navbar}>
    <span className={styles.brand}>Delivery Optimizer</span>
    <div className={styles.actions}>
      <button className={styles.btn}>Profile</button>
      <button className={styles.btn}>Logout</button>
    </div>
  </nav>
);

export default Navbar;