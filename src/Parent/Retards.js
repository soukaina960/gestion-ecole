import React, { useEffect, useState } from 'react';

const Retards = () => {
  const [retards, setRetards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // par défaut récent

  const parentId = localStorage.getItem('parent_id');

  useEffect(() => {
    if (parentId) {
      fetch(`http://127.0.0.1:8000/api/retards/parent/${parentId}`)
        .then(response => response.json())
        .then(data => {
          if (data.message) {
            setError(data.message);
          } else {
            setRetards(data);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Erreur:', error);
          setError('Erreur de récupération des retards.');
          setLoading(false);
        });
    } else {
      setError('Identifiant du parent introuvable.');
      setLoading(false);
    }
  }, [parentId]);

  const sortedRetards = [...retards].sort((a, b) => {
    if (sortOrder === 'asc') {
      return new Date(a.date) - new Date(b.date);
    } else {
      return new Date(b.date) - new Date(a.date);
    }
  });

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  if (loading) {
    return <p style={styles.loading}>Chargement des retards...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Liste des Retards</h2>

      {/* Filter */}
      <div style={styles.filterContainer}>
        <label htmlFor="sort" style={styles.label}>Trier par date :</label>
        <select id="sort" value={sortOrder} onChange={handleSortChange} style={styles.select}>
          <option value="desc">Récents d'abord</option>
          <option value="asc">Anciens d'abord</option>
        </select>
      </div>

      {/* Table */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Nom étudiant</th>
            <th style={styles.th}>Classe</th>
            <th style={styles.th}>Professeur</th>
            <th style={styles.th}>Matiere</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Heure</th>
          </tr>
        </thead>
        <tbody>
          {sortedRetards.map(retard => (
            <tr key={retard.id}>
              <td style={styles.td}>{retard.etudiant?.nom || 'Non disponible'}</td>
              <td style={styles.td}>{retard.classroom?.name || 'Non disponible'}</td>
              <td style={styles.td}>{retard.professeur?.nom || 'Non disponible'}</td>
              <td style={styles.td}>{retard.matiere?.nom || 'Non disponible'}</td>
              <td style={styles.td}>{retard.date}</td>
              <td style={styles.td}>{retard.heure}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles
const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '28px',
    color: '#333',
  },
  filterContainer: {
    marginBottom: '20px',
    textAlign: 'right',
  },
  label: {
    marginRight: '10px',
    fontWeight: 'bold',
  },
  select: {
    padding: '8px 12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fdfdfd',
  },
  th: {
    backgroundColor: '#007BFF',
    color: 'white',
    padding: '12px',
    border: '1px solid #ddd',
    fontSize: '16px',
  },
  td: {
    padding: '10px',
    border: '1px solid #ddd',
    textAlign: 'center',
    fontSize: '16px',
  },
  loading: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    fontSize: '18px',
  },
};

export default Retards;
