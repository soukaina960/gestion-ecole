import React, { useState, useEffect } from 'react';
import ChatBot from 'react-simple-chatbot';

// Mock temporaire pour OpenAI
const fetchAICourses = async (topic) => {
    return ['Cours 1: React', 'Cours 2: JavaScript', 'Cours 3: Node.js'];
};

const fetchAIAnswer = async (question) => {
    return 'Voici une réponse exemple générée pour votre question.';
};

const CourseRecommendations = ({ previousStep, triggerNextStep }) => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchAICourses(previousStep.value)
            .then((courses) => {
                setCourses(courses);
                // Déclencher la prochaine étape après avoir reçu les cours
                setTimeout(() => triggerNextStep(), 1000);
            })
            .catch(() => setCourses([]));
    }, [previousStep.value, triggerNextStep]);

    return (
        <div>
            {courses.length > 0 ? (
                <ul>
                    {courses.map((course, index) => (
                        <li key={index}>{course}</li>
                    ))}
                </ul>
            ) : (
                <p>Aucun cours trouvé pour ce sujet.</p>
            )}
        </div>
    );
};

const FAQAnswer = ({ previousStep, triggerNextStep }) => {
    const [faq, setFaq] = useState(null);

    useEffect(() => {
        fetchAIAnswer(previousStep.value)
            .then((answer) => {
                setFaq({ question: previousStep.value, answer });
                // Déclencher la prochaine étape après avoir reçu la réponse
                setTimeout(() => triggerNextStep(), 1000);
            })
            .catch(() => setFaq(null));
    }, [previousStep.value, triggerNextStep]);

    return (
        <div>
            {faq ? <p>{faq.answer}</p> : <p>Désolé, aucune réponse trouvée.</p>}
        </div>
    );
};

const Chatbot = () => {
    try {
        const steps = [
            {
                id: '1',
                message: 'Bonjour ! Que souhaitez-vous faire ?',
                trigger: '2',
            },
            {
                id: '2',
                options: [
                    { value: 'cours', label: 'Recommander un cours', trigger: '3' },
                    { value: 'faq', label: 'Question fréquente', trigger: '4' },
                ],
            },
            {
                id: '3',
                message: 'Quel sujet vous intéresse ?',
                trigger: 'cours-tag',
            },
            {
                id: 'cours-tag',
                user: true,
                trigger: 'fetch-courses',
            },
            {
                id: 'fetch-courses',
                component: <CourseRecommendations />,
                waitAction: true,
                trigger: 'menu',
            },
            {
                id: '4',
                message: 'Posez votre question.',
                trigger: 'faq-question',
            },
            {
                id: 'faq-question',
                user: true,
                trigger: 'fetch-faq',
            },
            {
                id: 'fetch-faq',
                component: <FAQAnswer />,
                waitAction: true,
                trigger: 'menu',
            },
            {
                id: 'menu',
                message: 'Que souhaitez-vous faire maintenant ?',
                trigger: '2',
            },
        ];

        return <ChatBot steps={steps} />;
    } catch (error) {
        console.error('Erreur dans le Chatbot :', error);
        return <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>;
    }
};

export default Chatbot;