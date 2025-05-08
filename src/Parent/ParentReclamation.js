import React, { useState } from 'react';
import axios from 'axios';

const ParentReclamationForm = () => {
  const [titre, setTitre] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const containerStyle = {
    maxWidth: '600px',
    margin: '30px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  const labelStyle = {
    marginBottom: '5px',
    fontWeight: 'bold',
    display: 'block'
  };

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const parentId = localStorage.getItem('parent_id');

      const response = await axios.post('http://127.0.0.1:8000/api/reclamations', {
        titre,
        message,
        parent_id: parentId
      });

      setSuccessMessage(response.data.message);
      setTitre('');
      setMessage('');
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error.response?.data || error.message);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Envoyer une Réclamation</h2>

      {successMessage && <p style={{ color: 'green', textAlign: 'center' }}>{successMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle}>Titre:</label>
          <input
            type="text"
            style={inputStyle}
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>

        <div>
          <label style={labelStyle}>Message:</label>
          <textarea
            style={{ ...inputStyle, height: '120px', resize: 'vertical' }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <button type="submit" style={buttonStyle}>Envoyer</button>
      </form>
    </div>
  );
};

export default ParentReclamationForm;
