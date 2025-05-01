import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = {
  dashboard: {
    flex: 1,
    padding: '30px',
    color: '#4b2e83',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
  },
  stats: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    lineHeight: '2em',
  },
};

const SurveillantDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/statistics-surveillant')
      .then((response) => {
        setStatistics(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de chargement des stats !", error);
        setLoading(false);
      });
  }, []);

  return (
    <div style={styles.dashboard}>
      <h1 style={styles.title}>📊 Tableau de bord du Surveillant</h1>
      {loading ? (
        <p>Chargement des statistiques...</p>
      ) : (
        <div style={styles.stats}>
          <p><strong>Total Étudiants:</strong> {statistics.studentsCount}</p>
          <p><strong>Total Absences:</strong> {statistics.absencesCount}</p>
          <p><strong>Absences Justifiées:</strong> {statistics.justifiedAbsencesCount}</p>
          <p><strong>Absences Injustifiées:</strong> {statistics.unjustifiedAbsencesCount}</p>
          <p><strong>Total Incidents:</strong> {statistics.incidentsCount}</p>
        </div>
      )}
    </div>
  );
};

export default SurveillantDashboard;
