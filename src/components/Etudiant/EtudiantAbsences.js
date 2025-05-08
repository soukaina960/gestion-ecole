import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EtudiantAbsences.css'; // Assuming you have a CSS file for styles

const EtudiantAbsences = () => {
  const [etudiant, setEtudiant] = useState(null);
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Récupération des données de l'étudiant depuis le localStorage
    const userData = localStorage.getItem('utilisateur');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setEtudiant(parsedUser);
    }
  }, []);

  useEffect(() => {
    const fetchAbsences = async () => {
      try {
        if (etudiant && etudiant.id) {
          const response = await axios.get(`http://localhost:8000/api/absences/etudiant/${etudiant.id}`);
          setAbsences(response.data);
        }
      } catch (err) {
        setError("Erreur lors de la récupération des absences");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsences();
  }, [etudiant]); // Déclenché quand l'étudiant change

  if (loading) return <div className="text-center mt-4">Chargement des absences...</div>;
  if (error) return <div className="alert alert-danger mt-4">{error}</div>;
  if (!etudiant) return <div className="alert alert-warning mt-4">Veuillez vous connecter</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Mes absences</h2>
      
      {absences.length === 0 ? (
        <div className="alert alert-info">Aucune absence enregistrée</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Date</th>
                <th>Motif</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {absences.map((absence) => (
                <tr key={absence.id}>
                  <td>{new Date(absence.date).toLocaleDateString('fr-FR')}</td>
                  <td>{absence.motif || 'Non spécifié'}</td>
                  <td>
                    {absence.justifiee ? (
                      <span className="badge bg-success">Justifiée</span>
                    ) : (
                      <span className="badge bg-danger">Non justifiée</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EtudiantAbsences;