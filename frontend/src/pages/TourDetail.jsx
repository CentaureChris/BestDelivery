import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import MapView from "../components/MapView";

const fakeTour = {
  id: 1,
  date: "2025-07-21",
  addresses: [
    { id: 1, text: "12 Rue du Pont, Paris" },
    { id: 2, text: "45 Av. Jean Jaurès" },
  ],
  itinerary: null, // à calculer via API
};

const TourDetail = () => {
  const [tour] = useState(fakeTour);
  const handleOptimize = () => {
    // TODO: Call backend to optimize
    alert("Optimiser l'itinéraire");
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main>
        <TopBar />
        <h2>Tournée du {new Date(tour.date).toLocaleDateString()}</h2>
        <MapView addresses={tour.addresses} itinerary={tour.itinerary} onOptimize={handleOptimize} />
        <h3>Adresses</h3>
        <ul>
          {tour.addresses.map(addr => <li key={addr.id}>{addr.text}</li>)}
        </ul>
        {/* Export/Partager/etc... */}
      </main>
    </div>
  );
};

export default TourDetail;