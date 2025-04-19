import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UtilisateurForm = ({ reloadUtilisateurs }) => {
  const [professeurs, setProfesseurs] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [roleFiltre, setRoleFiltre] = useState('');
  const [parents, setParents] = useState([]);
  const [classes, setClasses] = useState([]);
  
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
    profession: ''
  });

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
    }

    if (form.role === 'parent') {
      formData.append('prenom', form.prenom);
      formData.append('profession', form.profession || '');
    }

    try {
      // 1. Créer l'utilisateur
      const response = await axios.post('http://localhost:8000/api/utilisateurs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const result = response.data;

      
      alert('✅ Utilisateur ajouté avec succès');
      
      // Réinitialiser le formulaire
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
      } else {
        alert('❌ Erreur : ' + (error.message || 'Erreur inconnue'));
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
  }, [roleFiltre]);

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <h2>Ajouter un utilisateur</h2>

        <div className="row">
          <div className="col-md-3">
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
          <div className="col-md-3">
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
          <div className="col-md-3">
            <input
              type="password"
              name="mot_de_passe"
              placeholder="Mot de passe"
              value={form.mot_de_passe}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="matricule"
              placeholder="Matricule"
              value={form.matricule}
              onChange={handleChange}
              required
              className="form-control"
            />
          </div>
        </div>

        <div className="row mt-3">
          <div className="col-md-3">
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="form-control"
            >
              <option value="">Sélectionner un rôle</option>
              <option value="admin">Admin</option>
              <option value="professeur">Professeur</option>
              <option value="surveillant">Surveillant</option>
              <option value="étudiant">Étudiant</option>
              <option value="parent">Parent</option>
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="telephone"
              placeholder="Téléphone"
              value={form.telephone}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              name="adresse"
              placeholder="Adresse"
              value={form.adresse}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-3">
            <input
              type="file"
              name="photo_profil"
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {form.role === 'étudiant' && (
          <>
            <div className="row mt-3">
              <div className="col-md-3">
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
              <div className="col-md-3">
                <input
                  type="date"
                  name="date_naissance"
                  value={form.date_naissance}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="col-md-3">
                <select name="sexe" value={form.sexe} onChange={handleChange} required className="form-control">
                  <option value="">Sexe</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div className="col-md-3">
                <input
                  type="number"
                  name="montant_a_payer"
                  placeholder="Montant à payer"
                  value={form.montant_a_payer}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-md-3">
                <select
                  name="classe_id"
                  value={form.classe_id}
                  onChange={handleChange}
                  className="form-control"
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
              <div className="col-md-3">
                <input
                  type="text"
                  name="origine"
                  placeholder="Origine"
                  value={form.origine}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-3">
                <select
                  name="professeurs"
                  multiple
                  value={form.professeurs}
                  onChange={handleChange}
                  className="form-control"
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
              <div className="col-md-3">
                <select
                  name="parent_id"
                  value={form.parent_id}
                  onChange={handleChange}
                  className="form-control"
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
            </div>
          </>
        )}

        {form.role === 'professeur' && (
          <>
            <div className="row mt-3">
              <div className="col-md-3">
                <input
                  type="text"
                  name="specialite"
                  placeholder="Spécialité"
                  value={form.specialite}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
              <div className="col-md-3">
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
              <div className="col-md-3">
                <input
                  type="text"
                  name="diplome"
                  placeholder="Diplôme"
                  value={form.diplome}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-3">
                <input
                  type="date"
                  name="date_embauche"
                  value={form.date_embauche}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>
            </div>
          </>
        )}

        {form.role === 'parent' && (
          <div className="row mt-3">
            <div className="col-md-4">
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

        <div className='row mt-4'>
          <div className="col-md-12">
            <button type="submit" className="btn btn-primary mt-3 w-100">
              Ajouter
            </button>
          </div>
        </div>
      </form>

      <div className='mt-5'>
        <select onChange={handleRoleFiltreChange} className='form-select w-25'>
          <option value="">Filtrer par rôle</option>
          <option value="admin">Admin</option>
          <option value="professeur">Professeur</option>
          <option value="surveillant">Surveillant</option>
          <option value="étudiant">Étudiant</option>
          <option value="parent">Parent</option>
        </select>

        <table className="table mt-4">
          <thead>
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
                <td>{utilisateur.nom}</td>
                <td>{utilisateur.email}</td>
                <td>{utilisateur.role}</td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(utilisateur.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UtilisateurForm;