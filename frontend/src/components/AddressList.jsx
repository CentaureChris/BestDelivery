import React from "react";

const AddressList = ({ addresses, onRemove }) => (
  <ul>
    {addresses.map(addr => (
      <li key={addr.id}>
        {addr.text}
        <button onClick={() => onRemove(addr.id)}>🗑️</button>
      </li>
    ))}
  </ul>
);

export default AddressList;
