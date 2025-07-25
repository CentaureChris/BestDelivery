import React from "react";
import { Link } from "react-router-dom";

const TourList = ({ tours }) => (
  <div>
    <h2>Mes tournées récentes</h2>
    <ul>
      {tours.map(tour => (
        <li key={tour.id}>
          <Link to={`/tours/${tour.id}`}>
            {new Date(tour.date).toLocaleDateString()} ({tour.addresses.length} adresses)
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default TourList;