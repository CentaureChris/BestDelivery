import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import TourList from "../components/TourList";
// import { getTours } from "../api/api"; // à implémenter

const fakeTours = [
  { id: 1, date: "2025-07-21", addresses: [{}, {}, {}] },
  { id: 2, date: "2025-07-12", addresses: [{}, {}] },
];

const Dashboard = () => {
  // const [tours, setTours] = useState([]);
  // useEffect(() => { getTours().then(setTours); }, []);
  const [tours] = useState(fakeTours);

  return (
    <div className="app-layout">
      <Sidebar />
      <main>
        <TopBar />
        <TourList tours={tours} />
      </main>
    </div>
  );
};

export default Dashboard;