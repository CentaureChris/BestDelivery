import React, {useState} from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RoundForm from "../components/RoundForm";
// import { useNavigate } from "react-router-dom";
// import type { Address } from "../types/index";
import commonStyles from "../assets/css/CommonStyles.module.css";

const NewRoundPage: React.FC = () => {
const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={commonStyles.layout}>
      <div
        className={`${commonStyles.sidebarWrap} ${
          sidebarOpen ? commonStyles.open : commonStyles.closed
        }`}
        aria-hidden={!sidebarOpen}
      >
        <Sidebar />
      </div>
      <div className={commonStyles.mainContent}>
        <Navbar
          onToggleSidebar={() => {
            console.log("[Page] toggling sidebar");
            setSidebarOpen(prev => !prev);
          }}
        />
          <main className={commonStyles.main}>
            <h2 className={commonStyles.heading}>Créer une nouvelle tournée</h2>
            <RoundForm />
          </main>
        </div>
      </div>
  );
};

export default NewRoundPage;
