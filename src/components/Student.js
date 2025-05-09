import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import "bootstrap/dist/css/bootstrap.min.css";

export default function EtudiantList() {
  const [paiements, setPaiements] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [userId, setUserId] = useState(""); 
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [matricule, setMatricule] = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [sexe, setSexe] = useState("M");
  const [adresse, setAdresse] = useState("");
  const [photoProfil, setPhotoProfil] = useState(null);
  const [classId, setClassId] = useState("");
  const [montantAPayer, setMontantAPayer] = useState("");
  const [classes, setClasses] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [selectedProfesseurs, setSelectedProfesseurs] = useState([]);
  const [editing, setEditing] = useState(null);
  const [prenom, setPrenom] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClass, setFilterClass] = useState("");

  const handlePaiement = async (etudiantId) => {
    const moisActuel = dayjs().format("MM");
    const payload = {
      etudiant_id: etudiantId,
      mois: moisActuel,
      est_paye: true,
      date_paiement: new Date().toISOString().split('T')[0]
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/paiements-mensuels", payload);
      const paiementResponse = await axios.get("http://127.0.0.1:8000/api/paiements-mensuels");
      setPaiements(paiementResponse.data);
      alert("Paiement enregistré !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement :", error);
      alert(`Échec de l'enregistrement: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCancelPaiement = async (etudiantId) => {
    const moisActuel = dayjs().format("MM");
    const paiement = paiements.find(p => 
      p.etudiant_id === etudiantId && p.mois?.startsWith(moisActuel)
    );

    if (paiement) {
      await axios.delete(`http://127.0.0.1:8000/api/paiements-mensuels/${paiement.id}`);
      const paiementResponse = await axios.get("http://127.0.0.1:8000/api/paiements-mensuels");
      setPaiements(paiementResponse.data);
      alert("Paiement annulé avec succès !");
    } else {
      alert("Aucun paiement trouvé pour ce mois.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [etudiantRes, classRes, profRes, paiementRes, userRes] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/etudiants?include=professeurs'),
          axios.get('http://127.0.0.1:8000/api/classrooms'),
          axios.get('http://127.0.0.1:8000/api/professeurs'),
          axios.get("http://127.0.0.1:8000/api/paiements-mensuels"),
          axios.get('http://127.0.0.1:8000/api/utilisateurs')
        ]);
        
        setEtudiants(etudiantRes.data);
        setClasses(classRes.data);
        setProfesseurs(profRes.data);
        setPaiements(paiementRes.data);
        setUtilisateurs(userRes.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    
    fetchData();
  }, []);

  const handleFileChange = (e) => {
    setPhotoProfil(e.target.files[0]);
  };

  const handleAddEtudiant = async () => {
    try {
      const formData = new FormData();
      formData.append('nom', nom);
      formData.append('email', email);
      formData.append('matricule', matricule);
      formData.append('date_naissance', dateNaissance);
      formData.append('sexe', sexe);
      formData.append('adresse', adresse);
      formData.append('classe_id', classId);
       formData.append('montant_a_payer', montantAPayer);
      formData.append('user_id', userId);
      formData.append('prenom', prenom);

      selectedProfesseurs.forEach(profId => {
        formData.append('professeurs[]', profId);
      });

      if (photoProfil) {
        formData.append('photo_profil', photoProfil);
      }

      await axios.post("http://127.0.0.1:8000/api/etudiants", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const etudiantResponse = await axios.get('http://127.0.0.1:8000/api/etudiants?include=professeurs,classroom');      setEtudiants(etudiantResponse.data);
      resetForm();
      setShowForm(false);
      alert("Étudiant ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'étudiant", error);
    }
  };

  const handleDeleteEtudiant = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/etudiants/${id}`);
        const response = await axios.get('http://127.0.0.1:8000/api/etudiants?include=professeurs');
        setEtudiants(response.data);
      } catch (error) {
        console.error("Erreur lors de la suppression de l'étudiant", error);
      }
    }
  };

  const handleEditEtudiant = (etudiant) => {
    setNom(etudiant.nom);
    setPrenom(etudiant.prenom || "");
    setEmail(etudiant.email);
    setMatricule(etudiant.matricule);
    setDateNaissance(etudiant.date_naissance);
    setSexe(etudiant.sexe);
    setAdresse(etudiant.adresse);
    setClassId(etudiant.class_id);
    setMontantAPayer(etudiant.montant_a_payer);
    setSelectedProfesseurs(etudiant.professeurs ? etudiant.professeurs.map(prof => prof.id) : []);
    setEditing(etudiant.id);
    setShowForm(true);
  };

  const handleUpdateEtudiant = async () => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('nom', nom);
      formData.append('email', email);
      formData.append('matricule', matricule);
      formData.append('date_naissance', dateNaissance);
      formData.append('sexe', sexe);
      formData.append('adresse', adresse);
      formData.append('prenom', prenom); 
      formData.append('classe_id', classId);
      formData.append('montant_a_payer', montantAPayer);
      
      selectedProfesseurs.forEach(profId => {
        formData.append('professeurs[]', profId);
      });

      if (photoProfil) {
        formData.append('photo_profil', photoProfil);
      }

      await axios.post(`http://127.0.0.1:8000/api/etudiants/${editing}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const response = await axios.get('http://127.0.0.1:8000/api/etudiants?include=professeurs');
      setEtudiants(response.data);
      resetForm();
      setShowForm(false);
      alert("Étudiant modifié avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
      if (error.response) {
        alert(`Erreur de validation: ${JSON.stringify(error.response.data.errors)}`);
      }
    }
  };

  const resetForm = () => {
    setNom("");
    setPrenom("");
    setEmail("");
    setMatricule("");
    setDateNaissance("");
    setSexe("M");
    setAdresse("");
    setPhotoProfil(null);
    setClassId("");
    setMontantAPayer("");
    setSelectedProfesseurs([]);
    setEditing(null);
  };

  const aPayeCeMois = (etudiantId) => {
    const moisActuel = dayjs().format("MM");
    const paiement = paiements.find(p => 
      p.etudiant_id === etudiantId && p.mois?.startsWith(moisActuel)
    );
    return paiement?.est_paye;
  };

  const filteredEtudiants = etudiants.filter(etudiant => {
    const matchesSearch = 
      etudiant.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etudiant.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etudiant.matricule?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Correction clé ici : utiliser 'classe_id' comme dans l'API
    const matchesClass = filterClass ? 
      etudiant.classe_id?.toString() === filterClass.toString() : 
      true;
    
    return matchesSearch && matchesClass;
  });
  return (
<<<<<<< HEAD
    <div className="container-fluid py-4">
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h2 className="text-primary mb-0">Gestion des Étudiants</h2>
        </div>
        <div className="col-md-6 d-flex justify-content-end gap-2">
          <div className="input-group" style={{ width: "300px" }}>
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="input-group" style={{ width: "200px" }}>
            <span className="input-group-text">
              <FaFilter />
            </span>
            <select
              className="form-select"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">Toutes les classes</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>
                  {classe.name}
                </option>
=======
<div className=" mt-4">
   <h3 className="mb-4 text-center">Formulaire d'édition étudiant</h3>
  <div className="row mb-3">
    <div className="col-md-3">
      <input
        className="form-control"
        placeholder="Nom"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
      />
    </div>
    <div className="col-md-3">
      <input
        className="form-control"
        placeholder="Prénom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
      />
    </div>
    <div className="col-md-3">
      <input
        className="form-control"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div className="col-md-3">
      <input
        className="form-control"
        placeholder="Matricule"
        value={matricule}
        onChange={(e) => setMatricule(e.target.value)}
      />
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-3">
      <input
        type="date"
        className="form-control"
        placeholder="Date de Naissance"
        value={dateNaissance}
        onChange={(e) => setDateNaissance(e.target.value)}
      />
    </div>
    <div className="col-md-3">
      <select
        className="form-select"
        value={sexe}
        onChange={(e) => setSexe(e.target.value)}
      >
        <option value="M">Masculin</option>
        <option value="F">Féminin</option>
      </select>
    </div>
    <div className="col-md-3">
      <input
        className="form-control"
        placeholder="Adresse"
        value={adresse}
        onChange={(e) => setAdresse(e.target.value)}
      />
    </div>
    <div className="col-md-3">
      <input
        type="file"
        onChange={handleFileChange}
        className="form-control"
      />
    </div>
  </div>

  <div className="row mb-3">
    <div className="col-md-3">
      <select
        className="form-select"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
      >
        <option value="">Sélectionner une classe</option>
        {classes.map((classe) => (
          <option key={classe.id} value={classe.id}>
            {classe.name}
          </option>
        ))}
      </select>
    </div>
    <div className="col-md-3">
      <input
        type="number"
        className="form-control"
        placeholder="Montant à payer"
        value={montantAPayer}
        onChange={(e) => setMontantAPayer(e.target.value)}
      />
    </div>
    <div className="col-md-3">
      <select
        multiple
        className="form-select"
        value={selectedProfesseurs}
        onChange={(e) =>
          setSelectedProfesseurs(
            Array.from(e.target.selectedOptions, (option) => option.value)
          )
        }
      >
        {professeurs.map((professeur) => (
          <option key={professeur.id} value={professeur.id}>
            {professeur.nom}
          </option>
        ))}
      </select>
    </div>
    <div className="col-md-3">
      {editing ? (
        <button className="btn btn-warning w-100" onClick={handleUpdateEtudiant}>
          Mettre à jour
        </button>
      ) : null}
    </div>
  </div>


        {/* Liste des étudiants */}
        <h2 className="text-center text-primary m-5">Liste des Étudiants</h2>
        <div className="table-responsive w-100">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Classe</th>
                <th>Montant</th>
                <th>Professeurs</th>
                <th>Paiement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {etudiants.map((etudiant) => (
                <tr key={etudiant.id}>
                  <td>
                    <Link to={`/etudiants/${etudiant.id}`} className="text-decoration-none text-primary">
                      {etudiant.nom}
                    </Link>
                  </td>
                  <td>{etudiant.email}</td>
                  <td>{etudiant.montant_a_payer} MAD</td>
                  <td>
                    {etudiant.professeurs && etudiant.professeurs.length > 0 ? (
                      etudiant.professeurs.map((prof, index) => (
                        <span key={prof.id}>{prof.nom}{index < etudiant.professeurs.length - 1 ? ', ' : ''}</span>
                      ))
                    ) : (
                      <span>Aucun professeur assigné</span>
                    )}
                  </td>
                  <td>
                    {aPayeCeMois(etudiant.id) ? (
                      <span className="badge bg-success">Payé</span>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handlePaiement(etudiant.id)}
                      >
                        Payer
                      </button>
                    )}
                  </td>
                  <td>
  <div className="dropdown">
    <button
      className="btn btn-light dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <FaEye /> {/* Tu peux aussi mettre juste l'icône ici si tu veux un bouton minimal */}
    </button>
    <ul className="dropdown-menu">
     
      <li>
        <button className="dropdown-item" onClick={() => handleEditEtudiant(etudiant)}>
          <FaEdit className="me-2" /> Modifier
        </button>
      </li>
      <li>
        <button className="dropdown-item text-danger" onClick={() => handleDeleteEtudiant(etudiant.id)}>
          <FaTrash className="me-2" /> Supprimer
        </button>
      </li>
    </ul>
  </div>
</td>
                </tr>
>>>>>>> 4ff383b4df22939c6201cdb25dd2d9a2fa2fbfa6
              ))}
            </select>
          </div>
         
        </div>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              {editing ? "Modifier un étudiant" : "Ajouter un nouvel étudiant"}
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Nom</label>
                <input
                  className="form-control"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Prénom</label>
                <input
                  className="form-control"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Matricule</label>
                <input
                  className="form-control"
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Date de Naissance</label>
                <input
                  type="date"
                  className="form-control"
                  value={dateNaissance}
                  onChange={(e) => setDateNaissance(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Sexe</label>
                <select
                  className="form-select"
                  value={sexe}
                  onChange={(e) => setSexe(e.target.value)}
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Adresse</label>
                <input
                  className="form-control"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Classe</label>
                <select
                  className="form-select"
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                >
                  <option value="">Sélectionner une classe</option>
                  {classes.map((classe) => (
                    <option key={classe.id} value={classe.id}>
                      {classe.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Montant à payer</label>
                <input
                  type="number"
                  className="form-control"
                  value={montantAPayer}
                  onChange={(e) => setMontantAPayer(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Professeurs</label>
                <select
                  multiple
                  className="form-select"
                  value={selectedProfesseurs}
                  onChange={(e) =>
                    setSelectedProfesseurs(
                      Array.from(e.target.selectedOptions, (option) => option.value)
                    )
                  }
                >
                  {professeurs.map((professeur) => (
                    <option key={professeur.id} value={professeur.id}>
                      {professeur.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Photo</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="form-control"
                />
              </div>
              <div className="col-12 d-flex justify-content-end gap-2">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                >
                  Annuler
                </button>
                {editing ? (
                  <button className="btn btn-warning" onClick={handleUpdateEtudiant}>
                    Mettre à jour
                  </button>
                ) : (
                  <button className="btn btn-success" onClick={handleAddEtudiant}>
                    Ajouter
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div >
        <div >
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-primary">
                <tr>
                  <th>Nom & Prénom</th>
                  <th>Email</th>
                  <th>Classe</th>
                  <th>Montant</th>
                  <th>Professeurs</th>
                  <th className="text-center">Paiement</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEtudiants.length > 0 ? (
                  filteredEtudiants.map((etudiant) => (
                    <tr key={etudiant.id}>
                      <td>
                        <Link 
                          to={`/etudiants/${etudiant.id}`} 
                          className="text-decoration-none text-primary "
                        >
                          {etudiant.nom} {etudiant.prenom && etudiant.prenom}
                        </Link>
                      </td>
                      <td>{etudiant.email}</td>
                      <td>
                        {etudiant.classroom ? (
                          <span className="badge bg-info text-dark">
                            {etudiant.classroom.name}
                          </span>
                        ) : (
                          'Aucune classe'
                        )}
                      </td>
                      <td>{etudiant.montant_a_payer} MAD</td>
                      <td>
                        {etudiant.professeurs && etudiant.professeurs.length > 0 ? (
                          <div className="d-flex flex-wrap gap-1">
                            {etudiant.professeurs.map((prof) => (
                              <span key={prof.id} className="badge bg-light text-dark">
                                {prof.nom}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "Aucun professeur"
                        )}
                      </td>
                      <td className="text-center">
                        {aPayeCeMois(etudiant.id) ? (
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <span className="badge bg-success">Payé</span>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleCancelPaiement(etudiant.id)}
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handlePaiement(etudiant.id)}
                          >
                            Payer
                          </button>
                        )}
                      </td>
                      <td className="text-center">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditEtudiant(etudiant)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteEtudiant(etudiant.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="alert alert-info mb-0">
                        Aucun étudiant trouvé
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}