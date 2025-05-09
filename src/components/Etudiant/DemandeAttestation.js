import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function DemanderAttestation() {
  const [message, setMessage] = useState("");
  const [etudiantId, setEtudiantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fonction pour envoyer la demande d'attestation
  const envoyerDemande = async () => {
    try {
      if (etudiantId) {
        await axios.post("http://127.0.0.1:8000/api/demandes-attestations", {
          etudiant_id: etudiantId,
        });
        setMessage("✅ Demande envoyée avec succès.");
      } else {
        setMessage("❌ Aucune donnée utilisateur trouvée.");
      }
    } catch (err) {
      setMessage("❌ Erreur lors de l’envoi.");
    }
  };

  // useEffect pour récupérer les données utilisateur depuis le localStorage
  useEffect(() => {
    const userData = localStorage.getItem('utilisateur');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setEtudiantId(parsedUser.id); // Assume que l'utilisateur a un 'id'
        setLoading(false);
      } catch (error) {
        setError("Erreur de lecture des données utilisateur");
        setLoading(false);
      }
    } else {
      setError("Aucun utilisateur connecté détecté");
      setLoading(false);
    }
  }, []);

  // Si les données sont en train de charger, afficher un message de chargement
  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      {error && <p>{error}</p>}
      <button onClick={envoyerDemande}>Demander Attestation</button>
      <p>{message}</p>
      
      {/* Lien vers la page des demandes en incluant l'ID de l'étudiant dans l'URL */}
      <Link to={`/mes-demandes/${etudiantId}`}>Voir mes demandes</Link>
    </div>
  );
}