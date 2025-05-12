import React, { useState } from 'react';
import axios from 'axios';

const ReclamationForm = ({ onSuccess }) => {
  const [titre, setTitre] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const parentId = localStorage.getItem('parent_id');

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
      onSuccess(); // actualiser la liste
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
    }
  };

  // Styles en ligne
  const containerStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    maxWidth: '600px',
    margin: '2rem auto',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-in-out', // Pour l'effet de zoom au survol
  };

  const containerHoverStyle = {
    transform: 'scale(1.05)', // Effet de zoom lors du survol
  };

  const headingStyle = {
    marginBottom: '1rem',
    color: '#333',
    fontSize: '1.5rem',
  };

  const subHeadingStyle = {
    color: '#666',
    fontSize: '1rem',
    marginBottom: '1.5rem',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  const inputStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    width: '100%',
  };

  const textareaStyle = {
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    width: '100%',
    resize: 'vertical',
  };

  const buttonStyle = {
    padding: '0.75rem',
    border: 'none',
    backgroundColor: '#28a745', // Vert
    color: '#fff',
    fontWeight: 'bold',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  };

  const buttonHoverStyle = {
    backgroundColor: '#218838', // Vert plus foncé
  };

  const successMessageStyle = {
    marginTop: '0.5rem',
    color: 'green',
    fontWeight: 'bold',
  };

  const iconStyle = {
    marginRight: '8px',
  };

  return (
    <div 
      style={containerStyle}
      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} // Application de l'effet au survol
      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} // Retrait de l'effet quand la souris est sortie
    >
      <h2 style={headingStyle}>
        <i className="fas fa-exclamation-circle" style={iconStyle}></i>
        Envoyer une Réclamation
      </h2>
      <p style={subHeadingStyle}>
        Veuillez remplir le formulaire ci-dessous pour envoyer votre réclamation. Nous traiterons votre demande dans les plus brefs délais.
      </p>

      {successMessage && <p style={successMessageStyle}>{successMessage}</p>}

      <form onSubmit={handleSubmit} style={formStyle}>
        <input
          type="text"
          placeholder="Titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="5"
          required
          style={textareaStyle}
        />
        <button 
          type="submit" 
          style={buttonStyle} 
          onMouseOver={e => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor} 
          onMouseOut={e => e.target.style.backgroundColor = '#28a745'}
        >
          <i className="fas fa-paper-plane" style={iconStyle}></i>
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default ReclamationForm;
