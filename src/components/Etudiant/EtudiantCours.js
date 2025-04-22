import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EtudiantCours = () => {
  const [fichiers, setFichiers] = useState([]);
  const [etudiant, setEtudiant] = useState(null);
  const [semestreId, setSemestreId] = useState(1);
  const [classeId, setClasseId] = useState(null);
  const [matieres, setMatieres] = useState([]);
  const [matiereId, setMatiereId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('utilisateur');

    if (userData) {
      const parsedUser = JSON.parse(userData);
      setEtudiant(parsedUser);

      if (parsedUser.classe_id) {
        setClasseId(parsedUser.classe_id);
      }

      axios.get('http://127.0.0.1:8000/api/matieres')
        .then(res => {
          if (res.data.success) {
            setMatieres(res.data.data);
          }
        })
        .catch(err => console.error("Erreur chargement matières :", err));
    }
  }, []);

  useEffect(() => {
    if (classeId && semestreId) {
      axios.get('http://127.0.0.1:8000/api/fichiers-etudiant', {
        params: {
          classe_id: classeId,
          semestre_id: semestreId,
          matiere_id: matiereId
        }
      })
        .then(res => {
          setFichiers(res.data);
        })
        .catch(err => {
          console.error("Erreur API fichiers :", err);
        });
    }
  }, [classeId, semestreId, matiereId]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📂 Fichiers pédagogiques</h2>

      <div className="form-group mb-3">
        <label>Sélectionner un semestre :</label>
        <select className="form-control" value={semestreId} onChange={e => setSemestreId(Number(e.target.value))}>
          <option value={1}>Semestre 1</option>
          <option value={2}>Semestre 2</option>
        </select>
      </div>

      <div className="form-group mb-3">
        <label>Sélectionner une matière :</label>
        <select className="form-control" value={matiereId || ''} onChange={e => setMatiereId(Number(e.target.value) || null)}>
          <option value="">Toutes les matières</option>
          {matieres.map(m => (
            <option key={m.id} value={m.id}>{m.nom}</option>
          ))}
        </select>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Type</th>
            <th>Nom du fichier</th>
            <th>Spécialité</th>
            <th>Télécharger</th>
          </tr>
        </thead>
        <tbody>
          {fichiers.length > 0 ? (
            fichiers.map((f, i) => (
              <tr key={i}>
                <td>{f.type_fichier}</td>
                <td>{f.nom_fichier}</td>
                <td>{f.specialite}</td>
                <td>
                <a
                      href={`http://127.0.0.1:8000/api/fichiers-pedagogiques/download/${f.id}`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-sm btn-primary"
                    >
                      Télécharger
                    </a>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">Aucun fichier trouvé.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EtudiantCours;
