import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MapView from "../components/MapView";
import type { Address, Round } from "../types/index";
import { getRound, getAddresses } from "../api/apiRound";
import commonStyles from "../assets/css/CommonStyles.module.css";

const OptimizeRoundPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [round, setRound] = useState<Round | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div>Loading...</div>;
  if (error || !round) return <div>{error || "Round not found."}</div>;

  return (
    <div className={commonStyles.layout}>
      <Sidebar />
      <div className={commonStyles.mainContent}>
        <Navbar />
        <main className="flex-1 p-8">
          <h2 className="text-xl font-semibold mb-4">Optimize Your Round</h2>
          <div className="mb-4">
            <button className="btn mr-2">Shortest</button>
            <button className="btn mr-2">Fastest</button>
            <button className="btn">Eco</button>
          </div>
          <MapView addresses={addresses} />
          <div className="mt-4 flex gap-4">
            <button className="btn">Edit Order</button>
            <button className="btn">Recalculate</button>
            <button className="btn">Save</button>
            <button className="btn">Export PDF</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OptimizeRoundPage;