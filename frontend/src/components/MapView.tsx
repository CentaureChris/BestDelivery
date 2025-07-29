import React from "react";
import { type Address } from "../types/index";;

type Props = { addresses: Address[] };

const MapView: React.FC<Props> = ({ addresses }) => (
  <div className="h-64 bg-gray-200 flex items-center justify-center">
    {/* Integrate real map later */}
    <span>Map will display {addresses.length} addresses here.</span>
  </div>
);

export default MapView;