import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import AddressList from "../components/AddressList";

const NewTour = () => {
  const [addresses, setAddresses] = useState([]);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (input.trim()) {
      setAddresses([...addresses, { id: Date.now(), text: input }]);
      setInput("");
    }
  };

  const handleRemove = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleValidate = () => {
    // TODO: API call to save addresses
    // then redirect to map/optimization page
    alert("Valider les adresses");
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main>
        <TopBar />
        <h2>Nouvelle Tournée</h2>
        <div>
          <input
            type="text"
            placeholder="Adresse"
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button onClick={handleAdd}>Ajouter</button>
        </div>
        <AddressList addresses={addresses} onRemove={handleRemove} />
        <button onClick={handleValidate} disabled={addresses.length === 0}>
          Valider les adresses
        </button>
      </main>
    </div>
  );
};

export default NewTour;