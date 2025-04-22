// NavBar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const styles = {
    sidebar: {
      width: "250px",
      backgroundColor: "#9b59b6", 
      padding: "30px 20px", 
      color: "white",
      minHeight: "100vh",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    header: {
      marginBottom: "60px",
    },
    title: {
      fontSize: "24px",
      marginBottom: "30px",
    },
    ul: {
      listStyleType: "none",
      padding: 0,
    },
    link: {
        textDecoration: "none",
        color: "white",
        fontSize: "18px",
        padding: "10px 0", 
        display: "block",
        marginBottom: "25px", // <-- plus d’espace entre les liens
        borderBottom: "1px solid rgba(255,255,255,0.2)",
        transition: "color 0.3s",
      },
    linkHover: {
      color: "#8e44ad", 
    },
    logoutBtn: {
      backgroundColor: "white", 
      color: "black",
      marginTop: "-50px",
      marginBottom: "30px",
      border: "none",
      padding: "12px",
      fontSize: "16px",
      borderRadius: "6px",
      cursor: "pointer",
      width: "100%",
      fontWeight: "bold",
      transition: "background-color 0.3s",
    }
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <h2 style={styles.title}>Parent Dashboard</h2>
        <ul style={styles.ul}>
          <li><Link to="" style={styles.link}>Accueil</Link></li>
          <li><Link to="notes" style={styles.link}>Notes</Link></li>
          <li><Link to="retards" style={styles.link}>Retards</Link></li>
          <li><Link to="incidents" style={styles.link}>Incidents</Link></li>
          <li><Link to="profil" style={styles.link}>Profil</Link></li>
        </ul>
      </div>

      
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Déconnexion
        </button>
    
    </div>
  );
};

export default NavBar;
