import React, { useState } from "react";
import { geocodeAddress } from "../api/geocode.tsx";
import { saveAddress } from "../api/apiAddress";
import styles from "../assets/css/RoundForm.module.css"


const RoundForm: React.FC = () => {
  const [addressText, setAddressText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!addressText.trim()) {
      setError("Please enter an address.");
      return;
    }

    // 1. Geocode the address
    const coords = await geocodeAddress(addressText);
    if (!coords) {
      setError("Address not found.");
      return;
    }

    // 2. Save to backend
    try {
      await saveAddress({
        address_text: addressText,
        latitude: coords.lat,
        longitude: coords.lon,
        order: 1,       // ou la valeur correcte dans ta logique
        delivered: false,
      });
      setSuccess("Address saved!");
      setAddressText(""); // reset input
    } catch (e) {
      setError("Could not save address.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className={styles.input}
        type="text"
        placeholder="Enter address"
        value={addressText}
        onChange={e => setAddressText(e.target.value)}
      />
      <button type="submit">Add address</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}
    </form>
  );
};

export default RoundForm;