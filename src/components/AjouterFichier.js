import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JOURS_SEMAINE = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

function AjouterExamen() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [utilisateur, setUtilisateur] = useState(null);
  
  // États pour les sélections
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [isLycee, setIsLycee] = useState(false);
  
  // États pour les données
  const [classes, setClasses] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [error, setError] = useState(null);
  const [professeurId, setProfesseurId] = useState(null);
  
  // États de chargement
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingFilieres, setIsLoadingFilieres] = useState(false);
  const [isLoadingMatieres, setIsLoadingMatieres] = useState(false);

  // État du formulaire
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

  // Récupérer l'ID du professeur à partir de l'ID utilisateur
  const fetchProfesseurId = async (userId) => {
    try {
      const response = await api.get(`/professeurs?user=${userId}`);
      if (response.data && response.data.length > 0) {
        const profId = response.data[0].id;
        localStorage.setItem("professeur_id", profId);
        return profId;
      }
      throw new Error("Professeur non trouvé");
    } catch (error) {
      console.error("Erreur fetchProfesseurId:", error);
      setError("Votre compte professeur n'est pas configuré");
      return null;
    }
  };

  // Charger l'utilisateur et l'ID professeur
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

  // Charger les classes
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await api.get('/classes');
        setClasses(response.data);
      } catch (error) {
        console.error("Erreur chargement classes", error);
        setError("Erreur lors du chargement des classes");
      } finally {
        setIsLoadingClasses(false);
      }
    };

    loadClasses();
  }, []);

  // Charger les filières si classe secondaire
  useEffect(() => {
    const loadFilieres = async () => {
      if (!selectedClasse) return;

      const classe = classes.find(c => c.id === parseInt(selectedClasse));
      setIsLycee(classe?.niveau === "Secondaire");

      if (classe?.niveau === "Secondaire") {
        setIsLoadingFilieres(true);
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
        } finally {
          setIsLoadingFilieres(false);
        }
      } else {
        setFilieres([]);
        setForm(prev => ({ ...prev, filiere_id: '' }));
      }
    };

    loadFilieres();
  }, [selectedClasse, classes]);

  // Charger les matières
  useEffect(() => {
    const loadMatieres = async () => {
      if (!selectedClasse || !professeurId) return;

      setIsLoadingMatieres(true);
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
      } finally {
        setIsLoadingMatieres(false);
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
    setSubmitError('');
    
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/examens', form);
      navigate('/', { 
        state: { 
          message: 'Examen ajouté avec succès',
          type: 'success'
        } 
      });
    } catch (error) {
      console.error("Erreur création examen", error);
      setSubmitError(error.response?.data?.message || "Erreur lors de la création");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingClasses || !utilisateur) {
    return <div className="container mx-auto p-4">Chargement...</div>;
  }

  if (utilisateur?.role !== "professeur") {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          Accès réservé aux professeurs
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Ajouter un Examen</h2>
      
      {submitError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Champs du formulaire */}
        <div className="form-group">
          <label className="block mb-2 font-medium">Classe :</label>
          <select 
            name="classe_id" 
            onChange={handleChange} 
            value={form.classe_id} 
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            disabled={isLoadingClasses}
          >
            <option value="">-- Choisir une classe --</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {isLycee && (
          <div className="form-group">
            <label className="block mb-2 font-medium">Filière :</label>
            <select 
              name="filiere_id" 
              onChange={handleChange} 
              value={form.filiere_id} 
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              disabled={isLoadingFilieres}
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
          <label className="block mb-2 font-medium">Matière :</label>
          <select 
            name="matiere_id" 
            onChange={handleChange} 
            value={form.matiere_id} 
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            disabled={isLoadingMatieres}
          >
            <option value="">-- Choisir une matière --</option>
            {matieres.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block mb-2 font-medium">Date :</label>
            <input 
              type="date" 
              name="date" 
              onChange={handleChange} 
              value={form.date}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div className="form-group">
            <label className="block mb-2 font-medium">Jour :</label>
            <select
              name="jour" 
              onChange={handleChange} 
              value={form.jour}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choisir un jour --</option>
              {JOURS_SEMAINE.map(jour => (
                <option key={jour} value={jour}>{jour}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block mb-2 font-medium">Heure Début :</label>
            <input 
              type="time" 
              name="heure_debut" 
              onChange={handleChange} 
              value={form.heure_debut}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="form-group">
            <label className="block mb-2 font-medium">Heure Fin :</label>
            <input 
              type="time" 
              name="heure_fin" 
              onChange={handleChange} 
              value={form.heure_fin}
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`px-6 py-2 rounded text-white font-medium ${
              isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Ajouter l\'examen'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AjouterExamen;