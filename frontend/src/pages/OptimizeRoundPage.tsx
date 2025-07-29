import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MapView from "../components/MapView";
import { type Address } from "../types/index";;

// Dummy addresses
const addresses: Address[] = [
  { id: 1, text: "12 Rue du Pont, Paris", order: 1 },
  { id: 2, text: "45 Av. Jean Jaurès", order: 2 }
];

const OptimizeRoundPage: React.FC = () => (
  <div className="h-screen flex flex-col">
    <Navbar />
    <div className="flex flex-1">
      <Sidebar />
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

export default OptimizeRoundPage;