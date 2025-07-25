import React from "react";

const MapView = ({ addresses, itinerary, onOptimize }) => (
  <div style={{ minHeight: "300px", border: "1px solid #eee", margin: "1em 0" }}>
    {/* TODO: Integrate Leaflet or Mapbox */}
    <p>Carte interactive ici</p>
    <button onClick={onOptimize}>Optimiser l'itinéraire</button>
    {/* Itinéraire et étapes à afficher */}
  </div>
);

export default MapView;