import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiSearch, FiLogOut, FiAlertCircle } from 'react-icons/fi';
import { 
  FaChalkboardTeacher, 
  FaBook, 
  FaClipboardCheck, 
  FaRegCalendarAlt, 
  FaUser, 
  FaShoppingCart ,
    FaUsers, FaBars, FaTimes,
    FaMoneyBill, FaChartBar, FaMoon, FaSun, 
    FaUserGraduate, FaUserTie, FaMoneyCheckAlt, FaGlobe,
    FaSearch, FaSignOutAlt, FaChartLine , FaClipboardList, FaCalendarCheck, FaFileAlt, FaQuestionCircle
} from 'react-icons/fa';
import { ChevronDown } from 'lucide-react';
// Importation des composants étudiants
import EtudiantCours from '../components/Etudiant/EtudiantCours';
import EtudiantNotes from '../components/Etudiant/EtudiantNotes';
import EtudiantBulletin from '../components/Etudiant/EtudiantBulletin';
import EtudiantAbsences from '../components/Etudiant/EtudiantAbsences';
import MesExamens from '../components/Etudiant/MesExamens';
import DemandeAttestation from '../components/Etudiant/DemandeAttestation';
import MesEvenements from '../components/Etudiant/MesEvenements';
import EtudiantQuiz from '../components/Etudiant/EtudiantQuiz';
import EmploiDuTemps from '../components/Etudiant/EmploiDuTemps';
import EtudiantInfos from '../components/Etudiant/EtudiantInfos';

// Importation du fichier CSS
import './DashboardEtudiant.css';

const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-spinner"></div>
    <p>Chargement en cours...</p>
  </div>
);

const ErrorScreen = ({ error }) => (
  <div className="error-message">
    <FiAlertCircle className="error-icon" />
    <p>{error || "Une erreur s'est produite"}</p>
    <button 
      className="button error-retry"
      onClick={() => window.location.reload()}
    >
      Réessayer
    </button>
  </div>
);

const EtudiantDashboard = () => {
    const [utilisateur, setUtilisateur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState("cours");
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const dropdownRef = useRef(null);
    const sidebarRef = useRef(null);
    const hamburgerRef = useRef(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userData = localStorage.getItem('utilisateur');
                
                if (!userData) {
                    navigate('/login');
                    return;
                }
                
                const parsedUser = JSON.parse(userData);
                setUtilisateur(parsedUser);
                
                // Vérifier le mode sombre dans localStorage
                const savedMode = localStorage.getItem('darkMode') === 'true';
                setDarkMode(savedMode);
                
            } catch (err) {
                console.error("Erreur de chargement des données:", err);
                setError("Erreur de chargement des données utilisateur");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

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

    const handleLogout = () => {
        localStorage.removeItem('utilisateur');
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        navigate('/login');
    };


    const handleSectionChange = (section) => {
        setActiveSection(section);
    };
    // Gérer le clic sur un élément du menu
const handleMenuItemClick = (section) => {
    setActiveSection(section);
    setDropdownOpen(false);
    if (window.innerWidth < 992) setSidebarOpen(false);
};

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };
      const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen error={error} />;
    if (!utilisateur) return <ErrorScreen error="Utilisateur non trouvé" />;

    return (
        <div className={`dashboard-container ${darkMode ? 'dark' : ''}`}>
            {/* Barre de navigation supérieure */}
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
                    <div className="logo">
                        <span className="logo-text">Scolyx</span>
                        <span className="logo-designer">Étudiant</span>
                    </div>
                </div>
                
                <div className="nav-center">
                    <div className="search-bar">
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            aria-label="Rechercher"
                        />
                        <FiSearch className="search-icon" />
                    </div>
                </div>
                
                <div className="nav-right">
                    <div className="user-greeting">
                        Bonjour, <span className="user-name">{utilisateur.nom} {utilisateur.prenom}</span>
                    </div>
                    <button 
                        onClick={toggleDarkMode} 
                        className="theme-toggle"
                        aria-label={darkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
                    >
                        {darkMode ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
                    </button>
                    <button 
                        onClick={handleLogout} 
                        className="logout-btn"
                        aria-label="Déconnexion"
                    >
                        <FiLogOut aria-hidden="true" />
                    </button>
                </div>
            </nav>

            <div className="main-content">
                {/* Sidebar */}
                <div 
                ref={sidebarRef}
                className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}
                >
                <div className="sidebar-menu">

                        <button 
                            onClick={() => handleSectionChange("cours")} 
                            className={`sidebar-button ${activeSection === "cours" ? 'active' : ''}`}
                            aria-current={activeSection === "cours" ? "page" : undefined}
                        >
                            <FaBook className="sidebar-icon" />
                            <span>Mes cours</span>
                        </button>
                        
                        <button 
                            onClick={() => handleSectionChange("notes")} 
                            className={`sidebar-button ${activeSection === "notes" ? 'active' : ''}`}
                            aria-current={activeSection === "notes" ? "page" : undefined}
                        >
                            <FaChartLine className="sidebar-icon" />
                            <span>Mes notes</span>
                        </button>
                        
                        <button 
                            onClick={() => handleSectionChange("bulletin")} 
                            className={`sidebar-button ${activeSection === "bulletin" ? 'active' : ''}`}
                            aria-current={activeSection === "bulletin" ? "page" : undefined}
                        >
                            <FaClipboardList className="sidebar-icon" />
                            <span>Mon bulletin</span>
                        </button>
                        
                        <button 
                            onClick={() => handleSectionChange("absences")} 
                            className={`sidebar-button ${activeSection === "absences" ? 'active' : ''}`}
                            aria-current={activeSection === "absences" ? "page" : undefined}
                        >
                            <FaCalendarCheck className="sidebar-icon" />
                            <span>Mes absences</span>
                        </button>
                        
                        <button 
                            onClick={() => handleSectionChange("examens")} 
                            className={`sidebar-button ${activeSection === "examens" ? 'active' : ''}`}
                            aria-current={activeSection === "examens" ? "page" : undefined}
                        >
                            <FaFileAlt className="sidebar-icon" />
                            <span>Mes examens</span>
                        </button>
                        
                        <button 
                            onClick={() => handleSectionChange("attestation")} 
                            className={`sidebar-button ${activeSection === "attestation" ? 'active' : ''}`}
                            aria-current={activeSection === "attestation" ? "page" : undefined}
                        >
                            <FaFileAlt className="sidebar-icon" />
                            <span>Demande attestation</span>
                        </button>
                        
                        <button 
                            onClick={() => handleSectionChange("evenements")} 
                            className={`sidebar-button ${activeSection === "evenements" ? 'active' : ''}`}
                            aria-current={activeSection === "evenements" ? "page" : undefined}
                        >
                            <FaRegCalendarAlt className="sidebar-icon" />
                            <span>Événements</span>
                        </button>
                        
                        <button 
                            onClick={() => handleSectionChange("quiz")} 
                            className={`sidebar-button ${activeSection === "quiz" ? 'active' : ''}`}
                            aria-current={activeSection === "quiz" ? "page" : undefined}
                        >
                            <FaQuestionCircle className="sidebar-icon" />
                            <span>Quiz</span>
                        </button>
                        
                        <button 
                            onClick={() => handleSectionChange("emploi")} 
                            className={`sidebar-button ${activeSection === "emploi" ? 'active' : ''}`}
                            aria-current={activeSection === "emploi" ? "page" : undefined}
                        >
                            <FaRegCalendarAlt className="sidebar-icon" />
                            <span>Emploi du temps</span>
                        </button>
                        
                        <button 
                            onClick={() => handleSectionChange("infos")} 
                            className={`sidebar-button ${activeSection === "infos" ? 'active' : ''}`}
                            aria-current={activeSection === "infos" ? "page" : undefined}
                        >
                            <FaUser className="sidebar-icon" />
                            <span>Mes informations</span>
                        </button>
                    </div>
                </div>

                {/* Zone de contenu */}
                <div className="content">
                    {activeSection === "cours" && <EtudiantCours />}
                    {activeSection === "notes" && <EtudiantNotes />}
                    {activeSection === "bulletin" && <EtudiantBulletin />}
                    {activeSection === "absences" && <EtudiantAbsences />}
                    {activeSection === "examens" && <MesExamens />}
                    {activeSection === "attestation" && <DemandeAttestation />}
                    {activeSection === "evenements" && <MesEvenements />}
                    {activeSection === "quiz" && <EtudiantQuiz />}
                    {activeSection === "emploi" && <EmploiDuTemps />}
                    {activeSection === "infos" && <EtudiantInfos />}
                    
                    {!activeSection && (
                        <div className="welcome-message">
                            <h2>Bienvenue sur votre tableau de bord</h2>
                            <p>Sélectionnez une section dans le menu pour commencer</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EtudiantDashboard;