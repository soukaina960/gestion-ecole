import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';

const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

const EmploiDuTemps = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClasseId, setSelectedClasseId] = useState('');
  const [emplois, setEmplois] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [selectedSeance, setSelectedSeance] = useState(null);
  const emploiRef = useRef(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/classes')
      .then(res => res.json())
      .then(data => setClasses(data));
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/creneaux')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));
        setCreneaux(sorted);
      });
  }, []);

  useEffect(() => {
    if (selectedClasseId) {
      fetch(`http://127.0.0.1:8000/api/emplois-temps/${selectedClasseId}`)
        .then(res => res.json())
        .then(data => setEmplois(data));
    }
  }, [selectedClasseId]);

  const getSeance = (jour, creneauId) => {
    const seance = emplois.find(e => e.jour === jour && e.creneau_id === creneauId);
    if (seance) {
      return (
        <div className="space-y-1">
          <div><strong>{seance.matiere?.nom}</strong></div>
          <div>{seance.professeur?.nom}</div>
          <div>Salle: {seance.salle}</div>
          <div className="flex justify-center gap-2 mt-1">
            <button onClick={() => setSelectedSeance(seance)} className="text-blue-600 hover:underline text-xs">Modifier</button>
            <button onClick={() => supprimerSeance(seance.id)} className="text-red-600 hover:underline text-xs">Supprimer</button>
          </div>
        </div>
      );
    }
    return <span>—</span>;
  };

  const supprimerSeance = (id) => {
    if (window.confirm('Supprimer cette séance ?')) {
      fetch(`http://127.0.0.1:8000/api/emplois-temps/${id}`, {
        method: 'DELETE',
      }).then(() => {
        setEmplois(prev => prev.filter(e => e.id !== id));
      });
    }
  };

  const telechargerPDF = () => {
    const element = emploiRef.current;
    const opt = {
      margin:       0.5,
      filename:     'emploi-du-temps.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Emploi du temps</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Classe :</label>
        <select
          className="border p-2 rounded"
          value={selectedClasseId}
          onChange={(e) => setSelectedClasseId(e.target.value)}
        >
          <option value="">-- Choisir une classe --</option>
          {classes.map(classe => (
            <option key={classe.id} value={classe.id}>{classe.nom}</option>
          ))}
        </select>
      </div>

      {selectedClasseId && (
        <>
          <div className="flex justify-end mb-4 gap-4">
            <button
              onClick={telechargerPDF}
              className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
            >
              Télécharger PDF
            </button>
          </div>

          <div className="overflow-x-auto" ref={emploiRef}>
            <table className="table-auto border-collapse w-full text-sm text-center">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Jour / Créneau</th>
                  {creneaux.map(cr => (
                    <th key={cr.id} className="border px-4 py-2">
                      {cr.heure_debut.slice(0, 5)} - {cr.heure_fin.slice(0, 5)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jours.map(jour => (
                  <tr key={jour}>
                    <td className="border font-bold px-4 py-2 text-left">{jour}</td>
                    {creneaux.map(cr => (
                      <td key={cr.id} className="border px-2 py-2">
                        {getSeance(jour, cr.id)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedSeance && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 shadow">
            <h3 className="text-lg font-bold mb-4">Modifier la séance</h3>
            {/* Tu peux mettre ici un formulaire de modification */}
            <p>Matière : {selectedSeance.matiere?.nom}</p>
            <p>Professeur : {selectedSeance.professeur?.nom}</p>
            <p>Salle : {selectedSeance.salle}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedSeance(null)}
                className="text-gray-700 px-3 py-1 border rounded hover:bg-gray-100"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmploiDuTemps;
