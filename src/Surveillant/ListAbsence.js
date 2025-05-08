import React, { useState, useEffect } from "react";
import axios from "axios";

const AbsenceSanctionTable = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [absences, setAbsences] = useState([]);
  const [sanctions, setSanctions] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/classrooms")
      .then(res => setClassrooms(res.data))
      .catch(err => console.error("Erreur chargement classes :", err));
    
    axios.get("http://localhost:8000/api/sanctions")
      .then(res => setSanctions(res.data))
      .catch(err => console.error("Erreur chargement sanctions :", err));
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      axios.get("http://localhost:8000/api/absences")
        .then(res => {
          const filtered = res.data.filter(a => a.class_id === parseInt(selectedClassId));
          setAbsences(filtered);
        })
        .catch(err => console.error("Erreur chargement absences :", err));
    }
  }, [selectedClassId]);

  const getSanction = (absenceCount) => {
    const sorted = sanctions
      .filter(s => s.nombre_absences_min <= absenceCount)
      .sort((a, b) => b.nombre_absences_min - a.nombre_absences_min);
    return sorted.length > 0 ? sorted[0].type_sanction : "Aucune";
  };

  // Regrouper par étudiant
  const groupedAbsences = absences.reduce((acc, curr) => {
    const key = curr.etudiant.id;
    if (!acc[key]) {
      acc[key] = {
        etudiant: curr.etudiant,
        count: 0
      };
    }
    acc[key].count++;
    return acc;
  }, {});

  const handleNotify = (etudiant) => {
    axios.get(`http://localhost:8000/api/parents/${etudiant.parent_id}`)
      .then(response => {
        const parentEmail = response.data.email; 
        
        axios.post(`http://localhost:8000/api/notifier-parent/${etudiant.id}`, {
          parentEmail,
          etudiant_id: etudiant.id
        })
        .then(() => {
          alert(`Email envoyé au parent de ${etudiant.nom} ${etudiant.prenom}`);
        })
        .catch(() => {
          alert(`Erreur lors de l'envoi de l'email.`);
        });
      })
      .catch(err => {
        console.error("Erreur lors de la récupération de l'email du parent :", err);
        alert("Erreur lors de la récupération de l'email du parent.");
      });
  };
  

  const styles = {
    container: { maxWidth: '900px', margin: '40px auto', padding: '20px', backgroundColor: '#f4f4f8', borderRadius: '12px' },
    heading: { textAlign: 'center', marginBottom: '20px' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { backgroundColor: '#2980b9', color: 'white', padding: '10px' },
    td: { padding: '10px', borderBottom: '1px solid #ddd' },
    button: { padding: '6px 12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Absences par Étudiant avec Sanction</h2>

      <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)}>
        <option value="">Choisir une classe</option>
        {classrooms.map(cls => (
          <option key={cls.id} value={cls.id}>{cls.name}</option>
        ))}
      </select>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Étudiant</th>
            <th style={styles.th}>Nombre d'Absences</th>
            <th style={styles.th}>Sanction</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedAbsences).length === 0 ? (
            <tr><td colSpan="4" style={styles.td}>Aucune absence trouvée</td></tr>
          ) : (
            Object.values(groupedAbsences).map(({ etudiant, count }) => (
              <tr key={etudiant.id}>
                <td style={styles.td}>{etudiant.nom} {etudiant.prenom}</td>
                <td style={styles.td}>{count}</td>
                <td style={styles.td}>{getSanction(count)}</td>
                <td style={styles.td}>
                    {sanctions && count >= 5 ? (
                        <button style={styles.button} onClick={() => handleNotify(etudiant)}>
                        Notifier le parent
                        </button>
                    ) : (
                        <span style={{ color: "#888" }}>-</span>
                    )}
                    </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AbsenceSanctionTable;
