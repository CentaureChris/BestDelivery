import React from "react";
import Sidebar from "../components/Sidebar";
import RoundList from "../components/RoundList";
import Navbar from "../components/Navbar";
import type { Round } from "../types/index";
import styles from '../assets/css/DashboardPage.module.css';


// Dummy data for rounds
const rounds: Round[] = [
  { id: 1, name: "Morning Round", date: "2025-07-22", addresses: [], optimizationType: "shortest" },
  { id: 2, name: "Afternoon Round", date: "2025-07-21", addresses: [], optimizationType: "fastest" }
];

const DashboardPage: React.FC = () => (
  <div className={styles.layout}>
    <Sidebar />
    <div className={styles.mainContent}>
      <Navbar />
      <main className={styles.main}>
        <h2 className={styles.heading}>My Rounds</h2>
        <RoundList rounds={rounds} />
      </main>
    </div>
  </div>
);

export default DashboardPage;