import React from "react";
import "../acceuil/navbar.css";
import { useNavigate } from "react-router-dom"; // Import pour la navigation

// Importation de l'image pour le fond (si toujours nécessaire)
import backgroundImage from "../assets/télécharger.png";

const Navbar = () => {
  const navigate = useNavigate(); // Hook pour la navigation

  const handleLoginClick = () => {
    navigate("/login"); // Redirection vers la page de login
  };

  const handleLogoClick = () => {
    navigate("/"); // Redirection vers l'accueil
  };

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="logo" onClick={handleLogoClick} style={{ cursor: "pointer" }}>
          LOGO
        </div>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
          <button className="login-button" onClick={handleLoginClick}>
            Login
          </button>
        </nav>
      </header>

      <main className="content">
        <div className="text-section">
          <h1>Back to School</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button className="cta-button">Click for more</button>
        </div>
      </main>
    </div>
  );
};

export default Navbar;