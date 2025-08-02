import React from "react";
import type { Round } from "../types/index";
import { Link } from "react-router-dom";

type Props = { rounds: Round[] };

const RoundList: React.FC<Props> = ({ rounds }) => (
  // <ul>
  //   {rounds.map(r => (
  //     <li key={r.id} className="flex justify-between py-2">
  //       <span>{r.date} ({r.itinerary.length} addresses)</span>
  //       <Link to={`/round/${r.id}`} className="text-blue-600">Details &gt;</Link>
  //     </li>
  //   ))}
  // </ul>
   <ul>
    {rounds.map(r => {
      // Try to parse itinerary if it's a string
      let steps: string[] = [];
      if (r.itinerary) {
        try {
          const parsed = typeof r.itinerary === "string"
            ? JSON.parse(r.itinerary)
            : r.itinerary;
          steps = parsed.steps || [];
        } catch (e) {
          steps = [];
        }
      }
      return (
        <li key={r.id} className="flex flex-col py-2 border-b">
          <div className="flex justify-between items-center">
            <span>{r.date} ({steps?.length ?? 0} etapes)</span>
            <br/>
            <Link to={`/round/${r.id}/optimize`} className="text-blue-600">Voir sur la carte</Link>
          </div>
          {steps.length > 0 && (
            <ul style={{ marginTop: 6, paddingLeft: 18 }}>
              {steps.map((step, i) => (
                <li key={i} style={{ fontSize: ".95rem", color: "#4b5563" }}>
                  {step}
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    })}
  </ul>
);

export default RoundList;