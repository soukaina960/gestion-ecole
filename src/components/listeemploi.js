import React, { useState, useEffect } from 'react';
import './style.css'; 
import axios from 'axios';

const EmploiDuTempsComplet = () => {
  const [classes, setClasses] = useState([]);
  const [emplois, setEmplois] = useState({});
  const [matieres, setMatieres] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: 'http://localhost:8000/api',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, matieresRes, professeursRes, creneauxRes] = await Promise.all([
          api.get('/classes'),
          api.get('/matieres'),
          api.get('/professeurs'),
          api.get('/creneaux')
        ]);

        setClasses(classesRes.data);
        setMatieres(matieresRes.data);
        setProfesseurs(professeursRes.data);
        setCreneaux(creneauxRes.data);

        // Charger les emplois du temps pour toutes les classes
        const emploisData = {};
        for (const classe of classesRes.data) {
          try {
            const res = await api.get(`/emplois-temps/${classe.id}`);
            emploisData[classe.id] = res.data;
          } catch (err) {
            console.error(`Erreur chargement emploi temps classe ${classe.id}:`, err);
            emploisData[classe.id] = [];
          }
        }
        setEmplois(emploisData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMatiereName = (id) => matieres.find(m => m.id === id)?.nom || 'Inconnue';
  const getProfesseurName = (id) => professeurs.find(p => p.id === id)?.nom || 'Inconnu';

  const getCoursPourCreneau = (classeId, jour, creneauId) => {
    return emplois[classeId]?.filter(c => 
      c.jour === jour && 
      c.creneau_id === creneauId
    ) || [];
  };

  if (loading) return <div className="loading">Chargement en cours...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  return (
    <div className="emploi-complet-container">
      <h1>Emplois du temps complets</h1>
      
      <div className="controls">
        <select 
          value={selectedClasse || ''}
          onChange={(e) => setSelectedClasse(e.target.value)}
        >
          <option value="">Toutes les classes</option>
          {classes.map(classe => (
            <option key={classe.id} value={classe.id}>{classe.nom}</option>
          ))}
        </select>
      </div>

      {selectedClasse ? (
        <EmploiClasse 
          classe={classes.find(c => c.id == selectedClasse)} 
          emploi={emplois[selectedClasse]} 
          jours={jours}
          creneaux={creneaux}
          getMatiereName={getMatiereName}
          getProfesseurName={getProfesseurName}
        />
      ) : (
        classes.map(classe => (
          <EmploiClasse 
            key={classe.id}
            classe={classe}
            emploi={emplois[classe.id]}
            jours={jours}
            creneaux={creneaux}
            getMatiereName={getMatiereName}
            getProfesseurName={getProfesseurName}
          />
        ))
      )}
    </div>
  );
};

const EmploiClasse = ({ classe, emploi, jours, creneaux, getMatiereName, getProfesseurName }) => {
  const getCoursPourCreneau = (jour, creneauId) => {
    return emploi?.filter(c => 
      c.jour === jour && 
      c.creneau_id === creneauId
    ) || [];
  };

  return (
    <div className="emploi-classe-card">
      <h2>{classe.nom}</h2>
      <div className="emploi-table-container">
        <table className="emploi-table">
          <thead>
            <tr>
              <th>Créneau</th>
              {jours.map(jour => (
                <th key={jour}>{jour}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {creneaux.map(creneau => (
              <tr key={creneau.id}>
                <td className="creneau-cell">
                  {creneau.heure_debut} - {creneau.heure_fin}
                </td>
                {jours.map(jour => {
                  const cours = getCoursPourCreneau(jour, creneau.id);
                  return (
                    <td key={`${jour}-${creneau.id}`}>
                      {cours.length > 0 ? (
                        <div className="seances-container">
                          {cours.map(seance => (
                            <div key={seance.id} className="seance-card">
                              <div className="seance-matiere">{getMatiereName(seance.matiere_id)}</div>
                              <div className="seance-prof">{getProfesseurName(seance.professeur_id)}</div>
                              <div className="seance-salle">{seance.salle}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="seance-vide"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmploiDuTempsComplet;