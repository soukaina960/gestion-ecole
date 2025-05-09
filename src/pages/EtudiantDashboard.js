import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EtudiantCours from '../components/Etudiant/EtudiantCours';
import EtudiantNotes from '../components/Etudiant/EtudiantNotes';
import EtudiantAbsences from '../components/Etudiant/EtudiantAbsences';
import EtudiantInfos from '../components/Etudiant/EtudiantInfos';
import DemandeAttestation from '../components/Etudiant/DemandeAttestation'; // Assuming you have a component for this
import './DashboardEtudiant.css'; // Assuming you have a CSS file for styles
import MesExamens from '../components/Etudiant/MesExamens';
import EtudiantQuiz from '../components/Etudiant/EtudiantQuiz'; // Assuming you have a component for this
import EmploiDuTemps from '../components/Etudiant/EmploiDuTemps';

const EtudiantDashboard = () => {
    const [utilisateur, setUtilisateur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState("");  // Section active par défaut
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const userData = localStorage.getItem('utilisateur');
            if (userData) {
                setUtilisateur(JSON.parse(userData));
            }
        } catch (err) {
            setError("Erreur de chargement des données utilisateur");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('utilisateur');
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <h2 className="sidebar-title">Bonjour, {utilisateur?.nom} 👋</h2>
                <div className="sidebar-buttons">
                    <button 
                        onClick={() => handleSectionChange("cours")}
                        className="sidebar-button"
                    >
                        📚 Consulter les cours
                    </button>
                    <button 
                        onClick={() => handleSectionChange("notes")}
                        className="sidebar-button"
                    >
                        📊 Voir mes notes
                    </button>
                    <button 
                        onClick={() => handleSectionChange("absences")}
                        className="sidebar-button"
                    >
                        📅 Mes absences
                    </button>
                    <button 
                        onClick={() => handleSectionChange("examens")}
                        className="sidebar-button"
                    >
                        📅 duree des examens
                    </button>

                    <button 
                        onClick={() => handleSectionChange("attestation")}
                        className="sidebar-button"
                    >
                        demande attestation
                    </button>
                    <button 
                        onClick={() => handleSectionChange("quiz")}
                        className="sidebar-button"
                    >
                        quiz
                    </button>
                    <button 
                        onClick={() => handleSectionChange("EmploiDuTemps")}
                        className="sidebar-button"
                    >
                        Emploi du temps 

                    </button>


                    <button 
                        onClick={() => handleSectionChange("infos")}
                        className="sidebar-button"
                    >
                        👤 Mes infos personnelles
                    </button>
                  
                    <button 
                        onClick={handleLogout}
                        className="logout-button"
                    >
                        Déconnexion
                    </button>
                </div>
            </div>
            <div className="content">
                {activeSection === "cours" && <EtudiantCours />}
                {activeSection === "notes" && <EtudiantNotes />}
                {activeSection === "absences" && <EtudiantAbsences />}
                {activeSection === "examens" && <MesExamens />}

                   {activeSection === "quiz" && <EtudiantQuiz />}
                {activeSection === "EmploiDuTemps" && <EmploiDuTemps />} {/* Assuming you have a component for this */}

                 
                {activeSection === "attestation" && <DemandeAttestation />}
                {activeSection === "infos" && <EtudiantInfos />}
               
            </div>
        </div>
    );
};

export default EtudiantDashboard;
