import React, { useEffect, useState } from "react";
import axios from "axios";

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('latest');
  const parentId = localStorage.getItem('parent_id');

  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
      marginTop: '20px',
    },
    select: {
      marginLeft: '10px',
      padding: '5px',
      borderRadius: '5px',
      border: '1px solid #ccc',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
      backgroundColor: '#fff',
    },
    th: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px',
      textAlign: 'left',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #ddd',
    },
    trHover: {
      backgroundColor: '#f1f1f1',
    },
    title: {
      marginTop: '20px',
      fontSize: '24px',
      color: '#333',
    },
    error: {
      color: 'red',
      fontWeight: 'bold',
    },
    empty: {
      color: '#555',
      marginTop: '20px',
    },
    label: {
      fontWeight: 'bold',
    }
  };

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/incidents/parent/${parentId}`)
      .then((response) => {
        setIncidents(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Une erreur est survenue.");
        setLoading(false);
      });
  }, [parentId]);

  const sortedIncidents = [...incidents].sort((a, b) => {
    if (sortOrder === 'latest') {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p style={styles.error}>{error}</p>;
  }

  return (
    <div style={styles.container}>
      <div>
        <label style={styles.label}>Trier par date :</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={styles.select}
        >
          <option value="latest">Plus récent</option>
          <option value="oldest">Plus ancien</option>
        </select>
      </div>

      <h2 style={styles.title}>Incidents</h2>

      {incidents.length === 0 ? (
        <p style={styles.empty}>Aucun incident trouvé</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Étudiant</th>
              <th style={styles.th}>Classe</th>
              <th style={styles.th}>Matière</th>
              <th style={styles.th}>Professeur</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedIncidents.map((incident) => (
              <tr
                key={incident.id}
                style={{ cursor: 'pointer' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = ''}
              >
                <td style={styles.td}>{incident.etudiant.nom} {incident.etudiant.prenom}</td>
                <td style={styles.td}>{incident.classroom ? incident.classroom.name : 'N/A'}</td>
                <td style={styles.td}>{incident.matiere ? incident.matiere.nom : 'N/A'}</td>
                <td style={styles.td}>{incident.professeur ? incident.professeur.nom : 'N/A'}</td>
                <td style={styles.td}>{incident.description}</td>
                <td style={styles.td}>{incident.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default Incidents;
