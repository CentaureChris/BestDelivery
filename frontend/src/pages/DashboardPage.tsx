import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RoundList from "../components/RoundList";
import Navbar from "../components/Navbar";
import type { Round } from "../types/index";
import { fetchRounds } from "../api/";
import commonStyles from "../assets/css/CommonStyles.module.css";

// [
//   { id: 1, date: "2025-07-22", addresses: [], optimizationType: "shortest" },
//   { id: 2, date: "2025-07-21", addresses: [], optimizationType: "fastest" }
// ];

const DashboardPage: React.FC = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchRounds()
      .then(data => {
        setRounds(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load rounds.");
        setLoading(false);
      });
  }, []);

  return (
    <div className={commonStyles.layout}>
      <Sidebar />
      <div className={commonStyles.mainContent}>
        <Navbar />
        <main className={commonStyles.main}>
          <h2 className={commonStyles.heading}>My Rounds</h2>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && <RoundList rounds={rounds} />}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
