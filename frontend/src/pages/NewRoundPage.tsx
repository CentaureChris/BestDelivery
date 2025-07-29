import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RoundForm from "../components/RoundForm";
import { useNavigate } from "react-router-dom";
import type { Address } from "../types/index";
import styles from '../assets/css/NewRoundPage.module.css';

const NewRoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (addresses: Address[]) => {
    // POST to backend, then redirect to optimize page
    // For now, simulate and redirect:
    navigate("/round/123/optimize");
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8">
          <h2 className="text-xl font-semibold mb-4">Create New Round</h2>
          <RoundForm onSubmit={handleSubmit} />
        </main>
      </div>
    </div>
  );
};

export default NewRoundPage;