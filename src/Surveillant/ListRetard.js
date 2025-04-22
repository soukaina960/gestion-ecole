import React, { useState, useEffect } from "react";
import axios from "axios";

const ListeRetards = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [allRetards, setAllRetards] = useState([]);
  const [filteredRetards, setFilteredRetards] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/classrooms")
      .then(res => setClassrooms(res.data))
      .catch(err => console.error(err));

    axios.get("http://localhost:8000/api/retards")
      .then(res => setAllRetards(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      const filtered = allRetards.filter(r => r.etudiant.classe_id == selectedClassId);
      setFilteredRetards(filtered);
    } else {
      setFilteredRetards(allRetards);
    }
  }, [selectedClassId, allRetards]);

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
    backgroundColor: "#3498db",
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
      <h2 style={headingStyle}>Liste des Retards</h2>

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
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Heure</th>
          </tr>
        </thead>
        <tbody>
          {filteredRetards.length === 0 ? (
            <tr>
              <td style={{ ...tdStyle, ...emptyRowStyle }} colSpan="3">Aucun retard trouvé.</td>
            </tr>
          ) : (
            filteredRetards.map((r, i) => (
              <tr key={i}>
                <td style={tdStyle}>{r.etudiant.nom} {r.etudiant.prenom}</td>
                <td style={tdStyle}>{r.date}</td>
                <td style={tdStyle}>{r.heure}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListeRetards;
