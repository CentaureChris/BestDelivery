import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MapView from "../components/MapView";
import type { AddressRound, Round } from "../types/index";
import { getRound, getAddresses, optimizeRound } from "../api/apiRound";
import commonStyles from "../assets/css/CommonStyles.module.css";
import styles from "../assets/css/OptimizeRoundPage.module.css"


const OptimizeRoundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [round, setRound] = useState<Round | null>(null);
  const [addresses, setAddresses] = useState<AddressRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orsPolyline, setOrsPolyline] = useState<[number, number][] | null>(null);
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);

    Promise.all([
      getRound(Number(id)),
      getAddresses(Number(id))
    ])
      .then(([roundData, addressesData]) => {
        setRound(roundData);
        setAddresses(addressesData);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load round or addresses.");
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
        data.ors_route?.geometry?.coordinates.map(([lng, lat]) => [lat, lng]) ?? null
      );
    } catch (e: any) {
      setError("Erreur lors de l’optimisation.");
    }
    setOptimizing(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error || !round) return <div>{error || "Round not found."}</div>;

  return (
    <div className={commonStyles.layout}>
      <Sidebar />
      <div className={commonStyles.mainContent}>
        <Navbar />
        <main className="flex-1 p-8">
          <h2 className="text-xl font-semibold mb-4">Optimiser votre tournée</h2>
          <div className="mb-4">
            <div className="mb-4 flex gap-2">
            
          </div>
          </div>
          <MapView addresses={addresses} polyline={orsPolyline}/>
          <div className={styles.bottomBarButton}>
            <button className="btn">Edit Order</button>
            <button
              className="btn"
              onClick={handleOptimize}
              disabled={optimizing}
            >
              {optimizing ? "Optimizing..." : "Recalculate"}
            </button>
            {/* <button className="btn">Save</button> */}
            <button className="btn">Export PDF</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OptimizeRoundPage;