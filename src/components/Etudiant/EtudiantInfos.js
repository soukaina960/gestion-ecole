import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EtudiantInfos = () => {
  const [etudiant, setEtudiant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      setError("Token non trouvé. Veuillez vous connecter.");
      return;
    }

    axios.get('http://localhost:8000/api/etudiant/info', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setEtudiant(response.data);
    })
    .catch(error => {
      if (error.response) {
        // Si l'erreur provient du serveur
        console.error(error.response.data);
        setError(error.response.data.message || "Impossible de charger les informations de l'étudiant.");
      } else {
        // Si c'est un autre type d'erreur
        console.error(error);
        setError("Erreur de connexion au serveur.");
      }
    });
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!etudiant) return <div>Chargement...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">👤 Mes informations</h2>
      <ul className="list-disc list-inside">
        <li><strong>Nom :</strong> {etudiant.nom}</li>
        <li><strong>Prénom :</strong> {etudiant.prenom}</li>
        <li><strong>Email :</strong> {etudiant.email}</li>
        <li><strong>Matricule :</strong> {etudiant.matricule}</li>
        <li><strong>Sexe :</strong> {etudiant.sexe}</li>
        <li><strong>Date de naissance :</strong> {etudiant.date_naissance}</li>
        <li><strong>Adresse :</strong> {etudiant.adresse}</li>
        <li><strong>Origine :</strong> {etudiant.origine}</li>
        <li><strong>Montant à payer :</strong> {etudiant.montant_a_payer} DH</li>
        <li><strong>Classe :</strong> {etudiant.classroom?.nom || 'Non attribuée'}</li>
      </ul>
    </div>
  );
};

export default EtudiantInfos;
