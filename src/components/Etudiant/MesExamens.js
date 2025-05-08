import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MesExamens() {
    const [examens, setExamens] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExamens = async () => {
            try {
                // 1. Récupérer l'utilisateur connecté
                const userData = localStorage.getItem('utilisateur');
                if (!userData) throw new Error('Utilisateur non connecté');

                const { id } = JSON.parse(userData);
                
                // 2. Récupérer les examens de l'étudiant
                const { data } = await axios.get(`http://127.0.0.1:8000/api/etudiants/${id}/examens`);
                
                // 3. Formater les données
                const examensFormates = data.map(examen => ({
                    ...examen,
                    date: examen.date,
                    jour: examen.jour || getFrenchDayName(examen.date),
                    heure_debut: formatHeure(examen.heure_debut),
                    heure_fin: formatHeure(examen.heure_fin),
                    matiere: examen.matiere?.nom || 'Non spécifié',
                    professeur: examen.professeur?.nom || 'Non affecté',
                    salle: examen.salle || 'Non spécifiée'
                }));
                
                setExamens(examensFormates);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                console.error('Erreur:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchExamens();
    }, []);

    // Formater l'heure (HH:MM:SS → HH:MM)
    const formatHeure = (heure) => {
        if (!heure) return '';
        const [hours, minutes] = heure.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    // Obtenir le nom du jour en français
    const getFrenchDayName = (dateString) => {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const date = new Date(dateString);
        return days[date.getDay()];
    };

    if (loading) return <div className="text-center py-8">Chargement en cours...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Mon Emploi du Temps des Examens</h2>
            
            {examens.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Aucun examen programmé</p>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-4 text-left">Date</th>
                                <th className="py-3 px-4 text-left">Jour</th>
                                <th className="py-3 px-4 text-left">Matière</th>
                                <th className="py-3 px-4 text-left">Professeur</th>
                                <th className="py-3 px-4 text-left">Horaire</th>
                               
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {examens.map((examen) => (
                                <tr key={examen.id} className="hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        {new Date(examen.date).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="py-3 px-4">{examen.jour}</td>
                                    <td className="py-3 px-4">{examen.matiere}</td>
                                    <td className="py-3 px-4">{examen.professeur}</td>
                                    <td className="py-3 px-4">
                                        {examen.heure_debut} - {examen.heure_fin}
                                    </td>
                                   
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default MesExamens;