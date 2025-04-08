import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const EntreNotes = () => {
    const [filieres, setFilieres] = useState([]);
    const [classes, setClasses] = useState([]);
    const [etudiants, setEtudiants] = useState([]);
    const [anneesScolaires, setAnneesScolaires] = useState([]);
    const [semestres, setSemestres] = useState([]);
    const [filiereId, setFiliereId] = useState('');
    const [classeId, setClasseId] = useState('');
    const [anneeScolaireId, setAnneeScolaireId] = useState('');
    const [semestreId, setSemestreId] = useState('');
    const [professeurId, setProfesseurId] = useState(null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [loading, setLoading] = useState({
        filieres: false,
        classes: false,
        etudiants: false,
        submission: false,
        anneesScolaires: false,
        semestres: false
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.professeurId) {
            setProfesseurId(location.state.professeurId);
        } else {
            setError("ID du professeur non trouvé.");
        }
    }, [location.state]);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setLoading(prev => ({ ...prev, anneesScolaires: true, semestres: true, filieres: true }));
                
                const [anneesRes, semestresRes, filieresRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/annees_scolaires'),
                    axios.get('http://127.0.0.1:8000/api/semestres'),
                    axios.get('http://127.0.0.1:8000/api/filieres')
                ]);

                setAnneesScolaires(anneesRes.data.data || []);
                setSemestres(semestresRes.data.data || []);
                setFilieres(filieresRes.data.data || []);
            } catch (err) {
                setError("Erreur lors du chargement des données initiales");
            } finally {
                setLoading(prev => ({
                    ...prev,
                    anneesScolaires: false,
                    semestres: false,
                    filieres: false
                }));
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchClasses = async () => {
            if (!filiereId) {
                setClasses([]);
                return;
            }
            
            setLoading(prev => ({ ...prev, classes: true }));
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/filieres/${filiereId}/classes`);
                setClasses(res.data.data || []);
            } catch (err) {
                setError("Erreur lors du chargement des classes");
            } finally {
                setLoading(prev => ({ ...prev, classes: false }));
            }
        };
        fetchClasses();
    }, [filiereId]);

    const handleClasseChange = async (e) => {
        const id = e.target.value;
        setClasseId(id);
        setEtudiants([]);
        
        if (!id || !professeurId || !anneeScolaireId || !semestreId) return;

        try {
            setLoading(prev => ({ ...prev, etudiants: true }));
            const res = await axios.get(`http://127.0.0.1:8000/api/evaluations/${id}`, {
                params: { 
                    professeur_id: professeurId,
                    annee_scolaire_id: anneeScolaireId,
                    semestre_id: semestreId
                }
            });
            setEtudiants(res.data);
        } catch (err) {
            setError("Erreur lors du chargement des étudiants");
        } finally {
            setLoading(prev => ({ ...prev, etudiants: false }));
        }
    };

    const handleNoteChange = (e, noteType, etudiantId) => {
        const value = e.target.value === '' ? '' : parseFloat(e.target.value);
        
        if (value !== '' && (value < 0 || value > 20)) {
            return;
        }
        
        setEtudiants(prev =>
            prev.map(etudiant =>
                etudiant.id === etudiantId ? { ...etudiant, [noteType]: value } : etudiant
            )
        );
    };

    const handleFacteurChange = (e, etudiantId) => {
        const value = e.target.value === '' ? 1 : parseFloat(e.target.value);
        
        if (value < 0.1 || value > 5) {
            return;
        }
        
        setEtudiants(prev =>
            prev.map(etudiant =>
                etudiant.id === etudiantId ? { ...etudiant, facteur: value } : etudiant
            )
        );
    };

    const calculerPointFinal = (etudiant) => {
        const notes = [etudiant.note1, etudiant.note2, etudiant.note3, etudiant.note4]
            .filter(n => n !== '' && !isNaN(n))
            .map(n => parseFloat(n));
            
        if (notes.length === 0) return '';
        
        const somme = notes.reduce((acc, curr) => acc + curr, 0);
        const facteur = parseFloat(etudiant.facteur || 1);
        const moyenne = somme / notes.length;
        const pointFinal = moyenne * facteur;
        return Math.min(pointFinal, 20).toFixed(2);
    };

    const validateForm = () => {
        if (!classeId || !anneeScolaireId || !semestreId) {
            setError("Veuillez sélectionner une classe, une année scolaire et un semestre");
            return false;
        }
        
        if (etudiants.length === 0) {
            setError("Aucun étudiant trouvé pour cette classe");
            return false;
        }
        
        setError(null);
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        const notes = etudiants.map(e => {
            const noteFinale = parseFloat(calculerPointFinal(e)) || 0;
            let remarque = '';
            
            if (noteFinale >= 16) remarque = 'Très bien';
            else if (noteFinale >= 12) remarque = 'Bien';
            else if (noteFinale >= 10) remarque = 'Assez bien';
            else remarque = 'Insuffisant';
    
            return {
                etudiant_id: e.id,
                note1: e.note1 === '' ? null : e.note1,
                note2: e.note2 === '' ? null : e.note2,
                note3: e.note3 === '' ? null : e.note3,
                note4: e.note4 === '' ? null : e.note4,
                facteur: e.facteur || 1,
                remarque: remarque,
                note_finale: noteFinale,
                annee_scolaire_id: anneeScolaireId,
                semestre_id: semestreId
            };
        });
    
        try {
            setLoading(prev => ({ ...prev, submission: true }));
            
            const response = await axios.post('http://127.0.0.1:8000/api/evaluations', {
                classe_id: classeId,
                professeur_id: professeurId,
                semestre_id: semestreId,
                notes: notes
            });
            
            setSuccess("Notes enregistrées avec succès !");
            setTimeout(() => {
                navigate('/enseignant/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'enregistrement des notes");
        } finally {
            setLoading(prev => ({ ...prev, submission: false }));
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Saisie des notes</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label>Année Scolaire</label>
                        <select 
                            className="form-control" 
                            value={anneeScolaireId} 
                            onChange={(e) => setAnneeScolaireId(e.target.value)}
                            disabled={loading.anneesScolaires}
                        >
                            <option value="">Sélectionner une année scolaire</option>
                            {anneesScolaires.map(annee => (
                                <option key={annee.id} value={annee.id}>{annee.annee}</option>
                            ))}
                        </select>
                        {loading.anneesScolaires && <small>Chargement...</small>}
                    </div>
                </div>
                
                <div className="col-md-3">
                    <div className="form-group">
                        <label>Semestre</label>
                        <select 
                            className="form-control" 
                            value={semestreId} 
                            onChange={(e) => setSemestreId(e.target.value)}
                            disabled={loading.semestres}
                        >
                            <option value="">Sélectionner un semestre</option>
                            {semestres.map(semestre => (
                                <option key={semestre.id} value={semestre.id}>{semestre.nom}</option>
                            ))}
                        </select>
                        {loading.semestres && <small>Chargement...</small>}
                    </div>
                </div>
                
                <div className="col-md-3">
                    <div className="form-group">
                        <label>Filière</label>
                        <select 
                            className="form-control" 
                            value={filiereId} 
                            onChange={(e) => setFiliereId(e.target.value)}
                            disabled={loading.filieres}
                        >
                            <option value="">Sélectionner une filière</option>
                            {filieres.map(filiere => (
                                <option key={filiere.id} value={filiere.id}>{filiere.nom}</option>
                            ))}
                        </select>
                        {loading.filieres && <small>Chargement...</small>}
                    </div>
                </div>
                
                <div className="col-md-3">
                    <div className="form-group">
                        <label>Classe</label>
                        <select 
                            className="form-control" 
                            value={classeId} 
                            onChange={handleClasseChange}
                            disabled={loading.classes || !filiereId}
                        >
                            <option value="">Sélectionner une classe</option>
                            {classes.map(classe => (
                                <option key={classe.id} value={classe.id}>{classe.nom}</option>
                            ))}
                        </select>
                        {loading.classes && <small>Chargement...</small>}
                    </div>
                </div>
            </div>

            {loading.etudiants ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Chargement...</span>
                    </div>
                    <p>Chargement des étudiants...</p>
                </div>
            ) : (
                etudiants.length > 0 && (
                    <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Liste des étudiants</h5>
                            <button 
                                className="btn btn-primary"
                                onClick={handleSubmit}
                                disabled={loading.submission}
                            >
                                {loading.submission ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                                        Enregistrement...
                                    </>
                                ) : 'Enregistrer les notes'}
                            </button>
                        </div>
                        
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Nom</th>
                                        <th>Note 1</th>
                                        <th>Note 2</th>
                                        <th>Note 3</th>
                                        <th>Note 4</th>
                                        <th>Facteur</th>
                                        <th>Note Finale</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {etudiants.map(etudiant => (
                                        <tr key={etudiant.id}>
                                            <td>{etudiant.nom}</td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    className={`form-control ${etudiant.note1 !== '' && (etudiant.note1 < 0 || etudiant.note1 > 20) ? 'is-invalid' : ''}`}
                                                    value={etudiant.note1}
                                                    onChange={(e) => handleNoteChange(e, 'note1', etudiant.id)}
                                                    min="0"
                                                    max="20"
                                                    step="0.1"
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    className={`form-control ${etudiant.note2 !== '' && (etudiant.note2 < 0 || etudiant.note2 > 20) ? 'is-invalid' : ''}`}
                                                    value={etudiant.note2}
                                                    onChange={(e) => handleNoteChange(e, 'note2', etudiant.id)}
                                                    min="0"
                                                    max="20"
                                                    step="0.1"
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    className={`form-control ${etudiant.note3 !== '' && (etudiant.note3 < 0 || etudiant.note3 > 20) ? 'is-invalid' : ''}`}
                                                    value={etudiant.note3}
                                                    onChange={(e) => handleNoteChange(e, 'note3', etudiant.id)}
                                                    min="0"
                                                    max="20"
                                                    step="0.1"
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    className={`form-control ${etudiant.note4 !== '' && (etudiant.note4 < 0 || etudiant.note4 > 20) ? 'is-invalid' : ''}`}
                                                    value={etudiant.note4}
                                                    onChange={(e) => handleNoteChange(e, 'note4', etudiant.id)}
                                                    min="0"
                                                    max="20"
                                                    step="0.1"
                                                />
                                            </td>
                                            <td>
                                                <input 
                                                    type="number" 
                                                    className={`form-control ${etudiant.facteur !== '' && (etudiant.facteur < 0.1 || etudiant.facteur > 5) ? 'is-invalid' : ''}`}
                                                    value={etudiant.facteur}
                                                    onChange={(e) => handleFacteurChange(e, etudiant.id)}
                                                    min="0.1"
                                                    max="5"
                                                    step="0.1"
                                                />
                                            </td>
                                            <td className="font-weight-bold">
                                                {calculerPointFinal(etudiant)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default EntreNotes;