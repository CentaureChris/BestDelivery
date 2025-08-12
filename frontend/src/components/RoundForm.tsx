import React, { useState } from "react";
import styles from "../assets/css/RoundForm.module.css";
import { geocodeAddress } from "../api/geocode";
import { createRound, attachAddressToRound } from "../api/apiRound";

const RoundForm: React.FC = () => {
  const [addressText, setAddressText] = useState("");
  const [currentRoundId, setCurrentRoundId] = useState<number | null>(null);
  const [currentOrder, setCurrentOrder] = useState(1); // start order at 1
  const [message, setMessage] = useState<string | null>(null);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!addressText.trim()) {
      setMessage("Veuillez entrer une adresse.");
      return;
    }

    // 1. Geocode
    const coords = await geocodeAddress(addressText);
    if (!coords) {
      setMessage("Adresse introuvable.");
      return;
    }

    try {
      let roundId = currentRoundId;

      // 2. Create new round if none in progress
      if (!roundId) {
        const newRound = await createRound({
          name: "Nouvelle tournée",
          date: new Date().toISOString().split("T")[0],
          type_optimisation: "shortest",
        });
        roundId = newRound.id;
        setCurrentRoundId(roundId);
        setCurrentOrder(1); // reset order for new round
        setMessage(`Tournée #${roundId} créée.`);
      }

      // 3. Attach address with current order
      await attachAddressToRound(roundId!, {
        address_text: addressText,
        latitude: coords.lat,
        longitude: coords.lon,
        order: currentOrder,
        delivered: false,
      });

      setMessage(`Adresse ajoutée (ordre ${currentOrder}) à la tournée #${roundId}`);
      setAddressText("");
      setCurrentOrder(prev => prev + 1); // increment for next address
    } catch (error) {
      setMessage("Erreur lors de l'enregistrement.");
    }
  };

  const handleEndRound = () => {
    setMessage(`Tournée #${currentRoundId} terminée.`);
    setCurrentRoundId(null);
    setCurrentOrder(1); // reset order counter for next round
  };

  return (
    <main className="p-8">
      <form onSubmit={handleAddAddress} className="mb-4 flex gap-2">
        <input
          type="text"
          value={addressText}
          onChange={e => setAddressText(e.target.value)}
          placeholder="Saisir une adresse"
          className={styles.input}
        />
        <button type="submit" className="btn m-2">
          Ajouter
        </button>
      </form>

      {currentRoundId && (
        <button onClick={handleEndRound} className="btn bg-red-500 text-white">
          Fin de tournée
        </button>
      )}

      {message && <div className="mt-4 text-sm text-blue-600">{message}</div>}
    </main>
  );
};

export default RoundForm;