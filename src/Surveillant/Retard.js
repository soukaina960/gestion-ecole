import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlusCircle, FaTimesCircle } from 'react-icons/fa'; // Import icons from react-icons/fa

const styles = {
  container: {
    fontFamily: 'Segoe UI, sans-serif',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
    backgroundColor: '#fdfefe',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderRadius: '12px',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '28px',
    marginBottom: '30px',
  },
  message: {
    backgroundColor: '#eafaf1',
    padding: '12px 16px',
    borderRadius: '8px',
    color: '#2c3e50',
    border: '1px solid #d1f2eb',
    marginBottom: '20px',
  },
  sectionTitle: {
    marginBottom: '12px',
    color: '#34495e',
    fontWeight: '600',
    fontSize: '18px',
  },
  select: {
    padding: '10px',
    width: '100%',
    marginBottom: '20px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '15px',
  },
  input: {
    padding: '10px',
    width: '100%',
    marginBottom: '20px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '15px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    padding: '12px',
    border: '1px solid #ccc',
    backgroundColor: '#f0f3f4',
    textAlign: 'left',
    fontSize: '15px',
    color: '#2c3e50',
  },
  td: {
    padding: '12px',
    border: '1px solid #e0e0e0',
    fontSize: '14px',
    color: '#555',
  },
  iconButton: {
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    padding: '10px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease',
  },
  formGroup: {
    marginTop: '40px',
    backgroundColor: '#f8f9f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  btnSuccess: {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    flex: 1,
    transition: 'background-color 0.3s',
  },
  btnDanger: {
    backgroundColor: '#c0392b',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    flex: 1,
    transition: 'background-color 0.3s',
  },
  btnGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '20px',
  },
};


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
  const [selectedMatiereId, setSelectedMatiereId] = useState('');

  const surveillantId = localStorage.getItem('surveillant_id');

  useEffect(() => {
    axios.get("http://localhost:8000/api/classrooms")
      .then(res => setClassrooms(res.data));
    axios.get("http://localhost:8000/api/professeurs")
      .then(res => setProfesseurs(res.data));
  }, []);

  useEffect(() => {
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
      }).then(res => setMatieres(res.data));
    }
  }, [selectedClassId, selectedProfesseurId]);

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredEtudiants = etudiants.filter(etudiant =>
    etudiant.nom.toLowerCase().includes(search.toLowerCase()) ||
    etudiant.prenom.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRetard = () => {
    if (!selectedEtudiantId || !selectedProfesseurId) {
      setMessage('Veuillez remplir tous les champs requis.');
      return;
    }

    const retardData = {
      etudiant_id: selectedEtudiantId,
      professeur_id: selectedProfesseurId,
      class_id: selectedClassId,
      matiere_id: selectedMatiereId,
      date,
      heure,
      surveillant_id: surveillantId,
    };

    axios.post('http://127.0.0.1:8000/api/retards', retardData)
      .then(res => {
        setRetards([...retards, res.data]);
        setMessage('Retard ajouté avec succès.');
        setEditing(false);
        setSelectedEtudiantId('');
        setDate('');
        setHeure('');
        setSelectedProfesseurId('');
        setSelectedMatiereId('');
      })
      .catch(() => {
        setMessage('Erreur lors de l\'ajout du retard.');
      });
  };

  const handleCancel = () => {
    setEditing(false);
    setDate('');
    setHeure('');
    setSelectedEtudiantId('');
    setSelectedProfesseurId('');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Liste des Retards</h2>

      {message && <p style={styles.message}>{message}</p>}

      <div style={{ marginTop: '30px' }}>
        <h3 style={styles.sectionTitle}>Filtrer par Classe</h3>
        <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} style={styles.select}>
          <option value="">Sélectionner une classe</option>
          {classrooms.map(cls => <option key={cls.id} value={cls.id}>{cls.name}</option>)}
        </select>

        <h3 style={styles.sectionTitle}>Rechercher Étudiant</h3>
        <input type="text" value={search} onChange={handleSearch} placeholder="Nom ou prénom" style={styles.input} />
      </div>

      <h3 style={{ marginTop: '40px', ...styles.sectionTitle }}>Étudiants de la classe</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Étudiant</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Heure</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEtudiants.map(etudiant => (
            <tr key={etudiant.id}>
              <td style={styles.td}>{etudiant.nom} {etudiant.prenom}</td>
              <td style={styles.td}>Date</td>
              <td style={styles.td}>Heure</td>
              <td style={styles.td}>
                <button
                  onClick={() => {
                    setEditing(true);
                    setSelectedEtudiantId(etudiant.id);
                  }}
                  style={styles.iconButton}
                >
                  <FaPlusCircle />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div style={styles.formGroup}>
          <h3 style={styles.sectionTitle}>Ajouter un Retard</h3>

          <label>Date :</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={styles.input} />

          <label>Heure :</label>
          <input type="time" value={heure} onChange={e => setHeure(e.target.value)} style={styles.input} />

          <h3 style={styles.sectionTitle}>Sélectionner le Professeur</h3>
          <select value={selectedProfesseurId} onChange={e => setSelectedProfesseurId(e.target.value)} style={styles.select}>
            <option value="">Sélectionner un professeur</option>
            {professeurs.map(prof => (
              <option key={prof.id} value={prof.id}>{prof.nom} {prof.prenom}</option>
            ))}
          </select>

          <select value={selectedMatiereId} onChange={e => setSelectedMatiereId(e.target.value)} style={styles.select}>
            <option value="">Choisir une matière</option>
            {matieres.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>

          <div style={styles.btnGroup}>
            <button onClick={handleAddRetard} style={styles.btnSuccess}>Enregistrer</button>
            <button onClick={handleCancel} style={styles.btnDanger}>Annuler</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Retard;
