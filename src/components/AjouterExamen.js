import React, { useState, useEffect } from 'react';
import api from '../services/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AjouterExamen() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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
  
  // États de chargement
  const [loading, setLoading] = useState({
    classes: true,
    filieres: false,
    matieres: false
  });

  const [form, setForm] = useState({
    classe_id: '',
    matiere_id: '',
    professeur_id: '', // Sera rempli automatiquement
    filiere_id: '', // Ajout pour la filière
    date: '',
    jour: '', // Nouveau champ jour
    heure_debut: '',
    heure_fin: ''
  });

  // Charger l'utilisateur depuis le localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("utilisateur");
      if (userData) {
        const user = JSON.parse(userData);
        setUtilisateur(user);
        if (user?.role === "professeur") {
          setForm(prev => ({ ...prev, professeur_id: user.id }));
        }
      }
    } catch (err) {
      console.error("Erreur de chargement des données utilisateur", err);
      setSubmitError("Erreur de chargement des données utilisateur");
    }
  }, []);

  // Charger les classes
  useEffect(() => {
    api.get('/classes')
      .then(res => {
        setClasses(res.data);
        setLoading(prev => ({ ...prev, classes: false }));
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des classes", error);
        setLoading(prev => ({ ...prev, classes: false }));
      });
  }, []);

  // Vérifier si c'est une classe de lycée et charger les filières
  useEffect(() => {
    if (selectedClasse) {
      const classe = classes.find((c) => c.id === parseInt(selectedClasse));
      const isSecondaire = classe && classe.niveau === "Secondaire";
      setIsLycee(isSecondaire);

      if (isSecondaire) {
        setLoading(prev => ({ ...prev, filieres: true }));
        axios
          .get(`http://127.0.0.1:8000/api/classes/${selectedClasse}/filieres`)
          .then((res) => {
            const filieresData = res.data.filiere ? [res.data.filiere] : res.data.filieres || [];
            setFilieres(filieresData);
            if (filieresData.length > 0) {
              setSelectedFiliere(filieresData[0].id);
              setForm(prev => ({ ...prev, filiere_id: filieresData[0].id }));
            }
          })
          .catch((err) => {
            console.error("Erreur chargement filières:", err);
            setFilieres([]);
          })
          .finally(() => setLoading(prev => ({ ...prev, filieres: false })));
      } else {
        setFilieres([]);
        setSelectedFiliere("");
        setForm(prev => ({ ...prev, filiere_id: '' }));
      }
    }
  }, [selectedClasse]);

  // Charger les matières quand une filière est sélectionnée (lycée)
  useEffect(() => {
    if (isLycee && selectedClasse && selectedFiliere && utilisateur?.id) {
      setLoading(prev => ({ ...prev, matieres: true }));
      axios
        .get(
          `http://127.0.0.1:8000/api/professeurs/${utilisateur.id}/classes/${selectedClasse}/filieres/${selectedFiliere}/matieres`
        )
        .then((res) => {
          setMatieres(res.data);
          // Réinitialiser la sélection de matière quand les matières changent
          setForm(prev => ({ ...prev, matiere_id: '' }));
        })
        .catch((err) => {
          console.error("Erreur chargement matières:", err);
          setMatieres([]);
        })
        .finally(() => setLoading(prev => ({ ...prev, matieres: false })));
    } else if (!isLycee && selectedClasse && utilisateur?.id) {
      // Charger les matières pour les classes non-lycée
      setLoading(prev => ({ ...prev, matieres: true }));
      api.get(`/professeurs/${utilisateur.id}/classes/${selectedClasse}/matieres`)
        .then(res => {
          setMatieres(res.data);
          setForm(prev => ({ ...prev, matiere_id: '' }));
        })
        .catch(err => console.error("Erreur chargement matières:", err))
        .finally(() => setLoading(prev => ({ ...prev, matieres: false })));
    }
  }, [selectedFiliere, selectedClasse, utilisateur]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Gérer le changement de classe sélectionnée
    if (name === 'classe_id') {
      setSelectedClasse(value);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitError('');
    setIsLoading(true);

    // Validation
    if (new Date(`${form.date}T${form.heure_fin}`) <= new Date(`${form.date}T${form.heure_debut}`)) {
      setSubmitError("L'heure de fin doit être après l'heure de début");
      setIsLoading(false);
      return;
    }

    api.post('/examens', form)
      .then(() => {
        navigate('/', { state: { message: 'Examen ajouté avec succès' } });
      })
      .catch(error => {
        console.error("Erreur lors de la création de l'examen", error);
        setSubmitError(error.response?.data?.message || "Erreur lors de la création de l'examen");
      })
      .finally(() => setIsLoading(false));
  };

  // Vérifier si les données sont prêtes
  const isReady = !loading.classes && utilisateur;

  if (!isReady) {
    return <div>Chargement en cours...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Ajouter un Examen</h2>
      {submitError && <div className="text-red-500 mb-4">{submitError}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-group">
          <label className="block mb-1">Classe :</label>
          <select 
            name="classe_id" 
            onChange={handleChange} 
            value={form.classe_id} 
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Choisir une classe --</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {isLycee && filieres.length > 0 && (
          <div className="form-group">
            <label className="block mb-1">Filière :</label>
            <select 
              name="filiere_id" 
              onChange={handleChange} 
              value={form.filiere_id} 
              required
              className="w-full p-2 border rounded"
            >
              {filieres.map(f => (
                <option key={f.id} value={f.id}>{f.nom}</option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group">
          <label className="block mb-1">Matière :</label>
          <select 
            name="matiere_id" 
            onChange={handleChange} 
            value={form.matiere_id} 
            required
            className="w-full p-2 border rounded"
            disabled={loading.matieres}
          >
            <option value="">-- Choisir une matière --</option>
            {matieres.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
            {loading.matieres && <option>Chargement des matières...</option>}
          </select>
        </div>

        <div className="form-group">
          <label className="block mb-1">Date :</label>
          <input 
            type="date" 
            name="date" 
            onChange={handleChange} 
            value={form.date}
            required
            className="w-full p-2 border rounded" 
          />
        </div>

        <div className="form-group">
          <label className="block mb-1">Jour :</label>
          <select
            name="jour" 
            onChange={handleChange} 
            value={form.jour}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">-- Choisir un jour --</option>
            <option value="Lundi">Lundi</option>
            <option value="Mardi">Mardi</option>
            <option value="Mercredi">Mercredi</option>
            <option value="Jeudi">Jeudi</option>
            <option value="Vendredi">Vendredi</option>
            <option value="Samedi">Samedi</option>
            <option value="Dimanche">Dimanche</option>
          </select>
        </div>

        <div className="form-group">
          <label className="block mb-1">Heure Début :</label>
          <input 
            type="time" 
            name="heure_debut" 
            onChange={handleChange} 
            value={form.heure_debut}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="form-group">
          <label className="block mb-1">Heure Fin :</label>
          <input 
            type="time" 
            name="heure_fin" 
            onChange={handleChange} 
            value={form.heure_fin}
            required
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Champ caché pour l'ID du professeur */}
        <input 
          type="hidden" 
          name="professeur_id" 
          value={form.professeur_id} 
        />

        <button 
          type="submit" 
          disabled={isLoading || loading.matieres}
          className={`px-4 py-2 rounded text-white ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {isLoading ? 'En cours...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
}

export default AjouterExamen;