import { useState, useEffect } from 'react';
import axios from 'axios';

import './EmploiDuTemps.css';

export default function EmploiDuTemps() {
  const [emplois, setEmplois] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [classeId, setClasseId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Authentification utilisateur
        const userData = localStorage.getItem('utilisateur');
        if (!userData) throw new Error("Utilisateur non connecté");

        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id;

        // Récupération de l'étudiant
        const etudiantRes = await axios.get('http://127.0.0.1:8000/api/etudiants', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        const etudiant = etudiantRes.data.find(e => e.utilisateur_id === userId);
        if (!etudiant) throw new Error("Aucun étudiant trouvé pour cet utilisateur");

        const classe_id = etudiant.classe_id;
        setClasseId(classe_id);

        // Récupération des créneaux
        const creneauxRes = await axios.get('http://127.0.0.1:8000/api/creneaux');
        setCreneaux(creneauxRes.data);

      } catch (err) {
        setError(err.message || "Une erreur est survenue");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Charger l'emploi du temps quand la classe est connue
  useEffect(() => {
    const fetchEmploiTemps = async () => {
      if (!classeId) return;

      try {
        setLoading(true);
        const res = await axios.get('http://127.0.0.1:8000/api/emplois-temps', {
          params: { classe_id: classeId }
        });
        setEmplois(res.data);
      } catch (err) {
        setError("Erreur de chargement de l'emploi du temps");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmploiTemps();
  }, [classeId]);

  // Trouver tous les cours pour un jour et un créneau donné
  const getCoursList = (jour, creneauId) => {
    return emplois.filter(
      e => e.jour.toLowerCase() === jour.toLowerCase() && e.creneau_id === creneauId
    );
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="emploi-container">
      <h2 className="emploi-title">Emploi du temps</h2>

      <table className="emploi-table">
        <thead>
          <tr>
            <th>Heure / Jour</th>
            {jours.map(jour => (
              <th key={jour}>{jour}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {creneaux.map(creneau => (
            <tr key={creneau.id}>
              <td>{creneau.heure_debut} - {creneau.heure_fin}</td>
              {jours.map(jour => {
                const coursList = getCoursList(jour, creneau.id);
                return (
                  <td key={`${jour}-${creneau.id}`} className={coursList.length > 0 ? 'has-course' : ''}>
                    {coursList.length > 0 ? (
                      coursList.map((cours, idx) => (
                        <div key={idx} className="course-item">
                          <p className="course-name">{cours.matiere.nom}</p>
                          <p className="course-teacher">{cours.professeur.nom}</p>
                          <p className="course-room">{cours.salle}</p>
                          <hr />
                        </div>
                      ))
                    ) : '-'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
