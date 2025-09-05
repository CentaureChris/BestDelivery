import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import RoundList from "../components/RoundList";
import Navbar from "../components/Navbar";
import type { Round } from "../types/index";
import { fetchRounds, deleteRound } from "../api/";
import commonStyles from "../assets/css/CommonStyles.module.css";

// [
//   { id: 1, date: "2025-07-22", addresses: [], optimizationType: "shortest" },
//   { id: 2, date: "2025-07-21", addresses: [], optimizationType: "fastest" }
// ];

const DashboardPage: React.FC = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const handleDelete = async (id: number) => {
    const ok = window.confirm(`Supprimer la tournée #${id} ?`);
    if (!ok) return;
    try {
      await deleteRound(id);
      setRounds(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      setError("Échec de la suppression de la tournée.");
    }
  };

  return (
    <div className={commonStyles.layout}>
       {/* Sidebar wrapper that opens/closes */}
      <div
        className={`${commonStyles.sidebarWrap} ${
          sidebarOpen ? commonStyles.open : commonStyles.closed
        }`}
        aria-hidden={!sidebarOpen}
      >
        <Sidebar />
      </div>
      <div className={commonStyles.mainContent}>
        <Navbar
          onToggleSidebar={() => {
            console.log("[Page] toggling sidebar");
            setSidebarOpen(prev => !prev);
          }}
        />
        <main className={commonStyles.main}>
          <h2 className={commonStyles.heading}>Mes Tournées</h2>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && (
            <RoundList rounds={rounds} onDelete={handleDelete} />
          )}
        </main>
      </div>
    </div>
  );
};
  
export default DashboardPage;
