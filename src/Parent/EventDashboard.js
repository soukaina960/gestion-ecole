import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventDashboard = () => {
  const [evenements, setEvenements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const utilisateurId = localStorage.getItem('utilisateurId');

    if (!token || !utilisateurId) {
      setErrorMessage('Utilisateur non authentifié.');
      setLoading(false);
      return;
    }

    const fetchEvenements = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/evenements`);
        const events = response.data;

        const now = new Date();
        const futurs = events
          .filter(ev => new Date(ev.date_debut) >= now)
          .sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut));

        setEvenements(futurs);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des événements", error);
        setLoading(false);
      }
    };

    fetchEvenements();
  }, []);

  const styles = {
    container: {
      backgroundColor: "#FFFCEC",
      maxWidth: "95%",
      margin: "30px auto",
      padding: "30px",
      borderRadius: "16px",
      fontFamily: "'Poppins', sans-serif",
      boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
      color: "#3a3a3a",
    },
    title: {
      fontSize: "26px",
      fontWeight: "600",
      marginBottom: "20px",
      color: "#8B5E3C",
      borderBottom: "2px solid #e0c77c",
      paddingBottom: "8px",
    },
    eventCard: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "15px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
      borderLeft: "6px solid #facc15",
      transition: "transform 0.2s",
    },
    eventCardHover: {
      transform: "scale(1.02)",
    },
    label: {
      fontWeight: "600",
      color: "#8b5e3c",
    },
    emptyText: {
      fontStyle: "italic",
      color: "#999",
      padding: "10px",
    }
  };

  if (loading) return <p style={{ padding: '20px', textAlign: 'center' }}>Chargement...</p>;
  if (errorMessage) return <p style={{ color: "red", textAlign: 'center' }}>{errorMessage}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        📅 Prochains événements
      </h2>

      {evenements.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {evenements.map((ev, index) => (
            <li key={index} style={styles.eventCard}>
              <div><span style={styles.label}>Titre :</span> {ev.titre}</div>
              <div><span style={styles.label}>Date :</span> {ev.date_debut} → {ev.date_fin}</div>
              <div><span style={styles.label}>Lieu :</span> {ev.lieu}</div>
              <div><span style={styles.label}>Description :</span> {ev.description}</div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.emptyText}>Aucun événement à venir pour le moment.</p>
      )}
    </div>
  );
};

export default EventDashboard;
