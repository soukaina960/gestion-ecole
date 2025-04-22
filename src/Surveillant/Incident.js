import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [etudiantId, setEtudiantId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/incidents')
      .then(res => setIncidents(res.data))
      .catch(() => setMessage("Erreur lors du chargement des incidents."));
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/classrooms')
      .then(res => setClasses(res.data))
      .catch(() => setMessage("Erreur lors du chargement des classes."));
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      axios.get(`http://127.0.0.1:8000/api/classrooms/${selectedClassId}/students`)
        .then(res => setEtudiants(res.data))
        .catch(() => setMessage("Erreur lors du chargement des étudiants."));
    }
  }, [selectedClassId]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredEtudiants = etudiants.filter(et =>
    et.nom.toLowerCase().includes(search.toLowerCase()) ||
    et.prenom.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddIncident = () => {
    if (!etudiantId || !description || !date) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    axios.post('http://127.0.0.1:8000/api/incidents', {
      etudiant_id: etudiantId,
      description,
      date: date, // Use the selected date here
    })
      .then(res => {
        setIncidents([...incidents, res.data]);
        setMessage("Incident ajouté avec succès.");
        setEtudiantId('');
        setDescription('');
        setDate('');
      })
      .catch(() => setMessage("Erreur lors de l'ajout de l'incident."));
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/incidents/${id}`)
      .then(() => {
        setIncidents(incidents.filter(i => i.id !== id));
        setMessage("Incident supprimé.");
      })
      .catch(() => setMessage("Erreur lors de la suppression."));
  };

  return (
    <div style={{ fontFamily: 'Arial', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>📋 Gestion des Incidents</h2>

      {message && <p style={{ color: '#c0392b' }}>{message}</p>}

      <h3>🎯 Filtrer par Classe</h3>
      <select
        value={selectedClassId}
        onChange={(e) => setSelectedClassId(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
      >
        <option value="">Sélectionner une classe</option>
        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>

      <h3>🔎 Rechercher Étudiant</h3>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Nom ou prénom"
        style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
      />

      <h3>📝 Ajouter un Incident</h3>
      <select
        value={etudiantId}
        onChange={(e) => setEtudiantId(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
      >
        <option value="">Choisir un étudiant</option>
        {filteredEtudiants.map(et => (
          <option key={et.id} value={et.id}>{et.nom} {et.prenom}</option>
        ))}
      </select>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Décrire l'incident"
        style={{ padding: '8px', width: '100%', height: '100px', marginBottom: '10px' }}
      />

      <h3>📅 Date de l'Incident</h3>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
      />

      <button
        onClick={handleAddIncident}
        style={{ backgroundColor: '#27ae60', color: '#fff', padding: '10px', width: '100%', border: 'none', borderRadius: '5px' }}
      >
        ✅ Ajouter Incident
      </button>

      <h3 style={{ marginTop: '30px' }}>📂 Liste des Incidents</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#ecf0f1' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Étudiant</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Description</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Date</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map(incident => {
            const etudiant = etudiants.find(e => e.id === incident.etudiant_id);
            return (
              <tr key={incident.id}>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  {etudiant ? `${etudiant.nom} ${etudiant.prenom}` : 'N/A'}
                </td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{incident.description}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>{incident.date}</td>
                <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                  <button
                    onClick={() => handleDelete(incident.id)}
                    style={{ backgroundColor: '#e74c3c', color: '#fff', padding: '6px 12px', border: 'none', borderRadius: '4px' }}
                  >
                    🗑️ Supprimer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default IncidentList;
