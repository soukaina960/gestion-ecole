import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './MesEvenements.css';

function MesEvenements() {
    const [evenements, setEvenements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [classeId, setClasseId] = useState(null);
    const navigate = useNavigate();
useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const userData = localStorage.getItem('utilisateur');
            if (!userData) {
                navigate('/login');
                return;
            }

            const parsedUser = JSON.parse(userData);
            let resolvedClasseId;

            if (parsedUser.role === 'étudiant') {
                const etudiantResponse = await axios.get(
                    `http://127.0.0.1:8000/api/etudiants`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );

                const etudiant = etudiantResponse.data.find(e => e.utilisateur_id === parsedUser.id);
                if (!etudiant) {
                    throw new Error('Aucun étudiant trouvé pour cet utilisateur');
                }

                resolvedClasseId = etudiant.classe_id;
            } 
            else if (parsedUser.role === 'professeur') {
                const professeurResponse = await axios.get(
                    `http://127.0.0.1:8000/api/professeurs`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                );

                const professeur = professeurResponse.data.find(p => p.user_id === parsedUser.id);
                if (!professeur) {
                    throw new Error('Aucun professeur trouvé pour cet utilisateur');
                }

                resolvedClasseId = professeur.classe_id;
            }

            setClasseId(resolvedClasseId); // tu peux l'utiliser ailleurs
            const { data } = await axios.get(
                `http://127.0.0.1:8000/api/evenements?class_id=${resolvedClasseId}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            const evenementsFormates = data.map(evenement => ({
                ...evenement,
                date_debut: evenement.date_debut,
                date_fin: evenement.date_fin,
                jour: getFrenchDayName(evenement.date_debut),
                heure_debut: formatHeure(evenement.date_debut),
                heure_fin: formatHeure(evenement.date_fin)
            }));

            setEvenements(evenementsFormates);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [navigate]);


    const formatHeure = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    const getFrenchDayName = (dateString) => {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Chargement en cours...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="retry-button"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="events-container">
            <h2 className="events-title">Mes Événements</h2>
            
            {evenements.length === 0 ? (
                <div className="empty-state">
                    Aucun événement programmé pour le moment
                </div>
            ) : (
                <div className="events-list">
                    {evenements.map((evenement, index) => (
                        <div key={evenement.id} className="event-card" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="event-header">
                                <div>
                                    <h3 className="event-title">{evenement.titre}</h3>
                                    <p className="event-description">{evenement.description}</p>
                                </div>
                                <div className="event-day">{evenement.jour}</div>
                            </div>
                            
                            <div className="event-details">
                                <div className="event-detail">
                                    <span className="detail-label">Date:</span>
                                    <span className="detail-value">
                                        {new Date(evenement.date_debut).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                                <div className="event-detail">
                                    <span className="detail-label">Horaire:</span>
                                    <span className="detail-value">
                                        {evenement.heure_debut} - {evenement.heure_fin}
                                    </span>
                                </div>
                                <div className="event-detail">
                                    <span className="detail-label">Lieu:</span>
                                    <span className="detail-value">
                                        {evenement.lieu || 'Non spécifié'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MesEvenements;