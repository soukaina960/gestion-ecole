import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function AttestationPage() {
  const [message, setMessage] = useState("");
  const [etudiantId, setEtudiantId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeAttestation, setTypeAttestation] = useState("scolarite");
  const [motif, setMotif] = useState("");
  const [demandes, setDemandes] = useState([]);
  const navigate = useNavigate();

  // Récupérer l'étudiant lié à l'utilisateur connecté
  useEffect(() => {
    const fetchEtudiant = async () => {
      try {
        const userData = localStorage.getItem('utilisateur');
        if (!userData) throw new Error("Utilisateur non connecté");

        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id;

        const etudiantResponse = await axios.get(
          `http://127.0.0.1:8000/api/etudiants`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );

        const etudiant = etudiantResponse.data.find(p => p.utilisateur_id === userId);
        if (!etudiant) throw new Error("Aucun étudiant trouvé pour cet utilisateur");

        setEtudiantId(etudiant.id);

      } catch (err) {
        setError(err.message || "Une erreur est survenue");
      } finally {
        setLoading(false);
      }
    };

    fetchEtudiant();
  }, []);

  // Récupérer les demandes de cet étudiant dès que l'etudiantId est disponible
  useEffect(() => {
    if (!etudiantId) return;

    const fetchDemandes = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/demandes-attestations/etudiant/${etudiantId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setDemandes(res.data);
      } catch (err) {
        console.error("Erreur récupération demandes:", err);
      }
    };

    fetchDemandes();
  }, [etudiantId]);

  const envoyerDemande = async () => {
    try {
      if (!etudiantId) {
        setMessage("❌ Aucun étudiant trouvé");
        return;
      }
      if (motif.trim() === "") {
        setMessage("❌ Veuillez entrer un motif");
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/demandes-attestations",
        {
          etudiant_id: etudiantId,
          type_attestation: typeAttestation,
          motif: motif,
          statut: "en_attente"
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      setMessage("✅ Demande envoyée avec succès");
      setMotif("");
      
      // Rafraîchir la liste des demandes
      const res = await axios.get(
        `http://127.0.0.1:8000/api/demandes-attestations/etudiant/${etudiantId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setDemandes(res.data);

    } catch (err) {
      setMessage(`❌ Erreur: ${err.response?.data?.message || err.message}`);
    }
  };

  const getFileUrl = (path) => {
    if (!path) return null;
    const cleanedPath = path.replace('storage/app/public/', '');
    return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${cleanedPath}`;
  };

  if (loading) {
    return <div className="text-center my-4">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2>Demander une attestation</h2>

      {message && (
        <div className={`alert ${message.includes("✅") ? "alert-success" : "alert-danger"}`}>
          {message}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label text-dark">Type d'attestation</label>
            <select
              className="form-select"
              value={typeAttestation}
              onChange={(e) => setTypeAttestation(e.target.value)}
            >
              <option value="scolarite">Attestation de scolarité</option>
              <option value="reussite">Attestation de réussite</option>
              <option value="inscription">Attestation d'inscription</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label text-dark">Motif</label>
            <textarea
              className="form-control"
              rows={3}
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              required
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={envoyerDemande}
            disabled={!etudiantId || motif.trim() === ""}
          >
            Envoyer la demande
          </button>
        </div>
      </div>

      <h3>Mes demandes</h3>
      {demandes.length === 0 ? (
        <p>Aucune demande trouvée</p>
      ) : (
        <ul>
          {demandes.map(d => (
            <li key={d.id}>
              {d.traitee ? (
                <a
                  href={getFileUrl(d.lien_attestation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`attestation_${d.id}.pdf`}
                >
                  📄 Télécharger l'attestation #{d.id}
                </a>
              ) : (
                "⏳ En attente"
              )}
            </li>
          ))}
        </ul>
      )}

     
    </div>
  );
}
