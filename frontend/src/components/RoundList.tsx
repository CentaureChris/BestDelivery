import React from "react";
import type { Round } from "../types/index";
import { Link } from "react-router-dom";

type Props = { rounds: Round[] };

const RoundList: React.FC<Props> = ({ rounds }) => (
  <ul>
    {rounds.map(r => (
      <li key={r.id} className="flex justify-between py-2">
        <span>{r.date} ({r.addresses.length} addresses)</span>
        <Link to={`/round/${r.id}`} className="text-blue-600">Details &gt;</Link>
      </li>
    ))}
  </ul>
);

export default RoundList;