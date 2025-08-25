import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function ListeDemandesEtudiant() {
  const { etudiantId } = useParams();  // Récupère l'ID de l'étudiant depuis l'URL
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!etudiantId) {
      setError("ID étudiant manquant.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/api/demandes-attestations/etudiant/${etudiantId}`)
      .then((res) => {
        setDemandes(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erreur lors de la récupération des demandes.");
        setLoading(false);
      });
  }, [etudiantId]);

  if (loading) {
    return <p>Chargement...</p>;
  }
  
    const getFileUrl = (path) => {
        if (!path) return null;
        const cleanedPath = path.replace('storage/app/public/', '');
        return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${cleanedPath}`;
    };     

  return (
    <div>
      <h3>Mes Demandes</h3>
      {error && <p>{error}</p>}
      
      {demandes.length === 0 ? (
        <p>Aucune demande trouvée</p>
      ) : (
        <ul>
          {demandes.map((d) => (
            <li key={d.id}>
           {d.traitee ? (
  <a href={getFileUrl(d.lien_attestation)}  target="_blank" download={`attestation_${d.id}.pdf`}>
    📄 Télécharger
  </a>
) : (
  "⏳ En attente"
)}



            </li>
          ))}
        </ul>
      )}

      {/* Lien pour retourner à la demande d'attestation */}
      <Link to="/etudiant/dashboard">Retour à la demande d'attestation</Link>
    </div>
  );
}
