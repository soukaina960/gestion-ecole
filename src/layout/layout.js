import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-icons/fa';
import { FaUsers, FaChalkboardTeacher, FaClock, FaMoneyBill, FaChartBar, FaCog, FaMoon, FaSun ,FaUserGraduate,FaUserTie } from "react-icons/fa";
import UtilisateurForm from "../components/UtilisateurList"; // 📌 Importation du composant UtilisateurList
import logo from '../images/logo.png';
import SearchBar from "../components/SearchBar"; // 📌 Importation du composant SearchBar
import ClassroomList from "../components/ClassroomList"; // 📌 Importation du composant ClassroomList
import StudentList from "../components/Student";
import ProfesseurList from "../components/prof";
import EmploiTemps from "../components/EmploiTemps";
import Dashboard from "../components/Dashboard";
import CalculSalaireProfesseur from "../components/CalculSalaire"; // 📌 Importation du composant CalculSalaireProfesseur
const Layout = () => {
  const [activePage, setActivePage] = useState("users");
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const renderContent = () => {
    switch (activePage) {
      case "users":
        return   <UtilisateurForm searchTerm={searchTerm} />; // Passer searchTerm au composant UtilisateurList
        case "classes":
          return (
            <div>
              <ClassroomList /> {/* Affiche le composant ClassroomList */}
            </div>
          );
            case "etudiants":
              return (
                <div>
                  <StudentList /> {/* Affiche le composant Student */}
                </div>
              );
              case "profs":
                return (
                  <div>
                    <ProfesseurList /> 
                  </div>
                );
      case "schedule":
         return (
          <div>
            <EmploiTemps /> 
          </div>
        );
      case "finance":
        return (
          <div>
            <CalculSalaireProfesseur /> 
          </div>
        );
      case "reports":
        return <h2>Accès aux rapports</h2>;
      case "settings":
        return <h2>Configuration des paramètres</h2>;
      default:
        return <h2>Bienvenue sur la plateforme</h2>;
    }
  };

  return (
    <div >
      {/* Horizontal Navbar */}
      <nav className={`navbar navbar-expand-lg ${darkMode ? "bg-dark" : "bg-light"} text-white`} style={{marginLeft:'240px',marginTop:'-60px'}}>
          <span className="navbar-brand text-white"><img src={logo} alt="Logo"  style={{ width: '200px' }} /></span>
          <h4 className="text-center text-primary">Bonjour Monsieur l'Admin</h4>          
          {/* Search Bar */}
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="btn btn-outline-light">
            {darkMode ? <FaSun style={{ color: "yellow" }}/> : <FaMoon style={{ color: "black" }}/>}
          </button>
      </nav>

      <div className={`d-flex navbar navbar-expand-lg ${darkMode ? "bg-dark" : "bg-light"} text-white`}>
      {/* Sidebar */}
        <div className="sidebar bg-purple text-white p-3">
          <h3 className="text-center">Gestion École</h3>
          <ul className="nav flex-column">
          <li className="nav-item">
              <button className={`nav-link text-white ${activePage === "users" && "active"}`} onClick={() => setActivePage("users")}>
                <FaUsers className="me-2" /> Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-white ${activePage === "users" && "active"}`} onClick={() => setActivePage("users")}>
                <FaUsers className="me-2" /> Utilisateurs
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-white ${activePage === "classes" && "active"}`} onClick={() => setActivePage("classes")}>
                <FaChalkboardTeacher className="me-2" /> Classes
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-white ${activePage === "etudiants" && "active"}`} onClick={() => setActivePage("etudiants")}>
                <FaUserGraduate className="me-2" /> Etudiants
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-white ${activePage === "profs" && "active"}`} onClick={() => setActivePage("profs")}>
                <FaUserTie  className="me-2" /> Profisseurs
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-white ${activePage === "schedule" && "active"}`} onClick={() => setActivePage("schedule")}>
                <FaClock className="me-2" /> Emplois du temps
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-white ${activePage === "finance" && "active"}`} onClick={() => setActivePage("finance")}>
                <FaMoneyBill className="me-2" /> Finances
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-white ${activePage === "reports" && "active"}`} onClick={() => setActivePage("reports")}>
                <FaChartBar className="me-2" /> Rapports
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link text-white ${activePage === "settings" && "active"}`} onClick={() => setActivePage("settings")}>
                <FaCog className="me-2" /> Paramètres
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="content p-4">
          <div className="p-4 bg-white rounded">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

// Ajout du style CSS
const styles = `
  .bg-purple { background-color: #6a0dad !important; }
  .sidebar {
    width: 250px;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
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
  .nav-item button {
    background: none;
    border: none;
    width: 100%;
    text-align: left;
  }
`;
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
