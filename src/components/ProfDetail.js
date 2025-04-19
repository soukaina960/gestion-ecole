import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ProfesseurDetail() {
  const { id } = useParams();
  const [professeur, setProfesseur] = useState(null);

  useEffect(() => {
    const fetchProfesseur = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/professeurs/${id}`);
        setProfesseur(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement du professeur :", error);
      }
    };

    fetchProfesseur();
  }, [id]);

  if (!professeur) return <p>Chargement...</p>;

  return (
    <div className="container mt-5">
      <h2>Détails du Professeur</h2>
      <p><strong>Nom :</strong> {professeur.nom}</p>
      <p><strong>Email :</strong> {professeur.email}</p>
      <p><strong>Spécialité :</strong> {professeur.specialite}</p>
      <p><strong>Niveau d'enseignement :</strong> {professeur.niveau_enseignement}</p>
      <p><strong>Diplôme :</strong> {professeur.diplome}</p>
      <p><strong>Date d'embauche :</strong> {professeur.date_embauche}</p>
      {/* Affiche d'autres champs si nécessaire */}
    </div>
  );
}
