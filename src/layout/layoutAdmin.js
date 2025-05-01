import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import {
  FaUsers, FaChalkboardTeacher, FaClock, FaMoneyBill, FaChartBar,
  FaCog, FaMoon, FaSun, FaUserGraduate, FaUserTie, FaMoneyCheckAlt, FaUserSlash, FaGlobe
} from "react-icons/fa";
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react'; 
import { Wallet, ArrowDownCircle, Coins } from 'lucide-react';
import UtilisateurForm from "../components/UtilisateurList";
import logo from '../images/logo.png';
import SearchBar from "../components/SearchBar";
import ClassroomList from "../components/ClassroomList";
import StudentList from "../components/Student";
import ProfesseurList from "../components/prof";
import EmploiTemps from "../components/EmploiTemps";
import Dashboard from "../components/Dashboard";
import ChargeForm from "../components/charge"; // Pour les charges
import CalculSalaireProfesseur from "../components/CalculSalaire";
import GenererEmploiTemps from "../components/EmploiTemps"; // Pour la génération de l'emploi du temps
import EmploiTempsForm from "../components/EmploiTempsForm"; // Pour la gestion des emplois du temps
import CreneauList from "../components/crenau"; // Pour la gestion des créneaux
import { CalendarDays, PlusCircle, Settings } from 'lucide-react';
import DemandeAttestationList from "../components/DemandeAttestationList"; // Pour la gestion des demandes d'attestation
import ConfigAttestationForm from '../components/ConfigAttestationForm'; // Pour la configuration de l'attestation
import EmploiTempsParProf from '../components/emploiprof'; // Pour l'emploi du temps des professeurs
import Evenements from '../components/evenementGestion'; // Pour la gestion des événements


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
      setEtudiantsEnRetard(response.data); // Assure-toi que l'API renvoie un tableau d'étudiants
      setShowRetardsModal(true);
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants en retard:', error);
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
        // Optionally refresh the list
        fetchEtudiantsEnRetard();
      } else {
        alert(response.data.message || "Échec de l'envoi de la notification");
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      
      let errorMessage = "Erreur lors de l'envoi de la notification";
      if (error.response) {
        // Server responded with a status other than 2xx
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Pas de réponse du serveur";
      }
      
      alert(errorMessage);
    }
  };
  

  // ✅ Appel API pour les absences
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

    }
  };

useEffect(() => {
  fetch("http://localhost:8000/api/absences/plus-de-15h")
    .then((res) => res.json())
    .then((data) => setNbAbsentsCritiques(data.count))
    .catch((err) => console.error("Erreur chargement absences:", err));
}, []);


  return (
    
    <div>
      {/* Top Navbar */}
      <nav className={`navbar navbar-expand-lg ${darkMode ? "bg-dark" : "bg-light"} text-white`} style={{ marginLeft: '240px' ,width:'84%'}}>
        <h4 className="text-center text-primary">Bonjour Monsieur l'Admin</h4>

        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="d-flex align-items-center ms-3">
        <div className="alert alert-danger p-2 m-1 mb-0 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
        <FaUserSlash className="me-2 text-danger" /> Absents &gt; 15h : {nbAbsentsCritiques}
      </div>
      <div className="alert alert-warning p-2 m-1 mb-0 d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
        <FaMoneyCheckAlt className="me-2 text-warning" />
        Retards : {nbRetardsPaiement}
        <button className="btn btn-sm btn-outline-light ms-2" onClick={fetchEtudiantsEnRetard}>
          Voir détails
        </button>
      </div>

        </div>

        {/* Langue et DarkMode */}
        <div className="ms-auto d-flex align-items-center gap-2 me-3">
        <div className="language-switcher d-flex align-items-center gap-2">
            <img
              src="https://flagcdn.com/w40/fr.png"
              alt="FR"
              style={{ cursor: "pointer", border: language === 'fr' ? '2px solid #007bff' : 'none', borderRadius: '5px' }}
              onClick={() => setLanguage('fr')}
            />
            
            <img
              src="https://flagcdn.com/w40/ma.png"
              alt="AR"
              style={{ cursor: "pointer", border: language === 'ar' ? '2px solid #007bff' : 'none', borderRadius: '5px' }}
              onClick={() => setLanguage('ar')}
            />
          </div>

          <button onClick={toggleDarkMode} className="btn btn-outline-light ms-2">
            {darkMode ? <FaSun style={{ color: "yellow" }} /> : <FaMoon style={{ color: "black" }} />}
          </button>
        </div>
      </nav>

      {/* Sidebar + Content */}
      <div className={`d-flex ${darkMode ? "bg-dark text-white" : "bg-light text-dark"}`}>
        {/* Sidebar */}
        <div className="sidebar bg-purple text-white p-3">
          <span className="navbar-brand text-white">
            <img src={logo} alt="Logo" style={{ width: '200px' }} />
          </span>
          <ul className="nav flex-column">
          <li className="nav-item">
              <button className={`nav-link text-blue ${activePage === "reports" && "active"}`} onClick={() => setActivePage("reports")}>
                <FaChartBar className="me-2" /> Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-blue ${activePage === "users" && "active"}`} onClick={() => setActivePage("users")}>
                <FaUsers className="me-2" /> Utilisateurs
              </button>
            </li>
            <li className="nav-item">
              <div className="dropdown-container">
                <button
                  onClick={() => setActivePage(activePage === "dropdown" ? "" : "dropdown")}
                  className={`nav-link text-blue d-flex justify-content-between align-items-center ${
                    activePage === "dropdown" && "active"
                  }`}
                >
                  <span><FaChalkboardTeacher className="me-2" /> Gestion des Classes</span>
                  <ChevronDown className={`ms-2 transition ${activePage === "dropdown" ? "rotate-180" : ""}`} size={16} />
                </button>

                {activePage === "dropdown" && (
                  <ul className="list-unstyled ps-3 ms-2 mt-1">
                    <li><Link to="/matiere" className="dropdown-link ">➤ Matières</Link></li>
                    <li><Link to="/filiere" className="dropdown-link">➤ Filières</Link></li>
                  </ul>
                )}
              </div>
            </li>

            <li className="nav-item">
              <button className={`nav-link text-blue ${activePage === "etudiants" && "active"}`} onClick={() => setActivePage("etudiants")}>
                <FaUserGraduate className="me-2" /> Étudiants
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-blue ${activePage === "profs" && "active"}`} onClick={() => setActivePage("profs")}>
                <FaUserTie className="me-2" /> Professeurs
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-blue ${activePage === "demandes" && "active"}`} onClick={() => setActivePage("demandes")}>
                <FaUserGraduate className="me-2" /> Demandes d'attestation
              </button>
            </li>
            <li className="nav-item">
            <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2 text-left text-gray-800 hover:bg-gray-100 rounded-md focus:outline-none"
      >
        <span className="flex items-center space-x-2">
          <CalendarDays className="w-5 h-5" />
          <span>Emplois du temps</span>
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

              {open && (
                <div className="ml-6 mt-2 space-y-2 text-sm">
                 <button className={`nav-link text-blue ${activePage === "cree-creau" && "active"}`} onClick={() => setActivePage("cree-creau")}>
                <CalendarDays className="me-2" /> creer creneau
                  </button>
                  <button className={`nav-link text-blue ${activePage === "EmploiTempsForm" && "active"}`} onClick={() => setActivePage("EmploiTempsForm")}>
                <PlusCircle className="me-2" /> cree emploi du temps
                  </button>
                  <button className={`nav-link text-blue ${activePage === "GenererEmploiTemps" && "active"}`} onClick={() => setActivePage("GenererEmploiTemps")}>
                <CalendarDays className="me-2" /> Voir les emplois du temps des classes
                  </button>
                  <button className={`nav-link text-blue ${activePage === "voir-emploi-prof" && "active"}`} onClick={() => setActivePage("voir-emploi-prof")}>
                <CalendarDays className="me-2" /> Voir les emplois du temps des proffesseurs
                  </button>
                  <button className={`nav-link text-blue ${activePage === "voir-emploi-serveillant" && "active"}`} onClick={() => setActivePage("voir-emploi-serveillant")}>
                <CalendarDays className="me-2" /> Voir les emplois du temps des serveillants
                  </button>
            
                </div>
              )}
            </div>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-blue ${activePage === "finance" && "active"}`} onClick={() => setActivePage("finance")}>
                <FaMoneyBill className="me-2" /> Finances
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-blue ${activePage === "charge" && "active"}`} onClick={() => setActivePage("charge")}>
                < Wallet/> charges
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-blue ${activePage === "evenements" && "active"}`} onClick={() => setActivePage("evenements")}>
                <FaGlobe className="me-2" /> Evenements
              </button>
            </li>
            
            <li className="nav-item">
              <button className={`nav-link text-blue ${activePage === "settings" && "active"}`} onClick={() => setActivePage("settings")}>
                <FaCog className="me-2" /> Paramètres
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="content p-4">
          <div className={`${darkMode ? 'bg-dark text-white' : 'bg-white'} p-4 rounded`}>
            {renderContent()}
          </div>
        </div>
      </div>
      {showRetardsModal && (
  <div className="modal show fade d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Étudiants en retard de paiement</h5>
          <button type="button" className="btn-close" onClick={() => setShowRetardsModal(false)}></button>
        </div>
        <div className="modal-body">
          {etudiantsEnRetard.length > 0 ? (
            <ul className="list-group">
              {etudiantsEnRetard.map((etudiant) => (
                <li key={etudiant.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {etudiant.nom} {etudiant.prenom} - {etudiant.email}
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => envoyerNotification(etudiant.id)}
                  >
                    Envoyer notification
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun étudiant en retard.</p>
          )}
        </div>
      </div>
    </div>
  </div>
)}

    </div>
    
  );
};
export default AdminLayout;
const styles = `
  .bg-purple { background-color:#E6E6FA !important; }

  body.dark, .dark {
    background-color: #1e1e2f;
    color: #f1f1f1;
  }

  .dark .bg-white {
    background-color: #2e2e3e !important;
    color: #f1f1f1;
  }

  .sidebar {
    width: 250px;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
     z-index: 1040
  }

  .content {
    margin-left: 250px;
    width: 100%;
  }

  .nav-link {
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    transition: background 0.3s;
  }

  .nav-link:hover, .nav-link.active {
    background: rgba(255, 255, 255, 0.2);
  }

  .dark .nav-link:hover, .dark .nav-link.active {
    background: rgba(255, 255, 255, 0.1);
  }

  .nav-item button {
    background: none;
    border: none;
    width: 100%;
    text-align: left;

  }
     
    

  .dark .navbar {
    background-color: #2e2e3e !important;
  }

  .dark .alert-danger {
    background-color: #9c1c1c;
    color: white;
  }
.navbar {
display: flex;
position: fixed;
box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.1);}
  .dark .alert-warning {
    background-color: #a36d00;
    color: white;
  }
    .content {
  margin-top: 70px; /* Ajuste selon la hauteur de ta navbar */
}
  .sidebar a:hover, .sidebar button:hover {
  background-color: #d3d3d3;
  color: black !important;
}
.dark .sidebar a:hover, .dark .sidebar button:hover {
  background-color: #444;
  color: white !important;
}
  .dropdown-container .dropdown-link {
  display: block;
  color: #fff;
  padding: 8px 12px;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.dropdown-container .dropdown-link:hover {
  background-color: #0d6efd;
  color: #fff;
}

.dropdown-container .rotate-180 {
  transform: rotate(180deg);
}

.transition {
  transition: transform 0.3s ease;
}


    
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
