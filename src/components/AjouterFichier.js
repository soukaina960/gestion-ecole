import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AjouterFichier = () => {
  const navigate = useNavigate();
  const [utilisateur, setUtilisateur] = useState(null);
  const [annees, setAnnees] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [typesFichier] = useState(['cours', 'devoir', 'examen']);

  const [selectedAnnee, setSelectedAnnee] = useState("");
  const [selectedSemestre, setSelectedSemestre] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedType, setSelectedType] = useState("cours");
  const [fichier, setFichier] = useState(null);
  const [fichiersListe, setFichiersListe] = useState([]);

  const [isLycee, setIsLycee] = useState(false);
  const [loading, setLoading] = useState({
    annees: false,
    semestres: false,
    classes: false,
    filieres: false,
    fichiers: false,
    submission: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    try {
      const userData = localStorage.getItem("utilisateur");
      if (userData) {
        const user = JSON.parse(userData);
        setUtilisateur(user);
        fetchFichiersProfesseur(user.id);
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
    } else {
      setSemestres([]);
      setSelectedSemestre("");
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
    } else {
      setClasses([]);
      setSelectedClasse("");
    }
  }, [selectedAnnee, selectedSemestre]);

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

  const fetchFichiersProfesseur = async (profId) => {
    try {
      setLoading((prev) => ({ ...prev, fichiers: true }));
      const res = await axios.get(`http://127.0.0.1:8000/api/fichiers`, {
        params: { professeur_id: profId }
      });
      setFichiersListe(res.data.data || res.data || []);
    } catch (err) {
      setError("Erreur de chargement des fichiers");
    } finally {
      setLoading((prev) => ({ ...prev, fichiers: false }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!fichier || !selectedClasse || !selectedSemestre || !utilisateur?.id) {
      setError("Veuillez sélectionner tous les champs obligatoires et un fichier");
      return;
    }

    const formData = new FormData();
    formData.append("classe_id", selectedClasse);
    formData.append("semestre_id", selectedSemestre);
    formData.append("type", selectedType);
    formData.append("fichier", fichier);
    formData.append("professeur_id", utilisateur.id);
    if (isLycee && selectedFiliere) {
      formData.append("filiere_id", selectedFiliere);
    }

    try {
      setLoading((prev) => ({ ...prev, submission: true }));
      await axios.post("http://127.0.0.1:8000/api/fichiers", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setSuccess("Fichier envoyé avec succès !");
      setError(null);
      setFichier(null);
      fetchFichiersProfesseur(utilisateur.id);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Échec de l'envoi du fichier");
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/fichiers/${id}`);
        setSuccess("Fichier supprimé avec succès");
        fetchFichiersProfesseur(utilisateur.id);
      } catch (err) {
        setError("Erreur lors de la suppression");
      }
    }
  };

  const handleDownload = (id) => {
    window.open(`http://127.0.0.1:8000/api/fichiers/download/${id}`, '_blank');
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestion des Fichiers Pédagogiques</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h5>Ajouter un nouveau fichier</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpload}>
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
                    }}
                    disabled={loading.annees}
                  >
                    <option value="">-- Choisir une année --</option>
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
              <div className="col-md-4">
                <div className="form-group">
                  <label>Type de Fichier</label>
                  <select
                    className="form-control"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {typesFichier.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="col-md-5">
                <div className="form-group">
                  <label>Fichier</label>
                  <input 
                    type="file" 
                    className="form-control" 
                    onChange={(e) => setFichier(e.target.files[0])} 
                    required
                  />
                </div>
              </div>
              
              <div className="col-md-3 d-flex align-items-end">
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading.submission}
                >
                  {loading.submission ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2" role="status"></span>
                      Envoi...
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
          <h5>Mes fichiers envoyés</h5>
        </div>
        <div className="card-body">
          {loading.fichiers ? (
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
                    <th>Filière</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {fichiersListe.map((f) => (
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
                      <td>{f.filiere?.nom || '-'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(f.id)}
                            disabled={loading.submission}
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
    </div>
  );
};

export default AjouterFichier;