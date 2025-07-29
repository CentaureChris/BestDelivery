import React, { useState } from "react";
import { type Address } from "../types/index";
import AddressList from "./AddressList";

type Props = {
  onSubmit: (addresses: Address[]) => void;
};

const RoundForm: React.FC<Props> = ({ onSubmit }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressInput, setAddressInput] = useState("");

  const addAddress = () => {
    if (addressInput.trim()) {
      setAddresses([
        ...addresses,
        { id: Date.now(), text: addressInput, order: addresses.length + 1 }
      ]);
      setAddressInput("");
    }
  };

  const deleteAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  return (
    <div>
      <div className="flex mb-4">
        <input
          type="text"
          value={addressInput}
          onChange={e => setAddressInput(e.target.value)}
          placeholder="Enter address"
          className="border p-2 flex-1"
        />
        <button onClick={addAddress} className="ml-2 btn">Add</button>
      </div>
      <AddressList addresses={addresses} onDelete={deleteAddress} />
      <button
        className="mt-4 btn"
        onClick={() => onSubmit(addresses)}
        disabled={addresses.length === 0}
      >
        Validate addresses
      </button>
    </div>
  );
};

export default RoundForm;