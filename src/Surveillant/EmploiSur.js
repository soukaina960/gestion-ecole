import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './NavBar';

const EmploiList = () => {
  const [emplois, setEmplois] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/emplois')
      .then(response => setEmplois(response.data))
      .catch(error => console.error('Erreur lors du chargement des emplois', error));
  }, []);

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      fontSize: '24px',
      marginBottom: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    th: {
      backgroundColor: '#0073e6',
      color: 'white',
      padding: '10px',
      textAlign: 'left',
      borderBottom: '2px solid #005bb5',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #ccc',
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h2 style={styles.title}>Liste des Emplois de Surveillance</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Jour</th>
            <th style={styles.th}>Heure Début</th>
            <th style={styles.th}>Heure Fin</th>
            <th style={styles.th}>Salle</th>
            <th style={styles.th}>Surveillant ID</th>
          </tr>
        </thead>
        <tbody>
          {emplois.map((emploi, index) => (
            <tr key={index}>
              <td style={styles.td}>{emploi.jour}</td>
              <td style={styles.td}>{emploi.heure_debut}</td>
              <td style={styles.td}>{emploi.heure_fin}</td>
              <td style={styles.td}>{emploi.salle}</td>
              <td style={styles.td}>{emploi.surveillant_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmploiList;
