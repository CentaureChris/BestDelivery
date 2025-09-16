import React from "react";
import { logout } from "../api/";
import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import styles from "../assets/css/Navbar.module.css";

type Props = {
  onToggleSidebar?: () => void;
};

const Navbar: React.FC<Props> = ({ onToggleSidebar }) => {
  console.log("[Navbar] onToggleSidebar is", typeof onToggleSidebar); // should be "function"
  
  const navigate = useNavigate();

  const userLogout = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      logout();
      navigate("/login");
    } catch (err: unknown) {
      // ✅ Type narrowing
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        console.log("Logout Failed " + axiosError.response?.data?.message);
      } else {
        console.log("Logout Failed", err);
      }
    }
  };

  const handleToggle = () => {
    console.log("[Navbar] toggle clicked");
    onToggleSidebar?.(); // will do nothing if undefined
  };

  return (
    <nav className={styles.navbar}>
      <button
        onClick={handleToggle}
        className={styles.burger}
        aria-label="Toggle sidebar"
      >
        <FaBars size={20} color="#333" />
      </button>

      <span className={styles.brand}>SmartDelivery</span>

      <div className={styles.actions}>
        <button className={styles.btn}>Profile</button>
        <button className={styles.btn} onClick={userLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
