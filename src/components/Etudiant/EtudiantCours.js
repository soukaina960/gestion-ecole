import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EtudiantCours = () => {
  const [fichiers, setFichiers] = useState([]);
  const [etudiant, setEtudiant] = useState(null);
  const [semestreId, setSemestreId] = useState(1); // ou sélection depuis un menu déroulant
  const [classeId, setClasseId] = useState(2); // à récupérer selon l'utilisateur connecté

  useEffect(() => {
    const userData = localStorage.getItem('utilisateur');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setEtudiant(parsedUser);

      axios.get('http://127.0.0.1:8000/api/fichiers-etudiant', {
        params: {
          classe_id: classeId, // Assurez-vous que classe_id est bien défini
          semestre_id: semestreId, // semestre_id doit également être défini
        }
      })
      .then(res => setFichiers(res.data))
      .catch(err => console.error("Erreur chargement fichiers :", err));
    }
  }, [semestreId, classeId]);

  return (
    <div className="container mt-4">
      <h2>Fichiers disponibles</h2>

      <div className="form-group">
        <label htmlFor="semestreSelect">Sélectionner un semestre:</label>
        <select
          id="semestreSelect"
          className="form-control"
          value={semestreId}
          onChange={(e) => setSemestreId(Number(e.target.value))}
        >
          <option value={1}>Semestre 1</option>
          <option value={2}>Semestre 2</option>
        </select>
      </div>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Type</th>
            <th>Nom du fichier</th>
            <th>Spécialité</th>
            <th>Télécharger</th>
          </tr>
        </thead>
        <tbody>
          {fichiers.map((fichier, index) => (
            <tr key={index}>
              <td>{fichier.type_fichier}</td>
              <td>{fichier.nom_fichier}</td>
              <td>{fichier.specialite}</td>
              <td>
                <a
                  href={`http://127.0.0.1:8000/${fichier.chemin_fichier}`}
                  download
                >
                  Télécharger
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EtudiantCours;
