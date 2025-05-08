import { useState, useEffect } from 'react';
import axios from 'axios';

export default function QuizInterface() {
  const [matieres, setMatieres] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [classeId, setClasseId] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState({
    matieres: false,
    quizzes: false,
  });

  // Charger les données utilisateur
  useEffect(() => {
    const userData = localStorage.getItem('utilisateur');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role === 'étudiant' && parsedUser.classe_id) {
        setClasseId(parsedUser.classe_id);
      }
    }
  }, []);

  // Charger les matières
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        setLoading(prev => ({ ...prev, matieres: true }));
        const res = await axios.get('http://127.0.0.1:8000/api/matieres');
        setMatieres(res.data.data || []);
      } catch (err) {
        setError('Erreur de chargement des matières');
      } finally {
        setLoading(prev => ({ ...prev, matieres: false }));
      }
    };
    fetchMatieres();
  }, []);

  // Charger les quiz
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!classeId) return;
      
      try {
        setLoading(prev => ({ ...prev, quizzes: true }));
        const res = await axios.get('http://localhost:8000/api/quizzes', {
          params: { class_id: classeId },
        });
        
        setQuizzes(res.data);
        setFilteredQuizzes(res.data); // Initialiser avec tous les quiz
      } catch (err) {
        setError('Erreur de chargement des quiz');
      } finally {
        setLoading(prev => ({ ...prev, quizzes: false }));
      }
    };
    fetchQuizzes();
  }, [classeId]);

  // Filtrer les quiz quand une matière est sélectionnée
  const handleMatiereChange = (e) => {
    const matiereId = e.target.value;
    
    if (matiereId) {
      const filtered = quizzes.filter(q => q.matiere_id == matiereId);
      setFilteredQuizzes(filtered);
    } else {
      setFilteredQuizzes(quizzes);
    }
    
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  // Gestion des réponses
  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    if (answer === filteredQuizzes[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
  };

  // Question suivante
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentQuestionIndex(prev => 
      prev < filteredQuizzes.length - 1 ? prev + 1 : 0
    );
  };

  // Question actuelle
  const currentQuestion = filteredQuizzes[currentQuestionIndex] || {};
  const selectedMatiere = matieres.find(m => m.id == currentQuestion?.matiere_id);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Quiz</h1>

      {/* Sélection de la matière */}
      <div className="mb-6">
        <label className="block text-gray-700 mb-2">Matière :</label>
        <select
          onChange={handleMatiereChange}
          className="w-full p-2 border rounded"
          disabled={loading.matieres}
        >
          <option value="">-- Toutes les matières --</option>
          {matieres.map(m => (
            <option key={m.id} value={m.id}>{m.nom}</option>
          ))}
        </select>
      </div>

      {/* Affichage des erreurs */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Avertissement si aucun quiz */}
      {!loading.quizzes && filteredQuizzes.length === 0 && (
        <div className="text-center py-8 bg-yellow-100 rounded-lg">
          Aucun quiz disponible pour cette sélection
        </div>
      )}

      {/* Interface du quiz */}
      {filteredQuizzes.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* En-tête */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {selectedMatiere?.nom && `Matière: ${selectedMatiere.nom}`}
            </h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              Question {currentQuestionIndex + 1}/{filteredQuizzes.length}
            </span>
          </div>

          {/* Question */}
          <div className="mb-6">
            <p className="text-lg mb-4">{currentQuestion.question_text}</p>
            {currentQuestion.description && (
              <p className="text-gray-600 italic">{currentQuestion.description}</p>
            )}
          </div>

          {/* Boutons de réponse */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleAnswer(true)}
              disabled={showResult}
              className={`p-3 rounded-lg font-medium ${
                showResult 
                  ? currentQuestion.answer 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300'
                  : 'bg-blue-100 hover:bg-blue-200'
              }`}
            >
              Vrai
            </button>
            <button
              onClick={() => handleAnswer(false)}
              disabled={showResult}
              className={`p-3 rounded-lg font-medium ${
                showResult 
                  ? !currentQuestion.answer 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300'
                  : 'bg-blue-100 hover:bg-blue-200'
              }`}
            >
              Faux
            </button>
          </div>

          {/* Résultat */}
          {showResult && (
            <div className={`p-4 mb-6 rounded-lg ${
              selectedAnswer === currentQuestion.answer 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {selectedAnswer === currentQuestion.answer ? (
                <p className="font-medium">✓ Bonne réponse!</p>
              ) : (
                <p className="font-medium">
                  ✗ Mauvaise réponse. La réponse correcte était: {' '}
                  <span className="font-bold">
                    {currentQuestion.answer ? 'Vrai' : 'Faux'}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Bouton suivant */}
          {showResult && (
            <button
              onClick={handleNextQuestion}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {currentQuestionIndex < filteredQuizzes.length - 1 ? 'Question suivante →' : 'Recommencer'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}