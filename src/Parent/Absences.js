import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Absences = () => {
  // État pour stocker les absences
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer le parent_id du localStorage
  const parentId = localStorage.getItem('parent_id');

  // Effectuer une requête à l'API pour récupérer les absences
  useEffect(() => {
    if (parentId) {
      // Effectuer la requête API pour récupérer les absences
      fetch(`http://127.0.0.1:8000/api/absences/parent/${parentId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setError(data.message);
            setLoading(false);
          } else {
            setAbsences(data);
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error('Erreur:', error);
          setError('Erreur de récupération des absences.');
          setLoading(false);
        });
    } else {
      setError('Identifiant du parent introuvable dans localStorage.');
      setLoading(false);
    }
  }, [parentId]);

  // Affichage des absences ou du message d'erreur
  if (loading) {
    return <p>Chargement des absences...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {absences.length === 0 ? (
        <p>Aucune absence trouvée</p>
      ) : (
        absences.map(absence => (
          <div key={absence.id}>
            {/* Vérifie si 'etudiant' et 'nom' existent */}
            {absence.etudiant && absence.etudiant.nom ? (
              <p>Nom de l'étudiant : {absence.etudiant.nom}</p>
            ) : (
              <p>Nom de l'étudiant non disponible</p>
            )}
            <p>Motif : {absence.motif}</p>
            <p>Date : {absence.date}</p>
            <p>Justifiée : {absence.justifiee === 1 ? 'Oui' : 'Non'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Absences;
