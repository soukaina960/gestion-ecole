import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../css/style.css';
import '../css/bootstrap.min.css';
import { Nav } from "react-bootstrap";


import { Bot, ArrowUp } from 'lucide-react';
import '../assets/styles.css';
const Acceuil = () => {
  // Références pour le scroll vers les sections
  const aboutSectionRef = useRef(null);
  const facilitiesSectionRef = useRef(null);

  const [showChatbot, setShowChatbot] = useState(false);
  // Fonction pour scroller vers une section
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const contactSectionRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Envoi en cours...");

    try {
      const response = await fetch("https://formspree.io/f/xqaejgga", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Email envoyé avec succès !");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Erreur lors de l'envoi.");
      }
    } catch (error) {
      setStatus("Erreur lors de l'envoi.");
      console.error(error);
    }
  };
  return (
    <div className="container-xxl bg-white p-0">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top px-3 px-lg-5 py-3">
        <Link to="/" className="navbar-brand">
          <h1 className="m-0 text-primary"><i className="fa fa-book-reader me-2"></i>Skolyx</h1>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarCollapse">
          <div className="navbar-nav mx-auto text-center">
            <button className="nav-link border-0 bg-transparent" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Accueil</button>
            <button className="nav-link border-0 bg-transparent" onClick={() => scrollToSection(aboutSectionRef)}>À Propos</button>
            <button className="nav-link border-0 bg-transparent" onClick={() => scrollToSection(facilitiesSectionRef)}>Classes</button>
            <button className="nav-link border-0 bg-transparent" onClick={() => scrollToSection(contactSectionRef)}>Contact</button>
          </div>
          <Link to="/login" className="btn btn-primary rounded-pill px-3 ms-lg-3 my-2 my-lg-0">
            Rejoignez-nous <i className="fa fa-arrow-right ms-2"></i>
          </Link>
        </div>
      </nav>
      {/* Navbar End */}

      {/* Carousel Start */}
      <div className="container-fluid p-0 mb-5">
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          className="header-carousel"
        >
          <SwiperSlide>
            <div className="position-relative">
              <img
                className="img-fluid w-100"
                src="img/young-childrens-coloring.jpg"
                alt="Enfants en train de colorier"
                style={{ height: "600px", objectFit: "cover" }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ background: "rgba(0, 0, 0, .2)" }}>
                <div className="text-center text-white px-3">
                  <h1 className="display-4 mb-3">La Meilleure École Maternelle</h1>
                  <p className="fs-5 mb-4">Apprentissage et développement dans un environnement bienveillant</p>
                  <div className="d-flex justify-content-center flex-wrap gap-2">
                    <a href="#" className="btn btn-primary rounded-pill py-2 px-4">En savoir plus</a>
                    <a href="#" className="btn btn-dark rounded-pill py-2 px-4">Nos Classes</a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="position-relative">
              <img
                className="img-fluid w-100"
                src="img/kids-being-happy-first-day-school.jpg"
                alt="Enfants heureux lors de leur premier jour d'école"
                style={{ height: "600px", objectFit: "cover" }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ background: "rgba(0, 0, 0, .2)" }}>
                <div className="text-center text-white px-3">
                  <h1 className="display-4 mb-3">Construisez un Avenir Meilleur</h1>
                  <p className="fs-5 mb-4">Éducation de qualité pour les leaders de demain</p>
                  <div className="d-flex justify-content-center flex-wrap gap-2">
                    <a href="#" className="btn btn-primary rounded-pill py-2 px-4">En savoir plus</a>
                    <a href="#" className="btn btn-dark rounded-pill py-2 px-4">Nos Classes</a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      {/* Carousel End */}
              
      {/* Facilities Start */}
      <div ref={aboutSectionRef} className="container-xxl py-5" style={{marginTop: "200px"}}>
        <div className="container">
          <div className="row g-5 align-items-center">
            {/* User Roles Start */}
            <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{maxWidth: "600px"}}>
              <h1 className="mb-3">Rôles des Utilisateurs</h1>
              <p>Découvrez les différents profils utilisateurs de notre plateforme et leurs fonctionnalités principales pour une meilleure expérience éducative.</p>
            </div>
            <div className="row g-4">
              {/* Professeur */}
              <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
                <div className="facility-item">
                  <div className="facility-icon bg-primary">
                    <span className="bg-primary"></span>
                    <i className="fa fa-chalkboard-teacher fa-3x text-primary"></i>
                    <span className="bg-primary"></span>
                  </div>
                  <div className="facility-text bg-primary">
                    <h3 className="text-primary mb-3">Professeur</h3>
                    <p className="mb-0">Le professeur peut noter les élèves, gérer les fichiers pédagogiques, créer des quiz et définir la durée des examens.</p>
                  </div>
                </div>
              </div>

              {/* Administrateur & Surveillant */}
              <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
                <div className="facility-item">
                  <div className="facility-icon bg-success">
                    <span className="bg-success"></span>
                    <i className="fa fa-user-shield fa-3x text-success"></i>
                    <span className="bg-success"></span>
                  </div>
                  <div className="facility-text bg-success">
                    <h3 className="text-success mb-3">Administration</h3>
                    <p className="mb-0">Gèrent les comptes utilisateurs, supervisent les examens et veillent au bon déroulement des sessions d'évaluation.</p>
                  </div>
                </div>
              </div>

              {/* Parent */}
              <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
                <div className="facility-item">
                  <div className="facility-icon bg-warning">
                    <span className="bg-warning"></span>
                    <i className="fa fa-user-friends fa-3x text-warning"></i>
                    <span className="bg-warning"></span>
                  </div>
                  <div className="facility-text bg-warning">
                    <h3 className="text-warning mb-3">Parent</h3>
                    <p className="mb-0">Suit la progression de son enfant, échange avec les enseignants et consulte les bulletins.</p>
                  </div>
                </div>
              </div>

              {/* Étudiant */}
              <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
                <div className="facility-item">
                  <div className="facility-icon bg-info">
                    <span className="bg-info"></span>
                    <i className="fa fa-user-graduate fa-3x text-info"></i>
                    <span className="bg-info"></span>
                  </div>
                  <div className="facility-text bg-info">
                    <h3 className="text-info mb-3">Étudiant</h3>
                    <p className="mb-0">Accède aux cours, réalise les devoirs et suit ses résultats scolaires en temps réel.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Facilities End */}

      {/* About Start */}
      <div ref={facilitiesSectionRef} className="container-xxl py-5" style={{marginTop: "150px"}}>
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
              <h1 className="mb-4">Découvrez Notre Mission et Nos Activités Culturelles</h1>
              <p>
                Notre plateforme vise à enrichir l'expérience éducative en combinant apprentissage académique et activités culturelles. 
                Nous croyons que l'éducation va au-delà des salles de classe, et que la culture joue un rôle essentiel dans le développement personnel.
              </p>
              <p className="mb-4">
                Grâce à des événements, des ateliers interactifs et des projets collaboratifs, nous encourageons la curiosité, la créativité et 
                l'ouverture d'esprit chez les apprenants. Rejoignez-nous pour construire ensemble un environnement d'apprentissage stimulant, 
                moderne et humain.
              </p>
            </div>
            <div className="col-lg-6 about-img wow fadeInUp" data-wow-delay="0.5s">
              <div className="row">
                <div className="col-12 text-center">
                  <img className="img-fluid w-70 h-20 rounded-circle bg-light p-3" src="img/friends-sitting-class_1098-2687.jpg" alt="Amis assis en classe" />
                </div>
                <div className="col-6 text-start" style={{marginTop: "-150px"}}>
                  <img
                    className="img-fluid rounded-circle bg-light p-3"
                    style={{ width: "300px", height: "300px", objectFit: "cover" }}
                    src="img/intelligent-primary-students-class.jpg"
                    alt="Élèves du primaire en classe"
                  />
                </div>
                <div className="col-6 text-end" style={{marginTop: "-150px"}}>
                  <img className="img-fluid w-100 rounded-circle bg-light p-3"   style={{ width: "300px", height: "300px", objectFit: "cover" }} src="img/schoolchildren-standing-classroom-hugging_23-2147663526.jpg" alt="Écoliers debout dans une salle de classe" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

      {/* Call To Action Start */}
      <div className="container-xxl py-5" style={{marginTop: "150px"}}>
        <div className="container px-0">
          <div className="bg-light rounded-3 overflow-hidden wow fadeIn" data-wow-delay="0.1s">
            <div className="position-relative" style={{paddingTop: "56.25%" /* 16:9 ratio */}}>
              {/* Vidéo */}
              <video 
                id="customVideoPlayer"
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{objectFit: "cover"}}
                loop
                playsInline
                poster="img/image.png"
              >
                <source src="img/WhatsApp Video 2025-05-18 um 20.20.04_136f2801.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la vidéo.
              </video>

              {/* Bouton de contrôle personnalisé */}
              <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-center p-4">
                <button 
                  id="videoControlBtn"
                  className="btn btn-primary btn-lg rounded-pill px-4 py-3"
                  style={{zIndex: 10}}
                  onClick={() => {
                    const video = document.getElementById('customVideoPlayer');
                    const btn = document.getElementById('videoControlBtn');
                    if (video.paused) {
                      video.play();
                      btn.innerHTML = '<i className="fas fa-pause me-2"></i>Pause';
                    } else {
                      video.pause();
                      btn.innerHTML = '<i className="fas fa-play me-2"></i>Lecture';
                    }
                  }}
                >
                  <i className="fas fa-play me-2"></i>Lecture
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Call To Action End */}

      {/* Appointment Start */}
      <div ref={contactSectionRef} className="container-xxl py-5" style={{ marginTop: "150px" }}>
        <div className="container">
          <div className="bg-light rounded">
            <div className="row g-0">
              <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                <div className="h-100 d-flex flex-column justify-content-center p-5">
                  <h1 className="mb-4">Contactez-nous</h1>
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control border-0"
                            id="name"
                            name="name"
                            placeholder="Votre nom"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="name">Nom complet</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="email"
                            className="form-control border-0"
                            id="email"
                            name="email"
                            placeholder="Votre email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                          <label htmlFor="email">Email</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="form-floating">
                          <textarea
                            className="form-control border-0"
                            placeholder="Votre message"
                            id="message"
                            name="message"
                            style={{ height: "100px" }}
                            value={formData.message}
                            onChange={handleChange}
                            required
                          ></textarea>
                          <label htmlFor="message">Message</label>
                        </div>
                      </div>

                      <div className="col-12">
                        <button className="btn btn-primary w-100 py-3" type="submit">
                          Envoyer
                        </button>
                      </div>
                      <div className="col-12">
                        <p className="text-center">{status}</p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s" style={{ minHeight: "400px" }}>
                <div className="position-relative h-100">
                  <img
                    className="position-absolute w-100 h-100 rounded"
                    src="img/appointment.jpg"
                    style={{ objectFit: "cover" }}
                    alt="contact"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Appointment End */}

      {/* Team Start */}
      <div className="container-xxl py-5" style={{marginTop: "150px" ,marginBottom: "200px"}}>
        <div className="container">
          <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{maxWidth: "600px"}}>
            <h1 className="mb-3">Nos Enseignants Populaires</h1>
            <p>Découvrez notre équipe d'enseignants dévoués qui accompagnent vos enfants dans leur parcours éducatif avec passion et expertise.</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
              <div className="team-item position-relative">
                <img className="img-fluid rounded-circle w-75" src="img/WhatsApp Image 2025-05-22 à 23.48.59_e7ad31b7.jpg" alt="Soukaina ESSABIRI" />
                <div className="team-text text-center">
                  <h3 className="text-center">Soukaina ESSABIRI</h3>
                  <p>Spécialité</p>
                  <div className="d-flex align-items-center">
                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-facebook-f"></i></a>
                    <a className="btn btn-square btn-primary  mx-1" href=""><i className="fab fa-twitter"></i></a>
                    <a className="btn btn-square btn-primary  mx-1" href=""><i className="fab fa-instagram"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
              <div className="team-item position-relative">
                <img className="img-fluid rounded-circle w-75" src="img/WhatsApp Image 2025-05-22 à 23.44.13_083b0bd5.jpg" alt="Hajar MOUTAKID" />
                <div className="team-text text-center">
                  <h3  className="text-center">Hajar MOUTAKID</h3>
                  <p>Spécialité</p>
                  <div className="d-flex align-items-center">
                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-facebook-f"></i></a>
                    <a className="btn btn-square btn-primary  mx-1" href=""><i className="fab fa-twitter"></i></a>
                    <a className="btn btn-square btn-primary  mx-1" href=""><i className="fab fa-instagram"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
              <div className="team-item position-relative">
                <img className="img-fluid rounded-circle w-75" src="img/team-3.jpg" alt="Enseignant" />
                <div className="team-text">
                  <h3 className="text-center">Nom Complet</h3>
                  <p>Spécialité</p>
                  <div className="d-flex align-items-center">
                    <a className="btn btn-square btn-primary mx-1" href=""><i className="fab fa-facebook-f"></i></a>
                    <a className="btn btn-square btn-primary  mx-1" href=""><i className="fab fa-twitter"></i></a>
                    <a className="btn btn-square btn-primary  mx-1" href=""><i className="fab fa-instagram"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Team End */}

      {/* Footer Start */}
      <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s" style={{marginTop: "150px"}}>
        <div className="containerr py-5">
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <h3 className="text-white mb-4">Contactez-nous</h3>
              <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>123 Rue, Paris, France</p>
              <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+012 345 67890</p>
              <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@example.com</p>
              <div className="d-flex pt-2">
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-twitter"></i></a>
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-facebook-f"></i></a>
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-youtube"></i></a>
                <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h3 className="text-white mb-4">Liens Rapides</h3>
              <a className="btn btn-link text-white-50" href="">À Propos</a>
              <a className="btn btn-link text-white-50" href="">Contact</a>
              <a className="btn btn-link text-white-50" href="">Nos Services</a>
              <a className="btn btn-link text-white-50" href="">Politique de Confidentialité</a>
              <a className="btn btn-link text-white-50" href="">Conditions d'Utilisation</a>
            </div>
            <div className="col-lg-3 col-md-6">
              <h3 className="text-white mb-4">Galerie Photo</h3>
              <div className="row g-2 pt-2">
                <div className="col-4">
                  <img className="img-fluid rounded bg-light p-1" src="img/classes-1.jpg" alt="Classe 1" />
                </div>
                <div className="col-4">
                  <img className="img-fluid rounded bg-light p-1" src="img/classes-2.jpg" alt="Classe 2" />
                </div>
                <div className="col-4">
                  <img className="img-fluid rounded bg-light p-1" src="img/classes-3.jpg" alt="Classe 3" />
                </div>
                <div className="col-4">
                  <img className="img-fluid rounded bg-light p-1" src="img/classes-4.jpg" alt="Classe 4" />
                </div>
                <div className="col-4">
                  <img className="img-fluid rounded bg-light p-1" src="img/classes-5.jpg" alt="Classe 5" />
                </div>
                <div className="col-4">
                  <img className="img-fluid rounded bg-light p-1" src="img/classes-6.jpg" alt="Classe 6" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <h3 className="text-white mb-4">Newsletter</h3>
              <p>Abonnez-vous à notre newsletter pour recevoir les dernières actualités.</p>
              <div className="position-relative mx-auto" style={{maxWidth: "400px"}}>
                <input className="form-control bg-transparent w-100 py-3 ps-4 pe-5" type="text" placeholder="Votre email" />
                <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">S'inscrire</button>
              </div>
            </div>
          </div>
        </div>
        <div className="container4">
          <div className="copyright">
            <div className="row">
              <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                &copy; <a className="border-bottom" href="#">Skolyx</a>, Tous droits réservés.
              </div>
              <div className="col-md-6 text-center text-md-end">
                <div className="footer-menu">
                  <a href="">Accueil</a>
                  <a href="">Cookies</a>
                  <a href="">Aide</a>
                  <a href="">FAQ</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}

      {/* Back to Top */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top"><i className="bi bi-arrow-up"></i></a>
    </div>
  );
}

export default Acceuil;