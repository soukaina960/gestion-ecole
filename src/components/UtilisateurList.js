 import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UtilisateurForm = ({ reloadUtilisateurs }) => {
  const [professeurs, setProfesseurs] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [roleFiltre, setRoleFiltre] = useState('');
  const [parents, setParents] = useState([]);
  const [classeId, setClasseId] = useState('');
  const [matiereId, setMatiereId] = useState('');
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);

  const [form, setForm] = useState({
    nom: '',
    email: '',
    mot_de_passe: '',
    role: '',
    telephone: '',
    adresse: '',
    photo_profil: null,
    matricule: '',
    prenom: '',
    date_naissance: '',
    sexe: '',
    montant_a_payer: '',
    classe_id: '',
    origine: '',
    parent_id: '',
    specialite: '',
    niveau_enseignement: '',
    montant: '',
    prime: '',
    pourcentage: '',
    total: '',
    diplome: '',
    date_embauche: '',
    professeurs: [],
    profession: '',
    matiere_id: '',
  });

  const fetchMatieres = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/matieres');
      console.log("API Response:", response.data);
      setMatieres(response.data.data);
    } catch (error) {
      console.error('Erreur lors du chargement des matières:', error);
      setMatieres([]);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/classrooms');
      console.log("Données des classes:", response.data);
      
      const formattedClasses = response.data.map(classe => ({
        id: classe.id,
        nom: classe.name || `Classe ${classe.id}`
      }));
      
      setClasses(formattedClasses);
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
      setClasses([]);
    }
  };

  const fetchParents = async () => {
    try {
      console.log("Fetching parents...");
      const response = await axios.get('http://127.0.0.1:8000/api/parents');
      console.log("Parents data:", response.data);
      
      const parentsData = response.data.parents || response.data;
      setParents(Array.isArray(parentsData) ? parentsData : []);
    } catch (error) {
      console.error('Erreur lors du chargement des parents:', error);
      setParents([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, files, selectedOptions } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else if (name === 'professeurs') {
      const selectedProfesseurs = Array.from(selectedOptions, option => option.value);
      setForm({ ...form, [name]: selectedProfesseurs });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('nom', form.nom);
    formData.append('email', form.email);
    formData.append('mot_de_passe', form.mot_de_passe);
    formData.append('role', form.role);
    formData.append('matricule', form.matricule);
    formData.append('telephone', form.telephone || '');
    formData.append('adresse', form.adresse || '');
    
    if (form.photo_profil) {
      formData.append('photo_profil', form.photo_profil);
    }

    if (form.role === 'étudiant') {
      formData.append('prenom', form.prenom);
      formData.append('date_naissance', form.date_naissance);
      formData.append('sexe', form.sexe);
      formData.append('montant_a_payer', form.montant_a_payer || 0);
      formData.append('classe_id', form.classe_id || '');
      formData.append('origine', form.origine || '');
      formData.append('parent_id', form.parent_id || '');
      form.professeurs.forEach((profId, index) => {
          formData.append(`professeurs[${index}]`, profId);
        });
    }

    if (form.role === 'professeur') {
      formData.append('specialite', form.specialite);
      formData.append('niveau_enseignement', form.niveau_enseignement);
      formData.append('montant', form.montant || 0);
      formData.append('prime', form.prime || 0);
      formData.append('pourcentage', form.pourcentage || 0);
      formData.append('total', form.total || 0);
      formData.append('diplome', form.diplome || '');
      formData.append('date_embauche', form.date_embauche);
      formData.append('classe_id', form.classe_id);
      formData.append('matiere_id', form.matiere_id);
      formData.append('matieres_classes[0][matiere_id]', form.matiere_id);
      formData.append('matieres_classes[0][classe_id]', form.classe_id);
    }

    if (form.role === 'parent') {
      formData.append('prenom', form.prenom);
      formData.append('profession', form.profession || '');
    }

    try {
      const response = await axios.post('http://localhost:8000/api/utilisateurs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const result = response.data;
      alert('✅ Utilisateur ajouté avec succès');
      
      setForm({
        nom: '',
        email: '',
        mot_de_passe: '',
        role: '',
        telephone: '',
        adresse: '',
        photo_profil: null,
        matricule: '',
        prenom: '',
        date_naissance: '',
        sexe: '',
        montant_a_payer: '',
        classe_id: '',
        origine: '',
        parent_id: '',
        professeurs: [],
        profession: '',
        specialite: '',
        niveau_enseignement: '',
        montant: '',
        prime: '',
        pourcentage: '',
        total: '',
        diplome: '',
        date_embauche: ''
      });

      reloadUtilisateurs();
    } catch (error) {
      console.error('Erreur:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        const messages = Object.values(error.response.data.errors).flat().join('\n');
        alert('❌ Erreur de validation :\n' + messages);
      } 
    }
  };

  const fetchProfesseurs = async () => {
    try {
      const profResponse = await axios.get('http://127.0.0.1:8000/api/professeurs');
      setProfesseurs(profResponse.data);
    } catch (error) {
      console.error('Erreur lors du chargement des professeurs:', error);
    }
  };

  const fetchUtilisateurs = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/utilisateurs?role=${roleFiltre}`);
      setUtilisateurs(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const handleRoleFiltreChange = (e) => {
    setRoleFiltre(e.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/utilisateurs/${id}`);
      fetchUtilisateurs();
      alert('✅ Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  useEffect(() => {
    fetchUtilisateurs();
    fetchProfesseurs();
    fetchParents();
    fetchClasses();
    fetchMatieres();
  }, [roleFiltre]);

  return (
    <div className="container " style={{ maxWidth: '1200px' }}>
      <div className="card shadow-sm">
        <div className="card-header bg-danger text-white">
          <h2 className="mb-0">Ajouter un utilisateur</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={form.nom}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Rôle</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  required
                  className="form-select"
                >
                  <option value="">Sélectionner un rôle</option>
                  <option value="admin">Admin</option>
                  <option value="professeur">Professeur</option>
                  <option value="surveillant">Surveillant</option>
                  <option value="étudiant">Étudiant</option>
                  <option value="parent">Parent</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Téléphone</label>
                <input
                  type="text"
                  name="telephone"
                  placeholder="Téléphone"
                  value={form.telephone}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Adresse</label>
                <input
                  type="text"
                  name="adresse"
                  placeholder="Adresse"
                  value={form.adresse}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Photo de profil</label>
                <input
                  type="file"
                  name="photo_profil"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {form.role === 'étudiant' && (
                <>
                  <div className="col-md-4">
                    <label className="form-label">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      placeholder="Prénom"
                      value={form.prenom}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Date de naissance</label>
                    <input
                      type="date"
                      name="date_naissance"
                      value={form.date_naissance}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Sexe</label>
                    <select name="sexe" value={form.sexe} onChange={handleChange} required className="form-select">
                      <option value="">Sexe</option>
                      <option value="M">Masculin</option>
                      <option value="F">Féminin</option>
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Montant à payer</label>
                    <input
                      type="number"
                      name="montant_a_payer"
                      placeholder="Montant à payer"
                      value={form.montant_a_payer}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Classe</label>
                    <select
                      name="classe_id"
                      value={form.classe_id}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">-- Sélectionner une classe --</option>
                      {classes.map((classe) => (
                        <option key={classe.id} value={classe.id}>
                          {classe.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Origine</label>
                    <input
                      type="text"
                      name="origine"
                      placeholder="Origine"
                      value={form.origine}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Professeurs</label>
                    <select
                      name="professeurs"
                      multiple
                      value={form.professeurs}
                      onChange={handleChange}
                      className="form-select"
                      size="3"
                    >
                      {professeurs.map((professeur) => (
                        <option key={professeur.id} value={professeur.id}>
                          {professeur.nom} ({professeur.specialite})
                        </option>
                      ))}
                    </select>
                    <small className="text-muted">
                      Maintenez Ctrl (Windows) ou Cmd (Mac) pour sélectionner plusieurs professeurs
                    </small>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Parent</label>
                    <select
                      name="parent_id"
                      value={form.parent_id}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">-- Sélectionner un parent --</option>
                      {Array.isArray(parents) && parents.length > 0 ? (
                        parents.map((parent) => (
                          <option key={parent.id} value={parent.id}>
                            {parent.nom} {parent.prenom}
                          </option>
                        ))
                      ) : (
                        <option value="" disabled>Aucun parent disponible</option>
                      )}
                    </select>
                  </div>
                </>
              )}

              {form.role === 'professeur' && (
                <>
                  
                  <div className="col-md-4">
                    <label className="form-label">Niveau enseignement</label>
                    <input
                      type="text"
                      name="niveau_enseignement"
                      placeholder="Niveau enseignement"
                      value={form.niveau_enseignement}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Matière</label>
                    <select
                      name="matiere_id"
                      value={form.matiere_id}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">-- Sélectionner une matière --</option>
                      {matieres.map((matiere) => (
                        <option key={matiere.id} value={matiere.id}>
                          {matiere.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Classe</label>
                    <select
                      name="classe_id"
                      value={form.classe_id}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">-- Sélectionner une classe --</option>
                      {classes.map((classe) => (
                        <option key={classe.id} value={classe.id}>
                          {classe.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Diplôme</label>
                    <input
                      type="text"
                      name="diplome"
                      placeholder="Diplôme"
                      value={form.diplome}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Date embauche</label>
                    <input
                      type="date"
                      name="date_embauche"
                      value={form.date_embauche}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                </>
              )}

              {form.role === 'parent' && (
                <div className="row mt-3">
                  <div className="col-md-4">
                    <label className="form-label">Prénom</label>
                    <input
                      type="text"
                      name="prenom"
                      placeholder="Prénom"
                      value={form.prenom}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Profession</label>
                    <input
                      type="text"
                      name="profession"
                      placeholder="Profession"
                      value={form.profession}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 text-end">
              <button 
                type="submit" 
                className="btn btn-warning px-4 py-2"
                style={{ borderRadius: '20px', fontWeight: '600' }}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm mt-5">
        <div className="card-header bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="mb-0">Liste des utilisateurs</h3>
            <div className="col-md-3">
              <select 
                onChange={handleRoleFiltreChange} 
                className="form-select"
              >
                <option value="">Filtrer par rôle</option>
                <option value="admin">Admin</option>
                <option value="professeur">Professeur</option>
                <option value="surveillant">Surveillant</option>
                <option value="étudiant">Étudiant</option>
                <option value="parent">Parent</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.map((utilisateur) => (
                  <tr key={utilisateur.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {utilisateur.photo_profil && (
                          <img 
                            src={`http://127.0.0.1:8000/storage/${utilisateur.photo_profil}`} 
                            alt="Profil" 
                            className="rounded-circle me-2"
                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                          />
                        )}
                        {utilisateur.nom}
                      </div>
                    </td>
                    <td>{utilisateur.email}</td>
                    <td>
                      <span className={`badge ${
                        utilisateur.role === 'admin' ? 'bg-danger' :
                        utilisateur.role === 'professeur' ? 'bg-primary' :
                        utilisateur.role === 'étudiant' ? 'bg-success' :
                        utilisateur.role === 'parent' ? 'bg-warning text-dark' :
                        'bg-secondary'
                      }`}>
                        {utilisateur.role}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(utilisateur.id)}
                      >
                        <i className="bi bi-trash"></i> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtilisateurForm; 