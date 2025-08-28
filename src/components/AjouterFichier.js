import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// Constants
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
const FILE_TYPES = ['cours', 'devoir', 'examen', 'corrigé', 'ressource'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation'
];

const AjouterFichier = () => {
  const navigate = useNavigate();
  
  // State management
  const [state, setState] = useState({
    formData: {
      annee: "",
      semestre: "",
      classe: "",
      filiere: "",
      matiere: "",
      typeFichier: FILE_TYPES[0],
      fichier: null
    },
    data: {
      annees: [],
      semestres: [],
      classes: [],
      filieres: [],
      matieres: [],
      fichiers: []
    },
    metadata: {
      utilisateur: null,
      professeurId: null,
      isLycee: false
    },
    status: {
      loading: false,
      error: null,
      success: null,
      currentOperation: null
    }
  });

  // Destructure state for easier access
  const { formData, data, metadata, status } = state;

  // Initialize user and professor data
  useEffect(() => {
    const initializeUser = async () => {
      try {
        const userData = localStorage.getItem("utilisateur");
        if (!userData) {
          navigate('/login');
          return;
        }

        const user = JSON.parse(userData);
        setState(prev => ({
          ...prev,
          metadata: { ...prev.metadata, utilisateur: user }
        }));

        if (user?.role === "professeur") {
          await fetchProfesseurId(user.id);
        } else {
          navigate('/unauthorized');
        }
      } catch (error) {
        handleError(error, "Initializing user data");
      }
    };

    initializeUser();
  }, [navigate]);

  // Fetch professor ID
  const fetchProfesseurId = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/professeurs?user=${userId}`);
      if (response.data && response.data.length > 0) {
        const professeur = response.data.find(p => p.user_id === userId);
        if (professeur) {
          setState(prev => ({
            ...prev,
            metadata: { 
              ...prev.metadata, 
              professeurId: professeur.id 
            }
          }));
          return professeur.id;
        }
      }
      throw new Error("Professeur non trouvé");
    } catch (error) {
      handleError(error, "fetching professor ID");
      return null;
    }
  };

  // Load initial data (years and classes)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoadingStatus(true, "Loading initial data");
        
        const [anneesRes, classesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/annees_scolaires`),
          axios.get(`${API_BASE_URL}/classes`)
        ]);
        
        setState(prev => ({
          ...prev,
          data: {
            ...prev.data,
            annees: anneesRes.data,
            classes: classesRes.data
          }
        }));
        
      } catch (error) {
        handleError(error, "loading initial data");
      } finally {
        setLoadingStatus(false);
      }
    };

    if (metadata.utilisateur?.role === "professeur") {
      fetchInitialData();
    }
  }, [metadata.utilisateur]);

  // Load dependent data (semesters and filtered classes)
  useEffect(() => {
    const fetchDependentData = async () => {
      if (!formData.annee) return;
      
      try {
        setLoadingStatus(true, "Loading dependent data");
        
        const [semestresRes, classesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/annees/${formData.annee}/semestres`),
          axios.get(`${API_BASE_URL}/classes?annee=${formData.annee}`)
        ]);
        
        setState(prev => ({
          ...prev,
          data: {
            ...prev.data,
            semestres: semestresRes.data,
            classes: classesRes.data
          },
          formData: {
            ...prev.formData,
            semestre: "",
            classe: "",
            filiere: "",
            matiere: ""
          }
        }));
        
      } catch (error) {
        handleError(error, "loading dependent data");
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchDependentData();
  }, [formData.annee]);

  // Check if class is lycée and load filières
  useEffect(() => {
    const checkAndLoadFilieres = async () => {
      if (!formData.classe) {
        setState(prev => ({
          ...prev,
          metadata: { ...prev.metadata, isLycee: false },
          data: { ...prev.data, filieres: [] },
          formData: { ...prev.formData, filiere: "", matiere: "" }
        }));
        return;
      }

      try {
        const classe = data.classes.find(c => c.id === parseInt(formData.classe));
        const isLycee = classe?.niveau === "Secondaire";
        
        setState(prev => ({
          ...prev,
          metadata: { ...prev.metadata, isLycee }
        }));

        if (isLycee) {
          setLoadingStatus(true, "Loading filières");
          
          const res = await axios.get(
            `${API_BASE_URL}/classes/${formData.classe}/filieres`
          );
          
          const filieresData = res.data.filiere ? [res.data.filiere] : res.data.filieres || [];
          
          setState(prev => ({
            ...prev,
            data: { ...prev.data, filieres: filieresData },
            formData: {
              ...prev.formData,
              filiere: filieresData.length === 1 ? filieresData[0].id : "",
              matiere: ""
            }
          }));
        }
      } catch (error) {
        handleError(error, "loading filières");
      } finally {
        setLoadingStatus(false);
      }
    };

    checkAndLoadFilieres();
  }, [formData.classe, data.classes]);

  // Load matières
  const fetchMatieres = useCallback(async () => {
    if (!formData.classe || !metadata.professeurId) {
      setState(prev => ({
        ...prev,
        data: { ...prev.data, matieres: [] },
        formData: { ...prev.formData, matiere: "" }
      }));
      return;
    }
    
    try {
      setLoadingStatus(true, "Loading matières");
      
      let url;
      if (metadata.isLycee && formData.filiere) {
        url = `${API_BASE_URL}/professeurs/${metadata.professeurId}/classes/${formData.classe}/filieres/${formData.filiere}/matieres`;
      } else {
        url = `${API_BASE_URL}/professeurs/${metadata.professeurId}/classes/${formData.classe}/matieres`;
      }

      const res = await axios.get(url);
      
      setState(prev => ({
        ...prev,
        data: { ...prev.data, matieres: res.data },
        formData: { ...prev.formData, matiere: "" }
      }));
      
    } catch (error) {
      handleError(error, "loading matières");
    } finally {
      setLoadingStatus(false);
    }
  }, [formData.classe, formData.filiere, metadata.professeurId, metadata.isLycee]);

  useEffect(() => {
    fetchMatieres();
  }, [fetchMatieres]);

  // Load existing files
  const fetchFichiers = useCallback(async () => {
    const { classe, semestre, matiere } = formData;
    
    if (!classe || !semestre || !matiere) {
      setState(prev => ({
        ...prev,
        data: { ...prev.data, fichiers: [] }
      }));
      return;
    }

    try {
      setLoadingStatus(true, "Chargement des fichiers");
      
      const response = await axios.get(`${API_BASE_URL}/fichiers-pedagogiques`, {
        params: {
          classe_id: classe,
          semestre_id: semestre,
          matiere_id: matiere
        }
      });

      // Normalisation des données
      let fichiersData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.data || response.data?.fichiers || [];

      const fichiersNormalises = fichiersData.map(file => ({
        id: file.id,
        nom_fichier: file.nom_fichier || file.name || 'Fichier sans nom',
        type: file.type_fichier || file.type || 'inconnu',
        matiere: file.matiere || { nom: file.matiere_nom || 'Inconnue' },
        created_at: file.created_at || file.date_upload || new Date().toISOString(),
        taille_fichier: file.taille_fichier || file.size || 0
      }));

      setState(prev => ({
        ...prev,
        data: { ...prev.data, fichiers: fichiersNormalises }
      }));
      
    } catch (error) {
      handleError(error, "loading files");
      setState(prev => ({
        ...prev,
        data: { ...prev.data, fichiers: [] }
      }));
    } finally {
      setLoadingStatus(false);
    }
  }, [formData.classe, formData.semestre, formData.matiere]);

  useEffect(() => {
    if (formData.classe && formData.semestre && formData.matiere) {
      fetchFichiers();
    }
  }, [fetchFichiers]);

  // Helper functions
  const setLoadingStatus = (isLoading, currentOperation = null) => {
    setState(prev => ({
      ...prev,
      status: {
        ...prev.status,
        loading: isLoading,
        currentOperation: isLoading ? currentOperation : null
      }
    }));
  };

  const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    setState(prev => ({
      ...prev,
      status: {
        ...prev.status,
        error: error.response?.data?.message || `Erreur lors de ${context}`,
        loading: false
      }
    }));
  };

  // Form handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [name]: value }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation du fichier
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      handleError(new Error("Type de fichier non supporté"), "file validation");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      handleError(new Error("Fichier trop volumineux (>10MB)"), "file validation");
      return;
    }

    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, fichier: file }
    }));
  };

  // Form validation
  const validateForm = () => {
    const { annee, semestre, classe, matiere, fichier } = formData;

    if (!annee || !semestre || !classe || !matiere) {
      return "Tous les champs obligatoires doivent être remplis";
    }

    if (metadata.isLycee && !formData.filiere) {
      return "La filière est obligatoire pour les classes de lycée";
    }

    if (!fichier) {
      return "Veuillez sélectionner un fichier";
    }

    return null;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setState(prev => ({
        ...prev,
        status: { ...prev.status, error: validationError }
      }));
      return;
    }
  
    try {
      setLoadingStatus(true, "Uploading file");
      
      const formDataToSend = new FormData();
      formDataToSend.append('fichier', formData.fichier);
      formDataToSend.append('type_fichier', formData.typeFichier);
      formDataToSend.append('classe_id', formData.classe);
      formDataToSend.append('semestre_id', formData.semestre);
      formDataToSend.append('matiere_id', formData.matiere);
      formDataToSend.append('professeur_id', metadata.professeurId);

      await axios.post(`${API_BASE_URL}/fichiers-pedagogiques`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      setState(prev => ({
        ...prev,
        status: { 
          ...prev.status, 
          success: "Fichier ajouté avec succès!",
          error: null
        },
        formData: {
          ...prev.formData,
          fichier: null
        }
      }));
      
      e.target.reset();
      fetchFichiers();
      
    } catch (error) {
      handleError(error, "uploading file");
    } finally {
      setLoadingStatus(false);
    }
  };

  // File operations
  const handleDownload = async (id) => {
    try {
      setLoadingStatus(true, "Préparation du téléchargement");
      
      const fichier = data.fichiers.find(f => f.id === id);
      if (!fichier) throw new Error('Fichier non trouvé');

      const response = await axios.get(`${API_BASE_URL}/fichiers-pedagogiques/download/${id}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fichier.nom_fichier);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      handleError(error, "téléchargement de fichier");
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Confirmer la suppression ?")) return;
    
    try {
      setLoadingStatus(true, "Deleting file");
      
      await axios.delete(`${API_BASE_URL}/fichiers-pedagogiques/${id}`);
      
      setState(prev => ({
        ...prev,
        status: { 
          ...prev.status, 
          success: "Fichier supprimé avec succès!",
          error: null
        }
      }));
      
      fetchFichiers();
      
    } catch (error) {
      handleError(error, "deleting file");
    } finally {
      setLoadingStatus(false);
    }
  };

  // Clear messages after timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setState(prev => ({
        ...prev,
        status: { ...prev.status, error: null, success: null }
      }));
    }, 5000);
    return () => clearTimeout(timer);
  }, [status.error, status.success]);

  // Render
  if (!metadata.utilisateur) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  if (metadata.utilisateur.role !== "professeur") {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Accès réservé aux professeurs uniquement
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestion des fichiers pédagogiques</h2>
      
      {/* Status messages */}
      {status.error && (
        <div className="alert alert-danger alert-dismissible fade show">
          {status.error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setState(prev => ({
              ...prev,
              status: { ...prev.status, error: null }
            }))}
          />
        </div>
      )}
      
      {status.success && (
        <div className="alert alert-success alert-dismissible fade show">
          {status.success}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setState(prev => ({
              ...prev,
              status: { ...prev.status, success: null }
            }))}
          />
        </div>
      )}

      {/* Add File Form */}
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
                    name="annee"
                    value={formData.annee}
                    onChange={handleChange}
                    disabled={status.loading}
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {data.annees.map(a => (
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
                    name="semestre"
                    value={formData.semestre}
                    onChange={handleChange}
                    disabled={!formData.annee || status.loading}
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {data.semestres.map(s => (
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
                    name="classe"
                    value={formData.classe}
                    onChange={handleChange}
                    disabled={!formData.semestre || status.loading}
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {data.classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {metadata.isLycee && (
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Filière *</label>
                    <select
                      className="form-control"
                      name="filiere"
                      value={formData.filiere}
                      onChange={handleChange}
                      disabled={!formData.classe || status.loading || data.filieres.length === 0}
                      required={metadata.isLycee}
                    >
                      <option value="">-- Choisir --</option>
                      {data.filieres.map(f => (
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
                    name="matiere"
                    value={formData.matiere}
                    onChange={handleChange}
                    disabled={!formData.classe || status.loading}
                    required
                  >
                    <option value="">-- Choisir --</option>
                    {data.matieres.map(m => (
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
                    name="typeFichier"
                    value={formData.typeFichier}
                    onChange={handleChange}
                    disabled={status.loading}
                    required
                  >
                    {FILE_TYPES.map(type => (
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
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    disabled={status.loading}
                    required
                  />
                  <small className="text-muted">Formats acceptés: PDF, DOC, DOCX, PPT, PPTX (max 10MB)</small>
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status.loading}
              >
                {status.loading && status.currentOperation === "Uploading file" ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <i className="bi bi-upload me-2"></i>
                    Envoyer le fichier
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Files List */}
      <div className="card">
        <div className="card-header bg-primary text-white">
          <h5>Mes fichiers</h5>
        </div>
        <div className="card-body">
          {status.loading && status.currentOperation === "Chargement des fichiers" ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : data.fichiers.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Type</th>
                    <th>Matière</th>
                    <th>Date</th>
                 
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.fichiers.map(f => (
                    <tr key={f.id}>
                      <td>{f.nom_fichier}</td>
                      <td>
                        <span className={`badge bg-${
                          f.type === 'cours' ? 'primary' : 
                          f.type === 'devoir' ? 'warning' : 
                          f.type === 'examen' ? 'danger' : 
                          'secondary'
                        }`}>
                          {f.type}
                        </span>
                      </td>
                      <td>{f.matiere?.nom || '-'}</td>
                      <td>{new Date(f.created_at).toLocaleDateString()}</td>
                    
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={() => handleDownload(f.id)}
                            disabled={status.loading}
                          >
                            <i className="bi bi-download me-1"></i>
                            Télécharger
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(f.id)}
                            disabled={status.loading}
                          >
                            <i className="bi bi-trash me-1"></i>
                            Supprimer
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
              {formData.matiere 
                ? "Aucun fichier disponible pour les critères sélectionnés" 
                : "Veuillez sélectionner une matière pour voir les fichiers associés"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

AjouterFichier.propTypes = {
  // Vous pouvez ajouter des PropTypes si ce composant reçoit des props
};

export default AjouterFichier;