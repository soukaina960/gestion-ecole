import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ParentProfile() {
  const [parent, setParent] = useState({
    id: '',
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: ''
  });
const parentId = localStorage.getItem('parent_id'); // Assurez-vous que l'ID du parent est stocké dans le localStorage
  const token = localStorage.getItem('access_token'); // Assurez-vous que le token est stocké dans le localStorage
  console.log("Parent ID:", parentId);
  // Charger les infos existantes du parent
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

  // Fonction de mise à jour
  const handleUpdate = async () => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/parent/update/${parentId}`, {
        parent: {
          nom: parent.nom,
          prenom: parent.prenom,
          telephone: parent.telephone,
          email: parent.email,
          password: parent.password || null // on l'envoie seulement s'il y a une nouvelle valeur
        },
        user: {
          nom: parent.nom,
          prenom: parent.prenom,
          telephone: parent.telephone,
          email: parent.email,
          password: parent.password || null // on l'envoie seulement s'il y a une nouvelle valeur
        }
      });

      alert("Profil mis à jour avec succès.");
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error.response?.data || error.message);
      alert('Erreur lors de la mise à jour');
    }
  };

  return (
    <div>
      <h2>Modifier le profil du parent</h2>
      <input
        type="text"
        placeholder="Nom"
        value={parent.nom}
        onChange={e => setParent({ ...parent, nom: e.target.value })}
      />
      <input
        type="text"
        placeholder="Prénom"
        value={parent.prenom}
        onChange={e => setParent({ ...parent, prenom: e.target.value })}
      />
      <input
        type="text"
        placeholder="Téléphone"
        value={parent.telephone}
        onChange={e => setParent({ ...parent, telephone: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={parent.email}
        onChange={e => setParent({ ...parent, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={parent.password}
        onChange={e => setParent({ ...parent, password: e.target.value })}
      />
      <button onClick={handleUpdate}>Mettre à jour</button>
    </div>
  );
}

export default ParentProfile;
