import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importation des images depuis src/assets
import cloud1 from '../assets/cloud1.png';
import cloud2 from '../assets/cloud2.png';
import cloud3 from '../assets/cloud3.png';
import cloud4 from '../assets/cloud4.png';
import cloud5 from '../assets/cloud5.png';
import cloud6 from '../assets/cloud6.png';
import lettreImage from '../assets/lettre-removebg-preview.png';
import fRemovebgPreview from '../assets/f-removebg-preview.png';

const App = () => {
  return (
    <div
      style={{
        // Dégradé linéaire horizontal entre une teinte lavande et un bleu clair
        background: "linear-gradient(90deg, rgb(186, 85, 236), rgb(135, 206, 250))",
        // Hauteur minimale de 80% de la hauteur de la fenêtre
        minHeight: "80vh",
        // Marges intérieures (espacement)
        padding: "20px",
      }}
      className="mt-5"
    >
      <div className="container mt-5">
        <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
          {/* Contenu du carrousel */}
          <div className="carousel-inner">
            {/* Premier page de carrousel(admin) */}
            <div className="carousel-item active" id="active">
              <h4 style={{ color: "white", justifySelf: 'center', marginTop: '-5px' }} className="lettre">
                Fonctionnalité administrateur
              </h4>
              <div className="lettre">
                <div className="image-container" style={{ marginTop: '-50px' }}>
                  <img src={cloud1} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                  <img src={cloud2} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                  <img src={cloud3} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto', marginInlineStart: '120px' }} />
                </div>
              </div>
              <img
                src={lettreImage}
                alt=""
                style={{ width: "60px", height: "120px", marginLeft: "340px", marginTop: "-690px" }}
                className="lettre"
              />
              <img src={fRemovebgPreview} alt="" className="arrow" style={{ width: "60px", height: "auto" }} />
              <div className="image-container" style={{ marginTop: '-490px', marginLeft: '690px' }}>
                <div className="lettre">
                  <img src={cloud4} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                  <img src={cloud5} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                  <img src={cloud6} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto', marginLeft: '-20px' }} />
                </div>
              </div>
            </div>

            {/* Deuxième page de carrousel (parents)*/}
            <div className="carousel-item" id="page2">
              <h4 style={{ color: "white", justifySelf: 'center' }}>
                Fonctionnalité parents
              </h4>
              <div className="image-container" style={{ marginTop: '-10px' }}>
                <img src={cloud1} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud2} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud3} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto', marginInlineStart: '120px' }} />
              </div>
              <div className="image-container" style={{ marginTop: '-450px', marginLeft: '690px' }}>
                <img src={cloud4} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud5} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud6} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto', marginLeft: '-20px' }} />
              </div>
            </div>

            {/* Troisième page de carrousel(etudiant) */}
            <div className="carousel-item" id="page3">
              <h4 style={{ color: "white", justifySelf: 'center' }}>
                Fonctionnalité étudiant
              </h4>
              <div className="image-container" style={{ marginTop: '-40px' }}>
                <img src={cloud1} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud2} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud3} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto', marginInlineStart: '120px' }} />
              </div>
              <div className="image-container" style={{ marginTop: '-450px', marginLeft: '690px' }}>
                <img src={cloud4} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud5} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud6} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto', marginLeft: '-20px' }} />
              </div>
            </div>

            {/* Quatrième page de carrousel (professeur) */}
            <div className="carousel-item" id="page4">
              <h4 style={{ color: "white", justifySelf: 'center' }}>
                Fonctionnalité professeur
              </h4>
              <div className="image-container" style={{ marginTop: '-40px' }}>
                <img src={cloud1} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud2} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud3} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto', marginInlineStart: '120px' }} />
              </div>
              <div className="image-container" style={{ marginTop: '-450px', marginLeft: '690px' }}>
                <img src={cloud4} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud5} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud6} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto', marginLeft: '-20px' }} />
              </div>
            </div>

            {/* Cinquième page de carrousel (serveillant) */}
            <div className="carousel-item" id="page5">
              <h4 style={{ color: "white", justifySelf: 'center' }}>
                Fonctionnalité serveillant
              </h4>
              <div className="image-container" style={{ marginTop: '-40px' }}>
                <img src={cloud1} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud2} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud3} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto', marginInlineStart: '120px' }} />
              </div>
              <div className="image-container" style={{ marginTop: '-450px', marginLeft: '690px' }}>
                <img src={cloud4} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud5} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud6} alt="CLOUD" className="image" style={{ width: '220px', height: 'auto', marginLeft: '-20px' }} />
              </div>
            </div>
          </div>

          {/* Contrôles de navigation */}
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" style={{ marginLeft: "50%" }}></span>
            <span className="visually-hidden">Précédent</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Suivant</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
