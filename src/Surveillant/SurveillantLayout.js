import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './SurveillantLayout.css';
import axios from 'axios';
import { 
  FaBell, FaUsers, FaChalkboardTeacher, FaBars, FaTimes,
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
  const [openDropdown, setOpenDropdown] = useState(null);
  const [unreadReclamations, setUnreadReclamations] = useState(0); 
  const [showReclamations, setShowReclamations] = useState(false);
  const [reclamations, setReclamations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const dropdownRefs = {
    absences: useRef(null),
    retards: useRef(null),
    incidents: useRef(null),
    notifications: useRef(null)
  };
  
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const overlayRef = useRef(null);
  
  const surveillantId = localStorage.getItem('surveillant_id');

  // Fetch surveillant data
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

  // Fetch reclamations
  const fetchReclamations = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reclamations/attente');
      setReclamations(response.data);
      setUnreadReclamations(response.data.length);
    } catch (error) {
      console.error('Erreur de chargement :', error.response?.data || error.message);
    }
  };

  // Handle click outside dropdowns and sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdowns if clicked outside
      if (openDropdown && dropdownRefs[openDropdown].current && 
          !dropdownRefs[openDropdown].current.contains(event.target)) {
        setOpenDropdown(null);
      }
      
      // Close notifications if clicked outside
      if (showReclamations && dropdownRefs.notifications.current && 
          !dropdownRefs.notifications.current.contains(event.target)) {
        setShowReclamations(false);
      }
      
      // Close sidebar if clicked outside (on mobile)
      if (sidebarOpen && window.innerWidth < 992 && 
          sidebarRef.current && !sidebarRef.current.contains(event.target) &&
          hamburgerRef.current && !hamburgerRef.current.contains(event.target) &&
          overlayRef.current && overlayRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown, showReclamations, sidebarOpen]);

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('surveillant_id');
    window.location.href = '/login';
  };

  const handleMenuItemClick = (page) => {
    setActivePage(page);
    setOpenDropdown(null);
    // Close sidebar on mobile after selecting a menu item
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleBellClick = () => {
    if (!showReclamations) {
      fetchReclamations();
    }
    setShowReclamations(!showReclamations);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleOverlayClick = (e) => {
    // Only close sidebar if clicking directly on overlay (not on sidebar)
    if (e.target === overlayRef.current) {
      setSidebarOpen(false);
    }
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
          <button 
            ref={hamburgerRef}
            className="hamburger-btn" 
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className="brand-container">
            <span className="brand-name">Skolyx</span>
            <span className="role-badge">
              Surveillant
            </span>
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
          {/* Notification Bell with Dropdown */}
          <div className="notification-container" ref={dropdownRefs.notifications}>
            <button className="icon-btn" onClick={handleBellClick}>
              <FaBell />
              {unreadReclamations > 0 && (
                <span className="notification-badge">{unreadReclamations}</span>
              )}
            </button>

            {showReclamations && (
              <div className="reclamations-dropdown">
                <h5>Réclamations non traitées :</h5>
                {reclamations.length === 0 ? (
                  <p>Aucune réclamation en attente.</p>
                ) : (
                  <ul className="reclamations-list">
                    {reclamations.map((reclamation, index) => (
                      <li key={index} className="reclamation-item">
                        <strong>{reclamation.titre || `Réclamation #${index + 1}`}</strong>
                        <div className="reclamation-details">
                          <span>Message : {reclamation.message}</span>
                          <span>De : {reclamation.parent?.nom} {reclamation.parent?.prenom}</span>
                          <span>Statut : {reclamation.statut}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <button onClick={toggleDarkMode} className="icon-btn">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button className="icon-btn" onClick={handleLogout}>
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="main-content">
        {/* Sidebar with toggle functionality */}
        <div 
          ref={sidebarRef}
          className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
        >
          <button
            className={`sidebar-button ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => handleMenuItemClick("dashboard")}
          >
            <FaChartBar className="sidebar-icon" />
            <span>Dashboard</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "surv-profile" ? "active" : ""}`}
            onClick={() => handleMenuItemClick("surv-profile")}
          >
            <FaUsers className="sidebar-icon" />
            <span>Mon Profil</span>
          </button>

          {/* Absences Dropdown */}
          <div className="dropdown-container" ref={dropdownRefs.absences}>
            <button
              className={`sidebar-button ${openDropdown === "absences" ? "active" : ""}`}
              onClick={() => toggleDropdown("absences")}
            >
              <FaChalkboardTeacher className="sidebar-icon" />
              <span>Gestion des Absences</span>
              <ChevronDown className={`dropdown-arrow ${openDropdown === "absences" ? "rotate" : ""}`} />
            </button>
            {openDropdown === "absences" && (
              <div className="dropdown-menu show">
                <button
                  className={`dropdown-item ${activePage === "surv-absences" ? "active" : ""}`}
                  onClick={() => handleMenuItemClick("surv-absences")}
                >
                  <FaBook className="dropdown-icon" />
                  Ajouter une absence
                </button>
                <button
                  className={`dropdown-item ${activePage === "surv-absence-list" ? "active" : ""}`}
                  onClick={() => handleMenuItemClick("surv-absence-list")}
                >
                  <FaBook className="dropdown-icon" />
                  Liste des absences
                </button>
              </div>
            )}
          </div>

          {/* Retards Dropdown */}
          <div className="dropdown-container" ref={dropdownRefs.retards}>
            <button
              className={`sidebar-button ${openDropdown === "retards" ? "active" : ""}`}
              onClick={() => toggleDropdown("retards")}
            >
              <FaChalkboardTeacher className="sidebar-icon" />
              <span>Gestion des Retards</span>
              <ChevronDown className={`dropdown-arrow ${openDropdown === "retards" ? "rotate" : ""}`} />
            </button>
            {openDropdown === "retards" && (
              <div className="dropdown-menu">
                <button
                  className={`dropdown-item ${activePage === "surv-retards" ? "active" : ""}`}
                  onClick={() => handleMenuItemClick("surv-retards")}
                >
                  <FaBook className="dropdown-icon" />
                  Ajouter un retard
                </button>
                <button
                  className={`dropdown-item ${activePage === "surv-retard-list" ? "active" : ""}`}
                  onClick={() => handleMenuItemClick("surv-retard-list")}
                >
                  <FaBook className="dropdown-icon" />
                  Liste des retards
                </button>
              </div>
            )}
          </div>

          {/* Incidents Dropdown */}
          <div className="dropdown-container" ref={dropdownRefs.incidents}>
            <button
              className={`sidebar-button ${openDropdown === "incidents" ? "active" : ""}`}
              onClick={() => toggleDropdown("incidents")}
            >
              <FaChalkboardTeacher className="sidebar-icon" />
              <span>Gestion des Incidents</span>
              <ChevronDown className={`dropdown-arrow ${openDropdown === "incidents" ? "rotate" : ""}`} />
            </button>
            {openDropdown === "incidents" && (
              <div className="dropdown-menu">
                <button
                  className={`dropdown-item ${activePage === "surv-incidents" ? "active" : ""}`}
                  onClick={() => handleMenuItemClick("surv-incidents")}
                >
                  <FaBook className="dropdown-icon" />
                  Ajouter un incident
                </button>
                <button
                  className={`dropdown-item ${activePage === "surv-incidents-list" ? "active" : ""}`}
                  onClick={() => handleMenuItemClick("surv-incidents-list")}
                >
                  <FaBook className="dropdown-icon" />
                  Liste des incidents
                </button>
              </div>
            )}
          </div>

          <button
            className={`sidebar-button ${activePage === "surv-reclamation-list" ? "active" : ""}`}
            onClick={() => handleMenuItemClick("surv-reclamation-list")}
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

        {/* Overlay for mobile sidebar - only visible when sidebar is open on mobile */}
        {sidebarOpen && (
          <div 
            ref={overlayRef}
            className="sidebar-overlay"
            onClick={handleOverlayClick}
          />
        )}

        {/* Content Area */}
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SurveillantLayout;