import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EtudiantNotes = () => {
  const [annees, setAnnees] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [selectedAnnee, setSelectedAnnee] = useState('');
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState({ annees: false, semestres: false, notes: false });
  const [error, setError] = useState('');
  const [utilisateur, setUtilisateur] = useState(null);

  // Charger les données de l'utilisateur à partir du localStorage
  useEffect(() => {
    const chargerUtilisateur = () => {
      const userData = localStorage.getItem('utilisateur');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUtilisateur(parsedUser);
      } else {
        setError("Aucun utilisateur connecté détecté");
      }
    };

    chargerUtilisateur();
  }, []);

  // Charger les années scolaires et semestres après la connexion de l'utilisateur
  useEffect(() => {
    if (!utilisateur) return;

    // Charger les années scolaires
    setLoading(prev => ({ ...prev, annees: true }));
    axios.get('http://127.0.0.1:8000/api/annees_scolaires')
      .then(res => {
        if (res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setAnnees(res.data.data);  // Accès correct à data
        } else {
          setError("Aucune année scolaire disponible");
        }
      })
      .catch(err => {
        console.error("Erreur années scolaires:", err);
        setError("Erreur lors du chargement des années scolaires");
      })
      .finally(() => setLoading(prev => ({ ...prev, annees: false })));

    // Charger les semestres
    setLoading(prev => ({ ...prev, semestres: true }));
    axios.get('http://127.0.0.1:8000/api/semestres')
      .then(res => {
        if (Array.isArray(res.data.data) && res.data.data.length > 0) {
          setSemestres(res.data.data);  // Accès correct à data
        } else {
          setError("Aucun semestre disponible");
        }
      })
      .catch(err => {
        console.error("Erreur semestres:", err);
        setError("Erreur lors du chargement des semestres");
      })
      .finally(() => setLoading(prev => ({ ...prev, semestres: false })));
  }, [utilisateur]);

  // Fonction de recherche des notes en fonction de l'année et du semestre sélectionnés
  const handleSearch = () => {
    if (!utilisateur) {
      setError("Vous devez être connecté pour voir vos notes");
      return;
    }

    if (!selectedAnnee || !selectedSemestre) {
      setError("Veuillez sélectionner une année et un semestre");
      return;
    }

    setLoading(prev => ({ ...prev, notes: true }));
    setError('');

    axios.get(`http://127.0.0.1:8000/api/notes-etudiant/${utilisateur.id}`, {
      params: {
        annee_scolaire_id: selectedAnnee,
        semestre_id: selectedSemestre,
      }
    })
    .then(res => {
      setNotes(res.data || []);
    })
    .catch(err => {
      console.error("Erreur API notes:", err);
      setError("Erreur lors de la récupération des notes");
    })
    .finally(() => setLoading(prev => ({ ...prev, notes: false })));
  };

  // Si aucun utilisateur n'est connecté, on affiche un message d'erreur
  if (!utilisateur) {
    return <div className="alert alert-danger">Aucun utilisateur connecté.</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Consulter mes notes</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="form-group">
            <label>Année scolaire :</label>
            <select
              className="form-control"
              value={selectedAnnee}
              onChange={e => setSelectedAnnee(e.target.value)}
              disabled={loading.annees}
            >
              <option value="">-- Choisir --</option>
              {annees.map(annee => (
                <option key={annee.id} value={annee.id}>
                  {annee.annee}
                </option>
              ))}
            </select>
            {loading.annees && <small className="text-muted">Chargement...</small>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label>Semestre :</label>
            <select
              className="form-control"
              value={selectedSemestre}
              onChange={e => setSelectedSemestre(e.target.value)}
              disabled={loading.semestres}
            >
              <option value="">-- Choisir --</option>
              {semestres.length > 0 ? (
                semestres.map(semestre => (
                  <option key={semestre.id} value={semestre.id}>
                    {semestre.nom}
                  </option>
                ))
              ) : (
                <option>Aucun semestre disponible</option>
              )}
            </select>
            {loading.semestres && <small className="text-muted">Chargement...</small>}
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={loading.notes || !selectedAnnee || !selectedSemestre}
        >
          {loading.notes ? 'Chargement...' : 'Voir mes notes'}
        </button>
      </div>

      {notes.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead>
              <tr>
                <th>Matière</th>
                <th>Note 1</th>
                <th>Note 2</th>
                <th>Note 3</th>
                <th>Note 4</th>
                <th>Note finale</th>
                <th>Remarque</th>
              </tr>
            </thead>
            <tbody>
  {notes.map((note, index) => (
    <tr key={index}>
      <td>{note.specialite || 'Aucune spécialité'}</td>
      <td>{note.note1 != null ? parseFloat(note.note1).toFixed(2) : '-'}</td>
      <td>{note.note2 != null ? parseFloat(note.note2).toFixed(2) : '-'}</td>
      <td>{note.note3 != null ? parseFloat(note.note3).toFixed(2) : '-'}</td>
      <td>{note.note4 != null ? parseFloat(note.note4).toFixed(2) : '-'}</td>
      <td>{note.note_finale != null ? parseFloat(note.note_finale).toFixed(2) : '-'}</td>
      <td>{note.remarque || 'Aucune remarque'}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default EtudiantNotes;
