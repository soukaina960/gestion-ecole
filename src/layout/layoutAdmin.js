import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import './layoutAdmin.css';
import axios from 'axios';
import { 
  FaChevronDown, FaChevronUp, FaUsers, FaChalkboardTeacher, 
  FaMoneyBill, FaChartBar, FaCog, FaMoon, FaSun, 
  FaUserGraduate, FaUserTie, FaMoneyCheckAlt, FaGlobe,
  FaSearch, FaSignOutAlt, FaBook 
} from "react-icons/fa";
import { Link } from 'react-router-dom';

// import { ChevronDown } from 'lucide-react'; 
// import { Wallet, ArrowDownCircle, Coins } from 'lucide-react';

import { ChevronDown, CalendarDays, Wallet, PlusCircle, Settings } from 'lucide-react';
import { MdSchool } from "react-icons/md";

// Import des composants
import FiliereManager from "../components/FiliereManager";

import UtilisateurForm from "../components/UtilisateurList";
import ClassroomList from "../components/ClassroomList";
import StudentList from "../components/Student";
import ProfesseurList from "../components/prof";
import EmploiTemps from "../components/EmploiTemps";
import Dashboard from "../components/Dashboard";
import ChargeForm from "../components/charge";
import CalculSalaireProfesseur from "../components/CalculSalaire";

import GenererEmploiTemps from "../components/EmploiTemps"; // Pour la génération de l'emploi du temps
import EmploiTempsForm from "../components/EmploiTempsForm"; // Pour la gestion des emplois du temps
import CreneauList from "../components/crenau"; // Pour la gestion des créneaux
// import { CalendarDays, PlusCircle, Settings } from 'lucide-react';
import DemandeAttestationList from "../components/DemandeAttestationList"; // Pour la gestion des demandes d'attestation
import ConfigAttestationForm from '../components/ConfigAttestationForm'; // Pour la configuration de l'attestation
import EmploiTempsParProf from '../components/emploiprof'; // Pour l'emploi du temps des professeurs
import Evenements from '../components/evenementGestion'; // Pour la gestion des événements


import DemandeAttestationList from "../components/DemandeAttestationList";
import ConfigAttestationForm from '../components/ConfigAttestationForm';
import EmploiTempsParProf from '../components/emploiparprof';
import Evenements from '../components/evenementGestion';
import MatiereManager from "../components/matiere";
import GenererEmploiTemps from "../components/EmploiTemps";
import EmploiTempsForm from "../components/EmploiTempsForm";
import CreneauList from "../components/crenau";
import DiagrammeLigneRestes from '../components/ComparaisonRestesParMois';


const AdminLayout = () => {
  const [activePage, setActivePage] = useState("reports");
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [language, setLanguage] = useState("fr");
  const [open, setOpen] = useState(false);
  const [nbAbsentsCritiques, setNbAbsentsCritiques] = useState(0);
  const [nbRetardsPaiement, setNbRetardsPaiement] = useState(0);
  const [showRetardsModal, setShowRetardsModal] = useState(false);
  const [etudiantsEnRetard, setEtudiantsEnRetard] = useState([]);
  const dropdownRef = useRef(null);
  const handleLogout = () => {
    // Supprimer le token ou les infos de session
    localStorage.removeItem('authToken');
    // Rediriger vers la page de login
    window.location.href = '/login';
  };
  const handleMenuItemClick = (page) => {
    setActivePage(page);
    setOpen(false);
  };
 
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const fetchRetardsPaiement = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/retards-paiement');
        setNbRetardsPaiement(response.data.count);
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de retards de paiement:', error);
      }
    };
    fetchRetardsPaiement();
  }, []);

  const fetchEtudiantsEnRetard = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/etudiants/retards');
      setEtudiantsEnRetard(response.data.data);
      setShowRetardsModal(true);
    } catch (err) {
      console.error('Erreur:', err);
    } 
  };

  const envoyerNotification = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/etudiants/${id}/envoyer-notification`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      );
      
      if (response.data.success) {
        alert("Notification envoyée avec succès !");
        fetchEtudiantsEnRetard();
      } else {
        alert(response.data.message || "Échec de l'envoi de la notification");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      let errorMessage = "Erreur lors de l'envoi de la notification";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Pas de réponse du serveur";
      }
      alert(errorMessage);
    }
  };

  useEffect(() => {
    fetch("http://localhost:8000/api/absences/plus-de-15h")
      .then((res) => res.json())
      .then((data) => setNbAbsentsCritiques(data.count))
      .catch((err) => console.error("Erreur chargement absences:", err));
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
      case "users": return <UtilisateurForm searchTerm={searchTerm} />;
      case "classes": return <ClassroomList />;
      case "etudiants": return <StudentList />;
      case "profs": return <ProfesseurList />;
      case "schedule": return <EmploiTemps />;
      case "finance": return <CalculSalaireProfesseur />;
      case "reports": return <Dashboard />;
      case "settings": return <ConfigAttestationForm />;
      case "dropdown": return <ClassroomList/>;
      case "charge": return <ChargeForm />;
      case "GenererEmploiTemps": return <GenererEmploiTemps />;
      case "cree-creau": return <CreneauList />;
      case "EmploiTempsForm": return <EmploiTempsForm />;
      case "voir-emploi-prof": return <EmploiTempsParProf />;
      case "demandes": return <DemandeAttestationList />;
      case "evenements": return <Evenements />;
      case "matiere": return <MatiereManager />;
      case "filiere": return <FiliereManager />;
      case"diagramme": return <DiagrammeLigneRestes />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={`admin-layout ${darkMode ? 'dark' : ''}`}>
      {/* Top Navbar */}
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-text">Bonjour Monsieur l'Admin</span>
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

        <div className="nav-right ">
          <div className="alert-container ">
            <div className="alert alert-warning">
              <FaMoneyCheckAlt className="me-2" />
              Retards paiement: {nbRetardsPaiement}
              <button className="btn-details" onClick={fetchEtudiantsEnRetard}>
                Voir détails
              </button>
            </div>
          </div>

          <button onClick={toggleDarkMode} className="theme-toggle mb-3">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button className="logout-btn mb-3" onClick={handleLogout}>
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-menu">
          <div className="dropdown-container">
  <button
    className={`sidebar-button ${activePage === "dropdown" ? "active" : ""}`}
    onClick={() => setActivePage(activePage === "dropdown" ? "" : "dropdown")}
  >
    <FaChartBar className="sidebar-icon" />
    <span>Dashboard</span>
    <ChevronDown className={`dropdown-arrow ${activePage === "dropdown" ? "rotate" : ""}`} />
  </button>

  {activePage === "dropdown" && (
    <div className="dropdown-menu w-100">
                <button 
                  className={`sidebar-button ${activePage === "reports" ? "active" : ""}`}
                  onClick={() => setActivePage("reports")}
                >
                  Tableau de bord principal
                </button>
                <button 
                  className={`sidebar-button ${activePage === "diagramme" ? "active" : ""}`}
                  onClick={() => setActivePage("diagramme")}
                >
                  Diagramme des Restes
                </button>
              </div>
            )}
          </div>
            <button 
              className={`sidebar-button ${activePage === "users" ? "active" : ""}`}
              onClick={() => setActivePage("users")}
            >
              <FaUsers className="sidebar-icon" />
              <span>Utilisateurs</span>
            </button>

            <div className="dropdown-container">
              <button
                className={`sidebar-button ${activePage === "dropdown" ? "active" : ""}`}
                onClick={() => setActivePage(activePage === "dropdown" ? "" : "dropdown")}
              >
                <FaChalkboardTeacher className="sidebar-icon" />
                <span>Gestion des Classes</span>
                <ChevronDown className={`dropdown-arrow ${activePage === "dropdown" ? "rotate" : ""}`} />
              </button>

              {activePage === "dropdown" && (
                <div className="dropdown-menu w-100">
                  <button 
                    className={`sidebar-button ${activePage === "matiere" ? "active" : ""}`}
                    onClick={() => setActivePage("matiere")}
                  >
                    <FaBook style={{ marginRight: "8px" }} />
                    matière
                  </button>
                  <button 
                    className={`sidebar-button ${activePage === "filiere" ? "active" : ""}`}
                    onClick={() => setActivePage("filiere")}
                  >
                    <MdSchool style={{ marginRight: "8px" }} />
                    filière
                  </button>
                </div>
              )}
            </div>

            <button 
              className={`sidebar-button ${activePage === "etudiants" ? "active" : ""}`}
              onClick={() => setActivePage("etudiants")}
            >
              <FaUserGraduate className="sidebar-icon" />
              <span>Étudiants</span>
            </button>

            <button 
              className={`sidebar-button ${activePage === "profs" ? "active" : ""}`}
              onClick={() => setActivePage("profs")}
            >
              <FaUserTie className="sidebar-icon" />
              <span>Professeurs</span>
            </button>

            <button 
              className={`sidebar-button ${activePage === "demandes" ? "active" : ""}`}
              onClick={() => setActivePage("demandes")}
            >
              <FaUserGraduate className="sidebar-icon" />
              <span>Demandes d'attestation</span>
            </button>

            <div className="dropdown-container">
              <div className="dropdown" ref={dropdownRef}>
                <button
                  className={`sidebar-button ${open ? "active" : ""}`}
                  onClick={toggleDropdown}
                >
                  <CalendarDays className="sidebar-icon" />
                  <span>Emplois du temps</span>
                  {open ? <FaChevronUp className="ms-2" /> : <FaChevronDown className="ms-2" />}
                </button>

                {open && (
                  <div className="dropdown-menu show w-100">
                    <button 
                      className={`dropdown-item ${activePage === "cree-creau" ? "active" : ""}`}
                      onClick={() => handleMenuItemClick("cree-creau")}
                    >
                      Créer créneau
                    </button>
                    <button 
                      className={`dropdown-item ${activePage === "EmploiTempsForm" ? "active" : ""}`}
                      onClick={() => handleMenuItemClick("EmploiTempsForm")}
                    >
                      Créer emploi du temps
                    </button>
                    <button 
                      className={`dropdown-item ${activePage === "GenererEmploiTemps" ? "active" : ""}`}
                      onClick={() => handleMenuItemClick("GenererEmploiTemps")}
                    >
                      Emplois des classes
                    </button>
                    <button 
                      className={`dropdown-item ${activePage === "voir-emploi-prof" ? "active" : ""}`}
                      onClick={() => handleMenuItemClick("voir-emploi-prof")}
                    >
                      Emplois des professeurs
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button 
              className={`sidebar-button ${activePage === "finance" ? "active" : ""}`}
              onClick={() => setActivePage("finance")}
            >
              <FaMoneyBill className="sidebar-icon" />
              <span>Finances</span>
            </button>

            <button 
              className={`sidebar-button ${activePage === "charge" ? "active" : ""}`}
              onClick={() => setActivePage("charge")}
            >
              <Wallet className="sidebar-icon" />
              <span>Charges</span>
            </button>

            <button 
              className={`sidebar-button ${activePage === "evenements" ? "active" : ""}`}
              onClick={() => setActivePage("evenements")}
            >
              <FaGlobe className="sidebar-icon" />
              <span>Événements</span>
            </button>

            <button 
              className={`sidebar-button ${activePage === "settings" ? "active" : ""}`}
              onClick={() => setActivePage("settings")}
            >
              <FaCog className="sidebar-icon" />
              <span>Paramètres</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content " >
          {renderContent()}
        </div>
      </div>

      {/* Modal for late payments */}
      {showRetardsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Étudiants en retard de paiement</h3>
              <button onClick={() => setShowRetardsModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              {etudiantsEnRetard.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Prénom</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {etudiantsEnRetard.map((etudiant) => (
                      <tr key={etudiant.id}>
                        <td>{etudiant.nom}</td>
                        <td>{etudiant.prenom}</td>
                        <td>{etudiant.email}</td>
                        <td>
                          <button 
                            onClick={() => envoyerNotification(etudiant.id)}
                            className="btn-notify"
                          >
                            Envoyer notification au parent
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>Aucun étudiant en retard de paiement trouvé.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;