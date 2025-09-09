import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserTie } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function SurveillantProfile() {
  const [editMode, setEditMode] = useState(false);
  const [surveillant, setSurveillant] = useState({
    id: '',
    nom: '',
    telephone: '',
    email: '',
    password: '',
    matricule: '',
    adresse: '',
    photo_profil: ''
  });

  const surveillantId = localStorage.getItem('surveillant_id');
console.log(surveillantId);
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/surveillants/${surveillantId}`)
      .then(response => {
        const data = response.data;
        const utilisateur = data.utilisateur || {};

        setSurveillant({
          id: data.id,
          nom: data.nom || utilisateur.nom || '',
          telephone: data.telephone || utilisateur.telephone || '',
          email: data.email || utilisateur.email || '',
          password: '',
          matricule: utilisateur.matricule || '',
          adresse: utilisateur.adresse || '',
          photo_profil: utilisateur.photo_profil || ''
        });
      })
      .catch(error => {
        console.error('Erreur de chargement', error);
      });
  }, [surveillantId]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/surveillant/update/${surveillantId}`, {
        surveillant: {
          nom: surveillant.nom,
          telephone: surveillant.telephone,
          email: surveillant.email,
          password: surveillant.password || null
        },
        utilisateur: {
          nom: surveillant.nom,
          telephone: surveillant.telephone,
          email: surveillant.email,
          password: surveillant.password || null
        }
      });

      alert("Profil mis à jour avec succès.");
      setEditMode(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error.response?.data || error.message);
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurveillant(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mx-auto zoom-effect" style={{ maxWidth: '500px' }}>
        <div className="text-center">
          <FaUserTie size={50} className="text-primary mb-3" />
          <h4 className="mb-3">Profil du Surveillant</h4>
        </div>

        <div className="card-body">
          {editMode ? (
            <>
              <div className="mb-3">
                <label className="form-label">Nom</label>
                <input type="text" className="form-control" name="nom" value={surveillant.nom} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Téléphone</label>
                <input type="text" className="form-control" name="telephone" value={surveillant.telephone} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={surveillant.email} onChange={handleChange} />
              </div>
              <div className="mb-3">
                <label className="form-label">Nouveau mot de passe</label>
                <input type="password" className="form-control" name="password" value={surveillant.password} onChange={handleChange} />
              </div>
              <button className="btn btn-success w-100" onClick={handleUpdate}>
                💾 Enregistrer
              </button>
            </>
          ) : (
            <>
              <p><strong>Nom :</strong> {surveillant.nom}</p>
              <p><strong>Téléphone :</strong> {surveillant.telephone}</p>
              <p><strong>Email :</strong> {surveillant.email}</p>
              <button className="btn btn-primary w-100 mt-3" onClick={() => setEditMode(true)}>
                ✏️ Modifier mes infos
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Ajouter l'effet de zoom
const style = document.createElement('style');
style.innerHTML = `
.zoom-effect {
  transition: transform 0.3s ease-in-out;
}
.zoom-effect:hover {
  transform: scale(1.03);
}
`;
document.head.appendChild(style);

export default SurveillantProfile;
