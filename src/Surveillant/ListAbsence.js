import React, { useState, useEffect } from "react";
import axios from "axios";

const AbsenceSanctionTable = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [absences, setAbsences] = useState([]);
  const [sanctions, setSanctions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [message, setMessage] = useState("");

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

  const groupedAbsences = absences.reduce((acc, curr) => {
    const key = curr.etudiant.id;
    if (!acc[key]) {
      acc[key] = {
        etudiant: curr.etudiant,
        count: 0,
        id: curr.id
      };
    }
    acc[key].count++;
    return acc;
  }, {});

  const filteredAbsences = Object.values(groupedAbsences).filter(({ etudiant }) =>
    etudiant.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    etudiant.prenom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNotify = (etudiant) => {
    axios.get(`http://localhost:8000/api/parents/${etudiant.parent_id}`)
      .then(response => {
        const parentEmail = response.data.email;

        axios.post(`http://localhost:8000/api/notifier-parent/${etudiant.id}`, {
          parentEmail,
          etudiant_id: etudiant.id
        })
          .then(() => alert(`Email envoyé au parent de ${etudiant.nom} ${etudiant.prenom}`))
          .catch(() => alert(`Erreur lors de l'envoi de l'email.`));
      })
      .catch(err => {
        console.error("Erreur récupération email parent :", err);
        alert("Erreur récupération email parent.");
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/absences/${id}`)
      .then(() => {
        setAbsences(prev => prev.filter(i => i.etudiant.id !== id));
        setMessage("Incident supprimé.");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => {
        setMessage("Erreur lors de la suppression.");
        setTimeout(() => setMessage(""), 3000);
      });
  };

  const styles = {
    container: {
      maxWidth: '950px',
      margin: '40px auto',
      padding: '25px',
      backgroundColor: '#f8fbff',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      fontSize: '14px',
    },
    heading: {
      textAlign: 'center',
      marginBottom: '25px',
      color: '#2c3e50',
    },
    select: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      marginBottom: '20px',
      borderRadius: '8px',
      border: '1px solid #dce3f0',
      backgroundColor: '#fff',
    },
    searchInput: {
      padding: '10px',
      fontSize: '14px',
      width: '100%',
      marginBottom: '20px',
      borderRadius: '8px',
      border: '1px solid #dce3f0',
      backgroundColor: '#fff',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      overflow: 'hidden',
    },
    th: {
      backgroundColor: '#3498db',
      color: 'white',
      padding: '12px',
      textAlign: 'left',
      fontWeight: '600',
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #eaeef7',
      color: '#333',
    },
    actionButtons: {
      display: 'flex',
      gap: '10px',
    },
    button: {
      padding: '6px 10px',
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
    },
    deleteButton: {
      padding: '6px 10px',
      backgroundColor: '#e74c3c',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
    },
    noData: {
      padding: '20px',
      textAlign: 'center',
      color: '#888',
    },
    message: {
      textAlign: 'center',
      marginBottom: '15px',
      color: '#16a085',
      fontWeight: '500',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Absences par Étudiant avec Sanction</h2>

      {message && <div style={styles.message}>{message}</div>}

      <select
        value={selectedClassId}
        onChange={e => setSelectedClassId(e.target.value)}
        style={styles.select}
      >
        <option value="">Choisir une classe</option>
        {classrooms.map(cls => (
          <option key={cls.id} value={cls.id}>{cls.name}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Rechercher par nom ou prénom"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={styles.searchInput}
      />

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Étudiant</th>
            <th style={styles.th}>Absences</th>
            <th style={styles.th}>Sanction</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAbsences.length === 0 ? (
            <tr>
              <td colSpan="4" style={styles.noData}>Aucune absence trouvée</td>
            </tr>
          ) : (
            filteredAbsences.map(({ etudiant, count }) => (
              <tr key={etudiant.id}>
                <td style={styles.td}>{etudiant.nom} {etudiant.prenom}</td>
                <td style={styles.td}>{count}</td>
                <td style={styles.td}>{getSanction(count)}</td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    {count >= 5 && (
                      <button
                        style={styles.button}
                        onClick={() => handleNotify(etudiant)}
                      >
                        Notifier
                      </button>
                    )}
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDelete(etudiant.id)}
                    >
                      Supprimer
                    </button>
                  </div>
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
