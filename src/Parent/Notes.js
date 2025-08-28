import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotesDashboard = () => {
  const [parent, setParent] = useState(null);
  const [enfants, setEnfants] = useState([]);
  const [annees, setAnnees] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [selectedAnnee, setSelectedAnnee] = useState('');
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [notes, setNotes] = useState({});
  const [error, setError] = useState('');
  const [selectedEnfantId, setSelectedEnfantId] = useState('');
  const parentId = localStorage.getItem('parent_id');
  const [bulletinsDisponibles, setBulletinsDisponibles] = useState({});

  // Fonction pour récupérer les notes
  const handleFetchNotes = async () => {
    setError('');
    if (!selectedAnnee || !selectedSemestre) {
      setError('Veuillez choisir une année et un semestre.');
      return;
    }
    if (!selectedEnfantId) {
      setError('Veuillez choisir un enfant.');
      return;
    }
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/notes-parent', {
        params: {
          parent_id: parentId,
          semestre_id: selectedSemestre,
          annee_scolaire_id: selectedAnnee,
        },
      });

      setNotes(res.data);

      // Vérifier bulletins disponibles
      const bulletinsMap = {};
      const enfantIds = Object.keys(res.data);

      await Promise.all(
        enfantIds.map(async (enfantId) => {
          try {
            const existsRes = await axios.get(
              `http://127.0.0.1:8000/api/bulletin/existe/${enfantId}/${selectedSemestre}/${selectedAnnee}`
            );
            bulletinsMap[enfantId] = existsRes.data.existe;
          } catch (err) {
            bulletinsMap[enfantId] = false;
          }
        })
      );

      setBulletinsDisponibles(bulletinsMap);
    } catch (err) {
      setError('Erreur lors de la récupération des notes.');
    }
  };

  useEffect(() => {
    if (parentId) {
      axios
        .get('http://127.0.0.1:8000/api/etudiants')
        .then((res) => {
          const enfantsFiltres = res.data.filter(
            (enf) => enf.parent_id === parseInt(parentId)
          );
          setEnfants(enfantsFiltres);
        })
        .catch(() => setError('Erreur lors du chargement des enfants.'));
    }
  }, [parentId]);

  useEffect(() => {
    const storedParent = localStorage.getItem('utilisateur');
    if (storedParent) {
      try {
        const parsedParent = JSON.parse(storedParent);
        setParent(parsedParent);
      } catch (e) {
        setError('Erreur de lecture des données parent.');
      }
    }
  }, []);

  useEffect(() => {
    if (parent) {
      // Chargement années scolaires
      axios
        .get('http://127.0.0.1:8000/api/annees_scolaires')
        .then((res) => setAnnees(res.data))
        .catch(() => setError('Erreur lors du chargement des années.'));

      // Chargement semestres
      axios
        .get('http://127.0.0.1:8000/api/semestres')
        .then((res) => {
          if (Array.isArray(res.data)) {
            setSemestres(res.data);
          } else if (res.data && Array.isArray(res.data.data)) {
            setSemestres(res.data.data);
          } else {
            setSemestres([]);
            setError('Format des semestres inattendu.');
          }
        })
        .catch(() => setError('Erreur lors du chargement des semestres.'));
    }
  }, [parent]);

  const handleDownloadBulletin = async (enfantId) => {
    if (!selectedAnnee || !selectedSemestre) {
      setError('Veuillez choisir une année et un semestre.');
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/bulletin/parent/${enfantId}/${selectedSemestre}/${selectedAnnee}`,
        { responseType: 'blob' }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bulletin_${enfantId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Erreur lors du téléchargement du bulletin.");
    }
  };

  const calculerMoyenne = (note1, note2, note3, note4) => {
    let somme = 0;
    let count = 0;

    [note1, note2, note3, note4].forEach((note) => {
      if (note != null) {
        somme += parseFloat(note);
        count++;
      }
    });

    return count > 0 ? (somme / count).toFixed(2) : '-';
  };

  return (
    <div className="container mt-4">
      <h2>Notes de mes enfants</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row mb-4">
        <div className="col-md-12">
          <label>Choisir un enfant :</label>
          <select
            className="form-control"
            value={selectedEnfantId}
            onChange={(e) => setSelectedEnfantId(e.target.value)}
          >
            <option value="">-- Choisir un enfant --</option>
            {enfants.map((enf) => (
              <option key={enf.id} value={enf.id}>
                {enf.nom} {enf.prenom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <label>Année scolaire :</label>
          <select
            className="form-control"
            value={selectedAnnee}
            onChange={(e) => setSelectedAnnee(e.target.value)}
          >
            <option value="">-- Choisir --</option>
            {annees.map((annee) => (
              <option key={annee.id} value={annee.id}>
                {annee.annee}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label>Semestre :</label>
          <select
            className="form-control"
            value={selectedSemestre}
            onChange={(e) => setSelectedSemestre(e.target.value)}
          >
            <option value="">-- Choisir --</option>
            {semestres.map((sem) => (
              <option key={sem.id} value={sem.id}>
                {sem.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 text-center">
        <button className="btn btn-primary" onClick={handleFetchNotes}>
          Afficher les notes
        </button>
      </div>

      {/* Afficher uniquement les notes de l'enfant sélectionné */}
      {selectedEnfantId ? (
        <div key={selectedEnfantId} className="mb-5">
          <h5 className="text-primary">
            Élève : {enfants.find((e) => e.id === parseInt(selectedEnfantId))?.nom}{' '}
            {enfants.find((e) => e.id === parseInt(selectedEnfantId))?.prenom}
          </h5>
          <table className="table table-bordered">
            <thead className="thead-light">
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
              {notes[selectedEnfantId] && notes[selectedEnfantId].length > 0 ? (
                notes[selectedEnfantId].map((note, index) => {
                  const moyenne = calculerMoyenne(
                    note.note1,
                    note.note2,
                    note.note3,
                    note.note4
                  );
                  return (
                    <tr key={index}>
                      <td>{note.matiere}</td>
                      {[note.note1, note.note2, note.note3, note.note4].map((n, i) => (
                        <td key={i}>{n != null ? parseFloat(n).toFixed(2) : '-'}</td>
                      ))}
                      <td>{moyenne}</td>
                      <td>{note.remarque || '-'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Pas de notes disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {bulletinsDisponibles[selectedEnfantId] ? (
            <button
              className="btn btn-success"
              onClick={() => handleDownloadBulletin(selectedEnfantId)}
            >
              Télécharger le bulletin
            </button>
          ) : (
            <p>Aucun bulletin disponible pour cet enfant.</p>
          )}
        </div>
      ) : (
        <p>Veuillez sélectionner un enfant pour voir ses notes.</p>
      )}
    </div>
  );
};

export default NotesDashboard;