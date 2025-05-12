import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SurveillantReclamationList = () => {
  const [reclamations, setReclamations] = useState([]);

  const styles = {
    container: {
      maxWidth: '700px',
      margin: '40px auto',
      padding: '30px',
      backgroundColor: '#f9f7f4',
      borderRadius: '20px',
      fontFamily: 'system-ui, sans-serif',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#3b3b3b',
      fontSize: '26px',
      fontWeight: 'bold',
    },
    list: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    item: {
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    },
    title: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#3b3b3b',
    },
    paragraph: {
      fontSize: '15px',
      color: '#6c6c6c',
      marginBottom: '6px',
    },
    button: {
      marginTop: '12px',
      padding: '10px 16px',
      borderRadius: '12px',
      backgroundColor: '#f2e9e1',
      color: '#4b3f36',
      fontSize: '14px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
  };

  const fetchReclamations = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/reclamations');
      setReclamations(response.data);
    } catch (error) {
      console.error('Erreur de chargement :', error.response?.data || error.message);
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
      fetchReclamations();
    } catch (error) {
      console.error('Erreur de mise à jour :', error.response?.data || error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Liste des Réclamations</h2>

      {reclamations.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888' }}>Aucune réclamation trouvée.</p>
      ) : (
        <ul style={styles.list}>
          {reclamations.map((rec) => (
            <li key={rec.id} style={styles.item}>
              <h4 style={styles.title}>{rec.titre}</h4>
              <p style={styles.paragraph}><strong>Message:</strong> {rec.message}</p>
              <p style={styles.paragraph}><strong>Parent:</strong> {rec.parent?.nom} {rec.parent?.prenom}</p>
              <p style={styles.paragraph}><strong>Statut:</strong> {rec.statut}</p>

              <button
                style={styles.button}
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
