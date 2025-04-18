import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FiliereManager = () => {
  const [filieres, setFilieres] = useState([]);
  const [formData, setFormData] = useState({ nom: '', code: '', description: '', id: null });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  const fetchFilieres = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/filieres');
      console.log('Réponse API:', res.data);
      setFilieres(res.data.data); // ✅ utilise la clé "data"
    } catch (error) {
      console.error('Erreur lors de la récupération des filières :', error);
    }
  };

  useEffect(() => {
    fetchFilieres();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(`http://127.0.0.1:8000/api/filieres/${formData.id}`, formData);
        setMessage('Filière modifiée avec succès.');
      } else {
        await axios.post('http://127.0.0.1:8000/api/filieres', formData);
        setMessage('Filière ajoutée avec succès.');
      }

      setFormData({ nom: '', code: '', description: '', id: null });
      setIsEditing(false);
      fetchFilieres();
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      setMessage("Une erreur s'est produite.");
    }
  };

  const handleEdit = (filiere) => {
    setFormData(filiere);
    setIsEditing(true);
    setMessage('');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/filieres/${id}`);
      setMessage('Filière supprimée.');
      fetchFilieres();
    } catch (error) {
      console.error('Erreur lors de la suppression :', error);
      setMessage("Impossible de supprimer cette filière.");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>{isEditing ? 'Modifier' : 'Ajouter'} une Filière</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required />
        <input name="code" placeholder="Code" value={formData.code} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <button type="submit">{isEditing ? 'Modifier' : 'Ajouter'}</button>
      </form>

      {message && <p>{message}</p>}

      <h3>Liste des Filières</h3>
      {filieres.length === 0 ? (
        <p>Aucune filière trouvée.</p>
      ) : (
        <ul>
          {filieres.map((filiere) => (
            <li key={filiere.id}>
              <strong>{filiere.nom}</strong> ({filiere.code})<br />
              {filiere.description}<br />
              <button onClick={() => handleEdit(filiere)}>Modifier</button>
              <button onClick={() => handleDelete(filiere.id)}>Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FiliereManager;
