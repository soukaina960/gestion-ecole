import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './ParentLayout.css';
import axios from 'axios';
import { 
  FaChevronDown, FaChevronUp, FaUsers, FaChalkboardTeacher, 
  FaMoneyBill, FaChartBar, FaCog, FaMoon, FaSun, 
  FaUserGraduate, FaUserTie, FaMoneyCheckAlt, FaGlobe,
  FaSearch, FaSignOutAlt, FaBook 
} from "react-icons/fa";
import { Link } from 'react-router-dom';

import { ChevronDown } from 'lucide-react';
import ParentDashboard from "./ParentDashboard";
import ParentProfile from "./ParentProfile";
import ParentReclamationForm from "./ParentReclamation";
import Incidents from "./Incident";
import Retards from "./Retards";
import EventDashboard from "./EventDashboard";
import Absences from "./Absences";
import NotesDashboard from './Notes';
import ParentPayment from "./ParentPayment";
import ReclamationList from "./ParentReclamationList";

const ParentLayout = () => {
  const [parent, setParent] = useState(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const parentId = localStorage.getItem('parent_id');

  useEffect(() => {
    const fetchParentData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/parents/${parentId}`);
        setParent(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données du parent", error);
      }
    };
    fetchParentData();
  }, [parentId]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);
  useEffect(() => {
    const storedMode = localStorage.getItem('darkMode');
    if (storedMode) {
      setDarkMode(storedMode === 'true');
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);
  
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard": return <ParentDashboard />;
      case "parent-profile": return <ParentProfile />;
      case "reclamation": return <ParentReclamationForm />;
      case "parent-reclamation-list": return <ReclamationList />;
      case "incidents": return <Incidents />;
      case "retards": return <Retards />;
      case "absences": return <Absences />;
      case "notes": return <NotesDashboard />;
      case "payments": return <ParentPayment />;
      case "events": return <EventDashboard />;
      default: return <ParentDashboard />;
    }
  };

  return (
    <div className={`parent-layout ${darkMode ? 'dark' : ''}`}>
      {/* Top Navbar */}
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
                Parent
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
            className={`sidebar-button ${activePage === "parent-profile" ? "active" : ""}`}
            onClick={() => setActivePage("parent-profile")}
          >
            <FaUsers className="sidebar-icon" />
            <span>Mon Profil</span>
          </button>

          {/* Dropdown Gestion des Réclamations */}
          <div className="dropdown-container" ref={dropdownRef}>
            <button
              className="sidebar-button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaChalkboardTeacher className="sidebar-icon" />
              <span>Gestion des Réclamations</span>
              <ChevronDown className={`dropdown-arrow ${dropdownOpen ? "rotate" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <button 
                  className={`sidebar-button ${activePage === "reclamation" ? "active" : ""}`}
                  onClick={() => setActivePage("reclamation")}
                >
                  <FaBook style={{ marginRight: "8px" }} />
                  Ajouter une réclamation
                </button>
                <button 
                  className={`sidebar-button ${activePage === "parent-reclamation-list" ? "active" : ""}`}
                  onClick={() => setActivePage("parent-reclamation-list")}
                >
                  <FaBook style={{ marginRight: "8px" }} />
                  Liste des réclamations
                </button>
              </div>
            )}
          </div>

          <button
            className={`sidebar-button ${activePage === "incidents" ? "active" : ""}`}
            onClick={() => setActivePage("incidents")}
          >
            <FaMoneyBill className="sidebar-icon" />
            <span>Incidents</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "retards" ? "active" : ""}`}
            onClick={() => setActivePage("retards")}
          >
            <FaUserGraduate className="sidebar-icon" />
            <span>Retards</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "absences" ? "active" : ""}`}
            onClick={() => setActivePage("absences")}
          >
            <FaUserTie className="sidebar-icon" />
            <span>Absences</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "notes" ? "active" : ""}`}
            onClick={() => setActivePage("notes")}
          >
            <FaBook className="sidebar-icon" />
            <span>Notes</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "payments" ? "active" : ""}`}
            onClick={() => setActivePage("payments")}
          >
            <FaMoneyCheckAlt className="sidebar-icon" />
            <span>Paiement</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "events" ? "active" : ""}`}
            onClick={() => setActivePage("events")}
          >
            <FaGlobe className="sidebar-icon" />
            <span>Événements</span>
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

export default ParentLayout;
