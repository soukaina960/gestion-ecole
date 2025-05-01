import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SurveillantReclamationList = () => {
  const [reclamations, setReclamations] = useState([]);

  const containerStyle = {
    maxWidth: '800px',
    margin: '30px auto',
    padding: '20px',
    backgroundColor: '#f1f1f1',
    borderRadius: '10px'
  };

  const reclamationItemStyle = {
    backgroundColor: 'white',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
  };

  const titleStyle = {
    marginBottom: '8px',
    color: '#333'
  };

  const paragraphStyle = {
    marginBottom: '5px',
    color: '#666'
  };

  const buttonStyle = {
    padding: '8px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '10px'
  };

  const fetchReclamations = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reclamations');
      setReclamations(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  const handleStatusChange = async (id, currentStatut) => {
    const nouveauStatut = currentStatut === 'en attente' ? 'traitée' : 'en attente';

    try {
      await axios.put(`http://127.0.0.1:8000/api/reclamations/${id}`, {
        statut: nouveauStatut
      });

      // Recharger les réclamations après la mise à jour
      fetchReclamations();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error.response?.data || error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Liste des Réclamations</h2>

      {reclamations.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Aucune réclamation trouvée.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {reclamations.map((rec) => (
            <li key={rec.id} style={reclamationItemStyle}>
              <h4 style={titleStyle}>{rec.titre}</h4>
              <p style={paragraphStyle}><strong>Message:</strong> {rec.message}</p>
              <p style={paragraphStyle}><strong>Parent:</strong> {rec.parent?.nom} {rec.parent?.prenom}</p>
              <p style={paragraphStyle}><strong>Statut:</strong> {rec.statut}</p>

              <button
                style={buttonStyle}
                onClick={() => handleStatusChange(rec.id, rec.statut)}
              >
                Changer le statut
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SurveillantReclamationList;
