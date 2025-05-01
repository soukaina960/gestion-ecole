import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const joursSemaine = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const EmploiTempsParProf = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [selectedProf, setSelectedProf] = useState('');
  const [emploiTemps, setEmploiTemps] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const emploiTempsRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:8000/api/professeurs')
      .then(res => setProfesseurs(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedProf) {
      axios.get(`http://localhost:8000/api/emplois-temps/professeur/${selectedProf}`)
        .then(res => {
          setEmploiTemps(res.data);

          // Extraire et trier les créneaux distincts
          const unique = {};
          res.data.forEach(e => {
            const key = e.creneau?.heure_debut;
            if (key && !unique[key]) unique[key] = e.creneau;
          });

          const sorted = Object.values(unique).sort((a, b) =>
            a.heure_debut.localeCompare(b.heure_debut)
          );
          setCreneaux(sorted);
        })
        .catch(err => console.error(err));
    }
  }, [selectedProf]);

  const getSeance = (jour, heure_debut) => {
    return emploiTemps.find(e => e.jour === jour && e.creneau?.heure_debut === heure_debut);
  };

  const handleDownloadPdf = () => {
    const element = emploiTempsRef.current;
    const opt = {
      margin:       1,
      filename:     'emploi_du_temps.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="container mt-4">
      <h4>Emploi du temps du professeur</h4>

      <select className="form-select mb-3" value={selectedProf} onChange={(e) => setSelectedProf(e.target.value)}>
        <option value="">-- Choisir un professeur --</option>
        {professeurs.map(prof => (
          <option key={prof.id} value={prof.id}>{prof.nom} {prof.prenom}</option>
        ))}
      </select>

      {selectedProf && emploiTemps.length > 0 && (
        <button className="btn btn-outline-primary mb-3" onClick={handleDownloadPdf}>
          📄 Télécharger le PDF
        </button>
      )}

      {emploiTemps.length > 0 ? (
        <div ref={emploiTempsRef}>
          <table className="table table-bordered text-center">
            <thead className="table-light">
              <tr>
                <th>Jour / Heure</th>
                {creneaux.map((c, i) => (
                  <th key={i}>{c.heure_debut} - {c.heure_fin}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {joursSemaine.map((jour, i) => (
                <tr key={i}>
                  <td><strong>{jour}</strong></td>
                  {creneaux.map((c, j) => {
                    const seance = getSeance(jour, c.heure_debut);
                    return (
                      <td key={j}>
                        {seance ? (
                          <>
                            {seance.matiere?.nom}<br />
                            {seance.classe?.name}<br />
                            Salle {seance.salle}
                          </>
                        ) : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : selectedProf ? (
        <p>Aucun emploi du temps trouvé pour ce professeur.</p>
      ) : (
        <p>Sélectionnez un professeur pour afficher son emploi du temps.</p>
      )}
    </div>
  );
};

export default EmploiTempsParProf;
