import React, { useState } from "react";
import axios from "axios";
import './ParentPayment.css';

const ParentPayment = () => {
  const [paiements, setPaiements] = useState([]);
  const [mois, setMois] = useState("");
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const parentId = localStorage.getItem('parent_id');
  const token = localStorage.getItem('access_token');

  const handleMoisChange = (e) => {
    setMois(e.target.value);
    setError('');
    setMessage('');
  };

  const fetchPaiements = async () => {
    if (!mois) {
      setError("Veuillez sélectionner un mois.");
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/paiements/parent/${parentId}/${mois}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPaiements(response.data.data || []);
      setMessage(response.data.message || `Paiements trouvés pour ${mois}`);
    } catch (error) {
      console.error("Erreur lors de la récupération des paiements:", error);
      setError(error.response?.data?.message || "Erreur lors de la récupération des paiements");
      setPaiements([]);
    } finally {
      setLoading(false);
    }
  };

  const generateReceipt = (paiementId) => {
    window.open(
      `http://127.0.0.1:8000/api/paiement/receipt/${parentId}/${paiementId}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="container">
      <h2 className="title">Suivi des Paiements</h2>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <div className="formGroup">
        <label className="label">Sélectionnez le mois :</label>
        <select 
          value={mois} 
          onChange={handleMoisChange} 
          className="select"
          disabled={loading}
        >
          <option value="">--Choisissez un mois--</option>
          {["janvier", "février", "mars", "avril", "mai", "juin", 
            "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
            .map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
        </select>
        <button 
          onClick={fetchPaiements} 
          className="primaryButton"
          disabled={loading || !mois}
        >
          {loading ? 'Chargement...' : 'Afficher les paiements'}
        </button>
      </div>

      {loading && <p className="loading">Chargement en cours...</p>}

      {paiements.length > 0 ? (
        <div className="paymentList">
          <h3 className="sectionTitle">Paiements pour {mois.charAt(0).toUpperCase() + mois.slice(1)} :</h3>
          {paiements.map((paiement) => (
            <div key={paiement.id} className="paymentItem">
              <p><strong>Étudiant:</strong> {paiement.etudiant?.nom || paiement.etudiant_id}</p>
              <p><strong>Date de paiement:</strong> {formatDate(paiement.date_paiement)}</p>
              <p><strong>Statut:</strong> 
                <span className={paiement.est_paye ? "status paid" : "status unpaid"}>
                  {paiement.est_paye ? "Payé" : "Non payé"}
                </span>
              </p>
              <button 
                className="receiptButton" 
                onClick={() => generateReceipt(paiement.id)}
                disabled={!paiement.est_paye}
                title={!paiement.est_paye ? "Reçu disponible seulement pour les paiements validés" : ""}
              >
                Télécharger le reçu
              </button>
            </div>
          ))}
        </div>
      ) : (
        !loading && mois && <p className="no-results">Aucun paiement trouvé pour ce mois.</p>
      )}
    </div>
  );
};

export default ParentPayment;