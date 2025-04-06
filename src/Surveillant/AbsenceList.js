import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './NavBar';

const AbsenceList = () => {
  const [absences, setAbsences] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/absences')
      .then(response => setAbsences(response.data))
      .catch(error => console.error('Erreur lors du chargement des absences', error));
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
      <h2 style={styles.title}>Liste des Absences</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Étudiant</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Motif</th>
            <th style={styles.th}>Justifiée</th>
          </tr>
        </thead>
        <tbody>
          {absences.map((absence, index) => (
            <tr key={index}>
              <td style={styles.td}>{absence.nom_etudiant}</td>
              <td style={styles.td}>{absence.date}</td>
              <td style={styles.td}>{absence.motif}</td>
              <td style={styles.td}>{absence.justifiee ? 'Oui' : 'Non'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AbsenceList;
