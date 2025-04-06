import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './NavBar';

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/incidents')
      .then(response => setIncidents(response.data))
      .catch(error => console.error('Erreur lors du chargement des incidents', error));
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
      backgroundColor: '#cc0000',
      color: 'white',
      padding: '10px',
      textAlign: 'left',
      borderBottom: '2px solid #990000',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #ccc',
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h2 style={styles.title}>Liste des Incidents</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Type</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Étudiant ID</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident, index) => (
            <tr key={index}>
              <td style={styles.td}>{incident.type}</td>
              <td style={styles.td}>{incident.description}</td>
              <td style={styles.td}>{incident.date}</td>
              <td style={styles.td}>{incident.etudiant_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentList;
