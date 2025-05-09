




import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EmploiDuTemps() {
  const [emplois, setEmplois] = useState([]);
  const [classeId, setClasseId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Jours de la semaine et créneaux horaires
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  const creneaux = [
    { id: 1, heure: '08:00-09:30' },
    { id: 2, heure: '09:30-11:00' },
    // Ajoutez tous vos créneaux...
  ];

  // Charger les données utilisateur
  useEffect(() => {
    const userData = localStorage.getItem('utilisateur');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'étudiant' && parsedUser.classe_id) {
        setClasseId(parsedUser.classe_id);
      }
    }
  }, []);

  // Charger l'emploi du temps
  useEffect(() => {
    const fetchEmploiTemps = async () => {
      if (!classeId) return;
      
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:8000/api/emplois-temps', {
          params: { classe_id: classeId }
        });
        
        setEmplois(res.data);
      } catch (err) {
        setError('Erreur de chargement de l\'emploi du temps');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEmploiTemps();
  }, [classeId]);

  // Trouver le cours pour un jour/créneau donné
  const getCours = (jour, creneauId) => {
    return emplois.find(e => 
      e.jour === jour.toLowerCase() && e.creneau_id === creneauId
    );
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4 overflow-auto">
      <h2 className="text-xl font-bold mb-4">Emploi du temps</h2>
      
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border p-2">Heure/Jour</th>
            {jours.map(jour => (
              <th key={jour} className="border p-2">{jour}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {creneaux.map(creneau => (
            <tr key={creneau.id}>
              <td className="border p-2">{creneau.heure}</td>
              {jours.map(jour => {
                const cours = getCours(jour, creneau.id);
                return (
                  <td key={`${jour}-${creneau.id}`} className="border p-2">
                    {cours ? (
                      <div>
                        <p className="font-medium">{cours.matiere.nom}</p>
                        <p className="text-sm">{cours.professeur.nom}</p>
                        <p className="text-xs">{cours.salle}</p>
                      </div>
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