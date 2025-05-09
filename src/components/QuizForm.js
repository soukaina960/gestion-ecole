import { useState, useEffect } from 'react';
import axios from 'axios';

export default function QuizForm() {
  const [formData, setFormData] = useState({
    class_id: '',
    matiere_id: '',
    question_text: '',
    answer: false,
    description: '',
  });

  const [quizzes, setQuizzes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [isLycee, setIsLycee] = useState(false);
  const [loading, setLoading] = useState({ classes: true, filieres: false, matieres: false });
  const [matieres, setMatieres] = useState([]); // Ajout de l'état pour les matières
  const [utilisateur, setUtilisateur] = useState(null); // Ajout de l'état pour l'utilisateur

  // Charger l'utilisateur depuis le localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem("utilisateur");
      if (userData) {
        const user = JSON.parse(userData);
        setUtilisateur(user);
        if (user?.role === "professeur") {
          setFormData(prev => ({ ...prev, professeur_id: user.id }));
        }
      }
    } catch (err) {
      console.error("Erreur de chargement des données utilisateur", err);
    }
  }, []);

  // Charger les classes
  useEffect(() => {
    axios.get('http://localhost:8000/api/classes')
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
      const classe = classes.find(c => c.id === parseInt(selectedClasse));
      const isSecondaire = classe && classe.niveau === "Secondaire";
      setIsLycee(isSecondaire);

      if (isSecondaire) {
        setLoading(prev => ({ ...prev, filieres: true }));
        axios.get(`http://127.0.0.1:8000/api/classes/${selectedClasse}/filieres`)
          .then(res => {
            const filieresData = res.data.filiere ? [res.data.filiere] : res.data.filieres || [];
            setFilieres(filieresData);
            if (filieresData.length > 0) {
              setSelectedFiliere(filieresData[0].id);
              setFormData(prev => ({ ...prev, filiere_id: filieresData[0].id }));
            }
          })
          .catch(err => {
            console.error("Erreur chargement filières:", err);
            setFilieres([]);
          })
          .finally(() => setLoading(prev => ({ ...prev, filieres: false })));
      } else {
        setFilieres([]);
        setSelectedFiliere("");
        setFormData(prev => ({ ...prev, filiere_id: '' }));
      }
    }
  }, [selectedClasse]);

  // Charger les matières quand une filière est sélectionnée (lycée)
  useEffect(() => {
    if (selectedClasse && utilisateur?.id) {
      setLoading(prev => ({ ...prev, matieres: true }));
      const url = isLycee
        ? `http://127.0.0.1:8000/api/professeurs/${utilisateur.id}/classes/${selectedClasse}/filieres/${selectedFiliere}/matieres`
        : `http://localhost:8000/api/professeurs/${utilisateur.id}/classes/${selectedClasse}/matieres`;

      axios.get(url)
        .then(res => {
          console.log("Matières récupérées:", res.data); // Vérifie les données des matières
          setMatieres(res.data);
          setFormData(prev => ({ ...prev, matiere_id: '' }));
        })
        .catch(err => {
          console.error("Erreur chargement matières:", err);
          setMatieres([]);
        })
        .finally(() => setLoading(prev => ({ ...prev, matieres: false })));
    }
  }, [selectedClasse, selectedFiliere, utilisateur, isLycee]);

  // Gestion du changement dans le formulaire
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

  // Ajouter un quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/quizzes', formData);
      alert('Quiz ajouté avec succès !');
      setFormData({
        class_id: '',
        matiere_id: '',
        question_text: '',
        answer: false,
        description: '',
      });
      fetchQuizzes();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de l\'ajout du quiz.');
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/quizzes');
      setQuizzes(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement des quiz", error);
    }
  };

  return (
    <div className="p-4">
      <h2>Ajouter un Quiz</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div>
          <label className="block mb-1">Classe :</label>
          <select 
            name="class_id" 
            onChange={handleChange} 
            value={formData.class_id} 
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
              value={formData.filiere_id} 
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
            value={formData.matiere_id} 
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
        <input
          type="text"
          name="question_text"
          placeholder="Question"
          value={formData.question_text}
          onChange={handleChange}
          required
        /><br/>
        <label>
          Réponse correcte ?<input
            type="checkbox"
            name="answer"
            checked={formData.answer}
            onChange={handleChange}
          />
        </label><br/>
        <textarea
          name="description"
          placeholder="Description (facultatif)"
          value={formData.description}
          onChange={handleChange}
        ></textarea><br/>
        <button type="submit">Ajouter</button>
      </form>

      <h2>Liste des Quiz</h2>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.id}>
            {quiz.question_text} (Classe ID: {quiz.class_id}, Matière ID: {quiz.matiere_id}) - 
            Réponse: {quiz.answer ? 'Vrai' : 'Faux'}
          </li>
        ))}
      </ul>
    </div>
  );
}
