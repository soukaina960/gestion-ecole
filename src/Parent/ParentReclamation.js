import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ParentReclamationForm = () => {
  const [titre, setTitre] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [reclamations, setReclamations] = useState([]);

  const parentId = localStorage.getItem('parent_id');

  const fetchReclamations = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/reclamations?parent_id=${parentId}`);
      setReclamations(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des réclamations:', error);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/reclamations', {
        titre,
        message,
        parent_id: parentId,
      });
      setSuccessMessage(response.data.message);
      setTitre('');
      setMessage('');
      fetchReclamations(); // refresh list
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/reclamations/${id}`);
      fetchReclamations(); // refresh list
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <h2 style={{ textAlign: 'center' }}>Envoyer une Réclamation</h2>
      {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        <label>Titre:</label>
        <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        
        <label>Message:</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required style={{ width: '100%', padding: '10px', height: '100px', marginBottom: '10px' }} />

        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
          Envoyer
        </button>
      </form>

      <hr style={{ margin: '30px 0' }} />

      <h3>Mes Réclamations</h3>
      {reclamations.length === 0 ? (
        <p>Aucune réclamation pour le moment.</p>
      ) : (
        <ul>
          {reclamations.map((rec) => (
            <li key={rec.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
              <strong>{rec.titre}</strong> <br />
              <span>{rec.message}</span> <br />
              <em>Statut : {rec.statut}</em><br />
              {rec.statut === 'en attente' && (
                <button
                  onClick={() => handleDelete(rec.id)}
                  style={{ marginTop: '8px', padding: '6px 12px', backgroundColor: '#d9534f', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                  Annuler
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ParentReclamationForm;
