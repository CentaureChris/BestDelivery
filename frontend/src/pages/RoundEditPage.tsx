import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RoundStopsEditorDnD from "../components/RoundStopsEditorDnD";
import type { AddressRound, Round } from "../types";
import { getRound, getAddresses, attachAddressToRound } from "../api/apiRound";
import { geocodeAddress } from "../api/geocode";
import commonStyles from "../assets/css/CommonStyles.module.css";

const RoundEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const roundId = useMemo(() => (id ? Number(id) : null), [id]);

  const [round, setRound] = useState<Round | null>(null);
  const [addresses, setAddresses] = useState<AddressRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [newAddress, setNewAddress] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!roundId) return;
    setLoading(true);
    setError(null);
    Promise.all([getRound(roundId), getAddresses(roundId)])
      .then(([r, a]) => {
        setRound(r as any);
        setAddresses((a as any) ?? []);
      })
      .catch((e: any) => setError("Failed to load round or addresses. " + e.message))
      .finally(() => setLoading(false));
  }, [roundId]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roundId) return;
    const text = newAddress.trim();
    if (!text) return;
    setAdding(true);
    setError(null);
    try {
      const coords = await geocodeAddress(text);
      if (!coords) throw new Error("Adresse introuvable");
      const res: any = await attachAddressToRound(roundId, {
        address_text: text,
        latitude: coords.lat,
        longitude: coords.lon,
        delivered: false,
        order: addresses.length++
      });
      const next = res?.addresses ?? [];
      if (next.length) setAddresses(next);
      setNewAddress("");
    } catch (e: any) {
      setError(e?.message || "Erreur lors de l'ajout d'adresse");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!round || !roundId) return <div>Round not found.</div>;

  return (
    <div className={commonStyles.layout}>
      <div
        className={`${commonStyles.sidebarWrap} ${
          sidebarOpen ? commonStyles.open : commonStyles.closed
        }`}
        aria-hidden={!sidebarOpen}
      >
        <Sidebar />
      </div>
      <div className={commonStyles.mainContent}>
        <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className={commonStyles.main}>
          <h2 className={commonStyles.heading}>Modifier la tournée #{round.id}</h2>

          <form onSubmit={handleAddAddress} className="mb-4 flex gap-2">
            <input
              type="text"
              value={newAddress}
              onChange={e => setNewAddress(e.target.value)}
              placeholder="Ajouter une adresse (recherche et géocodage)"
              className="px-3 py-2 border rounded w-full"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 text-white rounded"
              disabled={adding}
            >
              {adding ? "Ajout..." : "Ajouter"}
            </button>
          </form>

          <RoundStopsEditorDnD
            roundId={roundId}
            addresses={addresses}
            onAddressesChange={setAddresses}
            enableCrud
          />
        </main>
      </div>
    </div>
  );
};

export default RoundEditPage;
