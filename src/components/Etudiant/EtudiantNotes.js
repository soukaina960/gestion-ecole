import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EtudiantNotes = () => {
  const navigate = useNavigate();
  
  // État initial consolidé
  const [state, setState] = useState({
    annees: [],
    semestres: [],
    matieres: [],
    selectedAnnee: '',
    selectedSemestre: '',
    notes: [],
    etudiantId: null,
    errors: {
      utilisateur: '',
      annees: '',
      semestres: '',
      notes: '',
      matieres: ''
    },
    loading: {
      initial: true,
      annees: false,
      semestres: false,
      matieres: false,
      notes: false,
      etudiant: false
    }
  });

  // Fonctions utilitaires pour mettre à jour l'état
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

  // Helper pour les appels API
  const apiGet = async (endpoint) => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return res.data?.data || res.data || [];
    } catch (err) {
      console.error(`Erreur ${endpoint}:`, err);
      throw err;
    }
  };

  // Récupérer l'étudiant connecté
  useEffect(() => {
    const fetchData = async () => {
      try {
        updateLoading('etudiant', true);
        
        // 1. Récupérer l'utilisateur connecté
        const userData = localStorage.getItem('utilisateur');
        if (!userData) {
          throw new Error("Utilisateur non connecté");
        }

        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id;

        // 2. Rechercher l'étudiant lié
        const etudiants = await apiGet('etudiants');
        const etudiant = etudiants.find(p => p.utilisateur_id === userId);
        
        if (!etudiant) {
          throw new Error("Aucun étudiant trouvé pour cet utilisateur");
        }

        updateState('etudiantId', etudiant.id);
        updateLoading('initial', false);
      } catch (err) {
        updateError('utilisateur', err.message || "Erreur d'authentification");
        console.error("Erreur:", err);
      } finally {
        updateLoading('etudiant', false);
      }
    };

    fetchData();
  }, []);

  // Récupérer les données initiales en parallèle
  useEffect(() => {
    if (!state.etudiantId) return;

    const fetchInitialData = async () => {
      try {
        updateLoading('annees', true);
        updateLoading('semestres', true);
        
        const [annees, semestres] = await Promise.all([
          apiGet('annees_scolaires'),
          apiGet('semestres')
        ]);

        updateState('annees', annees);
        updateState('semestres', semestres);
        
        if (annees.length === 0) updateError('annees', "Aucune année scolaire disponible");
        if (semestres.length === 0) updateError('semestres', "Aucun semestre disponible");
      } catch (err) {
        updateError('annees', "Erreur de chargement des données");
        console.error("Erreur initiale:", err);
      } finally {
        updateLoading('annees', false);
        updateLoading('semestres', false);
      }
    };

    fetchInitialData();
  }, [state.etudiantId]);

  // Récupérer les matières
  useEffect(() => {
    if (!state.etudiantId) return;

    const fetchMatieres = async () => {
      updateLoading('matieres', true);
      try {
        const matieres = await apiGet('matieres');
        updateState('matieres', matieres);
      } catch (err) {
        updateError('matieres', "Erreur de chargement des matières");
        console.error("Erreur matières:", err);
      } finally {
        updateLoading('matieres', false);
      }
    };

    fetchMatieres();
  }, [state.etudiantId]);

  // Calcul des notes enrichies avec mémoïsation
  const enrichedNotes = useMemo(() => {
    return state.notes.map(note => {
      const matiere = state.matieres.find(m => m.id === note.matiere_id);
      return {
        ...note,
        matiere_nom: matiere?.nom || 'Matière inconnue',
        moyenne: note.note_finale != null ? parseFloat(note.note_finale).toFixed(2) : '-'
      };
    });
  }, [state.notes, state.matieres]);

  const handleSearch = async () => {
    if (!state.selectedAnnee || !state.selectedSemestre) {
      updateError('notes', "Veuillez sélectionner une année et un semestre");
      return;
    }

    updateLoading('notes', true);
    updateError('notes', '');

    try {
      const notes = await apiGet(
        `notes-etudiant/${state.etudiantId}?annee_scolaire_id=${state.selectedAnnee}&semestre_id=${state.selectedSemestre}`
      );

      updateState('notes', notes);
      
      if (notes.length === 0) {
        updateError('notes', "Aucune note trouvée pour cette période");
      }
    } catch (err) {
      updateError('notes', "Erreur lors de la récupération des notes");
      console.error("Erreur notes:", err);
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

  // Rendu conditionnel
  if (state.loading.initial || state.loading.etudiant) {
    return (
      <div className="text-center mt-4" aria-live="polite">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p>Chargement des données étudiant...</p>
      </div>
    );
  }

  if (!state.etudiantId) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {state.errors.utilisateur || "Problème d'authentification"}
          <button 
            className="btn btn-link ms-2" 
            onClick={() => navigate('/login')}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const isSearchDisabled = !state.selectedAnnee || !state.selectedSemestre;
  const isResetDisabled = !state.selectedAnnee && !state.selectedSemestre && state.notes.length === 0;

  return (
    <div className="container mt-4">
      <h1 className="mb-4" tabIndex="0">Consulter mes notes</h1>

      {/* Affichage des erreurs */}
      {Object.entries(state.errors).map(
        ([key, error]) =>
          error && (
            <div key={key} className={`alert alert-${key === 'notes' ? 'warning' : 'danger'}`}>
              {error}
            </div>
          )
      )}

      {/* Formulaire de recherche */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="annee-select" className="form-label">Année scolaire :</label>
            <select
              id="annee-select"
              className="form-select"
              value={state.selectedAnnee}
              onChange={e => updateState('selectedAnnee', e.target.value)}
              disabled={state.loading.annees}
              aria-describedby="annee-help"
            >
              <option value="">-- Choisir --</option>
              {state.annees.map(annee => (
                <option key={annee.id} value={annee.id}>
                  {annee.annee || annee.nom}
                </option>
              ))}
            </select>
            {state.loading.annees && (
              <small id="annee-help" className="text-muted">Chargement des années...</small>
            )}
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="semestre-select" className="form-label">Semestre :</label>
            <select
              id="semestre-select"
              className="form-select"
              value={state.selectedSemestre}
              onChange={e => updateState('selectedSemestre', e.target.value)}
              disabled={state.loading.semestres}
              aria-describedby="semestre-help"
            >
              <option value="">-- Choisir --</option>
              {state.semestres.map(semestre => (
                <option key={semestre.id} value={semestre.id}>
                  {semestre.nom}
                </option>
              ))}
            </select>
            {state.loading.semestres && (
              <small id="semestre-help" className="text-muted">Chargement des semestres...</small>
            )}
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="d-flex justify-content-center gap-3 mb-4">
        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={isSearchDisabled || state.loading.notes}
          aria-busy={state.loading.notes}
        >
          {state.loading.notes ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
              Chargement...
            </>
          ) : (
            'Voir mes notes'
          )}
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={handleReset}
          disabled={isResetDisabled}
        >
          Réinitialiser
        </button>
      </div>

      {/* Résumé de la sélection */}
      {state.selectedAnnee && state.selectedSemestre && (
        <div className="alert alert-info text-center" role="status">
          Notes pour l'année :{' '}
          <strong>
            {state.annees.find(a => a.id === parseInt(state.selectedAnnee))?.annee}
          </strong>{' '}
          - Semestre :{' '}
          <strong>
            {state.semestres.find(s => s.id === parseInt(state.selectedSemestre))?.nom}
          </strong>
        </div>
      )}

      {/* Tableau des notes */}
      {state.notes.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover" aria-label="Notes des matières">
            <thead className="table-light">
              <tr>
                <th scope="col">Matière</th>
                <th scope="col">Note 1</th>
                <th scope="col">Note 2</th>
                <th scope="col">Note 3</th>
                <th scope="col">Note 4</th>
                <th scope="col">Moyenne</th>
                <th scope="col">Remarque</th>
              </tr>
            </thead>
            <tbody>
              {enrichedNotes.map((note, index) => (
                <tr key={index}>
                  <td>{note.matiere_nom}</td>
                  {[note.note1, note.note2, note.note3, note.note4].map(
                    (n, i) => (
                      <td key={i} className={n != null ? '' : 'text-muted'}>
                        {n != null ? parseFloat(n).toFixed(2) : '-'}
                      </td>
                    )
                  )}
                  <td className="fw-bold">{note.moyenne}</td>
                  <td className="small">{note.remarque || '-'}</td>
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