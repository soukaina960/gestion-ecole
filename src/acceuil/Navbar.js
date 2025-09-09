import React, { useState } from "react";
import "../acceuil/navbar.css";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          LOGO
        </div>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <button className="login-button" onClick={() => { navigate("/login"); setMenuOpen(false); }}>
            Login
          </button>
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div></div>
          <div></div>
          <div></div>
        </div>
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
