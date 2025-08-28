import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './MesExamens.css';

function MesExamens() {
    const [examens, setExamens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [etudiantId, setEtudiantId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Récupérer l'utilisateur connecté
                const userData = localStorage.getItem('utilisateur');
                if (!userData) throw new Error('Utilisateur non connecté');

                const parsedUser = JSON.parse(userData);
                
                // 2. Trouver l'étudiant correspondant à l'utilisateur
                const etudiantResponse = await axios.get(
                    `http://127.0.0.1:8000/api/etudiants?utilisateur_id=${parsedUser.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                if (etudiantResponse.data.length === 0) {
                    throw new Error('Aucun étudiant trouvé pour cet utilisateur');
                }

                const etudiant = etudiantResponse.data[0];
                setEtudiantId(etudiant.id);

                // 3. Récupérer les examens de l'étudiant
                const { data } = await axios.get(
                    `http://127.0.0.1:8000/api/etudiants/${etudiant.id}/examens`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );

                // 4. Formater les données
                const examensFormates = data.map(examen => ({
                    ...examen,
                    date: examen.date,
                    jour: examen.jour || getFrenchDayName(examen.date),
                    heure_debut: formatHeure(examen.heure_debut),
                    heure_fin: formatHeure(examen.heure_fin),
                    matiere: examen.matiere?.nom || 'Non spécifié',
                    professeur: examen.professeur?.nom || 'Non affecté',
                    salle: examen.salle || 'Non spécifiée'
                }));
                
                setExamens(examensFormates);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                console.error('Erreur:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Formater l'heure (HH:MM:SS → HH:MM)
    const formatHeure = (heure) => {
        if (!heure) return '';
        const [hours, minutes] = heure.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    // Obtenir le nom du jour en français
    const getFrenchDayName = (dateString) => {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p>Chargement en cours...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Réessayer
                </button>
            </div>
        );
    }

  return (
  <div className="examens-container">
    <h2 className="examens-title">Mon Emploi du Temps des Examens</h2>
    
    {loading ? (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement en cours...</p>
      </div>
    ) : error ? (
      <div className="error-container">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="retry-button"
        >
          Réessayer
        </button>
      </div>
    ) : examens.length === 0 ? (
      <div className="empty-state">
        Aucun examen programmé pour le moment
      </div>
    ) : (
      <div className="overflow-x-auto ">
        <table className="examens-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Jour</th>
              <th>Matière</th>
              <th>Professeur</th>
              <th>Horaire</th>
            
            </tr>
          </thead>
          <tbody>
            {examens.map((examen) => (
              <tr key={examen.id}>
                <td className="examen-date  text-dark">
                  {new Date(examen.date).toLocaleDateString('fr-FR')}
                </td>
                <td className=' text-dark'>{examen.jour}</td>
                <td className="examen-matiere text-dark">{examen.matiere}</td>
                <td className="examen-prof  text-dark">{examen.professeur}</td>
                <td className=' text-dark'>
                  {examen.heure_debut} - {examen.heure_fin}
                </td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);
}

export default MesExamens;