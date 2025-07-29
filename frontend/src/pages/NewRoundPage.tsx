import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RoundForm from "../components/RoundForm";
import { useNavigate } from "react-router-dom";
import type { Address } from "../types/index";
import commonStyles from '../assets/css/CommonStyles.module.css';

const NewRoundPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (addresses: Address[]) => {
    // POST to backend, then redirect to optimize page
    // For now, simulate and redirect:
    navigate("/round/123/optimize");
  };

  return (
    <div className={commonStyles.layout}>
    <Sidebar />
    <div className={commonStyles.mainContent}>
      <Navbar />
      <main className={commonStyles.main}>
        <h2 className={commonStyles.heading}>Create New Round</h2>
        <RoundForm onSubmit={handleSubmit} />
      </main>
    </div>
  </div>
  );
};

export default NewRoundPage;

  