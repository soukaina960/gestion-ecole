import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EnregistrerAbsence = () => {
    const [filieres, setFilieres] = useState([]);
    const [classes, setClasses] = useState([]);
    const [etudiants, setEtudiants] = useState([]);
    const [etudiantsProfesseurs, setEtudiantsProfesseurs] = useState([]); // Étudiants-professeurs
    const [filiereId, setFiliereId] = useState('');
    const [classeId, setClasseId] = useState('');
    const [absences, setAbsences] = useState([]);
    const [loading, setLoading] = useState({
        filieres: false,
        classes: false,
        etudiants: false,
        etudiantsProfesseurs: false,
        submission: false
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [selectedFiliere, setSelectedFiliere] = useState('');
    const [selectedClasse, setSelectedClasse] = useState('');

    // Fetch filières
    useEffect(() => {
        const fetchFilieres = async () => {
            setLoading(prev => ({ ...prev, filieres: true }));
            setError(null);
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/filieres');
                const data = response.data.data || response.data;
                setFilieres(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Erreur lors du chargement des filières");
                console.error(err);
            } finally {
                setLoading(prev => ({ ...prev, filieres: false }));
            }
        };
        fetchFilieres();
    }, []);

    // Fetch classes based on selected filière
    useEffect(() => {
        const fetchClasses = async () => {
            if (!selectedFiliere) {
                setClasses([]);
                setSelectedClasse('');
                return;
            }

            setLoading(prev => ({ ...prev, classes: true }));
            setError(null);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/filieres/${selectedFiliere}/classes`);
                const data = response.data.data || response.data;
                setClasses(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Erreur lors du chargement des classes");
                console.error(err);
            } finally {
                setLoading(prev => ({ ...prev, classes: false }));
            }
        };
        fetchClasses();
    }, [selectedFiliere]);

    // Fetch students of the selected class
    const handleClasseChange = async (e) => {
        const id = e.target.value;
        if (!id) return;

        setClasseId(id);
        setEtudiants([]); // Reset students

        try {
            setLoading(prev => ({ ...prev, etudiants: true }));
            setError(null);
            const response = await axios.get(`http://127.0.0.1:8000/api/etudiants/${id}`);
            if (Array.isArray(response.data)) {
                setEtudiants(response.data);
            } else {
                setError("Format de données inattendu pour les étudiants");
                setEtudiants([]);
            }
        } catch (err) {
            setError("Erreur lors du chargement des étudiants");
            setEtudiants([]);
        } finally {
            setLoading(prev => ({ ...prev, etudiants: false }));
        }
    };

    const handleFiliereChange = (e) => {
        const id = e.target.value;
        setSelectedFiliere(id);
        setFiliereId(id);
        setSelectedClasse('');
        setClasseId('');
        setEtudiants([]);
    };

    // Fetch students-professors based on selected class
    useEffect(() => {
        const fetchEtudiantsProfesseurs = async () => {
            if (!classeId) return;

            setLoading(prev => ({ ...prev, etudiantsProfesseurs: true }));
            setError(null);

            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/etudiant_professeur/${classeId}`);
                const data = response.data.data || response.data;
                setEtudiantsProfesseurs(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Erreur lors du chargement des étudiants-professeurs");
                console.error(err);
            } finally {
                setLoading(prev => ({ ...prev, etudiantsProfesseurs: false }));
            }
        };
        fetchEtudiantsProfesseurs();
    }, [classeId]);

    const toggleAbsence = (etudiantId) => {
        setAbsences(prev =>
            prev.includes(etudiantId)
                ? prev.filter(id => id !== etudiantId)
                : [...prev, etudiantId]
        );
    };

    const handleSubmit = async () => {
        if (!classeId || absences.length === 0) {
            setError("Veuillez sélectionner une classe et au moins un étudiant");
            return;
        }

        try {
            setLoading(prev => ({ ...prev, submission: true }));
            setError(null);

            await axios.post('http://127.0.0.1:8000/api/absences', {
                classe_id: classeId,
                etudiants_absents: absences
            });

            alert("Absences enregistrées avec succès !");
            navigate('/enseignant/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement des absences");
        } finally {
            setLoading(prev => ({ ...prev, submission: false }));
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Enregistrer des absences</h2>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="mb-4 space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Filière</label>
                    <select
                        onChange={handleFiliereChange}
                        value={filiereId}
                        className="border p-2 w-full rounded"
                        disabled={loading.filieres}
                    >
                        <option value="">Choisir une filière</option>
                        {filieres.map(f => (
                            <option key={f.id} value={f.id}>
                                {f.nom}
                            </option>
                        ))}
                    </select>
                    {loading.filieres && <p className="text-sm text-gray-500">Chargement...</p>}
                </div>

                {filiereId && (
                    <div>
                        <label className="block mb-1 font-medium">Classe</label>
                        <select
                            onChange={handleClasseChange}
                            value={classeId}
                            className="border p-2 w-full rounded"
                            disabled={loading.classes || !filiereId}
                        >
                            <option value="">Choisir une classe</option>
                            {classes.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.nom}
                                </option>
                            ))}
                        </select>
                        {loading.classes && <p className="text-sm text-gray-500">Chargement...</p>}
                    </div>
                )}
            </div>

            {classeId && (
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Étudiants</h3>
                    {loading.etudiants ? (
                        <p>Chargement des étudiants...</p>
                    ) : etudiants.length > 0 ? (
                        <ul className="space-y-2">
                            {etudiants.map(e => (
                                <li key={e.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        onChange={() => toggleAbsence(e.id)}
                                        checked={absences.includes(e.id)}
                                        className="mr-2"
                                    />
                                    <span>{e.nom} {e.prenom}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Aucun étudiant trouvé pour cette classe</p>
                    )}
                </div>
            )}

            <div className="mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={loading.submission || absences.length === 0 || !classeId}
                    className={`bg-green-600 text-white px-4 py-2 rounded ${loading.submission || absences.length === 0 || !classeId ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
                >
                    {loading.submission ? 'Enregistrement...' : 'Enregistrer les absences'}
                </button>
            </div>
        </div>
    );
};

export default EnregistrerAbsence;
