import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

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
  const [editing, setEditing] = useState(null);  // Pour suivre l'étudiant en édition
  const [prenom, setPrenom] = useState("");

    
  const handlePaiement = async (etudiantId) => {
  const now = new Date();
  const moisActuel = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-01`; // "2025-04-01"
  const datePaiement = now.toISOString().split('T')[0]; // "2025-04-08"
    const payload = {
      etudiant_id: etudiantId,
      mois: moisActuel, // Add this line
      est_paye: true,
      date_paiement: new Date().toISOString().split('T')[0] // Add date_paiement
    };
  
    console.log("Données envoyées : ", payload);
  
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/paiements-mensuels", 
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      
      // Refresh payments list
      const paiementResponse = await axios.get("http://127.0.0.1:8000/api/paiements-mensuels");
      setPaiements(paiementResponse.data);
      alert("Paiement enregistré !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement :", error.response?.data || error.message);
      alert(`Échec de l'enregistrement: ${error.response?.data?.message || error.message}`);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const etudiantResponse = await axios.get('http://127.0.0.1:8000/api/etudiants');
        setEtudiants(etudiantResponse.data);
        
        const classResponse = await axios.get('http://127.0.0.1:8000/api/classrooms');
        setClasses(classResponse.data);
        
        const profResponse = await axios.get('http://127.0.0.1:8000/api/professeurs');
        setProfesseurs(profResponse.data);
        const paiementResponse = await axios.get("http://127.0.0.1:8000/api/paiements-mensuels");
      setPaiements(paiementResponse.data);

  
        const userResponse = await axios.get('http://127.0.0.1:8000/api/utilisateurs');
        setUtilisateurs(userResponse.data);
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
      formData.append('class_id', classId);
      formData.append('montant_a_payer', montantAPayer);
      formData.append('user_id', userId);
      formData.append('prenom', prenom);



      if (photoProfil) {
        formData.append('photo_profil', photoProfil);
      }

      await axios.post("http://127.0.0.1:8000/api/etudiants", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const etudiantResponse = await axios.get('http://127.0.0.1:8000/api/etudiants');
      setEtudiants(etudiantResponse.data);
      alert("Étudiant ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'étudiant", error);
    }
  };

  const handleDeleteEtudiant = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/etudiants/${id}`);
      const response = await axios.get('http://127.0.0.1:8000/api/etudiants');
      setEtudiants(response.data);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étudiant", error);
    }
  };

  const handleEditEtudiant = (etudiant) => {
    setNom(etudiant.nom);
    setEmail(etudiant.email);
    setMatricule(etudiant.matricule);
    setDateNaissance(etudiant.date_naissance);
    setSexe(etudiant.sexe);
    setAdresse(etudiant.adresse);
    setClassId(etudiant.class_id);
    setMontantAPayer(etudiant.montant_a_payer);
    setSelectedProfesseurs(etudiant.professeurs ? etudiant.professeurs.map(prof => prof.id) : []);
    setEditing(etudiant.id);  
  };

  const handleUpdateEtudiant = async () => {
    try {
      const formData = new FormData();
      formData.append('_method', 'PUT'); // Laravel needs this for PUT requests via POST
      formData.append('nom', nom);
      formData.append('email', email);
      formData.append('matricule', matricule);
      formData.append('date_naissance', dateNaissance);
      formData.append('sexe', sexe);
      formData.append('adresse', adresse);
      formData.append('prenom', prenom); 
      formData.append('classe_id', classId); 
  
      // Add professors if any selected
      selectedProfesseurs.forEach(profId => {
        formData.append('professeurs[]', profId);
      });
  
      if (photoProfil) {
        formData.append('photo_profil', photoProfil);
      }
  
      // Debug: Log form data before sending
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
  
      // Use POST with _method=PUT for Laravel compatibility
      await axios.post(`http://127.0.0.1:8000/api/etudiants/${editing}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      const response = await axios.get('http://127.0.0.1:8000/api/etudiants');
      setEtudiants(response.data);
      
      // Reset form
      setEditing(null);
      resetForm();
      
      alert("Étudiant modifié avec succès !");
    } catch (error) {
      console.error("Full error:", error);
      if (error.response) {
        console.error("Validation errors:", error.response.data.errors);
        alert(`Erreur de validation: ${JSON.stringify(error.response.data.errors)}`);
      } else {
        console.error("Request error:", error.message);
        alert("Erreur lors de la mise à jour");
      }
    }
  };
  
  const resetForm = () => {
    setNom("");
    setEmail("");
    setMatricule("");
    setDateNaissance("");
    setSexe("M");
    setAdresse("");
    setPhotoProfil(null);
    setClassId("");
    setMontantAPayer("");
    setSelectedProfesseurs([]);
  };
  const aPayeCeMois = (etudiantId) => {
    const moisActuel = new Date().toISOString().slice(0, 7); // Exemple: "2025-04"
    const paiement = paiements.find(p => 
      p.etudiant_id === etudiantId && p.mois?.startsWith(moisActuel)
    );
    return paiement?.est_paye;
  };
  
  

  return (
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
                  <td>{etudiant.classroom ? etudiant.classroom.name : 'Aucune classe'}</td>
                  <td>{etudiant.montant_a_payer}</td>
                  <td>
                  
                  {etudiant.professeurs && etudiant.professeurs.length > 0 
                            ? etudiant.professeurs.map((prof) => prof.nom).join(", ") 
                            : "Aucun"}                  
                  </td>
                  <td>
                      {aPayeCeMois(etudiant.id) ? (
                        <span className="badge bg-success">Payé</span>
                      ) : (
                        <>
                          <button className="btn btn-sm btn-success" onClick={() => handlePaiement(etudiant.id)}>
                            Payer
                          </button>
                        </>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
   

  );
}
