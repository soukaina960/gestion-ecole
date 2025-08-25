import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

import './EmploiProf.css';

export default function EmploiProf() {
  const emploiTempsRef = useRef(); // ✅ useRef à l'intérieur du composant

  const [creneaux, setCreneaux] = useState([]); // Tous les créneaux horaires fixes
  const [emplois, setEmplois] = useState([]);   // Les cours du prof avec créneaux
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [professeurId, setProfesseurId] = useState(null);

  const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

  // Récupérer professeurId depuis user stocké
  const fetchProfesseurId = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/professeurs?user=${userId}`);
      if (response.data && response.data.length > 0) {
        const professeur = response.data.find(p => p.user_id === userId);
        if (professeur) {
          localStorage.setItem("professeur_id", professeur.id);
          return professeur.id;
        }
      }
      throw new Error("Professeur non trouvé");
    } catch (err) {
      setError("Votre compte professeur n'est pas configuré");
      return null;
    }
  };

  // Récupérer tous les créneaux horaires fixes
  const fetchCreneaux = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/creneaux');
      // Trier par heure_debut
      const sorted = response.data.sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));
      return sorted;
    } catch (err) {
      setError("Impossible de charger les créneaux horaires");
      return [];
    }
  };

  // Récupérer l'emploi du temps du prof
  const fetchEmploiDuTemps = async (profId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/emplois-temps/professeur/${profId}`);
      return response.data;
    } catch (err) {
      setError("Impossible de charger l'emploi du temps");
      return [];
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const userData = localStorage.getItem("utilisateur");
        if (!userData) {
          setError("Utilisateur non connecté");
          setLoading(false);
          return;
        }
        const user = JSON.parse(userData);
        if (user?.role !== "professeur") {
          setError("Accès réservé aux professeurs");
          setLoading(false);
          return;
        }

        let profId = localStorage.getItem("professeur_id");
        if (!profId) {
          profId = await fetchProfesseurId(user.id);
          if (!profId) {
            setLoading(false);
            return;
          }
        }
        setProfesseurId(profId);

        // Récupérer les créneaux fixes
        const creneauxData = await fetchCreneaux();
        setCreneaux(creneauxData);

        // Récupérer l'emploi du temps
        const emploisData = await fetchEmploiDuTemps(profId);
        setEmplois(emploisData);
      } catch (err) {
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Trouver le cours pour un jour et un créneau donné
  const getCours = (jour, creneauId) => {
    return emplois.find(e => e.jour.toLowerCase() === jour && e.creneau_id === creneauId);
  };

  const handleDownloadPdf = () => {
    const element = emploiTempsRef.current;
    if (!element) {
      alert("Le contenu à télécharger n'est pas prêt.");
      return;
    }
    const opt = {
      margin: 1,
      filename: 'emploi_du_temps.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  if (loading) return (
    <div className="emploi-container">
      <div className="loading-spinner"></div>
      <p>Chargement de l'emploi du temps...</p>
    </div>
  );

  if (error) return (
    <div className="emploi-container error-message">
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="refresh-button">
        Réessayer
      </button>
    </div>
  );

  return (
    <div className="emploi-container">
      <div className="emploi-header">
        <h2>Votre Emploi du Temps</h2>
        {emplois.length > 0 && (
          <button className="btn btn-outline-primary mb-3" onClick={handleDownloadPdf}>
            📄 Télécharger le PDF
          </button>
        )}
      </div>

      {/* Le ref ici permet de cibler cette zone pour la génération PDF */}
      <div className="table-container" ref={emploiTempsRef}>
        <table className="emploi-table">
          <thead>
            <tr>
              <th className="time-column">Créneau</th>
              {joursSemaine.map(jour => (
                <th key={jour} className="day-header">{jour.charAt(0).toUpperCase() + jour.slice(1)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {creneaux.length === 0 ? (
              <tr><td colSpan={joursSemaine.length + 1}>Aucun créneau horaire trouvé</td></tr>
            ) : (
              creneaux.map(creneau => (
                <tr key={creneau.id}>
                  <td className="time-cell">{creneau.heure_debut.slice(0,5)} - {creneau.heure_fin.slice(0,5)}</td>
                  {joursSemaine.map(jour => {
                    const cours = getCours(jour, creneau.id);
                    return (
                      <td key={`${jour}-${creneau.id}`} className="course-cell">
                        {cours ? (
                          <div className="course-card">
                            <div className="course-title">{cours.matiere.nom}</div>
                            <div className="course-details">
                              <span>Classe: {cours.classe.name}</span><br />
                              <span>Salle: {cours.salle}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="empty-slot">—</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
