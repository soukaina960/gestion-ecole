import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SurveillantProfile() {
  const [editMode, setEditMode] = useState(false);

  const [surveillant, setSurveillant] = useState({
    id: '',
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    password: '',
    matricule: '',
    adresse: '',
    photo_profil: ''
  });

  const surveillantId = localStorage.getItem('surveillant_id');
  const token = localStorage.getItem('access_token');
console.log("Surveillant ID:", surveillantId);
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/surveillants/${surveillantId}`)
      .then(response => {
        const data = response.data;
        const utilisateur = data.utilisateur || {};

        setSurveillant({
          id: data.id,
          nom: data.nom || utilisateur.nom || '',
          prenom: data.prenom || utilisateur.prenom || '',
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
              prenom: surveillant.prenom,
              telephone: surveillant.telephone,
              email: surveillant.email,
              password: surveillant.password || null
            },
            utilisateur: {
              nom: surveillant.nom,
              prenom: surveillant.prenom,
              telephone: surveillant.telephone,
              email: surveillant.email,
              password: surveillant.password || null
            }
          });
          

      alert("Profil mis à jour avec succès.");
      setEditMode(false); // quitter le mode édition après mise à jour
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Profil du Surveillant</h2>

      {editMode ? (
        <>
          <input type="text" name="nom" value={surveillant.nom} onChange={handleChange} placeholder="Nom" /><br />
          <input type="text" name="prenom" value={surveillant.prenom} onChange={handleChange} placeholder="Prénom" /><br />
          <input type="email" name="email" value={surveillant.email} onChange={handleChange} placeholder="Email" /><br />
          <input type="text" name="telephone" value={surveillant.telephone} onChange={handleChange} placeholder="Téléphone" /><br />
          <input type="text" name="adresse" value={surveillant.adresse} onChange={handleChange} placeholder="Adresse" /><br />
          <input type="password" name="password" value={surveillant.password} onChange={handleChange} placeholder="Nouveau mot de passe" /><br />
          <button onClick={handleUpdate}>💾 Enregistrer</button>
          <button onClick={() => setEditMode(false)} style={{ marginLeft: '10px' }}>Annuler</button>
        </>
      ) : (
        <>
          <p><strong>Nom:</strong> {surveillant.nom}</p>
          <p><strong>Prénom:</strong> {surveillant.prenom}</p>
          <p><strong>Email:</strong> {surveillant.email}</p>
          <p><strong>Téléphone:</strong> {surveillant.telephone}</p>
          <p><strong>Adresse:</strong> {surveillant.adresse}</p>
          <p><strong>Matricule:</strong> {surveillant.matricule}</p>
          {surveillant.photo_profil && (
            <img src={`http://127.0.0.1:8000/storage/${surveillant.photo_profil}`} alt="Profil" width="100" />
          )}
          <br />
          <button onClick={() => setEditMode(true)}>✏️ Modifier</button>
        </>
      )}
    </div>
  );
}

export default SurveillantProfile;
