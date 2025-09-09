import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './ParentLayout.css';
import axios from 'axios';
import { 
  FaUsers, FaChalkboardTeacher, FaBars, FaTimes,
  FaMoneyBill, FaChartBar, FaMoon, FaSun, 
  FaUserGraduate, FaUserTie, FaMoneyCheckAlt, FaGlobe,
  FaSearch, FaSignOutAlt, FaBook 
} from "react-icons/fa";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  
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

  // Handle click outside dropdowns and sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if clicked outside
      if (dropdownOpen && dropdownRef.current && 
          !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      
      // Close sidebar if clicked outside (on mobile)
      if (sidebarOpen && window.innerWidth < 992 && 
          sidebarRef.current && !sidebarRef.current.contains(event.target) &&
          hamburgerRef.current && !hamburgerRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen, sidebarOpen]);

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('parent_id');
    window.location.href = '/login';
  };

  const handleMenuItemClick = (page) => {
    setActivePage(page);
    setDropdownOpen(false);
    // Close sidebar on mobile after selecting a menu item
    if (window.innerWidth < 992) {
      setSidebarOpen(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
      <span className="role-badge">Parent</span>
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
    <button onClick={toggleDarkMode} className="theme-toggle">
      {darkMode ? <FaSun /> : <FaMoon />}
    </button>

    <button className="logout-btn" onClick={handleLogout}>
      <FaSignOutAlt />
    </button>
  </div>
</nav>

      {/* Main Layout */}
      <div className="main-content">
        {/* Sidebar */}
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
            className={`sidebar-button ${activePage === "parent-profile" ? "active" : ""}`}
            onClick={() => handleMenuItemClick("parent-profile")}
          >
            <FaUsers className="sidebar-icon" />
            <span>Mon Profil</span>
          </button>

          {/* Dropdown Gestion des Réclamations */}
          <div className="dropdown-container" ref={dropdownRef}>
            <button
              className={`sidebar-button ${dropdownOpen ? "active" : ""}`}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <FaChalkboardTeacher className="sidebar-icon" />
              <span>Gestion des Réclamations</span>
              <ChevronDown className={`dropdown-arrow ${dropdownOpen ? "rotate" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <button 
                  className={`dropdown-item ${activePage === "reclamation" ? "active" : ""}`}
                  onClick={() => handleMenuItemClick("reclamation")}
                >
                  <FaBook className="dropdown-icon" />
                  Ajouter une réclamation
                </button>
                <button 
                  className={`dropdown-item ${activePage === "parent-reclamation-list" ? "active" : ""}`}
                  onClick={() => handleMenuItemClick("parent-reclamation-list")}
                >
                  <FaBook className="dropdown-icon" />
                  Liste des réclamations
                </button>
              </div>
            )}
          </div>

          <button
            className={`sidebar-button ${activePage === "incidents" ? "active" : ""}`}
            onClick={() => handleMenuItemClick("incidents")}
          >
            <FaMoneyBill className="sidebar-icon" />
            <span>Incidents</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "retards" ? "active" : ""}`}
            onClick={() => handleMenuItemClick("retards")}
          >
            <FaUserGraduate className="sidebar-icon" />
            <span>Retards</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "absences" ? "active" : ""}`}
            onClick={() => handleMenuItemClick("absences")}
          >
            <FaUserTie className="sidebar-icon" />
            <span>Absences</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "notes" ? "active" : ""}`}
            onClick={() => handleMenuItemClick("notes")}
          >
            <FaBook className="sidebar-icon" />
            <span>Notes</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "payments" ? "active" : ""}`}
            onClick={() => handleMenuItemClick("payments")}
          >
            <FaMoneyCheckAlt className="sidebar-icon" />
            <span>Paiement</span>
          </button>

          <button
            className={`sidebar-button ${activePage === "events" ? "active" : ""}`}
            onClick={() => handleMenuItemClick("events")}
          >
            <FaGlobe className="sidebar-icon" />
            <span>Événements</span>
          </button>
        </div>

        {/* Overlay for mobile sidebar */}
{sidebarOpen && window.innerWidth < 992 && (
  <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
)}


        {/* Content Area */}
        <div className="content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ParentLayout;