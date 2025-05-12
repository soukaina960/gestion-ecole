import React, { useState, useEffect } from "react";
import axios from "axios";

const ListeIncidents = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [allIncidents, setAllIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/classrooms")
      .then(res => setClassrooms(res.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:8000/api/incidents")
      .then(res => setAllIncidents(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      const filtered = allIncidents.filter(i => i.etudiant.classe_id == selectedClassId);
      setFilteredIncidents(filtered);
    } else {
      setFilteredIncidents(allIncidents);
    }
  }, [selectedClassId, allIncidents]);
  const handleDeleteIncident = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet incident ?")) {
      axios.delete(`http://localhost:8000/api/incidents/${id}`)
        .then(() => {
          // Retire l'incident de la liste
          setAllIncidents(prev => prev.filter(i => i.id !== id));
        })
        .catch(err => {
          console.error(err);
          alert("Une erreur est survenue lors de la suppression.");
        });
    }
  };
  

  const containerStyle = {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#f9f9fb",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.07)",
    fontFamily: "Segoe UI, sans-serif"
  };

  const headingStyle = {
    marginBottom: "20px",
    color: "#2c3e50",
    textAlign: "center"
  };

  const labelStyle = {
    fontWeight: "600",
    display: "block",
    marginBottom: "8px",
    color: "#34495e"
  };

  const selectStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "25px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "16px"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden"
  };

  const thStyle = {
    padding: "12px 15px",
    backgroundColor: "#e67e22",
    color: "white",
    textAlign: "left"
  };

  const tdStyle = {
    padding: "12px 15px",
    borderBottom: "1px solid #ddd",
    color: "#2c3e50"
  };

  const emptyRowStyle = {
    textAlign: "center",
    color: "#999"
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Liste des Incidents</h2>

      <label style={labelStyle}>Choisir une classe :</label>
      <select
        style={selectStyle}
        value={selectedClassId}
        onChange={(e) => setSelectedClassId(e.target.value)}
      >
        <option value="">-- Toutes les classes --</option>
        {classrooms.map(cl => (
          <option key={cl.id} value={cl.id}>{cl.name}</option>
        ))}
      </select>

      <table style={tableStyle}>
      <thead>
        <tr>
          <th style={thStyle}>Étudiant</th>
          <th style={thStyle}>Description</th>
          <th style={thStyle}>Date</th>
          <th style={thStyle}>Action</th>
        </tr>
      </thead>

      <tbody>
  {filteredIncidents.length === 0 ? (
    <tr>
      <td style={{ ...tdStyle, ...emptyRowStyle }} colSpan="4">Aucun incident trouvé.</td>
    </tr>
  ) : (
    filteredIncidents.map((incident, i) => (
      <tr key={i}>
        <td style={tdStyle}>{incident.etudiant.nom} {incident.etudiant.prenom}</td>
        <td style={tdStyle}>{incident.description}</td>
        <td style={tdStyle}>{incident.date}</td>
        <td style={tdStyle}>
          <button
            onClick={() => handleDeleteIncident(incident.id)}
            style={{ backgroundColor: "#c0392b", color: "#fff", padding: "6px 12px", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Supprimer
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

      </table>
    </div>
  );
};

export default ListeIncidents;
