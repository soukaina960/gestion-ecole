import axios from "axios";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// Reusable components

// Validation functions
const validateNoteInput = (value) => value === "" || (!isNaN(value) && value >= 0 && value <= 20);
const validateFacteurInput = (value) => value === "" || (!isNaN(value) && value >= 0.1 && value <= 5);

const GradeInput = ({ value, onChange, type = "note", ...props }) => {
  const validate = type === "note" ? validateNoteInput : validateFacteurInput;
  return (
    <input
      type="number"
      className={`form-control ${!validate(value) ? "is-invalid" : ""}`}
      value={value}
      onChange={onChange}
      min={type === "note" ? "0" : "0.1"}
      max={type === "note" ? "20" : "5"}
      step="0.1"
      {...props}
    />
  );
};

const LoadingSpinner = ({ text = "Chargement..." }) => (
  <div className="text-center my-2">
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only">Chargement...</span>
    </div>
    {text && <p className="mt-2">{text}</p>}
  </div>
);

const ErrorDisplay = ({ errors }) => {
  if (!errors || errors.length === 0) return null;
  
  return (
    <div className="alert alert-danger">
      {Array.isArray(errors) ? (
        errors.map((err, i) => <div key={i}>{err}</div>)
      ) : (
        <div>{errors}</div>
      )}
    </div>
  );
};

const SuccessDisplay = ({ message, onDismiss }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onDismiss(), 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  return message ? <div className="alert alert-success">{message}</div> : null;
};

// Main component
const EntreNotes = () => {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

  // State management
  const [utilisateur, setUtilisateur] = useState(null);
  const [professeurId, setProfesseurId] = useState(null);
  
  const [loading, setLoading] = useState({
    annees: false,
    semestres: false,
    classes: false,
    filieres: false,
    matieres: false,
    etudiants: false,
    submission: false
  });
  const [errors, setErrors] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Data state
  const [annees, setAnnees] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [etudiants, setEtudiants] = useState([]);

  // Selection state
  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [selectedSemestre, setSelectedSemestre] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [isLycee, setIsLycee] = useState(false);

  // Helper functions
  const handleError = useCallback((error, context) => {
    console.error(`Error in ${context}:`, error);
    const errorMessage = error.response?.data?.message || `Erreur lors de ${context}`;
    setErrors(prev => [...prev, errorMessage]);
    return null;
  }, []);

  const clearSelections = (level) => {
    if (level <= 1) {
      setSelectedSemestre("");
      setSelectedClasse("");
      setSelectedFiliere("");
      setSelectedMatiere("");
      setEtudiants([]);
    }
    if (level <= 2) {
      setSelectedClasse("");
      setSelectedFiliere("");
      setSelectedMatiere("");
      setEtudiants([]);
    }
    if (level <= 3) {
      setSelectedFiliere("");
      setSelectedMatiere("");
      setEtudiants([]);
    }
    if (level <= 4) {
      setSelectedMatiere("");
      setEtudiants([]);
    }
  };

  // Data fetching functions
  const fetchProfesseurId = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/professeurs?user=${userId}`);
      if (response.data && response.data.length > 0) {
        const professeur = response.data.find(p => p.user_id === userId);
        if (professeur) {
          const profId = professeur.id;
          localStorage.setItem("professeur_id", profId);
          return profId;
        }
      }
      throw new Error("Professeur non trouvé");
    } catch (error) {
      console.error("Erreur fetchProfesseurId:", error);
      setError("Votre compte professeur n'est pas configuré");
      return null;
    }
  };

  const fetchData = async (endpoint, loadingKey, params = {}) => {
    try {
      setLoading(prev => ({ ...prev, [loadingKey]: true }));
      const response = await axios.get(`${API_BASE_URL}/${endpoint}`, { params });
      return response.data;
    } catch (err) {
      handleError(err, `loading ${loadingKey}`);
      return null;
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  // Effects for data loading
  useEffect(() => {
    const loadUserData = async () => {
      const userData = localStorage.getItem("utilisateur");
      if (userData) {
        const user = JSON.parse(userData);
        setUtilisateur(user);
        
        if (user?.role === "professeur") {
          const storedProfesseurId = localStorage.getItem("professeur_id");
          if (storedProfesseurId) {
            setProfesseurId(parseInt(storedProfesseurId));
          } else {
            const profId = await fetchProfesseurId(user.id);
            if (profId) setProfesseurId(profId);
          }
        }
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (professeurId) {
      fetchData("annees_scolaires", "annees").then(data => data && setAnnees(data));
    }
  }, [professeurId]);

  useEffect(() => {
    if (selectedAnnee) {
      fetchData(`annees/${selectedAnnee}/semestres`, "semestres").then(data => data && setSemestres(data));
    } else {
      setSemestres([]);
    }
  }, [selectedAnnee]);

  useEffect(() => {
    if (selectedAnnee && selectedSemestre) {
      fetchData("classes", "classes", { annee: selectedAnnee }).then(data => data && setClasses(data));
    } else {
      setClasses([]);
    }
  }, [selectedAnnee, selectedSemestre]);

  useEffect(() => {
    const checkLyceeAndFetchFilieres = async () => {
      if (!selectedClasse) {
        setIsLycee(false);
        setFilieres([]);
        return;
      }
      
      const classe = classes.find(c => c.id === parseInt(selectedClasse));
      const isLyceeClass = classe?.niveau === "Secondaire";
      setIsLycee(isLyceeClass);

      if (isLyceeClass) {
        const data = await fetchData(`classes/${selectedClasse}/filieres`, "filieres");
        if (data) {
          const filieresData = data.filiere ? [data.filiere] : data.filieres || [];
          setFilieres(filieresData);
          if (filieresData.length > 0) setSelectedFiliere(filieresData[0].id);
        }
      } else {
        setFilieres([]);
        setSelectedFiliere("");
      }
    };

    checkLyceeAndFetchFilieres();
  }, [selectedClasse, classes]);

  useEffect(() => {
    const fetchMatieres = async () => {
      if (!selectedClasse || !professeurId) {
        setMatieres([]);
        setSelectedMatiere("");
        return;
      }
      
      try {
        setLoading(prev => ({ ...prev, matieres: true }));
        
        const endpoint = isLycee
          ? `professeurs/${professeurId}/classes/${selectedClasse}/filieres/${selectedFiliere}/matieres`
          : `professeurs/${professeurId}/classes/${selectedClasse}/matieres`;
        
        const data = await fetchData(endpoint, "matieres");
        
        if (data && data.length > 0) {
          setMatieres(data);
          // Si une seule matière est disponible, la sélectionner automatiquement
          if (data.length === 1) {
            setSelectedMatiere(data[0].id.toString());
          }
        } else {
          setMatieres([]);
          setSelectedMatiere("");
          setError("Aucune matière disponible pour cette classe");
        }
      } catch (error) {
        setMatieres([]);
        setSelectedMatiere("");
        handleError(error, "loading matieres");
      } finally {
        setLoading(prev => ({ ...prev, matieres: false }));
      }
    };

    fetchMatieres();
  }, [selectedClasse, selectedFiliere, professeurId, isLycee]);

  useEffect(() => {
    const fetchEtudiants = async () => {
      if (!selectedClasse || !selectedAnnee || !selectedSemestre || !selectedMatiere || !professeurId) {
        setEtudiants([]);
        return;
      }
      
      const data = await fetchData(`evaluations/${selectedClasse}`, "etudiants", {
        professeur_id: professeurId,
        annee_scolaire_id: selectedAnnee,
        semestre_id: selectedSemestre,
        matiere_id: selectedMatiere
      });
      
      if (data) {
        setEtudiants(
          data.map(etudiant => ({
            ...etudiant,
            note1: etudiant.note1 || "",
            note2: etudiant.note2 || "",
            note3: etudiant.note3 || "",
            note4: etudiant.note4 || "",
            facteur: etudiant.facteur || 1
          }))
        );
      }
    };

    fetchEtudiants();
  }, [selectedClasse, selectedAnnee, selectedSemestre, selectedMatiere, professeurId]);

  // Handlers
  const handleNoteChange = (e, noteType, etudiantId) => {
    const value = e.target.value;
    if (!validateNoteInput(value)) return;
    
    setEtudiants(prev =>
      prev.map(etudiant =>
        etudiant.id === etudiantId ? { ...etudiant, [noteType]: value } : etudiant
      )
    );
  };

  const handleFacteurChange = (e, etudiantId) => {
    const value = e.target.value;
    if (!validateFacteurInput(value)) return;
    
    setEtudiants(prev =>
      prev.map(etudiant =>
        etudiant.id === etudiantId ? { ...etudiant, facteur: value || 1 } : etudiant
      )
    );
  };

  // Calculations
  const calculerPointFinal = useCallback((etudiant) => {
    const notes = [etudiant.note1, etudiant.note2, etudiant.note3, etudiant.note4]
      .filter(n => n !== "" && !isNaN(n))
      .map(n => parseFloat(n));
      
    if (notes.length === 0) return "";
    
    const moyenne = notes.reduce((acc, curr) => acc + curr, 0) / notes.length;
    const pointFinal = moyenne * (parseFloat(etudiant.facteur) || 1);
    return Math.min(pointFinal, 20).toFixed(2);
  }, []);

  const calculatedStudents = useMemo(() => (
    etudiants.map(etudiant => ({
      ...etudiant,
      noteFinale: calculerPointFinal(etudiant)
    }))
  ), [etudiants, calculerPointFinal]);

  // Form validation and submission
  const validateForm = () => {
    const newErrors = [];
    
    if (!selectedAnnee) newErrors.push("Veuillez sélectionner une année scolaire");
    if (!selectedSemestre) newErrors.push("Veuillez sélectionner un semestre");
    if (!selectedClasse) newErrors.push("Veuillez sélectionner une classe");
    if (isLycee && !selectedFiliere) newErrors.push("Veuillez sélectionner une filière");
    
    // Vérification plus stricte de la matière
    if (!selectedMatiere || !matieres.some(m => m.id.toString() === selectedMatiere)) {
      newErrors.push("Veuillez sélectionner une matière valide");
    }
    
    if (etudiants.length === 0) newErrors.push("Aucun étudiant trouvé pour cette classe");
    
    etudiants.forEach(etudiant => {
      if (!validateNoteInput(etudiant.note1)) newErrors.push(`Note 1 invalide pour ${etudiant.nom}`);
      if (!validateNoteInput(etudiant.note2)) newErrors.push(`Note 2 invalide pour ${etudiant.nom}`);
      if (!validateNoteInput(etudiant.note3)) newErrors.push(`Note 3 invalide pour ${etudiant.nom}`);
      if (!validateNoteInput(etudiant.note4)) newErrors.push(`Note 4 invalide pour ${etudiant.nom}`);
      if (!validateFacteurInput(etudiant.facteur)) newErrors.push(`Facteur invalide pour ${etudiant.nom}`);
    });
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    // Vérification supplémentaire de matiere_id
    const matiereId = parseInt(selectedMatiere);
    if (isNaN(matiereId)) {
      setError("ID de matière invalide");
      return;
    }

    const notes = calculatedStudents.map(e => {
      const noteFinale = parseFloat(e.noteFinale) || 0;
      let remarque = "";
      
      if (noteFinale >= 16) remarque = "Très bien";
      else if (noteFinale >= 12) remarque = "Bien";
      else if (noteFinale >= 10) remarque = "Assez bien";
      else remarque = "Insuffisant";

      return {
        etudiant_id: e.id,
        note1: e.note1 === "" ? null : parseFloat(e.note1),
        note2: e.note2 === "" ? null : parseFloat(e.note2),
        note3: e.note3 === "" ? null : parseFloat(e.note3),
        note4: e.note4 === "" ? null : parseFloat(e.note4),
        facteur: parseFloat(e.facteur) || 1,
        remarque,
        note_finale: noteFinale,
        annee_scolaire_id: parseInt(selectedAnnee),
        semestre_id: parseInt(selectedSemestre),
        matiere_id: matiereId,
      };
    });

    const payload = {
      classe_id: parseInt(selectedClasse),
      professeur_id: parseInt(professeurId),
      semestre_id: parseInt(selectedSemestre),
      matiere_id: matiereId,
      annee_scolaire_id: parseInt(selectedAnnee),
      notes,
    };

    try {
      setLoading(prev => ({ ...prev, submission: true }));
      
      const response = await axios.post(`${API_BASE_URL}/evaluations`, payload);
      
      if (response.data && response.data.success) {
        setSuccess("Notes enregistrées avec succès !");
        setTimeout(() => navigate("/enseignant/dashboard"), 2000);
      } else {
        setError(response.data?.message || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      handleError(err, "saving grades");
      
      // Log supplémentaire pour débogage
      console.error("Détails de l'erreur:", {
        payload,
        error: err.response?.data
      });
    } finally {
      setLoading(prev => ({ ...prev, submission: false }));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Saisie des notes</h2>

      
      <SuccessDisplay message={success} onDismiss={() => setSuccess(null)} />

      {/* Selection dropdowns */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="form-group">
            <label>Année Scolaire</label>
            <select
              className="form-control"
              value={selectedAnnee}
              onChange={(e) => {
                setSelectedAnnee(e.target.value);
                clearSelections(1);
              }}
              disabled={loading.annees}
            >
              <option value="">-- Choisir une année --</option>
              {annees.map(a => (
                <option key={a.id} value={a.id}>{a.annee}</option>
              ))}
            </select>
            {loading.annees && <LoadingSpinner text="" />}
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label>Semestre</label>
            <select
              className="form-control"
              value={selectedSemestre}
              onChange={(e) => {
                setSelectedSemestre(e.target.value);
                clearSelections(2);
              }}
              disabled={!selectedAnnee || loading.semestres}
            >
              <option value="">-- Choisir un semestre --</option>
              {semestres.map(s => (
                <option key={s.id} value={s.id}>{s.nom}</option>
              ))}
            </select>
            {loading.semestres && <LoadingSpinner text="" />}
          </div>
        </div>

        <div className="col-md-3">
          <div className="form-group">
            <label>Classe</label>
            <select
              className="form-control"
              value={selectedClasse}
              onChange={(e) => {
                setSelectedClasse(e.target.value);
                clearSelections(3);
              }}
              disabled={!selectedSemestre || loading.classes}
            >
              <option value="">-- Choisir une classe --</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {loading.classes && <LoadingSpinner text="" />}
          </div>
        </div>

        {isLycee && (
          <div className="col-md-3">
            <div className="form-group">
              <label>Filière</label>
              <select
                className="form-control"
                value={selectedFiliere}
                onChange={(e) => {
                  setSelectedFiliere(e.target.value);
                  clearSelections(4);
                }}
                disabled={loading.filieres || filieres.length === 0}
              >
                {filieres.length > 0 ? (
                  filieres.map(f => (
                    <option key={f.id} value={f.id}>{f.nom}</option>
                  ))
                ) : (
                  <option value="">Aucune filière disponible</option>
                )}
              </select>
              {loading.filieres && <LoadingSpinner text="" />}
            </div>
          </div>
        )}
      </div>

      <div className="row mb-4">
        <div className="col-md-6">
          <div className="form-group">
            <label>Matière</label>
            <select
              className="form-control"
              value={selectedMatiere}
              onChange={(e) => {
                setSelectedMatiere(e.target.value);
                setEtudiants([]);
              }}
              disabled={
                (!isLycee && !selectedClasse) || 
                (isLycee && !selectedFiliere) || 
                loading.matieres
              }
            >
              <option value="">-- Choisir une matière --</option>
              {matieres.map(m => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>
            {loading.matieres && <LoadingSpinner text="" />}
          </div>
        </div>
      </div>

      {/* Students and grades table */}
      {loading.etudiants ? (
        <LoadingSpinner text="Chargement des étudiants..." />
      ) : calculatedStudents.length > 0 ? (
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
              ) : (
                "Enregistrer les notes"
              )}
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
                {calculatedStudents.map(etudiant => (
                  <tr key={etudiant.id}>
                    <td>{etudiant.nom}</td>
                    <td>
                      <GradeInput
                        value={etudiant.note1}
                        onChange={(e) => handleNoteChange(e, "note1", etudiant.id)}
                      />
                    </td>
                    <td>
                      <GradeInput
                        value={etudiant.note2}
                        onChange={(e) => handleNoteChange(e, "note2", etudiant.id)}
                      />
                    </td>
                    <td>
                      <GradeInput
                        value={etudiant.note3}
                        onChange={(e) => handleNoteChange(e, "note3", etudiant.id)}
                      />
                    </td>
                    <td>
                      <GradeInput
                        value={etudiant.note4}
                        onChange={(e) => handleNoteChange(e, "note4", etudiant.id)}
                      />
                    </td>
                    <td>
                      <GradeInput
                        type="facteur"
                        value={etudiant.facteur}
                        onChange={(e) => handleFacteurChange(e, etudiant.id)}
                      />
                    </td>
                    <td className="font-weight-bold">{etudiant.noteFinale}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading.etudiants && (
          <div className="alert alert-info">
            {selectedMatiere ? "Aucun étudiant trouvé pour cette sélection" : "Veuillez sélectionner une matière"}
          </div>
        )
      )}
    </div>
  );
};

export default EntreNotes;