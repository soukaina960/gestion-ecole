import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const AjouterFichier = () => {
    const [filieres, setFilieres] = useState([]);
    const [classes, setClasses] = useState([]);
    const [semestres, setSemestres] = useState([]);
    const [filiereId, setFiliereId] = useState('');
    const [classeId, setClasseId] = useState('');
    const [semestreId, setSemestreId] = useState('');
    const [typeFichier, setTypeFichier] = useState('cours');
    const [fichier, setFichier] = useState(null);
    const [professeurId, setProfesseurId] = useState(null);
    const [fichiersListe, setFichiersListe] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const [editingFile, setEditingFile] = useState({ type: 'cours', fichier: null });

    const location = useLocation();

    // Modifiez votre useEffect d'initialisation comme suit :
useEffect(() => {
    if (location.state?.professeurId) {
        setProfesseurId(location.state.professeurId);
        fetchFichiersProfesseur(location.state.professeurId);
    }

    const fetchInitialData = async () => {
        try {
            const [semestresRes, filieresRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/semestres'),
                axios.get('http://127.0.0.1:8000/api/filieres')
            ]);
            
            // Vérifiez la structure de la réponse et accédez au tableau correctement
            setSemestres(semestresRes.data?.data || semestresRes.data || []);
            setFilieres(filieresRes.data?.data || filieresRes.data || []);
            
            console.log('Semestres:', semestresRes.data); // Pour débogage
            console.log('Filieres:', filieresRes.data); // Pour débogage
            
        } catch (e) {
            console.error('Erreur:', e);
            setError("Erreur de chargement des données initiales");
        }
    };
    fetchInitialData();
}, [location.state]);

    useEffect(() => {
        const fetchClasses = async () => {
            if (!filiereId) return;
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/filieres/${filiereId}/classes`);
                setClasses(res.data);
            } catch (e) {
                setError("Erreur lors du chargement des classes");
            }
        };
        fetchClasses();
    }, [filiereId]);

    const fetchFichiersProfesseur = async (profId) => {
        setLoading(true);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/fichiers`, {
                params: { professeur_id: profId }
            });
            setFichiersListe(res.data.data || res.data || []);
        } catch (e) {
            setError("Erreur de chargement des fichiers");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
    
        if (!fichier || !classeId || !semestreId || !typeFichier) {
            setError("Veuillez remplir tous les champs obligatoires");
            return;
        }
    
        const formData = new FormData();
        formData.append("classe_id", classeId);
        formData.append("semestre_id", semestreId);
        formData.append("type", typeFichier);
        formData.append("fichier", fichier);
        formData.append("professeur_id", professeurId);
    
        try {
            await axios.post("http://127.0.0.1:8000/api/fichiers", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            setMessage("Fichier envoyé avec succès !");
            setError(null);
            setFichier(null);
            setClasseId('');
            setSemestreId('');
            setTypeFichier('cours');
            fetchFichiersProfesseur(professeurId);
            setTimeout(() => setMessage(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Échec de l'envoi du fichier");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/fichiers/${id}`);
                setMessage("Fichier supprimé avec succès");
                fetchFichiersProfesseur(professeurId);
            } catch (e) {
                setError("Erreur lors de la suppression");
            }
        }
    };

    const handleShowModal = (fichier) => {
        setCurrentFile(fichier);
        setEditingFile({ type: fichier.type_fichier, fichier: null });
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        if (!currentFile) return;

        const formData = new FormData();
        formData.append("type", editingFile.type);
        if (editingFile.fichier) {
            formData.append("fichier", editingFile.fichier);
        }

        try {
            await axios.put(`http://127.0.0.1:8000/api/fichiers/${currentFile.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            
            setMessage("Fichier mis à jour avec succès");
            setShowModal(false);
            fetchFichiersProfesseur(professeurId);
        } catch (err) {
            setError(err.response?.data?.message || "Échec de la mise à jour");
        }
    };

    const handleDownload = (chemin) => {
        window.open(`http://127.0.0.1:8000/api/fichiers/download/${chemin}`, '_blank');
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Gestion des Fichiers Pédagogiques</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    <h5>Ajouter un nouveau fichier</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleUpload}>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label">Semestre</label>
                                <select 
                                    className="form-select"
                                    value={semestreId} 
                                    onChange={e => setSemestreId(e.target.value)}
                                    required
                                >
                                    <option value="">Choisir un semestre</option>
                                    {semestres.map(s => (
                                        <option key={s.id} value={s.id}>{s.nom}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-md-4">
                                <label className="form-label">Filière</label>
                                <select 
                                    className="form-select"
                                    value={filiereId} 
                                    onChange={e => setFiliereId(e.target.value)}
                                    required
                                >
                                    <option value="">Choisir une filière</option>
                                    {filieres.map(f => (
                                        <option key={f.id} value={f.id}>{f.nom}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-md-4">
                                <label className="form-label">Classe</label>
                                <select 
                                    className="form-select"
                                    value={classeId} 
                                    onChange={e => setClasseId(e.target.value)}
                                    required
                                    disabled={!filiereId}
                                >
                                    <option value="">Choisir une classe</option>
                                    {classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.nom}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-md-4">
                                <label className="form-label">Type de Fichier</label>
                                <select 
                                    className="form-select"
                                    value={typeFichier} 
                                    onChange={e => setTypeFichier(e.target.value)}
                                    required
                                >
                                    <option value="cours">Cours</option>
                                    <option value="devoir">Devoir</option>
                                    <option value="examen">Examen</option>
                                </select>
                            </div>
                            
                            <div className="col-md-5">
                                <label className="form-label">Fichier</label>
                                <input 
                                    type="file" 
                                    className="form-control" 
                                    onChange={e => setFichier(e.target.files[0])} 
                                    required
                                />
                            </div>
                            
                            <div className="col-md-3 d-flex align-items-end">
                                <button type="submit" className="btn btn-primary w-100">
                                    Envoyer
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="card">
                <div className="card-header bg-primary text-white">
                    <h5>Mes fichiers envoyés</h5>
                </div>
                <div className="card-body">
                    {loading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Chargement...</span>
                            </div>
                        </div>
                    ) : fichiersListe.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Type</th>
                                        <th>Classe</th>
                                        <th>Semestre</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fichiersListe.map(f => (
                                        <tr key={f.id}>
                                            <td>{f.nom_fichier}</td>
                                            <td>
                                                <span className={`badge ${
                                                    f.type_fichier === 'cours' ? 'bg-primary' :
                                                    f.type_fichier === 'devoir' ? 'bg-warning text-dark' :
                                                    'bg-danger'
                                                }`}>
                                                    {f.type_fichier}
                                                </span>
                                            </td>
                                            <td>{f.classe?.nom}</td>
                                            <td>{f.semestre?.nom}</td>
                                            <td>
                                                <div className="d-flex gap-2">
                                                    <button 
                                                        className="btn btn-sm btn-info"
                                                        onClick={() => handleShowModal(f)}
                                                    >
                                                        <i className="bi bi-pencil"></i> Modifier
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(f.id)}
                                                    >
                                                        <i className="bi bi-trash"></i> Supprimer
                                                    </button>
                                                    <button 
                                                        className="btn btn-sm btn-success"
                                                        onClick={() => handleDownload(f.id)}
                                                    >
                                                        <i className="bi bi-download"></i> Télécharger
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-info">
                            Aucun fichier disponible pour le moment
                        </div>
                    )}
                </div>
            </div>

            {showModal && currentFile && (
                <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Modifier le fichier</h5>
                                <button 
                                    type="button" 
                                    className="btn-close" 
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <form onSubmit={handleUpdate}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Type de Fichier</label>
                                        <select 
                                            className="form-select"
                                            value={editingFile.type} 
                                            onChange={e => setEditingFile({
                                                ...editingFile,
                                                type: e.target.value
                                            })}
                                        >
                                            <option value="cours">Cours</option>
                                            <option value="devoir">Devoir</option>
                                            <option value="examen">Examen</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">
                                            Nouveau fichier (optionnel - actuel: {currentFile.nom_fichier})
                                        </label>
                                        <input 
                                            type="file" 
                                            className="form-control" 
                                            onChange={e => setEditingFile({
                                                ...editingFile,
                                                fichier: e.target.files[0]
                                            })} 
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary" 
                                        onClick={() => setShowModal(false)}
                                    >
                                        Annuler
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Enregistrer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AjouterFichier;