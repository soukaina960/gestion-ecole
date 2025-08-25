import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './Quiz.css';

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
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatiereId, setSelectedMatiereId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userData = localStorage.getItem('utilisateur');
        if (!userData) throw new Error("Utilisateur non connecté");

        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id;

        const etudiantRes = await axios.get('http://127.0.0.1:8000/api/etudiants', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });

        const etudiant = etudiantRes.data.find(e => e.utilisateur_id === userId);
        if (!etudiant) throw new Error("Aucun étudiant trouvé pour cet utilisateur");

        setClasseId(etudiant.classe_id);

      } catch (err) {
        setError(err.message || "Une erreur est survenue");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!classeId) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const [matieresRes, quizzesRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/matieres'),
          axios.get('http://localhost:8000/api/quizzes', {
            params: { class_id: classeId },
          })
        ]);
        
        setMatieres(matieresRes.data.data || []);
        setQuizzes(quizzesRes.data);
        setFilteredQuizzes(quizzesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur de chargement des données');
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [classeId]);

  const handleMatiereChange = (e) => {
    const matiereId = e.target.value;
    setSelectedMatiereId(matiereId);
    
    if (matiereId) {
      const filtered = quizzes.filter(q => q.matiere_id == matiereId);
      setFilteredQuizzes(filtered);
    } else {
      setFilteredQuizzes(quizzes);
    }
    
    resetQuizState();
  };

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  const handleAnswer = (userAnswer) => {
    // Convertit la réponse stockée (1/0) en booléen
    const correctAnswer = currentQuestion.answer === 1;
    
    setSelectedAnswer(userAnswer);
    setShowResult(true);
    
    // Compare la réponse utilisateur avec la bonne réponse
    if (userAnswer === correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentQuestionIndex(prev => 
      prev < filteredQuizzes.length - 1 ? prev + 1 : 0
    );
  };

  const handleRestartQuiz = () => {
    resetQuizState();
  };

  const currentQuestion = useMemo(() => {
    return filteredQuizzes[currentQuestionIndex] || {};
  }, [filteredQuizzes, currentQuestionIndex]);

  const selectedMatiere = useMemo(() => {
    return matieres.find(m => m.id == currentQuestion?.matiere_id) || {};
  }, [matieres, currentQuestion]);

  const progressPercentage = useMemo(() => {
    return ((currentQuestionIndex + 1) / filteredQuizzes.length) * 100;
  }, [currentQuestionIndex, filteredQuizzes.length]);

  if (isLoading) {
    return (
      <div className="quiz-loading">
        <div className="quiz-spinner"></div>
        <p>Chargement en cours...</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h1>Quiz</h1>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Matière :</label>
          <select
            value={selectedMatiereId}
            onChange={handleMatiereChange}
            className="quiz-select"
            disabled={isLoading}
          >
            <option value="">-- Toutes les matières --</option>
            {matieres.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
        </div>

        {error && <div className="quiz-error">{error}</div>}

        {!isLoading && filteredQuizzes.length === 0 && (
          <div className="quiz-empty">
            Aucun quiz disponible pour cette sélection
          </div>
        )}

        {filteredQuizzes.length > 0 && (
          <>
            <div className="quiz-progress">
              <div 
                className="quiz-progress-bar" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>

            <div className="quiz-content">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedMatiere?.nom && `Matière: ${selectedMatiere.nom}`}
                </h2>
                <span className="quiz-counter">
                  Question {currentQuestionIndex + 1}/{filteredQuizzes.length}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-lg mb-4">{currentQuestion.question_text}</p>
                {currentQuestion.description && (
                  <p className="text-gray-600 italic">{currentQuestion.description}</p>
                )}
              </div>

              <div className="quiz-answers">
                <button
                  onClick={() => handleAnswer(true)}
                  disabled={showResult}
                  className={`quiz-answer-btn ${
                    showResult && currentQuestion.answer === 1 ? 'correct' : ''
                  } ${
                    showResult && selectedAnswer === true && currentQuestion.answer === 0 ? 'incorrect' : ''
                  }`}
                  aria-pressed={selectedAnswer === true}
                >
                  Vrai
                </button>
                <button
                  onClick={() => handleAnswer(false)}
                  disabled={showResult}
                  className={`quiz-answer-btn ${
                    showResult && currentQuestion.answer === 0 ? 'correct' : ''
                  } ${
                    showResult && selectedAnswer === false && currentQuestion.answer === 1 ? 'incorrect' : ''
                  }`}
                  aria-pressed={selectedAnswer === false}
                >
                  Faux
                </button>
              </div>

              {showResult && (
                <div className={`quiz-feedback ${
                  selectedAnswer === (currentQuestion.answer === 1) ? 'correct' : 'incorrect'
                }`}>
                  {selectedAnswer === (currentQuestion.answer === 1) ? (
                    <p>✓ Bonne réponse!</p>
                  ) : (
                    <p>
                      ✗ Mauvaise réponse. La réponse correcte était: {' '}
                      <span className="font-bold">
                        {currentQuestion.answer === 1 ? 'Vrai' : 'Faux'}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {showResult && (
                <div className="quiz-navigation">
                  <button
                    onClick={
                      currentQuestionIndex < filteredQuizzes.length - 1 
                        ? handleNextQuestion 
                        : handleRestartQuiz
                    }
                    className="quiz-btn quiz-btn-primary"
                  >
                    {currentQuestionIndex < filteredQuizzes.length - 1 
                      ? 'Question suivante →' 
                      : 'Recommencer le quiz'}
                  </button>
                  
                  <div className="quiz-score">
                    Score: {score}/{filteredQuizzes.length}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}