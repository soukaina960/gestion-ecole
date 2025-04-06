import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './NavBar';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [etudiantId, setEtudiantId] = useState('');
  const [date, setDate] = useState('');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    etudiant_id: '',
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    axios.get('http://localhost:8000/api/notifications')
      .then(response => {
        setNotifications(response.data);
        setFilteredNotifications(response.data);
      })
      .catch(error => console.error('Erreur de chargement des notifications', error));
  };

  const handleFilter = () => {
    const filtered = notifications.filter(notif => {
      const matchEtudiant = etudiantId ? notif.etudiant_id.toString() === etudiantId : true;
      const matchDate = date ? notif.date === date : true;
      return matchEtudiant && matchDate;
    });
    setFilteredNotifications(filtered);
  };

  const handleReset = () => {
    setFilteredNotifications(notifications);
    setEtudiantId('');
    setDate('');
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/notifications', formData)
      .then(() => {
        alert('Notification envoyée ✅');
        setShowForm(false);
        setFormData({ titre: '', contenu: '', etudiant_id: '' });
        fetchNotifications();
      })
      .catch(error => {
        alert('Erreur lors de l\'envoi ❌');
        console.error(error);
      });
  };

  const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
    title: { fontSize: '24px', marginBottom: '20px' },
    filters: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
    input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
    button: {
      padding: '8px 16px',
      backgroundColor: '#009688',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    th: {
      backgroundColor: '#009688',
      color: 'white',
      padding: '10px',
      textAlign: 'left',
      borderBottom: '2px solid #00695c',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #ccc',
    },
    formContainer: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      marginBottom: '20px',
      maxWidth: '400px'
    },
    formLabel: { marginBottom: '5px', display: 'block' },
    formInput: { width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h2 style={styles.title}>Notifications envoyées</h2>

      <div style={styles.filters}>
        <input
          style={styles.input}
          type="text"
          placeholder="ID Étudiant"
          value={etudiantId}
          onChange={(e) => setEtudiantId(e.target.value)}
        />
        <input
          style={styles.input}
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button style={styles.button} onClick={handleFilter}>Filtrer</button>
        <button style={{ ...styles.button, backgroundColor: '#555' }} onClick={handleReset}>Réinitialiser</button>
        <button style={{ ...styles.button, backgroundColor: '#4CAF50' }} onClick={() => setShowForm(!showForm)}>
          {showForm ? '❌ Fermer le formulaire' : '➕ Envoyer une notification'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <label style={styles.formLabel}>Titre :</label>
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            style={styles.formInput}
            required
          />
          <label style={styles.formLabel}>Contenu :</label>
          <input
            type="text"
            name="contenu"
            value={formData.contenu}
            onChange={handleChange}
            style={styles.formInput}
            required
          />
          <label style={styles.formLabel}>ID Étudiant :</label>
          <input
            type="text"
            name="etudiant_id"
            value={formData.etudiant_id}
            onChange={handleChange}
            style={styles.formInput}
            required
          />
          <button type="submit" style={{ ...styles.button, width: '100%', marginTop: '10px' }}>📤 Envoyer</button>
        </form>
      )}

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Titre</th>
            <th style={styles.th}>Contenu</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Étudiant ID</th>
          </tr>
        </thead>
        <tbody>
          {filteredNotifications.map((notif, index) => (
            <tr key={index}>
              <td style={styles.td}>{notif.titre}</td>
              <td style={styles.td}>{notif.contenu}</td>
              <td style={styles.td}>{notif.date}</td>
              <td style={styles.td}>{notif.etudiant_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificationList;
