import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EtudiantAbsences.css';

const EtudiantAbsences = () => {
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matieres, setMatieres] = useState([]);
  const [etudiantId, setEtudiantId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchData = async () => {
    try {
      // 1. Récupérer l'utilisateur connecté depuis le localStorage
      const userData = localStorage.getItem('utilisateur');
      if (!userData) {
        throw new Error("Utilisateur non connecté");
      }

      const parsedUser = JSON.parse(userData);
      const userId = parsedUser.id;

      // 2. Rechercher l'étudiant lié à cet utilisateur
      const etudiantResponse = await axios.get(
        `http://127.0.0.1:8000/api/etudiants`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      // Recherche manuelle dans le tableau si nécessaire
      const etudiant = etudiantResponse.data.find(p => p.utilisateur_id === userId);
      if (!etudiant) {
        throw new Error("Aucun étudiant trouvé pour cet utilisateur");
      }

      setEtudiantId(etudiant.id);

      // 3. Charger les matières et les absences en parallèle
      const [matieresResponse, absencesResponse] = await Promise.all([
        axios.get('http://127.0.0.1:8000/api/matieres'),
        axios.get(`http://127.0.0.1:8000/api/absences/etudiant/${etudiant.id}`)
      ]);

      setMatieres(matieresResponse.data.data || []);
      setAbsences(absencesResponse.data);

    } catch (err) {
      setError(err.message || "Une erreur est survenue");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


  if (loading) {
    return (
      <div className="text-center mt-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p>Chargement des absences...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {error}
          <button 
            className="btn btn-link" 
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mes absences</h2>
      
      {absences.length === 0 ? (
        <div className="alert alert-info">
          Aucune absence enregistrée pour le moment
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Date</th>
                <th>Matière</th>
                <th>Motif</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((absence) => {
                const matiere = matieres.find(m => m.id === absence.matiere_id);
                return (
                  <tr key={absence.id}>
                    <td>{new Date(absence.date).toLocaleDateString('fr-FR')}</td>
                    <td>{matiere ? matiere.nom : 'Matière inconnue'}</td>
                    <td>{absence.motif || 'Non spécifié'}</td>
                    <td>
                      <span className={`badge ${absence.justifiee ? 'bg-success' : 'bg-warning'}`}>
                        {absence.justifiee ? 'Justifiée' : 'Non justifiée'}
                      </span>
                    </td>
                    <td>
                      {!absence.justifiee && (
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => navigate(`/justifier-absence/${absence.id}`)}
                        >
                          Justifier
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EtudiantAbsences;