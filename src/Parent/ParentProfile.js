import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserFriends } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function ParentProfile() {
  const [parent, setParent] = useState({
    id: '',
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: ''
  });

  const [editMode, setEditMode] = useState(false);

  const parentId = localStorage.getItem('parent_id');
  const token = localStorage.getItem('access_token');

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/parents/${parentId}`)
      .then(response => {
        const data = response.data;
        setParent(prev => ({
          ...prev,
          id: data.id,
          nom: data.nom,
          prenom: data.prenom,
          telephone: data.telephone,
          email: data.email || ''
        }));
      })
      .catch(error => {
        console.error('Erreur de chargement', error);
      });
  }, [parentId]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/parent/update/${parentId}`, {
        parent: {
          nom: parent.nom,
          prenom: parent.prenom,
          telephone: parent.telephone,
          email: parent.email,
          password: parent.password || null
        },
        user: {
          nom: parent.nom,
          prenom: parent.prenom,
          telephone: parent.telephone,
          email: parent.email,
          password: parent.password || null
        }
      });

      alert("Profil mis à jour avec succès.");
      setEditMode(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error.response?.data || error.message);
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4 mx-auto zoom-effect" style={{ maxWidth: '500px' }}>
        <div className="text-center">
          <FaUserFriends size={50} className="text-primary mb-3" />
          <h4 className="mb-3">Profil du Parent</h4>
        </div>

        <div className="card-body">
          {editMode ? (
            <>
              <div className="mb-3">
                <label className="form-label">Nom</label>
                <input type="text" className="form-control" value={parent.nom} onChange={e => setParent({ ...parent, nom: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Prénom</label>
                <input type="text" className="form-control" value={parent.prenom} onChange={e => setParent({ ...parent, prenom: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Téléphone</label>
                <input type="text" className="form-control" value={parent.telephone} onChange={e => setParent({ ...parent, telephone: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={parent.email} onChange={e => setParent({ ...parent, email: e.target.value })} />
              </div>
              <button className="btn btn-success w-100" onClick={handleUpdate}>
                💾 Enregistrer
              </button>
            </>
          ) : (
            <>
              <p><strong>Nom :</strong> {parent.nom}</p>
              <p><strong>Prénom :</strong> {parent.prenom}</p>
              <p><strong>Téléphone :</strong> {parent.telephone}</p>
              <p><strong>Email :</strong> {parent.email}</p>
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

// Effet de zoom avec CSS
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

export default ParentProfile;
