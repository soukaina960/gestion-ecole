import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api',
  ENDPOINTS: {
    ANNEES: '/annees_scolaires',
    SEMESTRES: '/annees/:anneeId/semestres',
    CLASSES: '/classes',
    FILIERES: '/classes/:classeId/filieres',
    MATIERES: '/professeurs/:professeurId/matieres',
    FICHIERS: '/fichiers-pedagogiques'
  }
};

const AjouterFichier = () => {
  const navigate = useNavigate();
  const [utilisateur, setUtilisateur] = useState(null);
  const [annees, setAnnees] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [typesFichier] = useState(['cours', 'devoir', 'examen', 'corrigé', 'ressource']);
  const [filieres, setFilieres] = useState([]);
  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [selectedSemestre, setSelectedSemestre] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [selectedType, setSelectedType] = useState("cours");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [fichier, setFichier] = useState(null);
  const [fichiersListe, setFichiersListe] = useState([]);
  const [isLycee, setIsLycee] = useState(false);
  const [loading, setLoading] = useState({
    annees: false,
    semestres: false,
    classes: false,
    filieres: false,
    matieres: false,
    fichiers: false,
    submission: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleApiError = (error, context) => {
    console.error(`Erreur ${context}:`, error);
    setError(error.response?.data?.message || `Erreur lors de ${context}`);
  };

  useEffect(() => {
    const userData = localStorage.getItem("utilisateur");
    if (userData) {
      setUtilisateur(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const fetchAnnees = async () => {
      setLoading(prev => ({ ...prev, annees: true }));
      try {
        const res = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANNEES}`);
        setAnnees(res.data);
      } catch (err) {
        handleApiError(err, "chargement des années");
      } finally {
        setLoading(prev => ({ ...prev, annees: false }));
      }
    };
    fetchAnnees();
  }, []);

  useEffect(() => {
    const fetchSemestres = async () => {
      if (!selectedAnnee) return setSemestres([]);
      setLoading(prev => ({ ...prev, semestres: true }));
      try {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEMESTRES.replace(':anneeId', selectedAnnee)}`;
        const res = await axios.get(url);
        setSemestres(res.data);
      } catch (err) {
        handleApiError(err, "chargement des semestres");
      } finally {
        setLoading(prev => ({ ...prev, semestres: false }));
      }
    };
    fetchSemestres();
  }, [selectedAnnee]);

  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedAnnee || !selectedSemestre) return setClasses([]);
      setLoading(prev => ({ ...prev, classes: true }));
      try {
        const res = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CLASSES}?annee=${selectedAnnee}`);
        setClasses(res.data);
      } catch (err) {
        handleApiError(err, "chargement des classes");
      } finally {
        setLoading(prev => ({ ...prev, classes: false }));
      }
    };
    fetchClasses();
  }, [selectedAnnee, selectedSemestre]);

  useEffect(() => {
    const checkLyceeAndFetchFilieres = async () => {
      if (!selectedClasse) return setIsLycee(false);
      const classe = classes.find(c => c.id === parseInt(selectedClasse));
      const isLycee = classe?.niveau === "Secondaire";
      setIsLycee(isLycee);
      if (!isLycee) return setFilieres([]);

      setLoading(prev => ({ ...prev, filieres: true }));
      try {
        const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FILIERES.replace(':classeId', selectedClasse)}`;
        const res = await axios.get(url);
        const filieresData = res.data.filiere ? [res.data.filiere] : res.data.filieres || [];
        setFilieres(filieresData);
        if (filieresData.length) setSelectedFiliere(filieresData[0].id);
      } catch (err) {
        handleApiError(err, "chargement des filières");
      } finally {
        setLoading(prev => ({ ...prev, filieres: false }));
      }
    };
    checkLyceeAndFetchFilieres();
  }, [selectedClasse, classes]);

  useEffect(() => {
    const fetchMatieres = async () => {
      if (!selectedClasse || !utilisateur?.id) return setMatieres([]);
      setLoading(prev => ({ ...prev, matieres: true }));
      try {
        const url = isLycee && selectedFiliere
          ? `${API_CONFIG.BASE_URL}/professeurs/${utilisateur.id}/classes/${selectedClasse}/filieres/${selectedFiliere}/matieres`
          : `${API_CONFIG.BASE_URL}/professeurs/${utilisateur.id}/classes/${selectedClasse}/matieres`;
        const res = await axios.get(url);
        setMatieres(res.data);
      } catch (err) {
        handleApiError(err, "chargement des matières");
      } finally {
        setLoading(prev => ({ ...prev, matieres: false }));
      }
    };
    fetchMatieres();
  }, [selectedClasse, selectedFiliere, isLycee, utilisateur]);

  const fetchFichiers = useCallback(async () => {
    if (!utilisateur?.id || !selectedClasse || !selectedSemestre || !selectedMatiere) return;
    setLoading(prev => ({ ...prev, fichiers: true }));
    try {
      const res = await axios.get(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FICHIERS}`, {
        params: {
          classe_id: selectedClasse,
          semestre_id: selectedSemestre,
          matiere_id: selectedMatiere
        },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFichiersListe(res.data.data || res.data);
    } catch (err) {
      handleApiError(err, "chargement des fichiers");
    } finally {
      setLoading(prev => ({ ...prev, fichiers: false }));
    }
  }, [utilisateur, selectedClasse, selectedSemestre, selectedMatiere]);

  useEffect(() => {
    fetchFichiers();
  }, [fetchFichiers]);

  const validateFile = (file) => {
    if (!file) return setError("Veuillez sélectionner un fichier");
    const validTypes = [
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    if (!validTypes.includes(file.type)) {
      return setError("Type de fichier non supporté");
    }
    if (file.size > 10 * 1024 * 1024) {
      return setError("Fichier trop volumineux (>10MB)");
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!validateFile(fichier)) return;

    const formData = new FormData();
    formData.append('fichier', fichier); // Envoie du fichier avec le nom 'fichier'
    formData.append('type_fichier', selectedType);
    formData.append('classe_id', selectedClasse);
    formData.append('semestre_id', selectedSemestre);
    formData.append('matiere_id', selectedMatiere);
    formData.append('professeur_id', utilisateur?.id);

    try {
        setLoading(prev => ({ ...prev, submission: true }));
        await axios.post(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FICHIERS}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        setSuccess("Fichier envoyé avec succès !");
        setFichier(null);
        e.target.reset();
        fetchFichiers();
    } catch (err) {
        handleApiError(err, "l'envoi du fichier");
    } finally {
        setLoading(prev => ({ ...prev, submission: false }));
    }
};

  const handleDownload = (id) => {
    window.open(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FICHIERS}/${id}/download`, '_blank');
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    try {
      await axios.delete(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FICHIERS}/${id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess("Fichier supprimé !");
      fetchFichiers();
    } catch (err) {
      handleApiError(err, "la suppression");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [error, success]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestion des fichiers pédagogiques</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5>Ajouter un fichier</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-3">
                <div className="form-group">
                  <label>Année Scolaire *</label>
                  <select
                    className="form-control"
                    value={selectedAnnee}
                    onChange={(e) => {
                      setSelectedAnnee(e.target.value);
                      setSelectedSemestre("");
                      setSelectedClasse("");
                      setSelectedMatiere("");
                    }}
                    disabled={loading.annees}
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {annees.map(a => (
                      <option key={a.id} value={a.id}>{a.annee}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Semestre *</label>
                  <select
                    className="form-control"
                    value={selectedSemestre}
                    onChange={(e) => {
                      setSelectedSemestre(e.target.value);
                      setSelectedClasse("");
                      setSelectedMatiere("");
                    }}
                    disabled={!selectedAnnee || loading.semestres}
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {semestres.map(s => (
                      <option key={s.id} value={s.id}>{s.nom}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Classe *</label>
                  <select
                    className="form-control"
                    value={selectedClasse}
                    onChange={(e) => {
                      setSelectedClasse(e.target.value);
                      setSelectedMatiere("");
                    }}
                    disabled={!selectedSemestre || loading.classes}
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {isLycee && filieres.length > 0 && (
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Filière *</label>
                    <select
                      className="form-control"
                      value={selectedFiliere}
                      onChange={(e) => setSelectedFiliere(e.target.value)}
                      disabled={loading.filieres}
                      required
                    >
                      {filieres.map(f => (
                        <option key={f.id} value={f.id}>{f.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
            <div className="row mb-3">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Matière *</label>
                  <select
                    className="form-control"
                    value={selectedMatiere}
                    onChange={(e) => setSelectedMatiere(e.target.value)}
                    disabled={!selectedClasse || loading.matieres}
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {matieres.map(m => (
                      <option key={m.id} value={m.id}>{m.nom}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <div className="form-group">
                  <label>Type de fichier *</label>
                  <select
                    className="form-control"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    required
                  >
                    {typesFichier.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-group">
                  <label>Fichier *</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFichier(e.target.files[0])}
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    required
                  />
                  <small className="text-muted">Formats acceptés: PDF, DOC, DOCX, PPT, PPTX (max 10MB)</small>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12 d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading.submission}
                >
                  {loading.submission ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Envoi en cours...
                    </>
                  ) : 'Envoyer le fichier'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5>Mes fichiers</h5>
        </div>
        <div className="card-body">
          {loading.fichiers ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : fichiersListe.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Type</th>
                    <th>Matière</th>
                    <th>Date</th>
                    <th>Taille</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fichiersListe.map(f => (
                    <tr key={f.id}>
                      <td>{f.nom_fichier}</td>
                      <td>
                        <span className={`badge bg-${f.type === 'cours' ? 'primary' : f.type === 'devoir' ? 'warning' : 'danger'}`}>
                          {f.type}
                        </span>
                      </td>
                      <td>{f.matiere?.nom || '-'}</td>
                      <td>{new Date(f.created_at).toLocaleDateString()}</td>
                      <td>{(f.taille_fichier / 1024).toFixed(1)} KB</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-success me-2"
                          onClick={() => handleDownload(f.id)}
                        >
                          <i className="bi bi-download me-1"></i>Télécharger
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(f.id)}
                        >
                          <i className="bi bi-trash me-1"></i>Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">Aucun fichier disponible pour les critères sélectionnés</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AjouterFichier;