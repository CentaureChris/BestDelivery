import React from "react";
import { type Address } from "../types/index";

type Props = {
  addresses: Address[];
  onDelete: (id: number) => void;
};

const AddressList: React.FC<Props> = ({ addresses, onDelete }) => (
  <ul className="divide-y">
    {addresses.map(addr => (
      <li key={addr.id} className="flex justify-between py-2">
        <span>{addr.text}</span>
        <button onClick={() => onDelete(addr.id)} className="text-red-500">🗑️</button>
      </li>
    ))}
  </ul>
);

export default AddressList;