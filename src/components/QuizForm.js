import { useState, useEffect } from 'react';
import axios from 'axios';
import './QuizForm.css';

// Configuration axios pour une réutilisation facile
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export default function QuizForm() {
  const [formData, setFormData] = useState({
    id: '', // Pour la modification
    class_id: '',
    matiere_id: '',
    question_text: '',
    answer: false,
    description: '',
    professeur_id: ''
  });

  const [quizzes, setQuizzes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [isLycee, setIsLycee] = useState(false);
  const [loading, setLoading] = useState({ 
    classes: true, 
    filieres: false, 
    matieres: false,
    professeur: false,
    submitting: false,
    quizzes: false,
    deleting: false,
    editing: false
  });
  const [matieres, setMatieres] = useState([]);
  const [utilisateur, setUtilisateur] = useState(null);
  const [professeurId, setProfesseurId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '', visible: false });
  const [isEditing, setIsEditing] = useState(false);

  // Afficher un message temporaire
  const showMessage = (text, type = 'success') => {
    setMessage({ text, type, visible: true });
    setTimeout(() => {
      setMessage(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  // Fermer manuellement le message
  const closeMessage = () => {
    setMessage(prev => ({ ...prev, visible: false }));
  };

  // Charger l'utilisateur et l'ID du professeur
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem("utilisateur");
        if (userData) {
          const user = JSON.parse(userData);
          setUtilisateur(user);
          
          if (user?.role === "professeur") {
            const storedProfesseurId = localStorage.getItem("professeur_id");
            if (storedProfesseurId) {
              setProfesseurId(storedProfesseurId);
              setFormData(prev => ({ ...prev, professeur_id: storedProfesseurId }));
            } else {
              const profId = await fetchProfesseurId(user.id);
              if (profId) {
                setProfesseurId(profId);
                setFormData(prev => ({ ...prev, professeur_id: profId }));
              }
            }
          }
        }
      } catch (err) {
        console.error("Erreur de chargement des données utilisateur", err);
        showMessage("Erreur de chargement des données utilisateur", "error");
      }
    };

    loadUserData();
  }, []);

  // Fonction pour récupérer l'ID du professeur
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
      showMessage("Votre compte professeur n'est pas configuré", "error");
      return null;
    }
  };

  // Charger les classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const res = await api.get('/classes');
        setClasses(res.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des classes", error);
        showMessage("Erreur lors du chargement des classes", "error");
      } finally {
        setLoading(prev => ({ ...prev, classes: false }));
      }
    };

    loadClasses();
  }, []);

  // Vérifier si c'est une classe de lycée et charger les filières
  useEffect(() => {
    const loadFilieres = async () => {
      if (selectedClasse) {
        const classe = classes.find(c => c.id === parseInt(selectedClasse));
        const isSecondaire = classe && classe.niveau === "Secondaire";
        setIsLycee(isSecondaire);

        if (isSecondaire) {
          setLoading(prev => ({ ...prev, filieres: true }));
          try {
            const res = await api.get(`/classes/${selectedClasse}/filieres`);
            const filieresData = res.data.filiere ? [res.data.filiere] : res.data.filieres || [];
            setFilieres(filieresData);
            if (filieresData.length > 0) {
              setSelectedFiliere(filieresData[0].id);
              setFormData(prev => ({ ...prev, filiere_id: filieresData[0].id }));
            }
          } catch (err) {
            console.error("Erreur chargement filières:", err);
            setFilieres([]);
            showMessage("Erreur lors du chargement des filières", "error");
          } finally {
            setLoading(prev => ({ ...prev, filieres: false }));
          }
        } else {
          setFilieres([]);
          setSelectedFiliere("");
          setFormData(prev => ({ ...prev, filiere_id: '' }));
        }
      }
    };

    loadFilieres();
  }, [selectedClasse, classes]);

  // Charger les matières quand une filière est sélectionnée
  useEffect(() => {
    const loadMatieres = async () => {
      if (!selectedClasse || !professeurId) return;

      let url = '';

      if (isLycee) {
        if (!selectedFiliere) return;
        url = `/professeurs/${professeurId}/classes/${selectedClasse}/filieres/${selectedFiliere}/matieres`;
      } else {
        url = `/professeurs/${professeurId}/classes/${selectedClasse}/matieres`;
      }

      setLoading((prev) => ({ ...prev, matieres: true }));
      try {
        const res = await api.get(url);
        setMatieres(res.data);
        setFormData((prev) => ({ ...prev, matiere_id: '' }));
      } catch (err) {
        console.error('Erreur chargement matières:', err);
        setMatieres([]);
      } finally {
        setLoading((prev) => ({ ...prev, matieres: false }));
      }
    };

    loadMatieres();
  }, [selectedClasse, selectedFiliere, professeurId, isLycee]);

  // Charger les quiz au montage et quand le professeur est défini
  useEffect(() => {
    if (professeurId) {
      fetchQuizzes();
    }
  }, [professeurId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (name === 'class_id') {
      setSelectedClasse(value);
    }
    if (name === 'filiere_id') {
      setSelectedFiliere(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submitting: true }));
    
    try {
      if (isEditing) {
        await api.put(`/quizzes/${formData.id}`, formData);
        showMessage('Quiz modifié avec succès !');
      } else {
        await api.post('/quizzes', formData);
        showMessage('Quiz ajouté avec succès !');
      }
      
      resetForm();
      fetchQuizzes();
    } catch (error) {
      console.error(error);
      showMessage(`Erreur lors de ${isEditing ? 'la modification' : "l'ajout"} du quiz`, "error");
    } finally {
      setLoading(prev => ({ ...prev, submitting: false }));
    }
  };

  const fetchQuizzes = async () => {
    if (!professeurId) return;
    
    setLoading(prev => ({ ...prev, quizzes: true }));
    try {
      const res = await api.get('/quizzes', {
        params: { professeur_id: professeurId }
      });
      setQuizzes(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des quiz", error);
      showMessage("Erreur lors du chargement des quiz", "error");
    } finally {
      setLoading(prev => ({ ...prev, quizzes: false }));
    }
  };

  const handleEdit = (quiz) => {
    setIsEditing(true);
    setFormData({
      id: quiz.id,
      class_id: quiz.class_id,
      matiere_id: quiz.matiere_id,
      question_text: quiz.question_text,
      answer: quiz.answer,
      description: quiz.description,
      professeur_id: professeurId,
      filiere_id: quiz.filiere_id || ''
    });
    
    setSelectedClasse(quiz.class_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce quiz ?")) return;
    
    setLoading(prev => ({ ...prev, deleting: true }));
    try {
      await api.delete(`/quizzes/${id}`);
      showMessage('Quiz supprimé avec succès !');
      fetchQuizzes();
    } catch (error) {
      console.error("Erreur lors de la suppression du quiz", error);
      showMessage("Erreur lors de la suppression du quiz", "error");
    } finally {
      setLoading(prev => ({ ...prev, deleting: false }));
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      class_id: '',
      matiere_id: '',
      question_text: '',
      answer: false,
      description: '',
      professeur_id: professeurId,
      filiere_id: ''
    });
    setSelectedClasse('');
    setSelectedFiliere('');
    setIsEditing(false);
  };

  const cancelEdit = () => {
    resetForm();
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">{isEditing ? 'Modifier un Quiz' : 'Ajouter un Quiz'}</h2>
      
      {/* Message de succès/erreur */}
      {message.visible && (
        <div className={`message ${message.type}`}>
          <div className="message-content">
            {message.text}
          </div>
          <button className="message-close" onClick={closeMessage}>
            &times;
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="quiz-form">
        <div className="form-group">
          <label>Classe :</label>
          <select 
            name="class_id" 
            onChange={handleChange} 
            value={formData.class_id} 
            required
            disabled={loading.classes}
          >
            <option value="">-- Choisir une classe --</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {isLycee && filieres.length > 0 && (
          <div className="form-group">
            <label>Filière :</label>
            <select 
              name="filiere_id" 
              onChange={handleChange} 
              value={formData.filiere_id} 
              required
              disabled={loading.filieres}
            >
              {filieres.map(f => (
                <option key={f.id} value={f.id}>{f.nom}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label>Matière :</label>
          <select 
            name="matiere_id" 
            onChange={handleChange} 
            value={formData.matiere_id} 
            required
            disabled={loading.matieres || !professeurId}
          >
            <option value="">-- Choisir une matière --</option>
            {matieres.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
            {loading.matieres && <option>Chargement des matières...</option>}
          </select>
        </div>

        <div className="form-group">
          <label>Question :</label>
          <input
            type="text"
            name="question_text"
            placeholder="Entrez votre question"
            value={formData.question_text}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            name="answer"
            id="answer"
            checked={formData.answer}
            onChange={handleChange}
          />
          <label htmlFor="answer">Réponse correcte ?</label>
        </div>

        <div className="form-group">
          <label>Description (facultatif) :</label>
          <textarea
            name="description"
            placeholder="Description supplémentaire"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading.professeur || !professeurId || loading.submitting}
          >
            {loading.submitting ? (
              <>
                <span className="spinner"></span>
                {isEditing ? 'Enregistrement...' : 'Envoi en cours...'}
              </>
            ) : isEditing ? 'Enregistrer les modifications' : 'Ajouter le Quiz'}
          </button>
          
          {isEditing && (
            <button 
              type="button" 
              className="cancel-btn"
              onClick={cancelEdit}
              disabled={loading.submitting}
            >
              Annuler
            </button>
          )}
        </div>
      </form>

      <div className="quizzes-list">
        <h2>Liste des Quiz</h2>
        {loading.quizzes ? (
          <div className="loading">Chargement des quiz...</div>
        ) : quizzes.length > 0 ? (
          <ul>
            {quizzes.map((quiz) => (
              <li key={quiz.id}>
                <div className="quiz-header">
                  <p className="question">{quiz.question_text}</p>
                  <div className="quiz-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(quiz)}
                      disabled={loading.deleting}
                    >
                      Modifier
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(quiz.id)}
                      disabled={loading.deleting}
                    >
                      {loading.deleting ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </div>
                </div>
                <p className="details">
                  Classe: {classes.find(c => c.id === quiz.class_id)?.name || quiz.class_id} | 
                  Matière: {matieres.find(m => m.id === quiz.matiere_id)?.nom || quiz.matiere_id} | 
                  Réponse: {quiz.answer ? 'Vrai' : 'Faux'}
                </p>
                {quiz.description && (
                  <p className="description">{quiz.description}</p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun quiz disponible pour le moment.</p>
        )}
      </div>
    </div>
  );
}