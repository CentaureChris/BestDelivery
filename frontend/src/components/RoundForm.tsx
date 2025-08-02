import React, { useState } from "react";
import { type Address } from "../types/index";
import AddressList from "./AddressList";
import styles from "../assets/css/RoundForm.module.css"

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
    <div className={styles.formGroup} >
      <div className="flex mb-4">
        <input  type="text" value={addressInput} onChange={e => setAddressInput(e.target.value)} placeholder="Entrer l'adresse" className={styles.input}/>
        <button onClick={addAddress} className={styles.addBtn}>Ajouter</button>
      </div>
      <AddressList addresses={addresses} onDelete={deleteAddress} />
      <button className={styles.validateBtn} onClick={() => onSubmit(addresses)} disabled={addresses.length === 0}>
        Valider l'adresse
      </button>
    </div>
  );
};

export default RoundForm;