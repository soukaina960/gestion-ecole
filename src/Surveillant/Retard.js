import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Retard = () => {
  const [etudiants, setEtudiants] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [classrooms, setClassrooms] = useState([]);
  const [message, setMessage] = useState('');
  const [date, setDate] = useState('');
  const [heure, setHeure] = useState('');
  const [selectedEtudiantId, setSelectedEtudiantId] = useState('');
  const [selectedProfesseurId, setSelectedProfesseurId] = useState('');
  const [editing, setEditing] = useState(false);
  const [retards, setRetards] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
    const [matieres, setMatieres] = useState([]);
    const [selectedMatiereId, setSelectedMatiereId] = useState(''); // Ajouté pour les matières
  
  // Charger les classes et les professeurs disponibles
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

  // Charger les matières pour un professeur et une classe donnée
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

  // Filtrage par recherche
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredEtudiants = etudiants.filter(etudiant =>
    etudiant.nom.toLowerCase().includes(search.toLowerCase()) ||
    etudiant.prenom.toLowerCase().includes(search.toLowerCase())
  );

  // Fonction pour enregistrer un retard
  const handleAddRetard = () => {
    if (!selectedEtudiantId) {
      setMessage('Veuillez sélectionner un étudiant.');
      return;
    }
    if (!selectedProfesseurId) {
      setMessage('Veuillez sélectionner un professeur.');
      return;
    }
    
    const etudiant = etudiants.find(etudiant => etudiant.id === selectedEtudiantId);
    if (!etudiant) {
      setMessage('Étudiant non trouvé.');
      return;
    }
    
    const retardData = {
      etudiant_id: selectedEtudiantId,
      professeur_id: selectedProfesseurId,
      class_id: selectedClassId,
      matiere_id: selectedMatiereId,
      date,
      heure,
    };
  
    axios.post('http://127.0.0.1:8000/api/retards', retardData)
      .then(res => {
        setRetards([...retards, res.data]);
        setMessage('Retard ajouté avec succès.');
        setSelectedEtudiantId('');
        setDate('');
        setHeure('');
        setSelectedProfesseurId('');
      })
      .catch((error) => {
        setMessage('Erreur lors de l\'ajout du retard.');
      });
  };

  // Fonction pour annuler l'ajout
  const handleCancel = () => {
    setEditing(false);
    setDate('');
    setHeure('');
    setSelectedEtudiantId('');
    setSelectedProfesseurId('');
  };

  return (
    <div style={{ fontFamily: 'Segoe UI', maxWidth: '900px', margin: '0 auto', padding: '30px' }}>
      <h2 style={{ textAlign: 'center', color: '#2c3e50' }}>📋 Liste des Retards</h2>

      {message && (
        <p style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', color: '#333' }}>
          {message}
        </p>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ marginBottom: '10px', color: '#34495e' }}>🔍 Filtrer par Classe</h3>

        <select
          value={selectedClassId}
          onChange={(e) => setSelectedClassId(e.target.value)}
          style={{ padding: '8px', width: '100%', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">Sélectionner une classe</option>
          {classrooms.map(cls => (
            <option key={cls.id} value={cls.id}>
              {cls.name}
            </option>
          ))}
        </select>

        <h3 style={{ marginBottom: '10px', color: '#34495e' }}>🔎 Rechercher Étudiant</h3>
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Nom ou prénom"
          style={{ padding: '8px', width: '100%', margin: '8px 0 16px 0', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <h3 style={{ marginTop: '40px', color: '#34495e' }}>📌 Étudiants de la classe</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#ecf0f1' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Étudiant</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Date</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Heure</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEtudiants.map(etudiant => (
            <tr key={etudiant.id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{etudiant.nom} {etudiant.prenom}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Date</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>Heure</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <button
                  onClick={() => {
                    setEditing(true);
                    setSelectedEtudiantId(etudiant.id); 
                  }}
                  style={{
                    backgroundColor: '#2980b9',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  ✏️ Ajouter Retard
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ marginBottom: '10px', color: '#34495e' }}>📅 Ajouter un Retard</h3>

          <label>📅 Date :</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ padding: '8px', width: '100%', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          />

          <label>⏰ Heure :</label>
          <input
            type="time"
            value={heure}
            onChange={(e) => setHeure(e.target.value)}
            style={{ padding: '8px', width: '100%', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          />

          <h3 style={{ marginBottom: '10px', color: '#34495e' }}>👨‍🏫 Sélectionner le Professeur</h3>
          <select
            value={selectedProfesseurId}
            onChange={(e) => setSelectedProfesseurId(e.target.value)}
            style={{ padding: '8px', width: '100%', marginBottom: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Sélectionner un professeur</option>
            {professeurs.map(prof => (
              <option key={prof.id} value={prof.id}>
                {prof.nom} {prof.prenom}
              </option>
            ))}
          </select>
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

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAddRetard}
              style={{
                backgroundColor: '#2ecc71',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                flex: 1
              }}
            >
              ✅ Enregistrer
            </button>
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: '#e74c3c',
                color: '#fff',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                flex: 1
              }}
            >
              ❌ Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Retard;
