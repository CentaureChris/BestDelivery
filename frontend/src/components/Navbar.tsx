import React from "react";
import { logout } from "../api/";
import { useNavigate } from "react-router-dom";
import styles from '../assets/css/Navbar.module.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const userLogout = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      logout();
      navigate("/login"); 
    } catch (err: any) {
      console.log("Logout Failed "+ err.response?.data?.message);
    }
  }
  return (
  <nav className={styles.navbar}>
    <span className={styles.brand}>BESTDELIVERY</span>
    <div className={styles.actions}>
      <button className={styles.btn}>Profile</button>
      <button className={styles.btn} onClick={userLogout}>Logout</button>
    </div>
  </nav>
  )
}
;

export default Navbar;