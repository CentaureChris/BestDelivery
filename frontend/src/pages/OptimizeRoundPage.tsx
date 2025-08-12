import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
// import RoundStopsEditor from "../components/RoundStopsEditor";
import RoundStopsEditorDnD from "../components/RoundStopsEditorDnD";
import MapView from "../components/MapView";
import type { AddressRound, Round } from "../types/index";
import { getRound, getAddresses, optimizeRound } from "../api/apiRound";
import commonStyles from "../assets/css/CommonStyles.module.css";
import styles from "../assets/css/OptimizeRoundPage.module.css";

const OptimizeRoundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [round, setRound] = useState<Round | null>(null);
  const [addresses, setAddresses] = useState<AddressRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orsPolyline, setOrsPolyline] = useState<[number, number][] | null>(
    null
  );
  const [optimizing, setOptimizing] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    Promise.all([getRound(Number(id)), getAddresses(Number(id))])
      .then(([roundData, addressesData]) => {
        setRound(roundData);
        setAddresses(addressesData);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load round or addresses." + err.message);
        setLoading(false);
      });
  }, [id]);

  const handleOptimize = async () => {
    if (!id) return;
    setOptimizing(true);
    setError(null);
    try {
      const data = await optimizeRound(Number(id));
      setAddresses(data.addresses); // met à jour l’ordre optimal
      setOrsPolyline(
        data.ors_route?.geometry?.coordinates.map(([lng, lat]) => [lat, lng]) ??
          null
      );
    } catch (e: any) {
      setError("Erreur lors de l’optimisation." + e.message);
    }
    setOptimizing(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error || !round) return <div>{error || "Round not found."}</div>;

  return (
    <div className={commonStyles.layout}>
      {/* Sidebar wrapper that opens/closes */}
      <aside
        className={`${styles.sidebarWrap} ${
          sidebarOpen ? styles.open : styles.closed
        }`}
        aria-hidden={!sidebarOpen}
      >
        <Sidebar />
      </aside>

      {/* Main area expands when sidebar closed */}
      <div
        className={`${styles.content} ${
          !sidebarOpen ? styles.contentExpanded : ""
        }`}
      >
        <Navbar
          onToggleSidebar={() => {
            console.log("[Page] toggling sidebar");
            setSidebarOpen(prev => !prev);
          }}
        />
        <main className={styles.container}>
          {/* ... rest of your page unchanged ... */}
          <div className={styles.headerRow}>
            <h2 className={styles.title}>Optimiser votre tournée</h2>
            <div className={styles.headerMeta}>
              <span className={styles.tag}>#{round.id}</span>
              {round.date && <span className={styles.tag}>{round.date}</span>}
            </div>
          </div>

          <div className={styles.toolbar}>
            <button
              className={styles.neuBtn}
              onClick={() => setShowEditor(v => !v)}
              aria-pressed={showEditor}
            >
              {showEditor ? "Masquer les étapes" : "Afficher les étapes"}
            </button>

            <button
              className={`${styles.neuBtn} ${styles.primary}`}
              onClick={handleOptimize}
              disabled={optimizing}
            >
              {optimizing ? "Optimisation" : "Recalculer"}
            </button>

            <button className={`${styles.neuBtn} ${styles.ghost}`}>
              Exporter le PDF
            </button>
          </div>

          <section className={styles.mapCard}>
            <MapView addresses={addresses} polyline={orsPolyline} />
          </section>

          {showEditor && round && (
            <section className={styles.panel}>
              <div className={styles.panelHeader}>
                <h3 className={styles.panelTitle}>Étapes & Livraison</h3>
                <p className={styles.panelSub}>
                  Faites glisser pour réordonner, cochez « Livré » pour marquer
                  l’étape.
                </p>
              </div>
              <RoundStopsEditorDnD
                roundId={round.id}
                addresses={addresses}
                onAddressesChange={setAddresses}
              />
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default OptimizeRoundPage;
