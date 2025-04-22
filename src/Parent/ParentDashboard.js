import React from 'react';

const ParentDashboard = () => {
  const stats = {
    moyenne: 14.5,
    retards: 3,
    notes: 12,
    incidents: 1,
  };

  const derniers = [
    { type: 'note', matiere: 'Maths', valeur: 18, date: '03/04/2025' },
    { type: 'retard', date: '02/04/2025', heure: '08:15' },
    { type: 'incident', desc: 'A oublié ses devoirs', date: '01/04/2025' },
  ];

  const styles = {
    container: {
      padding: '30px',
      fontFamily: "'Segoe UI', sans-serif",
      color: '#333',
    },
    title: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#2c3e50',
    },
    cardsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '20px',
      justifyContent: 'center',
      marginBottom: '40px',
    },
    card: {
      width: '200px',
      height: '120px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      padding: '20px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    h3: {
      margin: 0,
      fontSize: '18px',
      fontWeight: 600,
    },
    p: {
      margin: '8px 0 0',
      fontSize: '28px',
      fontWeight: 'bold',
    },
    recentSection: {
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '12px',
    },
    eventItem: {
      background: 'white',
      padding: '12px 15px',
      borderRadius: '8px',
      marginBottom: '10px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
      fontSize: '15px',
    },
  };

  const cardColors = {
    blue: '#3498db',
    orange: '#e67e22',
    green: '#27ae60',
    red: '#e74c3c',
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Bienvenue dans votre espace parent</h2>

      <div style={styles.cardsContainer}>
        <div style={{ ...styles.card, backgroundColor: cardColors.blue }}>
          <h3 style={styles.h3}>Moyenne</h3>
          <p style={styles.p}>{stats.moyenne}</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: cardColors.orange }}>
          <h3 style={styles.h3}>Retards</h3>
          <p style={styles.p}>{stats.retards}</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: cardColors.green }}>
          <h3 style={styles.h3}>Notes</h3>
          <p style={styles.p}>{stats.notes}</p>
        </div>
        <div style={{ ...styles.card, backgroundColor: cardColors.red }}>
          <h3 style={styles.h3}>Incidents</h3>
          <p style={styles.p}>{stats.incidents}</p>
        </div>
      </div>

      <div style={styles.recentSection}>
        <h3 style={{ marginBottom: '15px', color: '#34495e' }}>Derniers événements</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {derniers.map((item, index) => (
            <li key={index} style={styles.eventItem}>
              {item.type === 'note' && (
                <span>📝 Note en <strong>{item.matiere}</strong>: {item.valeur}/20 - {item.date}</span>
              )}
              {item.type === 'retard' && (
                <span>⏰ Retard le {item.date} à {item.heure}</span>
              )}
              {item.type === 'incident' && (
                <span>🚨 Incident: {item.desc} - {item.date}</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ParentDashboard;
