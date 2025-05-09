import { useEffect, useState } from 'react';
import axios from 'axios';

export default function EmploiProf() {
    const [emplois, setEmplois] = useState([]);
    const [profId, setProfId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const joursSemaine = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('utilisateur'));
        if (user?.role === 'professeur') {
            setProfId(user.id);
        } else {
            setError("Accès réservé aux professeurs");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!profId) return;

        setLoading(true);
        axios.get(`http://localhost:8000/api/emplois-temps/professeur/${profId}`)
            .then(res => {
                setEmplois(res.data);
            })
            .catch(err => {
                setError("Erreur lors du chargement de l'emploi du temps");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, [profId]);

    if (loading) return <div className="p-4">Chargement en cours...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (emplois.length === 0) return <div className="p-4">Aucun emploi du temps disponible</div>;

    // Récupérer tous les créneaux horaires uniques
    const creneaux = Array.from(new Set(emplois.map(e => `${e.creneau.heure_debut} - ${e.creneau.heure_fin}`)))
        .sort(); // Pour un affichage dans l’ordre

    const getCours = (jour, creneau) => {
        return emplois.find(e => e.jour === jour && `${e.creneau.heure_debut} - ${e.creneau.heure_fin}` === creneau);
    };

    return (
        <div className="p-4 overflow-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Votre Emploi du Temps</h2>
                <a 
                    href={`http://localhost:8000/api/emplois-temps/professeur/${profId}/pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Exporter en PDF
                </a>
            </div>

            <table className="min-w-full border border-gray-300 text-sm text-center">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-2 py-1">Créneau</th>
                        {joursSemaine.map(jour => (
                            <th key={jour} className="border px-2 py-1 capitalize">{jour}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {creneaux.map(creneau => (
                        <tr key={creneau}>
                            <td className="border px-2 py-1 font-medium">{creneau}</td>
                            {joursSemaine.map(jour => {
                                const cours = getCours(jour, creneau);
                                return (
                                    <td key={jour} className="border px-2 py-2 align-top">
                                        {cours ? (
                                            <div className="text-left">
                                                <p className="font-semibold">{cours.matiere.nom}</p>
                                                <p>Classe: {cours.classe.name}</p>
                                                <p>Salle: {cours.salle}</p>
                                            </div>
                                        ) : <span className="text-gray-400">—</span>}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
