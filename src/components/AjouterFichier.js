import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  // Charger l'utilisateur connecté
  useEffect(() => {
    const userData = localStorage.getItem("utilisateur");
    if (userData) {
      setUtilisateur(JSON.parse(userData));
    }
  }, []);

  // Charger les années scolaires
  useEffect(() => {
    setLoading((prev) => ({ ...prev, annees: true }));
    axios
      .get("http://127.0.0.1:8000/api/annees_scolaires")
      .then((res) => setAnnees(res.data))
      .catch((err) => console.error("Erreur chargement années:", err))
      .finally(() => setLoading((prev) => ({ ...prev, annees: false })));
  }, []);

  // Charger les semestres quand une année est sélectionnée
  useEffect(() => {
    if (selectedAnnee) {
      setLoading((prev) => ({ ...prev, semestres: true }));
      axios
        .get(`http://127.0.0.1:8000/api/annees/${selectedAnnee}/semestres`)
        .then((res) => setSemestres(res.data))
        .catch((err) => console.error("Erreur chargement semestres:", err))
        .finally(() => setLoading((prev) => ({ ...prev, semestres: false })));
    } else {
      setSemestres([]);
      setSelectedSemestre("");
    }
  }, [selectedAnnee]);

  // Charger les classes quand un semestre est sélectionné
  useEffect(() => {
    if (selectedAnnee && selectedSemestre) {
      setLoading((prev) => ({ ...prev, classes: true }));
      axios
        .get(`http://127.0.0.1:8000/api/classes?annee=${selectedAnnee}`)
        .then((res) => setClasses(res.data))
        .catch((err) => console.error("Erreur chargement classes:", err))
        .finally(() => setLoading((prev) => ({ ...prev, classes: false })));
    } else {
      setClasses([]);
      setSelectedClasse("");
    }
  }, [selectedAnnee, selectedSemestre]);

  // Vérifier si c'est une classe de lycée et charger les filières
  useEffect(() => {
    if (selectedClasse) {
      const classe = classes.find((c) => c.id === parseInt(selectedClasse));
      const lycee = classe && classe.niveau === "Secondaire";
      setIsLycee(lycee);

      if (lycee) {
        setLoading((prev) => ({ ...prev, filieres: true }));
        axios
          .get(`http://127.0.0.1:8000/api/classes/${selectedClasse}/filieres`)
          .then((res) => {
            const filieresData = res.data.filiere ? [res.data.filiere] : res.data.filieres || [];
            setFilieres(filieresData);
            if (filieresData.length > 0) setSelectedFiliere(filieresData[0].id);
          })
          .catch((err) => {
            console.error("Erreur chargement filières:", err);
            setFilieres([]);
          })
          .finally(() => setLoading((prev) => ({ ...prev, filieres: false })));
      } else {
        setFilieres([]);
        setSelectedFiliere("");
      }
    }
  }, [selectedClasse, classes]);

  // Charger les matières
  useEffect(() => {
    if (selectedClasse && utilisateur?.id) {
      setLoading((prev) => ({ ...prev, matieres: true }));
      
      let url;
      if (isLycee && selectedFiliere) {
        url = `http://127.0.0.1:8000/api/professeurs/${utilisateur.id}/classes/${selectedClasse}/filieres/${selectedFiliere}/matieres`;
      } else {
        url = `http://127.0.0.1:8000/api/professeurs/${utilisateur.id}/classes/${selectedClasse}/matieres`;
      }

      axios
        .get(url)
        .then((res) => setMatieres(res.data))
        .catch((err) => console.error("Erreur chargement matières:", err))
        .finally(() => setLoading((prev) => ({ ...prev, matieres: false })));
    } else {
      setMatieres([]);
      setSelectedMatiere("");
    }
  }, [selectedClasse, selectedFiliere, isLycee, utilisateur]);

  // Charger les fichiers existants
  const fetchFichiers = useCallback(async () => {
    if (!utilisateur?.id || !selectedAnnee || !selectedSemestre || !selectedClasse || !selectedMatiere) return;
    
    try {
      setLoading(prev => ({...prev, fichiers: true}));
      const res = await axios.get(`http://127.0.0.1:8000/api/fichiers-pedagogiques`, {
        params: {
          professeur_id: utilisateur.id,
          annee_scolaire_id: selectedAnnee,
          semestre_id: selectedSemestre,
          classroom_id: selectedClasse,
          matiere_id: selectedMatiere
        }
      });
      setFichiersListe(res.data.data || res.data);
    } catch (err) {
      setError("Erreur de chargement des fichiers");
    } finally {
      setLoading(prev => ({...prev, fichiers: false}));
    }
  }, [utilisateur, selectedAnnee, selectedSemestre, selectedClasse, selectedMatiere]);

  useEffect(() => {
    fetchFichiers();
  }, [fetchFichiers]);

  // Validation du fichier
  const validateFile = (file) => {
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
                       'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setError("Type de fichier non supporté. Formats acceptés: PDF, DOC, DOCX, PPT, PPTX");
      return false;
    }

    if (file.size > maxSize) {
      setError("La taille du fichier ne doit pas dépasser 10MB");
      return false;
    }

    return true;
  };

  // Soumission du fichier
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fichier || !selectedClasse || !selectedSemestre || !selectedMatiere) {
      setError("Veuillez sélectionner tous les champs obligatoires et un fichier");
      return;
    }

    if (!validateFile(fichier)) {
      return;
    }

    const formData = new FormData();
    formData.append('fichier', fichier);
    formData.append('type_fichier', selectedType);
    formData.append('professeur_id', utilisateur.id);
    formData.append('classroom_id', selectedClasse);
    formData.append('semestre_id', selectedSemestre);
    formData.append('annee_scolaire_id', selectedAnnee);
    formData.append('matiere_id', selectedMatiere);

    try {
      setLoading(prev => ({...prev, submission: true}));
      await axios.post('http://127.0.0.1:8000/api/fichiers-pedagogiques', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess('Fichier envoyé avec succès');
      setFichier(null);
      fetchFichiers();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi du fichier");
    } finally {
      setLoading(prev => ({...prev, submission: false}));
    }
  };

  // Télécharger un fichier
  const handleDownload = (id) => {
    window.open(`http://127.0.0.1:8000/api/fichiers-pedagogiques/${id}/download`, '_blank');
  };

  // Supprimer un fichier
  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    
    try {
      await axios.delete(`http://127.0.0.1:8000/api/fichiers-pedagogiques/${id}`);
      setSuccess('Fichier supprimé avec succès');
      fetchFichiers();
    } catch (err) {
      setError("Erreur lors de la suppression");
    }
  };

  // Effacer les messages après 5 secondes
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
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
                        <span className={`badge bg-${f.type_fichier === 'cours' ? 'primary' : f.type_fichier === 'devoir' ? 'warning' : 'danger'}`}>
                          {f.type_fichier}
                        </span>
                      </td>
                      <td>{f.matiere?.nom || '-'}</td>
                      <td>{new Date(f.created_at).toLocaleDateString()}</td>
                      <td>{(f.taille / 1024).toFixed(1)} KB</td>
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