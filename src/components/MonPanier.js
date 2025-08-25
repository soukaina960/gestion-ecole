import React, { useState, useEffect } from "react";
import axios from "axios";
import "./PaiementsProfesseur.css";

const PaiementsProfesseur = () => {
  const [paiementsData, setPaiementsData] = useState({
    paiements: [],
    total_paiements: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [utilisateur, setUtilisateur] = useState(null);
  const [mois, setMois] = useState("");
  const [professeurId, setProfesseurId] = useState(null);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [infosProfesseur, setInfosProfesseur] = useState(null);
  const [montant, setMontant] = useState(0);

  // Récupère les paiements pour le mois sélectionné
  const fetchPaiements = async (mois) => {
    if (!professeurId || !mois) return;
    
    setLoading(true);
    try {
      const response = await api.get(`/professeur/${professeurId}/paiements/${annee}-${mois.padStart(2, '0')}`);
      setPaiementsData(response.data);
      setError(null);
    } catch (err) {
      setError("Erreur lors du chargement des paiements.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Configuration de l'API
  const api = axios.create({
    baseURL: "http://localhost:8000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Récupère l'ID du professeur
  const fetchProfesseurId = async (userId) => {
  try {
    const response = await api.get(`/professeurs?user=${userId}`);
    if (response.data && response.data.length > 0) {
      const professeur = response.data.find(p => p.user_id === userId);
      if (professeur) {
        const profId = professeur.id;
        localStorage.setItem("professeur_id", profId);
        return profId;
      }
    }
    throw new Error("Professeur non trouvé");
  } catch (error) {
    console.error("Erreur fetchProfesseurId:", error);
    setError("Votre compte professeur n'est pas configuré");
    return null;
  }
};

  // Récupère les infos du professeur
  const fetchInfosProfesseur = async () => {
    try {
      const response = await api.get(`/professeurs/${professeurId}`);
      setInfosProfesseur(response.data);
      setMontant(response.data.montant_cours || 0);
    } catch (error) {
      console.error("Erreur lors du chargement des infos du professeur", error);
    }
  };

  // Charge les données utilisateur au montage du composant
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem("utilisateur");
        if (userData) {
          const user = JSON.parse(userData);
          setUtilisateur(user);
          
          if (user?.role === "professeur") {
            const profId = await fetchProfesseurId(user.id);
            if (profId) {
              setProfesseurId(profId);
            }
          }
        }
      } catch (err) {
        console.error("Erreur de chargement utilisateur", err);
        setError("Erreur de chargement des données");
      }
    };

    loadUserData();
  }, []);

  // Charge les infos professeur quand l'ID est disponible
  useEffect(() => {
    if (professeurId) {
      fetchInfosProfesseur();
    }
  }, [professeurId]);

  // Charge les paiements quand le mois ou l'année change
  useEffect(() => {
    if (professeurId && mois) {
      fetchPaiements(mois);
    }
  }, [mois, professeurId, annee]);

  // Gestion des changements de mois/année
  const handleMoisChange = (e) => {
    setMois(e.target.value);
  };

  const handleAnneeChange = (e) => {
    setAnnee(e.target.value);
  };

  // Fonction d'impression
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Paiements ${mois}-${annee}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .paid { background-color: #d4edda; color: #155724; padding: 3px 6px; border-radius: 3px; }
            .unpaid { background-color: #f8d7da; color: #721c24; padding: 3px 6px; border-radius: 3px; }
            .summary { margin-bottom: 20px; display: flex; justify-content: space-between; flex-wrap: wrap; }
            .summary-item { margin: 5px 10px; }
            .signature { margin-top: 40px; text-align: right; }
            @page { size: auto; margin: 10mm; }
          </style>
        </head>
        <body>
          <h2>Liste des Paiements - ${mois}/${annee}</h2>
          <p style="text-align: center;">Professeur: ${utilisateur?.nom} </p>
          
          <div class="summary">
            <div class="summary-item"><strong>Étudiants inscrits:</strong> ${paiementsData.paiements.length}</div>
            <div class="summary-item"><strong>Paiements reçus:</strong> ${paiementsData.paiements.filter(p => p.est_paye === 1).length}</div>
            <div class="summary-item"><strong>Paiements en attente:</strong> ${paiementsData.paiements.length - paiementsData.paiements.filter(p => p.est_paye === 1).length}</div>
            <div class="summary-item"><strong>Total perçu:</strong> ${paiementsData.total_paiements} €</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Statut</th>
         
                <th>Date paiement</th>
              </tr>
            </thead>
            <tbody>
              ${paiementsData.paiements.map(paiement => `
                <tr>
                  <td>${paiement.nom_complet}</td>
                  <td><span class="${paiement.est_paye === 1 ? 'paid' : 'unpaid'}">${paiement.statut_paiement}</span></td>
              
                  <td>${paiement.date_paiement || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="signature">
            <p>Fait le: ${new Date().toLocaleDateString('fr-FR')}</p>
            <p>Signature: _________________________</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  // Calcul des statistiques
  const paiementsPayes = paiementsData.paiements.filter(p => p.est_paye === 1).length;
  const totalARecouvrer = (paiementsData.paiements.length - paiementsPayes) * montant;

  return (
    <div className="container paiements-container">
      <h1>Gestion des Paiements des Étudiants</h1>

      {utilisateur && (
        <div className="welcome-message">
          <p>Bienvenue, Professeur {utilisateur.nom}!</p>
        </div>
      )}

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="annee">Année :</label>
          <select 
            id="annee" 
            value={annee} 
            onChange={handleAnneeChange}
            className="form-select"
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label htmlFor="mois">Mois :</label>
          <select 
            id="mois" 
            value={mois} 
            onChange={handleMoisChange}
            disabled={!professeurId}
            className="form-select"
          >
            <option value="">-- Sélectionnez un mois --</option>
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

        <button 
          onClick={handlePrint} 
          className="btn btn-primary"
          disabled={!paiementsData.paiements.length}
        >
          Imprimer la liste
        </button>
      </div>

      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Chargement en cours...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger">
          {error}
          <button onClick={() => setError(null)} className="close-btn">
            &times;
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {infosProfesseur && (
            <div className="professor-summary">
              <h2>Résumé pour {mois}/{annee}</h2>
              <div className="stats-container">
                <div className="stat-card">
                  <span className="stat-value">{paiementsData.paiements.length}</span>
                  <span className="stat-label">Étudiants inscrits</span>
                </div>
                <div className="stat-card paid">
                  <span className="stat-value">{paiementsPayes}</span>
                  <span className="stat-label">Paiements reçus</span>
                </div>
                <div className="stat-card unpaid">
                  <span className="stat-value">{paiementsData.paiements.length - paiementsPayes}</span>
                  <span className="stat-label">Paiements en attente</span>
                </div>
                <div className="stat-card amount">
                  <span className="stat-value">{totalARecouvrer} €</span>
                  <span className="stat-label">Total à recouvrer</span>
                </div>
                <div className="stat-card total">
                  <span className="stat-value">{paiementsData.total_paiements} €</span>
                  <span className="stat-label">Total perçu</span>
                </div>
              </div>
            </div>
          )}

          {paiementsData.paiements.length === 0 ? (
            <div className="no-data">
              <p>Aucun étudiant trouvé pour cette période.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="paiements-table">
                <thead>
                  <tr>
                    <th>Étudiant</th>
                    <th>Statut</th>
                 
                    <th>Date de paiement</th>
                  </tr>
                </thead>
                <tbody>
                  {paiementsData.paiements.map((paiement, index) => (
                    <tr key={index}>
                      <td>{paiement.nom_complet}</td>
                      <td>
                        <span className={`badge ${paiement.est_paye === 1 ? 'paid' : 'unpaid'}`}>
                          {paiement.statut_paiement}
                        </span>
                      </td>
                     
                      <td>{paiement.date_paiement || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PaiementsProfesseur;