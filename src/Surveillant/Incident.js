import React, { useState, useEffect } from 'react';
import axios from 'axios';

const IncidentList = () => {
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

  const surveillantId = localStorage.getItem('surveillant_id'); // Récupérer l'ID du surveillant depuis le localStorage

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
        {classrooms.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
        value={selectedEtudiantId}
        onChange={(e) => setSelectedEtudiantId(e.target.value)}
        style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
      >
        <option value="">Choisir un étudiant</option>
        {filteredEtudiants.map(et => (
          <option key={et.id} value={et.id}>{et.nom} {et.prenom}</option>
        ))}
      </select>
      <div>
          <label htmlFor="professeur_id" >Professeur:</label>
          <select
            id="professeur_id"
            value={selectedProfesseurId}
            onChange={(e) => setSelectedProfesseurId(e.target.value)}
            required
           
          >
            <option value="">Choisir un professeur</option>
            {professeurs.map((professeur) => (
              <option key={professeur.id} value={professeur.id}>
                {professeur.nom}
              </option>
            ))}
          </select>
        </div>
        <div>
  <label htmlFor="matiere_id" >Matière:</label>
  <select
    id="matiere_id"
    value={selectedMatiereId}
    onChange={(e) => setSelectedMatiereId(e.target.value)}
    required
  >
    <option value="">Choisir une matière</option>
    {matieres.map((matiere) => (
      <option key={matiere.id} value={matiere.id}>
        {matiere.nom}
      </option>
    ))}
  </select>
</div>

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
<td>{incident.etudiant ? `${incident.etudiant.nom} ${incident.etudiant.prenom}` : 'N/A'}</td>

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
