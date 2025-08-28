import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AjouterExamen.css';

const JOURS_SEMAINE = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

function AjouterExamen() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [utilisateur, setUtilisateur] = useState(null);
  
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [isLycee, setIsLycee] = useState(false);
  
  const [classes, setClasses] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [error, setError] = useState(null);
  const [professeurId, setProfesseurId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editExamenId, setEditExamenId] = useState(null);
  const [examens, setExamens] = useState([]);

  const [form, setForm] = useState({
    classe_id: '',
    matiere_id: '',
    professeur_id: '',
    filiere_id: '',
    date: '',
    jour: '',
    heure_debut: '',
    heure_fin: ''
  });

  const handleCloseMessage = () => {
    setIsMessageVisible(false);
  };

  const fetchProfesseurId = async (userId) => {
    try {
      const response = await api.get(`/professeurs?user=${userId}`);
      if (response.data && response.data.length > 0) {
        const professeur = response.data.find(p => p.user_id === userId);
        if (professeur) {
          const profId = professeur.id;
          localStorage.setItem("professeur_id", profId);
          return profId;
        }
      }
      throw new Error("Professeur non trouvé");
    } catch (error) {
      console.error("Erreur fetchProfesseurId:", error);
      setError("Votre compte professeur n'est pas configuré");
      return null;
    }
  };

  const fetchExamens = async () => {
    try {
      const response = await api.get('/examens');
      setExamens(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des examens", error);
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem("utilisateur");
        if (userData) {
          const user = JSON.parse(userData);
          setUtilisateur(user);
          
          if (user?.role === "professeur") {
            const profId = await fetchProfesseurId(user.id);
            if (profId) {
              setProfesseurId(profId);
              setForm(prev => ({ ...prev, professeur_id: profId }));
              fetchExamens();
            }
          }
        }
      } catch (err) {
        console.error("Erreur de chargement utilisateur", err);
        setError("Erreur de chargement des données");
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await api.get('/classes');
        setClasses(response.data);
      } catch (error) {
        console.error("Erreur chargement classes", error);
        setError("Erreur lors du chargement des classes");
      }
    };

    loadClasses();
  }, []);

  useEffect(() => {
    const loadFilieres = async () => {
      if (!selectedClasse) return;

      const classe = classes.find(c => c.id === parseInt(selectedClasse));
      setIsLycee(classe?.niveau === "Secondaire");

      if (classe?.niveau === "Secondaire") {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/classes/${selectedClasse}/filieres`
          );
          const filieresData = response.data.filiere ? 
            [response.data.filiere] : 
            response.data.filieres || [];
          
          setFilieres(filieresData);
          setForm(prev => ({ 
            ...prev, 
            filiere_id: filieresData[0]?.id || '',
            matiere_id: ''
          }));
        } catch (err) {
          console.error("Erreur chargement filières:", err);
          setFilieres([]);
        }
      } else {
        setFilieres([]);
        setForm(prev => ({ ...prev, filiere_id: '' }));
      }
    };

    loadFilieres();
  }, [selectedClasse, classes]);

  useEffect(() => {
    const loadMatieres = async () => {
      if (!selectedClasse || !professeurId) return;

      try {
        let apiUrl;
        if (isLycee && form.filiere_id) {
          apiUrl = `http://127.0.0.1:8000/api/professeurs/${professeurId}/classes/${selectedClasse}/filieres/${form.filiere_id}/matieres`;
        } else {
          apiUrl = `http://127.0.0.1:8000/api/professeurs/${professeurId}/classes/${selectedClasse}/matieres`;
        }

        const response = await axios.get(apiUrl);
        setMatieres(response.data);
        setForm(prev => ({ ...prev, matiere_id: '' }));
      } catch (err) {
        console.error("Erreur chargement matières:", err);
        setMatieres([]);
      }
    };

    loadMatieres();
  }, [selectedClasse, professeurId, isLycee, form.filiere_id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    if (name === 'classe_id') {
      setSelectedClasse(value);
      setForm(prev => ({ 
        ...prev, 
        classe_id: value,
        matiere_id: '',
        filiere_id: '' 
      }));
    }
  };

  const validateForm = () => {
    if (!form.classe_id || !form.matiere_id || !form.date || 
        !form.jour || !form.heure_debut || !form.heure_fin) {
      return "Tous les champs sont obligatoires";
    }

    const now = new Date();
    const startDate = new Date(`${form.date}T${form.heure_debut}`);
    const endDate = new Date(`${form.date}T${form.heure_fin}`);

    if (startDate >= endDate) {
      return "L'heure de fin doit être après l'heure de début";
    }

    if (startDate < now) {
      return "La date doit être dans le futur";
    }

    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitMessage('');
    setIsSuccess(false);
    setIsMessageVisible(false);
    
    const validationError = validateForm();
    if (validationError) {
      setSubmitMessage(validationError);
      setIsSuccess(false);
      setIsMessageVisible(true);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await api.put(`/examens/${editExamenId}`, form);
        setSubmitMessage('Examen modifié avec succès !');
      } else {
        await api.post('/examens', form);
        setSubmitMessage('Examen ajouté avec succès !');
      }
      
      setIsSuccess(true);
      setIsMessageVisible(true);
      fetchExamens();
      
      if (!isEditMode) {
        setForm({
          classe_id: '',
          matiere_id: '',
          professeur_id: professeurId,
          filiere_id: '',
          date: '',
          jour: '',
          heure_debut: '',
          heure_fin: ''
        });
      }
      
      setIsEditMode(false);
      setEditExamenId(null);
      
      setTimeout(() => {
        setIsMessageVisible(false);
      }, 5000);
      
    } catch (error) {
      console.error("Erreur création/modification examen", error);
      setSubmitMessage(error.response?.data?.message || "Erreur lors de l'opération");
      setIsSuccess(false);
      setIsMessageVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (examen) => {
    setForm({
      classe_id: examen.classe_id,
      matiere_id: examen.matiere_id,
      professeur_id: examen.professeur_id,
      filiere_id: examen.filiere_id || '',
      date: examen.date,
      jour: examen.jour,
      heure_debut: examen.heure_debut,
      heure_fin: examen.heure_fin
    });

    setIsEditMode(true);
    setEditExamenId(examen.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (examenId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet examen ?")) return;

    try {
      await api.delete(`/examens/${examenId}`);
      setSubmitMessage('Examen supprimé avec succès.');
      setIsSuccess(true);
      setIsMessageVisible(true);
      fetchExamens();
      setTimeout(() => setIsMessageVisible(false), 5000);
    } catch (error) {
      setSubmitMessage("Erreur lors de la suppression de l'examen.");
      setIsSuccess(false);
      setIsMessageVisible(true);
    }
  };

  const cancelEdit = () => {
    setIsEditMode(false);
    setEditExamenId(null);
    setForm({
      classe_id: '',
      matiere_id: '',
      professeur_id: professeurId,
      filiere_id: '',
      date: '',
      jour: '',
      heure_debut: '',
      heure_fin: ''
    });
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (utilisateur?.role !== "professeur") {
    return (
      <div className="container mx-auto p-4">
        <div className="error-message">
          Accès réservé aux professeurs
        </div>
      </div>
    );
  }

  return (
    <div className="examen-form-container">
      <h2 className="examen-form-title">{isEditMode ? 'Modifier un Examen' : 'Ajouter un Examen'}</h2>
      
      {submitMessage && isMessageVisible && (
        <div className={`message-container ${!isMessageVisible ? 'hide' : ''}`}>
          <div className={isSuccess ? "success-message" : "error-message"}>
            <div className="message-icon">
              {isSuccess ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              )}
            </div>
            <div className="message-content">
              {submitMessage}
            </div>
            <button className="message-close" onClick={handleCloseMessage}>
              &times;
            </button>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="examen-form">
        <div className="form-group">
          <label className="form-label">Classe :</label>
          <select 
            name="classe_id" 
            onChange={handleChange} 
            value={form.classe_id} 
            required
            className="form-control form-select"
          >
            <option value="">-- Choisir une classe --</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {isLycee && (
          <div className="form-group">
            <label className="form-label">Filière :</label>
            <select 
              name="filiere_id" 
              onChange={handleChange} 
              value={form.filiere_id} 
              required
              className="form-control form-select"
            >
              {filieres.length > 0 ? (
                filieres.map(f => (
                  <option key={f.id} value={f.id}>{f.nom}</option>
                ))
              ) : (
                <option value="">Aucune filière disponible</option>
              )}
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Matière :</label>
          <select 
            name="matiere_id" 
            onChange={handleChange} 
            value={form.matiere_id} 
            required
            className="form-control form-select"
          >
            <option value="">-- Choisir une matière --</option>
            {matieres.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Date :</label>
            <input 
              type="date" 
              name="date" 
              onChange={handleChange} 
              value={form.date}
              required
              min={new Date().toISOString().split('T')[0]}
              className="form-control" 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Jour :</label>
            <select
              name="jour" 
              onChange={handleChange} 
              value={form.jour}
              required
              className="form-control form-select"
            >
              <option value="">-- Choisir un jour --</option>
              {JOURS_SEMAINE.map(jour => (
                <option key={jour} value={jour}>{jour}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Heure Début :</label>
          <input 
  type="time" 
  name="heure_debut" 
  step="1" // pour permettre les secondes
  onChange={handleChange} 
  value={form.heure_debut || ''} // ex: "14:30:00"
  required
  className="form-control"
/>


          </div>

          <div className="form-group">
            <label className="form-label">Heure Fin :</label>
            <input 
    type="time" 
    name="heure_fin" 
    step="1" // pour permettre les secondes (HH:MM:SS)
    onChange={handleChange} 
    value={form.heure_fin || ''} // exemple : "16:00:00"
    required
    className="form-control"
  />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="submit-btn"
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Envoi en cours...
              </>
            ) : (isEditMode ? "Mettre à jour l'examen" : "Ajouter l'examen")}
          </button>

          {isEditMode && (
            <button 
              type="button" 
              onClick={cancelEdit}
              className="cancel-btn"
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <h2 className="examens-list-title">Liste des Examens</h2>
      <div className="examens-table-container">
        <table className="examens-table">
          <thead>
            <tr>
              <th className='text-dark'>Classe</th>
              <th>Matière</th>
              <th>Date</th>
              <th>Jour</th>
              <th>Heure Début</th>
              <th>Heure Fin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {examens.length > 0 ? (
              examens.map(examen => (
                <tr key={examen.id}>
                  <td className='text-dark'>{examen.classroom?.name || 'N/A'}</td>

                  <td className='text-dark'>{examen.matiere?.nom || 'N/A'}</td>
                  <td className='text-dark'>{examen.date}</td>
                  <td className='text-dark'>{examen.jour}</td>
                  <td className='text-dark'>{examen.heure_debut}</td>
                  <td className='text-dark'>{examen.heure_fin}</td>
                  <td className="actions-cell">
                    <button 
                      onClick={() => handleEdit(examen)} 
                      className="btn-edit"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(examen.id)} 
                      className="btn-delete"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-examens">Aucun examen programmé</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AjouterExamen;