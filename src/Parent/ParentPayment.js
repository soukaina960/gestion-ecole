import React, { useState } from "react";
import axios from "axios";
import './ParentPayment.css'; // Import the CSS file

const ParentPayment = () => {
  const [paiements, setPaiements] = useState([]);
  const [mois, setMois] = useState("");
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const parentId = localStorage.getItem('parent_id');
  const token = localStorage.getItem('access_token');

  const handleMoisChange = (e) => {
    setMois(e.target.value);
  };

  const fetchPaiements = () => {
    if (!mois) {
      setError("Veuillez sélectionner un mois.");
      return;
    }

    axios.get(`http://127.0.0.1:8000/api/paiements/parent/${parentId}/${mois}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((response) => {
        setPaiements(response.data);
        setMessage("Paiements récupérés avec succès.");
        setError('');
      })
      .catch((error) => {
        console.error(error);
        setError("Erreur lors de la récupération des paiements.");
        setMessage('');
      });
  };

  const generateReceipt = (paiementId) => {
    window.open(`http://127.0.0.1:8000/api/paiement/receipt/${parentId}/${mois}`, '_blank');
  };

  return (
    <div className="container">
      <h2 className="title">Suivi des Paiements</h2>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="formGroup">
        <label className="label">Sélectionnez le mois :</label>
        <select value={mois} onChange={handleMoisChange} className="select">
          <option value="">--Choisissez un mois--</option>
          {["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"].map((m) => (
            <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
          ))}
        </select>
        <button onClick={fetchPaiements} className="primaryButton">Afficher les paiements</button>
      </div>

      {paiements.length > 0 && (
        <div className="paymentList">
          <h3 className="sectionTitle">Paiements pour {mois} :</h3>
          {paiements.map((paiement) => (
            <div key={paiement.id} className="paymentItem">
              <p><strong>ID de l'étudiant:</strong> {paiement.etudiant_id}</p>
              <p><strong>Date de paiement:</strong> {paiement.date_paiement}</p>
              <p><strong>Status du paiement:</strong> {paiement.est_paye ? "Payé" : "Non payé"}</p>
              <button className="receiptButton" onClick={() => generateReceipt(paiement.id)}>
                Télécharger le reçu
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentPayment;
