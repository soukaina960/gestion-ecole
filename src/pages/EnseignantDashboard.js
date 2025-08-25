import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSun, FiMoon, FiSearch, FiLogOut, FiAlertCircle } from 'react-icons/fi';
import { 
  FaChalkboardTeacher, 
  FaBook, 
  FaClipboardCheck, 
  FaRegCalendarAlt, 
  FaUser, 
  FaShoppingCart 
} from 'react-icons/fa';

// Importation des composants
import EntrerNotes from '../components/EntrerNotes';
import EtudiantInfos from '../components/EtudiantInfos';
import AjouterFichier from '../components/AjouterFichier';
import MonPanier from '../components/MonPanier';
import AjouterAbsences from '../components/AjouterAbsences';
import AjouterExamen from '../components/AjouterExamen';
import QuizForm from '../components/QuizForm';
import EmploiProf from '../components/EmploiProf';

// Importation du fichier CSS
import './DashboardEnseignant.css';

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
    <p>Veuillez rafraîchir la page ou contacter l'administrateur</p>
  </div>
);

const EnseignantDashboard = () => {
    const [utilisateur, setUtilisateur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState("cours");
    const [darkMode, setDarkMode] = useState(false);
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.removeItem('utilisateur');
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen error={error} />;
    if (!utilisateur) return <ErrorScreen error="Utilisateur non trouvé" />;

    return (
        <div className={`dashboard-container ${darkMode ? 'dark' : ''}`}>
            {/* Barre de navigation supérieure */}
            <nav className="top-nav">
                <div className="nav-left">
                    <div className="logo">
                        <span className="logo-text">Scolyx</span>
                        <span className="logo-designer">Enseignant</span>
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
                <div className="sidebar">
                    <div className="sidebar-menu">
                        <button 
                            onClick={() => handleSectionChange("cours")} 
                            className={`sidebar-button ${activeSection === "cours" ? 'active' : ''}`}
                            aria-current={activeSection === "cours" ? "page" : undefined}
                        >
                            <FaBook className="sidebar-icon" />
                            <span>Consulter les cours</span>
                        </button>
                        
                       
                        
                        <button 
                            onClick={() => handleSectionChange("notes")} 
                            className={`sidebar-button ${activeSection === "notes" ? 'active' : ''}`}
                            aria-current={activeSection === "notes" ? "page" : undefined}
                        >
                            <FaChalkboardTeacher className="sidebar-icon" />
                            <span>Entrer les notes</span>
                        </button>
                        
                        <button 
                            onClick={() => handleSectionChange("exman")} 
                            className={`sidebar-button ${activeSection === "exman" ? 'active' : ''}`}
                            aria-current={activeSection === "exman" ? "page" : undefined}
                        >
                            <FaRegCalendarAlt className="sidebar-icon" />
                            <span>Emplois de temps examens</span>
                        </button>
                        
                        <button 
                            onClick={() => handleSectionChange("quiz")} 
                            className={`sidebar-button ${activeSection === "quiz" ? 'active' : ''}`}
                            aria-current={activeSection === "quiz" ? "page" : undefined}
                        >
                            <FaRegCalendarAlt className="sidebar-icon" />
                            <span>Emplois de temps quiz</span>
                        </button>
                        
                        <button 
                            onClick={() => handleSectionChange("EmploiProf")} 
                            className={`sidebar-button ${activeSection === "EmploiProf" ? 'active' : ''}`}
                            aria-current={activeSection === "EmploiProf" ? "page" : undefined}
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
                        
                        <button 
                            onClick={() => handleSectionChange("panier")} 
                            className={`sidebar-button ${activeSection === "panier" ? 'active' : ''}`}
                            aria-current={activeSection === "panier" ? "page" : undefined}
                        >
                            <FaShoppingCart className="sidebar-icon" />
                            <span>Mon panier</span>
                        </button>
                    </div>
                </div>

                {/* Zone de contenu */}
                <div className="content">
                    {activeSection === "notes" && <EntrerNotes />}
                    {activeSection === "absences" && <AjouterAbsences />}
                    {activeSection === "cours" && <AjouterFichier />}
                    {activeSection === "exman" && <AjouterExamen />}
                    {activeSection === "quiz" && <QuizForm />}
                    {activeSection === "EmploiProf" && <EmploiProf />}
                    {activeSection === "infos" && <EtudiantInfos />}
                    {activeSection === "panier" && <MonPanier />}
                    
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

export default EnseignantDashboard;