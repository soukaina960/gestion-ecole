import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const EntreNotes = () => {
  const navigate = useNavigate();
  const [utilisateur, setUtilisateur] = useState(null);
  const [annees, setAnnees] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [etudiants, setEtudiants] = useState([]);

  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [selectedSemestre, setSelectedSemestre] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");

  const [isLycee, setIsLycee] = useState(false);
  const [loading, setLoading] = useState({
    annees: false,
    semestres: false,
    classes: false,
    filieres: false,
    matieres: false,
    etudiants: false,
    submission: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("utilisateur");
      if (userData) {
        setUtilisateur(JSON.parse(userData));
      }
    } catch (err) {
      console.error("Erreur de chargement des données utilisateur", err);
    }
  }, []);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, annees: true }));
    axios.get("http://127.0.0.1:8000/api/annees_scolaires")
      .then((res) => {
        setAnnees(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading((prev) => ({ ...prev, annees: false })));
  }, []);

  useEffect(() => {
    if (selectedAnnee) {
      setLoading((prev) => ({ ...prev, semestres: true }));
      axios.get(`http://127.0.0.1:8000/api/annees/${selectedAnnee}/semestres`)
        .then((res) => {
          setSemestres(res.data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading((prev) => ({ ...prev, semestres: false })));
    }
  }, [selectedAnnee]);

  useEffect(() => {
    if (selectedAnnee && selectedSemestre) {
      setLoading((prev) => ({ ...prev, classes: true }));
      axios.get(`http://127.0.0.1:8000/api/classes?annee=${selectedAnnee}`)
        .then((res) => {
          setClasses(res.data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading((prev) => ({ ...prev, classes: false })));
    }
  }, [selectedSemestre]);

  useEffect(() => {
    if (selectedClasse) {
      const classe = classes.find((c) => c.id === parseInt(selectedClasse));
      const isLycee = classe && classe.niveau === "Secondaire";
      setIsLycee(isLycee);

      if (isLycee) {
        setLoading((prev) => ({ ...prev, filieres: true }));
        axios.get(`http://127.0.0.1:8000/api/classes/${selectedClasse}/filieres`)
          .then((res) => {
            // Handle both array and object response
            const filieresData = res.data.filiere ? [res.data.filiere] : 
                              (res.data.filieres || []);
            setFilieres(filieresData);
            if (filieresData.length > 0) {
              setSelectedFiliere(filieresData[0].id);
            }
          })
          .catch(err => {
            console.error(err);
            setFilieres([]);
          })
          .finally(() => setLoading((prev) => ({ ...prev, filieres: false })));
      } else {
        setFilieres([]);
        setSelectedFiliere("");
      }
    }
  }, [selectedClasse]);

  useEffect(() => {
    if (isLycee && selectedClasse && selectedFiliere && utilisateur?.id) {
      setLoading((prev) => ({ ...prev, matieres: true }));
      axios
        .get(`http://127.0.0.1:8000/api/professeurs/${utilisateur.id}/classes/${selectedClasse}/filieres/${selectedFiliere}/matieres`)
        .then((res) => {
          setMatieres(res.data);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading((prev) => ({ ...prev, matieres: false })));
    }
  }, [selectedFiliere, utilisateur]);

  useEffect(() => {
    if (selectedClasse && selectedAnnee && selectedSemestre && selectedMatiere && utilisateur?.id) {
      fetchEtudiants();
    }
  }, [selectedClasse, selectedAnnee, selectedSemestre, selectedMatiere]);

  const fetchEtudiants = async () => {
    try {
      setLoading((prev) => ({ ...prev, etudiants: true }));
      const res = await axios.get(`http://127.0.0.1:8000/api/evaluations/${selectedClasse}`, {
        params: {
          professeur_id: utilisateur.id,
          annee_scolaire_id: selectedAnnee,
          semestre_id: selectedSemestre,
          matiere_id: selectedMatiere
        }
      });
      setEtudiants(res.data.map(etudiant => ({
        ...etudiant,
        note1: etudiant.note1 || '',
        note2: etudiant.note2 || '',
        note3: etudiant.note3 || '',
        note4: etudiant.note4 || '',
        facteur: etudiant.facteur || 1
      })));
    } catch (err) {
      setError("Erreur lors du chargement des étudiants");
    } finally {
      setLoading((prev) => ({ ...prev, etudiants: false }));
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
    if (!selectedClasse || !selectedAnnee || !selectedSemestre || !selectedMatiere) {
      setError("Veuillez sélectionner toutes les options nécessaires");
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
        annee_scolaire_id: selectedAnnee,
        semestre_id: selectedSemestre,
        matiere_id: selectedMatiere
      };
    });

    try {
      setLoading((prev) => ({ ...prev, submission: true }));
      
      const response = await axios.post('http://127.0.0.1:8000/api/evaluations', {
        classe_id: selectedClasse,
        professeur_id: utilisateur.id,
        semestre_id: selectedSemestre,
        matiere_id: selectedMatiere,
        notes: notes
      });
      
      setSuccess("Notes enregistrées avec succès !");
      setTimeout(() => {
        navigate('/enseignant/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement des notes");
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Saisie des notes</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row mb-4">
        <div className="col-md-3">
          <div className="form-group">
            <label>Année Scolaire</label>
            <select
              className="form-control"
              value={selectedAnnee}
              onChange={(e) => {
                setSelectedAnnee(e.target.value);
                setSelectedSemestre("");
                setSelectedClasse("");
                setSelectedFiliere("");
                setSelectedMatiere("");
                setEtudiants([]);
              }}
              disabled={loading.annees}
            >
              <option value="">-- Choisir une année scolaire --</option>
              {annees.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.annee}
                </option>
              ))}
            </select>
            {loading.annees && <small>Chargement...</small>}
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
                setSelectedClasse("");
                setSelectedFiliere("");
                setSelectedMatiere("");
                setEtudiants([]);
              }}
              disabled={!selectedAnnee || loading.semestres}
            >
              <option value="">-- Choisir un semestre --</option>
              {semestres.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nom}
                </option>
              ))}
            </select>
            {loading.semestres && <small>Chargement...</small>}
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
                setSelectedFiliere("");
                setSelectedMatiere("");
                setEtudiants([]);
              }}
              disabled={!selectedSemestre || loading.classes}
            >
              <option value="">-- Choisir une classe --</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {loading.classes && <small>Chargement...</small>}
          </div>
        </div>
        
        {isLycee && (
          <div className="col-md-3">
            <div className="form-group">
              <label>Filière</label>
              <select
                className="form-control"
                value={selectedFiliere}
                onChange={(e) => setSelectedFiliere(e.target.value)}
                disabled={loading.filieres || filieres.length === 0}
              >
                {loading.filieres ? (
                  <option>Chargement...</option>
                ) : filieres.length > 0 ? (
                  filieres.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nom}
                    </option>
                  ))
                ) : (
                  <option value="">Aucune filière disponible</option>
                )}
              </select>
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
              {matieres.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nom}
                </option>
              ))}
            </select>
            {loading.matieres && <small>Chargement...</small>}
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