import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';  // Assure-toi d'utiliser 'NavLink' pour les liens de navigation
import axios from 'axios';  // Pour les appels API
import Navbar from './NavBar';

const SurveillantDashboard = () => {
  const [absences, setAbsences] = useState([]);
  const [retards, setRetards] = useState([]);
  const [emplois, setEmplois] = useState([]);
  const [incidents, setIncidents] = useState([]);
  
  // Effectuer les appels API lorsque le composant est monté
  useEffect(() => {
    // Appel API pour les absences
    axios.get('http://localhost:8000/api/absences')  // Mets l'URL de ton API ici
      .then(response => setAbsences(response.data))
      .catch(error => console.error('Erreur lors de la récupération des absences', error));

    // Appel API pour les retards
    axios.get('http://localhost:8000/api/retards')  // Mets l'URL de ton API ici
      .then(response => setRetards(response.data))
      .catch(error => console.error('Erreur lors de la récupération des retards', error));

    // Appel API pour les emplois
    axios.get('http://localhost:8000/api/emplois')  // Mets l'URL de ton API ici
      .then(response => setEmplois(response.data))
      .catch(error => console.error('Erreur lors de la récupération des emplois', error));

    // Appel API pour les incidents
    axios.get('http://localhost:8000/api/incidents')  // Mets l'URL de ton API ici
      .then(response => setIncidents(response.data))
      .catch(error => console.error('Erreur lors de la récupération des incidents', error));
  }, []);

  return (
    <div className="dashboard-container">
        <Navbar />

      <div className="main-content">
        <h1>Surveillant Dashboard</h1>

        <div className="stats-section">
          <h2>Statistiques</h2>
          <div className="stat-card">
            <h3>Absences</h3>
            <p>{absences.length} Absences</p>
          </div>

          <div className="stat-card">
            <h3>Retards</h3>
            <p>{retards.length} Retards</p>
          </div>

          <div className="stat-card">
            <h3>Emplois</h3>
            <p>{emplois.length} Emplois</p>
          </div>

          <div className="stat-card">
            <h3>Incidents</h3>
            <p>{incidents.length} Incidents</p>
          </div>
        </div>

        <div className="calendar-section">
          <h2>Calendrier</h2>
          {/* Tu peux intégrer un calendrier ici */}
        </div>
      </div>
    </div>
  );
};

export default SurveillantDashboard;
