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
  imageContainer1: {
    marginTop: "-50px",
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
  imageContainer2: {
    marginTop: "-490px",
    marginLeft: "690px",
  },
  imageContainerDefault: {
    marginTop: "-450px",
    marginLeft: "690px",
  },
  navIcon: {
    marginLeft: "50%",
  },
};

const App = () => {
  return (
    <div style={styles.main} className="mt-5">
      <div className="container mt-5">
        <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            {/* Page 1: Admin */}
            <div className="carousel-item active" id="active">
              <h4 style={styles.titre} className="lettre">Fonctionnalité administrateur</h4>
              <div className="lettre">
                <div className="image-container" style={styles.imageContainer1}>
                  <img src={cloud1} alt="CLOUD" className="image" style={styles.cloud} />
                  <img src={cloud2} alt="CLOUD" className="image" style={styles.cloud} />
                  <img src={cloud3} alt="CLOUD" className="image" style={{ ...styles.cloud, ...styles.cloudMargin }} />
                </div>
              </div>
              <img src={lettreImage} alt="" style={styles.lettre} className="lettre" />
              <img src={fRemovebgPreview} alt="" className="arrow" style={styles.arrow} />
              <div className="image-container" style={styles.imageContainer2}>
                <div className="lettre">
                  <img src={cloud4} alt="CLOUD" className="image" style={styles.cloud} />
                  <img src={cloud5} alt="CLOUD" className="image" style={styles.cloud} />
                  <img src={cloud6} alt="CLOUD" className="image" style={{ ...styles.cloud, marginLeft: "-20px" }} />
                </div>
              </div>
            </div>

            {/* Pages 2 à 5 */}
            {["parents", "étudiant", "professeur", "serveillant"].map((role, i) => (
              <div key={role} className="carousel-item" id={`page${i + 2}`}>
                <h4 style={styles.titre}>Fonctionnalité {role}</h4>
                <div className="image-container" style={{ marginTop: '-40px' }}>
                  <img src={cloud1} alt="CLOUD" className="image" style={styles.cloud} />
                  <img src={cloud2} alt="CLOUD" className="image" style={styles.cloud} />
                  <img src={cloud3} alt="CLOUD" className="image" style={{ ...styles.cloud, ...styles.cloudMargin }} />
                </div>
                <div className="image-container" style={styles.imageContainerDefault}>
                  <img src={cloud4} alt="CLOUD" className="image" style={styles.cloud} />
                  <img src={cloud5} alt="CLOUD" className="image" style={styles.cloud} />
                  <img src={cloud6} alt="CLOUD" className="image" style={{ ...styles.cloud, marginLeft: "-20px" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" style={styles.navIcon}></span>
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
