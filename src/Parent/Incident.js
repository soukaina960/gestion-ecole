import React, { useEffect, useState } from "react";
import axios from "axios";

const Incidents = () => {
  const [incidents, setIncidents] = useState([]);
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
      color: "#e74c3c",
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
      border: "1px solid #e74c3c",
      fontSize: "14px",
      backgroundColor: "#fff5f0",
      color: "#e74c3c",
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
      transform: isHovered ? "scale(1.03)" : "scale(1)",
      transition: "transform 0.3s ease",
    },
    th: {
      backgroundColor: "#e74c3c",
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
    trHover: {
      backgroundColor: "#f1f1f1",
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
      .get(`http://127.0.0.1:8000/api/incidents/parent/${parentId}`)
      .then((response) => {
        setIncidents(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Une erreur est survenue.");
        setLoading(false);
      });
  }, [parentId]);

  const sortedIncidents = [...incidents].sort((a, b) => {
    return sortOrder === "latest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date);
  });

  if (loading) return <p>Chargement...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}><i class="fas fa-clipboard" style={{ color: "#e74c3c" }} ></i> Liste des incidents</h2>

      <div style={styles.selectContainer}>
        <label style={styles.label}>Trier par date :</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={styles.select}
          onFocus={(e) => (e.target.style.backgroundColor = "#ffe6e1")}
          onBlur={(e) => (e.target.style.backgroundColor = "#fff5f0")}
          onMouseOver={(e) => (e.target.style.borderColor = "#ff5722")}
          onMouseOut={(e) => (e.target.style.borderColor = "#e74c3c")}
        >
          <option value="latest">Plus récent</option>
          <option value="oldest">Plus ancien</option>
        </select>
      </div>

      {incidents.length === 0 ? (
        <p style={styles.empty}>Aucun incident trouvé.</p>
      ) : (
        <table
          style={styles.table}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <thead>
            <tr>
              <th style={styles.th}>Étudiant</th>
              <th style={styles.th}>Classe</th>
              <th style={styles.th}>Matière</th>
              <th style={styles.th}>Professeur</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedIncidents.map((incident) => (
              <tr
                key={incident.id}
                style={{ cursor: "pointer" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    styles.trHover.backgroundColor)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "")
                }
              >
                <td style={styles.td}>
                  {incident.etudiant.nom} {incident.etudiant.prenom}
                </td>
                <td style={styles.td}>
                  {incident.classroom ? incident.classroom.name : "N/A"}
                </td>
                <td style={styles.td}>
                  {incident.matiere ? incident.matiere.nom : "N/A"}
                </td>
                <td style={styles.td}>
                  {incident.professeur ? incident.professeur.nom : "N/A"}
                </td>
                <td style={styles.td}>{incident.description}</td>
                <td style={styles.td}>{incident.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};


export default Incidents;
