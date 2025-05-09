import React, { useState, useEffect } from "react";
import axios from "axios";

const ParentProfile = () => {
  const [paiements, setPaiements] = useState([]);
  const [mois, setMois] = useState("");  // Variable to store selected month
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const parentId = localStorage.getItem('parent_id');
  const token = localStorage.getItem('access_token'); 
  console.log("Parent ID:", parentId);


  // Fonction pour récupérer les paiements en fonction du mois sélectionné
  const handleMoisChange = (e) => {
    setMois(e.target.value);
  };

  const fetchPaiements = () => {
    if (!mois) {
      setError("Veuillez sélectionner un mois.");
      return;
    }
    console.log(localStorage.getItem('token'));
    console.log(token);

    
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

  // Fonction pour générer le reçu PDF
  const generateReceipt = () => {
    window.open(`http://127.0.0.1:8000/api/paiement/receipt/${parentId}/${mois}`, '_blank');
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Mon Profil</h2>
      
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Sélection du mois */}
      <div>
        <label>Sélectionner le mois :</label>
        <select value={mois} onChange={handleMoisChange}>
          <option value="">--Choisir le mois--</option>
          <option value="mai">Mai</option>
          <option value="juin">Juin</option>
          <option value="juillet">Juillet</option>
          <option value="août">Août</option>
          <option value="septembre">Septembre</option>
          <option value="octobre">Octobre</option>
          <option value="novembre">Novembre</option>
          <option value="décembre">Décembre</option>
          <option value="janvier">Janvier</option>
          <option value="février">Février</option>
          <option value="mars">Mars</option>
          <option value="avril">Avril</option>

          {/* Ajoutez d'autres mois ici */}
        </select>
        <button onClick={fetchPaiements}>Afficher les paiements</button>
      </div>

      {/* Liste des paiements */}
      {paiements.length > 0 && (
        <div>
          <h3>Paiements pour le mois de {mois} :</h3>
          <ul>
            {paiements.map((paiement) => (
              <li key={paiement.id}>
                <p>Étudiant ID: {paiement.etudiant_id}</p>
                <p>Date de paiement: {paiement.date_paiement}</p>
                <p>Est payé: {paiement.est_paye ? "Oui" : "Non"}</p>
                <button
                  style={{ padding: "5px 10px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px" }}
                  onClick={() => generateReceipt(paiement.id)}
                >
                  Générer Recette (Skolyx)
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ParentProfile;
