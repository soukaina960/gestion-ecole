import React from 'react';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import cloud1 from '../assets/cloud1.png';
import cloud2 from '../assets/cloud2.png';
import cloud3 from '../assets/cloud3.png';
import cloud4 from '../assets/cloud4.png';
import cloud5 from '../assets/cloud5.png';
import cloud6 from '../assets/cloud6.png';
import lettreImage from '../assets/lettre-removebg-preview.png';
import fRemovebgPreview from '../assets/f-removebg-preview.png';

const styles = {
  main: {
    background: "linear-gradient(90deg, rgb(208, 149, 237), rgb(135, 206, 250))",
    minHeight: "80vh",
    padding: "20px",
  },
  titre: {
    color: "white",
    justifySelf: "center",
    marginTop: "-5px",
  },
  cloud: {
    width: "220px",
    height: "auto",
  },
  cloudMargin: {
    marginInlineStart: "120px",
  },
  lettre: {
    width: "60px",
    height: "120px",
    marginLeft: "340px",
    marginTop: "-690px",
  },
  arrow: {
    width: "60px",
    height: "auto",
  },
  imageContainerRight: {
    marginTop: "-450px",
    marginLeft: "690px",
  },
};

const Fonctionnaliter = () => {
  const roles = ["parents", "étudiant", "professeur", "serveillant"];

  return (
    <div style={styles.main} className="mt-5">
      <div className="container mt-5">
        <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">

            {/* Page 1 - Admin (active) */}
            <div className="carousel-item active">
              <h4 style={styles.titre}>Fonctionnalité administrateur</h4>
              <div className="image-container" style={{ marginTop: '-50px' }}>
                <img src={cloud1} alt="cloud1" style={styles.cloud} />
                <img src={cloud2} alt="cloud2" style={styles.cloud} />
                <img src={cloud3} alt="cloud3" style={{ ...styles.cloud, ...styles.cloudMargin }} />
              </div>
              <img src={lettreImage} alt="lettre" style={styles.lettre} />
              <img src={fRemovebgPreview} alt="arrow" style={styles.arrow} />
              <div className="image-container" style={styles.imageContainerRight}>
                <img src={cloud4} alt="cloud4" style={styles.cloud} />
                <img src={cloud5} alt="cloud5" style={styles.cloud} />
                <img src={cloud6} alt="cloud6" style={{ ...styles.cloud, marginLeft: '-20px' }} />
              </div>
            </div>

            {/* Pages 2 à 5 - Autres rôles */}
            {roles.map((role, i) => (
              <div key={role} className="carousel-item">
                <h4 style={styles.titre}>Fonctionnalité {role}</h4>
                <div className="image-container" style={{ marginTop: '-40px' }}>
                  <img src={cloud1} alt="cloud1" style={styles.cloud} />
                  <img src={cloud2} alt="cloud2" style={styles.cloud} />
                  <img src={cloud3} alt="cloud3" style={{ ...styles.cloud, ...styles.cloudMargin }} />
                </div>
                <div className="image-container" style={styles.imageContainerRight}>
                  <img src={cloud4} alt="cloud4" style={styles.cloud} />
                  <img src={cloud5} alt="cloud5" style={styles.cloud} />
                  <img src={cloud6} alt="cloud6" style={{ ...styles.cloud, marginLeft: '-20px' }} />
                </div>
              </div>
            ))}
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

export default Fonctionnaliter;
