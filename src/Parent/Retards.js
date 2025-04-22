// Retards.js
import React from 'react';

const Retards = () => {
  const data = [
    { date: "2025-03-15", duration: "30 minutes", reason: "Retard de transport" },
    { date: "2025-03-16", duration: "15 minutes", reason: "Retard familial" },
    { date: "2025-03-18", duration: "45 minutes", reason: "Retard pour rendez-vous médical" },
    // أضف المزيد من البيانات هنا حسب الحاجة
  ];

  const styles = {
    container: {
      padding: "20px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    th: {
      padding: "10px",
      backgroundColor: "#4CAF50",
      color: "white",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      border: "1px solid #ddd",
    },
    header: {
      fontSize: "24px",
      marginBottom: "20px",
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Retards des élèves</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Durée</th>
            <th style={styles.th}>Raison</th>
          </tr>
        </thead>
        <tbody>
          {data.map((retard, index) => (
            <tr key={index}>
              <td style={styles.td}>{retard.date}</td>
              <td style={styles.td}>{retard.duration}</td>
              <td style={styles.td}>{retard.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Retards;
