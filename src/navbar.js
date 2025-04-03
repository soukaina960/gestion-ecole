import React from "react";
import "./navbar.css";

// Importation de l'image pour le fond
import backgroundImage from "./assets/télécharger.png";

const LandingPage = () => {
  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="logo">LOGO</div>
        <nav>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
          <button className="signup-button">Inscription</button>
        </nav>
      </header>

      <main className="content">
        <div className="text-section">
          <h1>Back to School</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button className="cta-button">Click for more</button>
        </div>

        
      </main>
    </div>
  );
};

export default LandingPage;
