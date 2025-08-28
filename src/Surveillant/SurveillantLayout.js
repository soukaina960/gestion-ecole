import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './SurveillantLayout.css';
import axios from 'axios';
import { 
  FaBell , FaChevronDown,FaChevronUp, FaUsers, FaChalkboardTeacher,
  FaMoneyBill, FaChartBar, FaMoon, FaSun,
  FaUserGraduate, FaSearch, FaSignOutAlt, FaBook
} from "react-icons/fa";
import { ChevronDown } from 'lucide-react';

import Absence from "./Absence";
import BulletinForm from "./Bulletin";
import Incident from "./Incident";
import Retard from "./Retard";
import AbsenceSanctionTable from "./ListAbsence";
import ListeIncidents from "./ListIncident";
import ListeRetards from "./ListRetard";
import SurveillantReclamationList from "./ListReclamations";
import SurveillantDashboard from "./SurveillantDashboard";
import SurveillantProfile from "./SurveillantProfile";

const SurveillantLayout = () => {
  const [surveillant, setSurveillant] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const absencesRef = useRef();
  const retardsRef = useRef();
  const incidentsRef = useRef();

  const surveillantId = localStorage.getItem('surveillant_id');
  const [unreadReclamations, setUnreadReclamations] = useState(0); 
  const [showReclamations, setShowReclamations] = useState(false);
  const [reclamations, setReclamations] = useState([]);

// Nombre de réclamations non traitées
const fetchReclamations = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/reclamations/attente');
    setReclamations(response.data); // Stocker les réclamations dans l'état
    setUnreadReclamations(response.data.length); // Mettre à jour le nombre de réclamations non lues
  } catch (error) {
    console.error('Erreur de chargement :', error.response?.data || error.message);
  }
};

  
  const handleBellClick = () => {
    setShowReclamations(!showReclamations); // Toggle la visibilité de la liste des réclamations
    fetchReclamations(); // Charger les réclamations non lues
  };
  
  
  
  

  useEffect(() => {
    const fetchSurveillantData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/surveillants/${surveillantId}`);
        setSurveillant(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données du surveillant", error);
      }
    };
    fetchSurveillantData();
  }, [surveillantId]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const handleMenuItemClick = (page) => {
    setActivePage(page);
    setOpen(null);
  };

  const toggleDropdown = (dropdownName) => {
    setOpen(open === dropdownName ? null : dropdownName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        absencesRef.current && !absencesRef.current.contains(event.target) &&
        retardsRef.current && !retardsRef.current.contains(event.target) &&
        incidentsRef.current && !incidentsRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const renderContent = () => {
    switch (activePage) {
      case "dashboard": return <SurveillantDashboard />;
      case "surv-profile": return <SurveillantProfile />;
      case "surv-reclamation-list": return <SurveillantReclamationList />;
      case "surv-incidents": return <Incident />;
      case "surv-retards": return <Retard />;
      case "surv-absence-list": return <AbsenceSanctionTable />;
      case "surv-retard-list": return <ListeRetards />;
      case "surv-incidents-list": return <ListeIncidents />;
      case "surv-absences": return <Absence />;
      case "surv-bulletin": return <BulletinForm />;
      default: return <SurveillantDashboard />;
    }
  };

  return (
    <div className={`surveillant-layout ${darkMode ? 'dark' : ''}`}>
      <nav className="top-nav">
        <div className="nav-left">
          <div className="d-flex flex-column align-items-start">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white' }}>Skolyx</span>
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                color: '#1e1e1e',
                padding: '5px 12px',
                borderRadius: '5px',
                fontWeight: '700',
                fontSize: '1rem'
              }}>
                Surveillant
              </span>
            </div>
          </div>
        </div>

        <div className="nav-center">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="nav-right">
          {/* Icône de notification */}
          {/* <div className="notification-container">
            <FaBell className="notification-icon" />
            {unreadReclamations > 0 && (
              <span className="notification-badge">{unreadReclamations}</span>
            )}
          </div> */}
{/* Icône de notification */}
<div className="notification-container" style={{ position: 'relative' }}>
  <button className="logout-btn mb-3" onClick={handleBellClick}>
    <FaBell />
    {unreadReclamations > 0 && (
      <span className="badge bg-danger" style={{ position: 'absolute', top: 0, right: 0 }}>
        {unreadReclamations}
      </span>
    )}
  </button>

  {showReclamations && (
    <div className="reclamations-list bg-white p-3 rounded shadow" style={{ position: 'absolute', top: '100%', right: 0, zIndex: 1000, width: '300px' }}>
      <h5 className="mb-2">Réclamations non traitées :</h5>
      {reclamations.length === 0 ? (
        <p>Aucune réclamation en attente.</p>
      ) : (
        <ul className="list-unstyled">
          {reclamations.map((reclamation, index) => (
            <li key={index} className="mb-2 border-bottom pb-2">
              <strong>{reclamation.titre || `Réclamation #${index + 1}`}</strong>
              <br />
              <small>Message : {reclamation.message}</small><br />
              <small>De : {reclamation.parent?.nom} {reclamation.parent?.prenom}</small><br />
              <small>Statut : {reclamation.statut}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  )}
</div>




          <button onClick={toggleDarkMode} className="theme-toggle mb-3">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button className="logout-btn mb-3" onClick={handleLogout}>
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <button
            className={`sidebar-button ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => setActivePage("dashboard")}
          >
            <FaChartBar className="sidebar-icon" />
            <span>Dashboard</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "surv-profile" ? "active" : ""}`}
            onClick={() => setActivePage("surv-profile")}
          >
            <FaUsers className="sidebar-icon" />
            <span>Mon Profil</span>
          </button>

          {/* Absences */}
          <div className="dropdown-container">
              
                <button
                  className={`sidebar-button ${open === "absences" ? "active" : ""}`}
                  onClick={() => toggleDropdown("absences")}
                >
                  <FaChalkboardTeacher className="sidebar-icon" />
                  <span>Gestion des Absences</span>
                  <ChevronDown className={`dropdown-arrow ${open === "absences" ? "rotate" : ""}`} />
                </button>
                {open === "absences" && (
                  <div className="dropdown-menu show w-100">
                    <button
                      className={`dropdown-item ${activePage === "surv-absences" ? "active" : ""}`}
                      onClick={() => handleMenuItemClick("surv-absences")}
                    >
                      <FaBook style={{ marginRight: "8px" }} />
                      Ajouter une absence
                    </button>
                    <button
                      className={`dropdown-item ${activePage === "surv-absence-list" ? "active" : ""}`}
                      onClick={() => handleMenuItemClick("surv-absence-list")}
                    >
                      <FaBook style={{ marginRight: "8px" }} />
                      Liste des absences
                    </button>
                  </div>
                )}
              
            </div>


          {/* Retards */}
          <div className="dropdown-container" >
            
              <button
                className={`sidebar-button ${open === "retards" ? "active" : ""}`}
                onClick={() => toggleDropdown("retards")}
              >
                <FaChalkboardTeacher className="sidebar-icon" />
                <span>Gestion des Retards</span>
                <ChevronDown className={`dropdown-arrow ${open === "retards" ? "rotate" : ""}`} />
              </button>
              {open === "retards" && (
                <div className="dropdown-menu w-100">
                  <button
                    className={`dropdown-item ${activePage === "surv-retards" ? "active" : ""}`}
                    onClick={() => handleMenuItemClick("surv-retards")}
                  >
                    <FaBook style={{ marginRight: "8px" }} />
                    Ajouter un retard
                  </button>
                  <button
                    className={`dropdown-item ${activePage === "surv-retard-list" ? "active" : ""}`}
                    onClick={() => handleMenuItemClick("surv-retard-list")}
                  >
                    <FaBook style={{ marginRight: "8px" }} />
                    Liste des retards
                  </button>
                </div>
              )}
            
          </div>


          {/* Incidents */}
          <div className="dropdown-container" >
              <button 
                              className={`sidebar-button ${activePage === "dropdown" ? "active" : ""}`}
                              onClick={() => setActivePage(activePage === "dropdown" ? "" : "dropdown")}
                              >
                <FaChalkboardTeacher className="sidebar-icon" />
                <span>Gestion des Incidents</span>
                <ChevronDown className={`dropdown-arrow ${activePage === "dropdown" ? "rotate" : ""}`} />
              </button>
              {activePage === "dropdown" && (
                <div className="dropdown-menu w-100">
                  <button
                    className={`sidebar-button ${activePage === "surv-incidents" ? "active" : ""}`}
                    onClick={() => setActivePage("surv-incidents")}
                  >
                    <FaBook style={{ marginRight: "8px" }} />
                    Ajouter un incident
                  </button>
                  <button
                    className={`sidebar-button ${activePage === "surv-incidents-list" ? "active" : ""}`}
                    onClick={() => setActivePage("surv-incidents-list")}
                  >
                    <FaBook style={{ marginRight: "8px" }} />
                    Liste des incidents
                  </button>
                </div>
              )}
             
          </div>

          <button
            className={`sidebar-button ${activePage === "surv-reclamation-list" ? "active" : ""}`}
            onClick={() => setActivePage("surv-reclamation-list")}
          >
            <FaMoneyBill className="sidebar-icon" />
            <span>Liste des réclamations</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "surv-bulletin" ? "active" : ""}`}
            onClick={() => handleMenuItemClick("surv-bulletin")}
          >
            <FaUserGraduate className="sidebar-icon" />
            <span>Gestion des bulletins</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SurveillantLayout;
