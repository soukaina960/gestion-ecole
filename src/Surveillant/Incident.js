import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Incident = () => {
  const [etudiantId, setEtudiantId] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedProfesseurId, setSelectedProfesseurId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedEtudiantId, setSelectedEtudiantId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [matieres, setMatieres] = useState([]);
  const [selectedMatiereId, setSelectedMatiereId] = useState('');

  const surveillantId = localStorage.getItem('surveillant_id');

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/incidents')
      .then(res => setIncidents(res.data))
      .catch(() => setMessage("Erreur lors du chargement des incidents."));
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8000/api/classrooms")
      .then((response) => {
        setClassrooms(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des classes:", error);
      });

    axios.get("http://localhost:8000/api/professeurs")
      .then((response) => {
        setProfesseurs(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des professeurs:", error);
      });

    if (selectedClassId) {
      axios.get(`http://127.0.0.1:8000/api/classrooms/${selectedClassId}/students`)
        .then(res => setEtudiants(res.data));
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (selectedClassId && selectedProfesseurId) {
      axios.get(`http://localhost:8000/api/matieres-par-prof-classe`, {
        params: {
          professeur_id: selectedProfesseurId,
          classe_id: selectedClassId,
        }
      }).then(res => {
        setMatieres(res.data);
      }).catch(err => {
        console.error("Erreur lors du chargement des matières:", err);
      });
    }
  }, [selectedClassId, selectedProfesseurId]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredEtudiants = etudiants.filter(et =>
    et.nom.toLowerCase().includes(search.toLowerCase()) ||
    et.prenom.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddIncident = () => {
    if (!selectedEtudiantId || !description || !date) {
      setMessage("Veuillez remplir tous les champs.");
      return;
    }

    axios.post('http://127.0.0.1:8000/api/incidents', {
      etudiant_id: selectedEtudiantId,
      description,
      date: date,
      professeur_id: selectedProfesseurId,
      matiere_id: selectedMatiereId,
      class_id: selectedClassId,
      surveillant_id: surveillantId // Ajout de l'ID du surveillant
    })
      .then(res => {
        setIncidents([...incidents, res.data]);
        setMessage("Incident ajouté avec succès.");
        setEtudiantId('');
        setDescription('');
        setDate('');
      })
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
    <div style={{
      fontFamily: 'Segoe UI, sans-serif',
      maxWidth: '750px',
      margin: '30px auto',
      padding: '25px',
      backgroundColor: '#f9f9f9',
      borderRadius: '12px',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.08)',
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '20px'
      }}>
        Gestion des Incidents
      </h2>
    
      {message && <p style={{ color: '#e74c3c', textAlign: 'center' }}>{message}</p>}
    
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Filtrer par Classe</label>
        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          style={{
            padding: '10px',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginTop: '5px',
          }}
        >
          <option value="">Sélectionner une classe</option>
          {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
    
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontWeight: 'bold' }}>Rechercher Étudiant</label>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Nom ou prénom"
          style={{
            padding: '10px',
            width: '100%',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginTop: '5px',
          }}
        />
      </div>
    
      <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Ajouter un Incident</h3>
    
      <select
        value={selectedEtudiantId}
        onChange={(e) => setSelectedEtudiantId(e.target.value)}
        style={{
          padding: '10px',
          width: '100%',
          borderRadius: '6px',
          border: '1px solid #ccc',
          marginBottom: '15px',
        }}
      >
        <option value="">Choisir un étudiant</option>
        {filteredEtudiants.map(et => (
          <option key={et.id} value={et.id}>{et.nom} {et.prenom}</option>
        ))}
      </select>
    
      <label style={{ fontWeight: 'bold' }}>Professeur</label>
      <select
        value={selectedProfesseurId}
        onChange={(e) => setSelectedProfesseurId(e.target.value)}
        style={{
          padding: '10px',
          width: '100%',
          borderRadius: '6px',
          border: '1px solid #ccc',
          marginBottom: '15px',
          marginTop: '5px',
        }}
      >
        <option value="">Choisir un professeur</option>
        {professeurs.map(p => <option key={p.id} value={p.id}>{p.nom}</option>)}
      </select>
    
      <label style={{ fontWeight: 'bold' }}>Matière</label>
      <select
        value={selectedMatiereId}
        onChange={(e) => setSelectedMatiereId(e.target.value)}
        style={{
          padding: '10px',
          width: '100%',
          borderRadius: '6px',
          border: '1px solid #ccc',
          marginBottom: '15px',
          marginTop: '5px',
        }}
      >
        <option value="">Choisir une matière</option>
        {matieres.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
      </select>
    
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Décrire l'incident"
        style={{
          padding: '10px',
          width: '100%',
          height: '100px',
          borderRadius: '6px',
          border: '1px solid #ccc',
          marginBottom: '15px',
        }}
      />
    
      <label style={{ fontWeight: 'bold' }}>Date de l'Incident</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{
          padding: '10px',
          width: '100%',
          borderRadius: '6px',
          border: '1px solid #ccc',
          marginBottom: '20px',
          marginTop: '5px',
        }}
      />
    
      <button
        onClick={handleAddIncident}
        style={{
          backgroundColor: '#2ecc71',
          color: '#fff',
          padding: '12px',
          width: '100%',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '30px',
        }}
      >
        Ajouter l'incident
      </button>
    </div>
    
  );
};

export default Incident;
