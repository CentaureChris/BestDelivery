import React from "react";
import Sidebar from "../components/Sidebar";
import RoundList from "../components/RoundList";
import Navbar from "../components/Navbar";
import type { Round } from "../types/index";
import commonStyles from '../assets/css/CommonStyles.module.css';


// Dummy data for rounds
const rounds: Round[] = [
  { id: 1, name: "Morning Round", date: "2025-07-22", addresses: [], optimizationType: "shortest" },
  { id: 2, name: "Afternoon Round", date: "2025-07-21", addresses: [], optimizationType: "fastest" }
];

const DashboardPage: React.FC = () => (
  <div className={commonStyles.layout}>
    <Sidebar />
    <div className={commonStyles.mainContent}>
      <Navbar />
      <main className={commonStyles.main}>
        <h2 className={commonStyles.heading}>My Rounds</h2>
        <RoundList rounds={rounds} />
      </main>
    </div>
  </div>
);

export default DashboardPage;