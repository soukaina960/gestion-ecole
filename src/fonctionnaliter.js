import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Importer les images si elles sont dans src/assets/
import cloud1 from "../src/assets/cloud1.png";
import cloud2 from "../src/assets/cloud2.png";
import cloud3 from "../src/assets/cloud3.png";
import cloud4 from "../src/assets/cloud4.png";
import cloud5 from "../src/assets/cloud5.png";
import cloud6 from "../src/assets/cloud6.png";

const Fonctionnalité = () => {
  return (
    <div
      style={{
        background: "linear-gradient(90deg, rgb(186, 85, 236), rgb(135, 206, 250))",
        minHeight: "80vh",
        padding: "20px",
      }}
      className="mt-5"
    >
      <div className="container mt-5">
        <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">
          
          <div className="carousel-inner">
            
            {/* Page 1 - Administrateur */}
            <div className="carousel-item active">
              <h4 className="text-center text-white">Fonctionnalité administrateur</h4>
              <div className="d-flex justify-content-center mt-3">
                <img src={cloud1} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud2} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud3} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
              </div>
            </div>

            {/* Page 2 - Parents */}
            <div className="carousel-item">
              <h4 className="text-center text-white">Fonctionnalité parents</h4>
              <div className="d-flex justify-content-center mt-3">
                <img src={cloud1} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud2} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud3} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
              </div>
            </div>

            {/* Page 3 - Étudiant */}
            <div className="carousel-item">
              <h4 className="text-center text-white">Fonctionnalité étudiant</h4>
              <div className="d-flex justify-content-center mt-3">
                <img src={cloud1} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud2} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud3} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
              </div>
            </div>

            {/* Page 4 - Professeur */}
            <div className="carousel-item">
              <h4 className="text-center text-white">Fonctionnalité professeur</h4>
              <div className="d-flex justify-content-center mt-3">
                <img src={cloud1} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud2} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud3} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
              </div>
            </div>

            {/* Page 5 - Surveillant */}
            <div className="carousel-item">
              <h4 className="text-center text-white">Fonctionnalité surveillant</h4>
              <div className="d-flex justify-content-center mt-3">
                <img src={cloud1} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud2} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
                <img src={cloud3} alt="CLOUD" className="mx-2" style={{ width: '220px', height: 'auto' }} />
              </div>
            </div>

          </div>

          {/* Boutons de navigation */}
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
            <span className="visually-hidden">Précédent</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
            <span className="visually-hidden">Suivant</span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Fonctionnalité;
