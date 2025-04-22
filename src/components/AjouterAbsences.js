import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AjouterAbsences = () => {
  const navigate = useNavigate();
  const [utilisateur, setUtilisateur] = useState(null);
  const [annees, setAnnees] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [absences, setAbsences] = useState([]);

  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [selectedSemestre, setSelectedSemestre] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMotif, setSelectedMotif] = useState("");
  
  const [isLycee, setIsLycee] = useState(false);
  const [loading, setLoading] = useState({
    annees: false,
    semestres: false,
    classes: false,
    filieres: false,
    etudiants: false,
    absences: false,
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
    if (selectedClasse && selectedAnnee && selectedSemestre && utilisateur?.id) {
      fetchEtudiants();
      fetchAbsences();
    }
  }, [selectedClasse, selectedAnnee, selectedSemestre]);

  const fetchEtudiants = async () => {
    try {
      setLoading((prev) => ({ ...prev, etudiants: true }));
      const res = await axios.get(`http://127.0.0.1:8000/api/classes/${selectedClasse}/etudiants`, {
        params: {
          annee_scolaire_id: selectedAnnee,
          semestre_id: selectedSemestre
        }
      });
      setEtudiants(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des étudiants");
    } finally {
      setLoading((prev) => ({ ...prev, etudiants: false }));
    }
  };

  const fetchAbsences = async () => {
    try {
      setLoading((prev) => ({ ...prev, absences: true }));
      const res = await axios.get(`http://127.0.0.1:8000/api/absences`, {
        params: {
          classe_id: selectedClasse,
          annee_scolaire_id: selectedAnnee,
          semestre_id: selectedSemestre,
          professeur_id: utilisateur.id
        }
      });
      setAbsences(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des absences");
    } finally {
      setLoading((prev) => ({ ...prev, absences: false }));
    }
  };

  const handleSubmitAbsence = async (etudiantId, present) => {
    if (!selectedDate) {
      setError("Veuillez sélectionner une date");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, submission: true }));
      
      await axios.post('http://127.0.0.1:8000/api/absences', {
        etudiant_id: etudiantId,
        date: selectedDate,
        motif: present ? null : selectedMotif,
        justifiee: false,
        professeur_id: utilisateur.id,
        classe_id: selectedClasse,
        annee_scolaire_id: selectedAnnee,
        semestre_id: selectedSemestre
      });
      
      setSuccess(`Absence ${present ? "annulée" : "enregistrée"} avec succès !`);
      fetchAbsences();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  const handleJustifyAbsence = async (absenceId, justifiee) => {
    try {
      setLoading((prev) => ({ ...prev, submission: true }));
      
      await axios.put(`http://127.0.0.1:8000/api/absences/${absenceId}`, {
        justifiee: justifiee
      });
      
      setSuccess(`Absence ${justifiee ? "justifiée" : "déjustifiée"} avec succès !`);
      fetchAbsences();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  const isAbsent = (etudiantId, date) => {
    return absences.some(a => 
      a.etudiant_id === etudiantId && 
      a.date === date && 
      !a.justifiee
    );
  };

  const isJustified = (etudiantId, date) => {
    return absences.some(a => 
      a.etudiant_id === etudiantId && 
      a.date === date && 
      a.justifiee
    );
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestion des Absences</h2>
      
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
                setEtudiants([]);
                setAbsences([]);
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
                setEtudiants([]);
                setAbsences([]);
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
                setEtudiants([]);
                setAbsences([]);
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
            <div className="row mb-3">
              <div className="col-md-3">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="col-md-5">
                <div className="form-group">
                  <label>Motif (si absent)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedMotif}
                    onChange={(e) => setSelectedMotif(e.target.value)}
                    placeholder="Raison de l'absence"
                    disabled={!selectedDate}
                  />
                </div>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>Nom</th>
                    <th>Présence</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {etudiants.map(etudiant => (
                    <tr key={etudiant.id}>
                      <td>{etudiant.nom} {etudiant.prenom}</td>
                      <td>
                        {selectedDate && (
                          <>
                            {isAbsent(etudiant.id, selectedDate) ? (
                              <span className="badge bg-danger">Absent</span>
                            ) : isJustified(etudiant.id, selectedDate) ? (
                              <span className="badge bg-warning">Justifié</span>
                            ) : (
                              <span className="badge bg-success">Présent</span>
                            )}
                          </>
                        )}
                      </td>
                      <td>
                        {selectedDate && (
                          <div className="btn-group">
                            {isAbsent(etudiant.id, selectedDate) || isJustified(etudiant.id, selectedDate) ? (
                              <>
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleSubmitAbsence(etudiant.id, true)}
                                  disabled={loading.submission}
                                >
                                  Marquer présent
                                </button>
                                {isAbsent(etudiant.id, selectedDate) && (
                                  <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => handleJustifyAbsence(
                                      absences.find(a => 
                                        a.etudiant_id === etudiant.id && 
                                        a.date === selectedDate
                                      ).id, 
                                      true
                                    )}
                                    disabled={loading.submission}
                                  >
                                    Justifier
                                  </button>
                                )}
                              </>
                            ) : (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleSubmitAbsence(etudiant.id, false)}
                                disabled={loading.submission || !selectedMotif}
                              >
                                Marquer absent
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <h5>Historique des absences</h5>
              {loading.absences ? (
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </div>
              ) : absences.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Étudiant</th>
                        <th>Statut</th>
                        <th>Motif</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {absences.map(absence => (
                        <tr key={absence.id}>
                          <td>{absence.date}</td>
                          <td>
                            {etudiants.find(e => e.id === absence.etudiant_id)?.nom || 'Inconnu'}
                          </td>
                          <td>
                            {absence.justifiee ? (
                              <span className="badge bg-warning">Justifié</span>
                            ) : (
                              <span className="badge bg-danger">Non justifié</span>
                            )}
                          </td>
                          <td>{absence.motif || '-'}</td>
                          <td>
                            {absence.justifiee ? (
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleJustifyAbsence(absence.id, false)}
                                disabled={loading.submission}
                              >
                                Déjustifier
                              </button>
                            ) : (
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleJustifyAbsence(absence.id, true)}
                                disabled={loading.submission}
                              >
                                Justifier
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">
                  Aucune absence enregistrée pour cette classe
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AjouterAbsences;