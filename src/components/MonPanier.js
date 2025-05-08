import React, { useState, useEffect } from "react";
import axios from "axios";

const MonPanier = () => {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [utilisateur, setUtilisateur] = useState(null);
  const [mois, setMois] = useState("");
  const [professeurId, setProfesseurId] = useState(null);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [infosProfesseur, setInfosProfesseur] = useState(null);

  const fetchPaiements = async (mois) => {
    try {
      setLoading(true);
      setError(null);

      if (!mois) {
        setPaiements([]);
        return;
      }

      const response = await axios.get(
        `http://localhost:8000/api/professeur/${professeurId}/paiements/${annee}-${mois}`
      );

      setPaiements(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors du chargement des paiements.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInfosProfesseur = async () => {
    try {
      if (!professeurId) return;

      const response = await axios.get(`http://localhost:8000/api/professeurs/${professeurId}`);
      setInfosProfesseur(response.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des infos professeur", err);
      setError("Erreur lors du chargement des infos du professeur.");
    }
  };

  useEffect(() => {
    try {
      const userData = localStorage.getItem("utilisateur");
      if (userData) {
        const user = JSON.parse(userData);
        setUtilisateur(user);
        if (user?.role === "professeur") {
          setProfesseurId(user.id);
        }
      }
    } catch (err) {
      console.error("Erreur de chargement des données utilisateur", err);
      setError("Erreur de chargement des données utilisateur");
    }
  }, []);

  useEffect(() => {
    if (professeurId) {
      fetchInfosProfesseur();
    }
  }, [professeurId]);

  useEffect(() => {
    if (professeurId && mois) {
      fetchPaiements(mois);
    }
  }, [mois, professeurId, annee]);

  const handleMoisChange = (e) => {
    setMois(e.target.value.padStart(2, '0'));
  };

  const handleAnneeChange = (e) => {
    setAnnee(e.target.value);
  };

  const printTotal = () => {
    if (infosProfesseur) {
      window.print();
    }
  };

  return (
    <div className="container">
      <h1>Paiements des étudiants</h1>

      {utilisateur && (
        <p>Bienvenue, {utilisateur.nom}!</p>
      )}

      {infosProfesseur && (
        <div className="prof-info">
          <p><strong>Total reçu :</strong> {infosProfesseur.total} dh</p>
          <button onClick={printTotal} className="btn btn-primary">
            Imprimer le total
          </button>
        </div>
      )}

      <div className="filters">
        <div>
          <label htmlFor="annee">Année :</label>
          <select 
            id="annee" 
            value={annee} 
            onChange={handleAnneeChange}
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="mois">Mois :</label>
          <select 
            id="mois" 
            value={mois} 
            onChange={handleMoisChange}
            disabled={!professeurId}
          >
            <option value="">-- Tous les mois --</option>
            {Array.from({length: 12}, (_, i) => {
              const monthNum = (i + 1).toString().padStart(2, '0');
              const monthName = new Date(2000, i, 1).toLocaleString('fr-FR', { month: 'long' });
              return (
                <option key={monthNum} value={monthNum}>
                  {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {loading && <div className="loading"></div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          {paiements.length === 0 ? (
            <p>Aucun paiement trouvé pour cette période.</p>
          ) : (
            <table className="paiements-table">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Mois</th>
                  <th>Statut</th>
                  <th>Date de paiement</th>
                </tr>
              </thead>
              <tbody>
                {paiements.map((paiement, index) => (
                  <tr key={index}>
                    <td>{paiement.nom_complet}</td>
                    <td>{paiement.mois}</td>
                    <td>
                      <span className={`badge ${paiement.est_paye ? 'paid' : 'unpaid'}`}>
                        {paiement.est_paye ? 'Payé' : 'Impayé'}
                      </span>
                    </td>
                    <td>{paiement.est_paye ? paiement.date_paiement : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default MonPanier;
