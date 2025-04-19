import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EtudiantNotes = () => {
  // State organization
  const [state, setState] = useState({
    annees: [],
    semestres: [],
    selectedAnnee: '',
    selectedSemestre: '',
    notes: [],
    utilisateur: null,
    errors: {
      utilisateur: '',
      annees: '',
      semestres: '',
      notes: ''
    },
    loading: {
      initial: true,
      annees: false,
      semestres: false,
      notes: false
    }
  });

  // Helper function to update nested state
  const updateState = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const updateError = (key, message) => {
    setState(prev => ({
      ...prev,
      errors: { ...prev.errors, [key]: message }
    }));
  };

  const updateLoading = (key, isLoading) => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, [key]: isLoading }
    }));
  };

  // Load user data
  useEffect(() => {
    const userData = localStorage.getItem('utilisateur');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        updateState('utilisateur', parsedUser);
        updateLoading('initial', false);
      } catch (error) {
        updateError('utilisateur', "Erreur de lecture des données utilisateur");
        updateLoading('initial', false);
      }
    } else {
      updateError('utilisateur', "Aucun utilisateur connecté détecté");
      updateLoading('initial', false);
    }
  }, []);

  // Load academic years when user is available
  useEffect(() => {
    if (!state.utilisateur) return;

    const fetchAnnees = async () => {
      updateLoading('annees', true);
      updateError('annees', '');
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/annees_scolaires');
        if (res.data?.length > 0) {
          updateState('annees', res.data);
        } else {
          updateError('annees', "Aucune année scolaire disponible");
        }
      } catch (err) {
        console.error("Erreur années scolaires:", err);
        updateError('annees', "Erreur lors du chargement des années scolaires");
      } finally {
        updateLoading('annees', false);
      }
    };

    fetchAnnees();
  }, [state.utilisateur]);

  // Load semesters when user is available
  useEffect(() => {
    if (!state.utilisateur) return;

    const fetchSemestres = async () => {
      updateLoading('semestres', true);
      updateError('semestres', '');
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/semestres');
        if (res.data?.data?.length > 0) {
          updateState('semestres', res.data.data);
        } else {
          updateError('semestres', "Aucun semestre disponible");
        }
      } catch (err) {
        console.error("Erreur semestres:", err);
        updateError('semestres', "Erreur lors du chargement des semestres");
      } finally {
        updateLoading('semestres', false);
      }
    };

    fetchSemestres();
  }, [state.utilisateur]);

  const handleSearch = async () => {
    if (!state.utilisateur) {
      updateError('notes', "Vous devez être connecté pour voir vos notes");
      return;
    }
    if (!state.selectedAnnee || !state.selectedSemestre) {
      updateError('notes', "Veuillez sélectionner une année et un semestre");
      return;
    }

    updateLoading('notes', true);
    updateError('notes', '');

    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/notes-etudiant/${state.utilisateur.id}`,
        {
          params: {
            annee_scolaire_id: state.selectedAnnee,
            semestre_id: state.selectedSemestre,
          }
        }
      );
      updateState('notes', res.data || []);
    } catch (err) {
      console.error("Erreur API notes:", err);
      updateError('notes', "Erreur lors de la récupération des notes");
    } finally {
      updateLoading('notes', false);
    }
  };

  const handleReset = () => {
    updateState('selectedAnnee', '');
    updateState('selectedSemestre', '');
    updateState('notes', []);
    updateError('notes', '');
  };

  if (state.loading.initial) {
    return <div className="container mt-4">Chargement initial...</div>;
  }

  if (!state.utilisateur) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{state.errors.utilisateur}</div>
      </div>
    );
  }

  // Calculate if reset should be disabled
  const isResetDisabled = !state.selectedAnnee && !state.selectedSemestre && state.notes.length === 0;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Consulter mes notes</h2>

      {/* Display all errors that exist */}
      {Object.values(state.errors).map(
        (error, index) =>
          error && (
            <div key={index} className="alert alert-danger">
              {error}
            </div>
          )
      )}

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="form-group">
            <label>Année scolaire :</label>
            <select
              className="form-control"
              value={state.selectedAnnee}
              onChange={e => {
                updateState('selectedAnnee', e.target.value);
                updateError('notes', '');
              }}
              disabled={state.loading.annees}
            >
              <option value="">-- Choisir --</option>
              {state.annees.map(annee => (
                <option key={annee.id} value={annee.id}>
                  {annee.annee}
                </option>
              ))}
            </select>
            {state.loading.annees && <small className="text-muted">Chargement...</small>}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group">
            <label>Semestre :</label>
            <select
              className="form-control"
              value={state.selectedSemestre}
              onChange={e => {
                updateState('selectedSemestre', e.target.value);
                updateError('notes', '');
              }}
              disabled={state.loading.semestres}
            >
              <option value="">-- Choisir --</option>
              {state.semestres.length > 0 ? (
                state.semestres.map(semestre => (
                  <option key={semestre.id} value={semestre.id}>
                    {semestre.nom}
                  </option>
                ))
              ) : (
                <option disabled>Aucun semestre disponible</option>
              )}
            </select>
            {state.loading.semestres && <small className="text-muted">Chargement...</small>}
          </div>
        </div>
      </div>

      <div className="text-center mb-4">
        <button
          className="btn btn-primary mr-2"
          onClick={handleSearch}
          disabled={
            state.loading.notes ||
            !state.selectedAnnee ||
            !state.selectedSemestre
          }
        >
          {state.loading.notes ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" />
              Chargement...
            </>
          ) : (
            'Voir mes notes'
          )}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleReset}
          disabled={isResetDisabled}
        >
          Réinitialiser
        </button>
      </div>

      {state.selectedAnnee && state.selectedSemestre && (
        <p className="text-muted text-center">
          Notes pour l'année :{' '}
          <strong>
            {state.annees.find(a => a.id === parseInt(state.selectedAnnee))?.annee}
          </strong>{' '}
          - Semestre :{' '}
          <strong>
            {state.semestres.find(s => s.id === parseInt(state.selectedSemestre))?.nom}
          </strong>
        </p>
      )}

     
      {state.notes.length > 0 && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
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
              {state.notes.map((note, index) => (
                <tr key={index}>
                  <td>{note.specialite || 'Aucune spécialité'}</td>
                  {[note.note1, note.note2, note.note3, note.note4].map(
                    (n, i) => (
                      <td key={i}>
                        {n != null ? parseFloat(n).toFixed(2) : '-'}
                      </td>
                    )
                  )}
                  <td>
                    {note.note_finale != null
                      ? parseFloat(note.note_finale).toFixed(2)
                      : '-'}
                  </td>
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