import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Importation des composants
import EntrerNotes from '../components/EntrerNotes';
import EtudiantInfos from '../components/Etudiant/EtudiantInfos';
import AjouterFichier from '../components/AjouterFichier';
import MonPanier from '../components/MonPanier';
import AjouterAbsences from '../components/AjouterAbsences';



// Importation du fichier CSS
import './DashboardEnseignant.css';
import AjouterExamen from '../components/AjouterExamen';

const EnseignantDashboard = () => {
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
                    <button onClick={() => handleSectionChange("cours")} className="sidebar-button">
                        📚 Consulter les cours
                    </button>
                    <button onClick={() => handleSectionChange("absences")} className="sidebar-button">
                        📚 entrer les absences
                    </button>
                    <button onClick={() => handleSectionChange("notes")} className="sidebar-button">
                        📊 Entrer les notes
                    </button>
                    <button onClick={() => handleSectionChange("exman")} className="sidebar-button">
                        📊 Entrer les  emplois de temps exman
                    </button>

                    <button onClick={() => handleSectionChange("infos")} className="sidebar-button">
                        👤 Mes informations
                    </button>
                    <button onClick={() => handleSectionChange("panier")} className="sidebar-button">
    🛒 Mon panier
</button>

                    <button onClick={handleLogout} className="logout-button">
                        Déconnexion
                    </button>
                </div>
            </div>
            <div className="content">
                {activeSection === "notes" && <EntrerNotes />}
                {activeSection === "absences" && <AjouterAbsences />}
                {activeSection === "cours" && <AjouterFichier />}
                {activeSection === "exman" && <AjouterExamen />}
                {activeSection === "infos" && <EtudiantInfos />}
                {activeSection === "panier" && <MonPanier />}

            </div>
        </div>
    );
};

export default EnseignantDashboard;
