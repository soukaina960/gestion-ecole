import React, { useState, useEffect } from 'react';
import { Bot, User, Send, X, Loader2 } from 'lucide-react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

// Thème personnalisé pour le chatbot
const theme = {
  background: '#f5f8fb',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#3f83f8',
  headerFontColor: '#fff',
  headerFontSize: '16px',
  botBubbleColor: '#3f83f8',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

// Mock API pour les cours
const fetchAICourses = async (topic) => {
  // Simuler un délai réseau
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const courses = {
    'react': ['React Fundamentals', 'Advanced React Hooks', 'React Performance Optimization'],
    'javascript': ['JavaScript ES6+', 'Functional Programming in JS', 'JS Design Patterns'],
    'node': ['Node.js Basics', 'Building REST APIs with Node', 'Node.js Security']
  };

  return courses[topic.toLowerCase()] || ['Introduction to Programming', 'Algorithms and Data Structures'];
};

// Mock API pour les réponses FAQ
const fetchAIAnswer = async (question) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const answers = {
    'prix': 'Nos cours sont disponibles avec un abonnement mensuel de 29,99€ ou annuel à 299€.',
    'contact': 'Vous pouvez nous contacter à contact@eduka.com ou au 01 23 45 67 89.',
    'essai': 'Nous offrons une période d\'essai de 7 jours sans engagement.'
  };

  return answers[question.toLowerCase()] || 'Je n\'ai pas trouvé de réponse à votre question. Contactez notre support pour plus d\'informations.';
};

// Composant pour les recommandations de cours
const CourseRecommendations = ({ previousStep, triggerNextStep }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAICourses(previousStep.value)
      .then((courses) => {
        setCourses(courses);
        setLoading(false);
        setTimeout(() => triggerNextStep(), 1500);
      })
      .catch(() => {
        setCourses([]);
        setLoading(false);
      });
  }, [previousStep.value, triggerNextStep]);

  return (
    <div className="p-2">
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          <span>Recherche des cours...</span>
        </div>
      ) : courses.length > 0 ? (
        <div>
          <p className="font-semibold mb-2">Voici des cours sur "{previousStep.value}":</p>
          <ul className="list-disc pl-5 space-y-1">
            {courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Aucun cours trouvé pour ce sujet.</p>
      )}
    </div>
  );
};

// Composant pour les réponses FAQ
const FAQAnswer = ({ previousStep, triggerNextStep }) => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchAIAnswer(previousStep.value)
      .then((response) => {
        setAnswer(response);
        setLoading(false);
        setTimeout(() => triggerNextStep(), 1500);
      })
      .catch(() => {
        setAnswer('Erreur lors de la récupération de la réponse.');
        setLoading(false);
      });
  }, [previousStep.value, triggerNextStep]);

  return (
    <div className="p-2">
      {loading ? (
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin h-5 w-5 mr-2" />
          <span>Recherche de la réponse...</span>
        </div>
      ) : (
        <div>
          <p className="font-semibold mb-1">Votre question:</p>
          <p className="italic mb-2">"{previousStep.value}"</p>
          <p className="font-semibold mb-1">Réponse:</p>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

// Composant principal Chatbot
const Chatbot = ({ onClose }) => {
  const steps = [
    {
      id: 'welcome',
      message: 'Bonjour ! Je suis EdukaBot, votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?',
      trigger: 'options',
    },
    {
      id: 'options',
      options: [
        { 
          value: 'cours', 
          label: 'Trouver un cours', 
          trigger: 'ask-course-topic' 
        },
        { 
          value: 'faq', 
          label: 'Poser une question', 
          trigger: 'ask-faq-question' 
        },
        { 
          value: 'contact', 
          label: 'Contactez le support', 
          trigger: 'contact-support' 
        },
      ],
    },
    {
      id: 'ask-course-topic',
      message: 'Quel sujet vous intéresse ? (ex: React, JavaScript, Node)',
      trigger: 'get-course-topic',
    },
    {
      id: 'get-course-topic',
      user: true,
      validator: (value) => {
        if (!value || value.trim().length < 2) {
          return 'Veuillez entrer un sujet valide (au moins 2 caractères)';
        }
        return true;
      },
      trigger: 'fetch-courses',
    },
    {
      id: 'fetch-courses',
      component: <CourseRecommendations />,
      waitAction: true,
      trigger: 'more-help',
    },
    {
      id: 'ask-faq-question',
      message: 'Quelle est votre question ? Vous pouvez demander sur les prix, contacts ou essai gratuit.',
      trigger: 'get-faq-question',
    },
    {
      id: 'get-faq-question',
      user: true,
      trigger: 'fetch-faq-answer',
    },
    {
      id: 'fetch-faq-answer',
      component: <FAQAnswer />,
      waitAction: true,
      trigger: 'more-help',
    },
    {
      id: 'contact-support',
      message: 'Notre équipe support est disponible du lundi au vendredi de 9h à 18h. Vous pouvez nous contacter par email à contact@eduka.com ou par téléphone au 01 23 45 67 89.',
      trigger: 'more-help',
    },
    {
      id: 'more-help',
      message: 'Puis-je vous aider avec autre chose ?',
      trigger: 'options',
    },
  ];

  return (
    <div className="relative bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h3 className="font-bold text-lg flex items-center">
          <Bot className="mr-2" /> EdukaBot
        </h3>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200"
          aria-label="Fermer le chatbot"
        >
          <X size={20} />
        </button>
      </div>
      <div className="h-96">
        <ThemeProvider theme={theme}>
          <ChatBot
            steps={steps}
            headerTitle="EdukaBot Assistant"
            botAvatar={<Bot size={24} />}
            userAvatar={<User size={24} />}
            customDelay={300}
            width="100%"
            height="100%"
            hideUserAvatar={false}
            bubbleOptionStyle={{ backgroundColor: '#3f83f8', color: 'white' }}
          />
        </ThemeProvider>
      </div>
    </div>
  );
};

export default Chatbot;