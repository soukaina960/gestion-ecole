import React, { useEffect, useState } from "react";
import axios from "axios";

const Retards = () => {
  const [retards, setRetards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("latest");
  const [isHovered, setIsHovered] = useState(false);
  const parentId = localStorage.getItem("parent_id");

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f5f5f5",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      margin: "30px auto",
      maxWidth: "95%",
    },
    title: {
      fontSize: "26px",
      color: "#3498db", // Soft blue title color
      marginBottom: "25px",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    },
    selectContainer: {
      marginBottom: "20px",
      textAlign: "right",
    },
    label: {
      fontWeight: "bold",
      marginRight: "10px",
    },
    select: {
      padding: "8px 12px",
      borderRadius: "5px",
      border: "1px solid #3498db", // Soft blue border
      fontSize: "14px",
      backgroundColor: "#e6f7ff", // Soft blue background
      color: "#3498db", // Soft blue text color
      transition: "0.3s",
      cursor: "pointer",
      outline: "none",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "#fff",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    th: {
      backgroundColor: "#3498db", // Soft blue background for header
      color: "#fff",
      padding: "12px",
      textAlign: "left",
      fontSize: "15px",
    },
    td: {
      padding: "12px",
      borderBottom: "1px solid #ddd",
      fontSize: "14px",
      color: "#333",
    },
    tr: {
      cursor: "pointer",
    },
    trHover: {
      backgroundColor: "#e6f7ff", // Soft blue hover color
      transition: "background-color 0.3s ease",
    },
    error: {
      color: "red",
      fontWeight: "bold",
    },
    empty: {
      textAlign: "center",
      color: "#777",
      marginTop: "20px",
      fontSize: "16px",
    },
  };
  
  

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/retards/parent/${parentId}`)
      .then((response) => {
        setRetards(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Une erreur est survenue.");
        setLoading(false);
      });
  }, [parentId]);

  const sortedRetards = [...retards].sort((a, b) => {
    return sortOrder === "latest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}><i className="fas fa-clock" style={{ color: "#3498db" }}></i>
      Liste des retards</h2>

      <div style={styles.selectContainer}>
        <label style={styles.label}>Trier par date :</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={styles.select}
          onFocus={(e) => (e.target.style.backgroundColor = "#fff0e6")}
          onBlur={(e) => (e.target.style.backgroundColor = "#fff8f0")}
          onMouseOver={(e) => (e.target.style.borderColor = "#d35400")}
          onMouseOut={(e) => (e.target.style.borderColor = "#e67e22")}
        >
          <option value="latest">Plus récent</option>
          <option value="oldest">Plus ancien</option>
        </select>
      </div>

      {retards.length === 0 ? (
        <p style={styles.empty}>Aucun retard trouvé.</p>
      ) : (
        <table style={styles.table}>
  <thead>
    <tr>
      <th style={styles.th}>Nom étudiant</th>
      <th style={styles.th}>Classe</th>
      <th style={styles.th}>Professeur</th>
      <th style={styles.th}>Matière</th>
      <th style={styles.th}>Date</th>
      <th style={styles.th}>Heure</th>
    </tr>
  </thead>
  <tbody>
    {sortedRetards.map(retard => (
      <tr
        key={retard.id}
        style={styles.tr}
        onMouseEnter={e => e.currentTarget.style.background = '#e6f7ff'} // Soft blue hover
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <td style={styles.td}>{retard.etudiant?.nom || 'Non disponible'}</td>
        <td style={styles.td}>{retard.classroom?.name || 'Non disponible'}</td>
        <td style={styles.td}>{retard.professeur?.nom || 'Non disponible'}</td>
        <td style={styles.td}>{retard.matiere?.nom || 'Non disponible'}</td>
        <td style={styles.td}>{retard.date}</td>
        <td style={styles.td}>{retard.heure}</td>
      </tr>
    ))}
  </tbody>
</table>

      )}
    </div>
  );
};

export default Retards;
