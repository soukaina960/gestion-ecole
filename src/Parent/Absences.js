import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Absences = () => {
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest'); // latest or oldest

  const parentId = localStorage.getItem('parent_id');

  useEffect(() => {
    if (parentId) {
      fetch(`http://127.0.0.1:8000/api/absences/parent/${parentId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.message) {
            setError(data.message);
          } else {
            setAbsences(data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erreur:', error);
          setError('Erreur de récupération des absences.');
          setLoading(false);
        });
    } else {
      setError('Identifiant du parent introuvable dans localStorage.');
      setLoading(false);
    }
  }, [parentId]);

  const sortedAbsences = [...absences].sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  if (loading) {
    return <p style={styles.loading}>Chargement des absences...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.filterContainer}>
        <label style={styles.filterLabel}>Trier par date : </label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={styles.select}
        >
          <option value="latest">Plus récent</option>
          <option value="oldest">Plus ancien</option>
        </select>
      </div>

      {absences.length === 0 ? (
        <p style={styles.noAbsence}>Aucune absence trouvée</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nom étudiant</th>
              <th style={styles.th}>Classe</th>
              <th style={styles.th}>Matière</th>
              <th style={styles.th}>Professeur</th>
              <th style={styles.th}>Motif</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Justifiée</th>
            </tr>
          </thead>
          <tbody>
            {sortedAbsences.map(absence => (
              <tr key={absence.id} style={styles.tr}>
                <td style={styles.td}>{absence.etudiant?.nom || 'N/A'}</td>
                <td style={styles.td}>{absence.classroom?.name || 'N/A'}</td>
                <td style={styles.td}>{absence.matiere?.nom || 'N/A'}</td>
                <td style={styles.td}>{absence.professeur?.nom || 'N/A'}</td>
                <td style={styles.td}>{absence.motif}</td>
                <td style={styles.td}>{absence.date}</td>
                <td style={{ 
                    ...styles.td, 
                    color: absence.justifiee === 1 ? 'green' : 'red', 
                    fontWeight: 'bold' 
                    }}>
                    {absence.justifiee === 1 ? 'Oui' : 'Non'}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
  },
  loading: {
    fontSize: '20px',
    color: '#007bff',
    textAlign: 'center',
    marginTop: '50px',
  },
  error: {
    color: '#dc3545',
    textAlign: 'center',
    fontSize: '20px',
    marginTop: '50px',
  },
  noAbsence: {
    textAlign: 'center',
    fontSize: '20px',
    color: '#6c757d',
    marginTop: '50px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  th: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    padding: '12px 15px',
    textAlign: 'left',
    fontSize: '16px',
  },
  td: {
    padding: '12px 15px',
    borderBottom: '1px solid #dddddd',
    fontSize: '15px',
  },
  tr: {
    transition: 'background-color 0.2s ease',
  },
  filterContainer: {
    marginBottom: '20px',
    textAlign: 'right',
  },
  filterLabel: {
    marginRight: '10px',
    fontSize: '16px',
  },
  select: {
    padding: '8px 12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
};

export default Absences;
