import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../css/style.css';
import '../css/bootstrap.min.css';
import Chatbot from '../components/ChatBot';

const Acceuil = () => {
  const aboutSectionRef = useRef(null);
  const facilitiesSectionRef = useRef(null);
  const contactSectionRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
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
        headers: { "Content-Type": "application/json" },
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

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
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
            <button className="nav-link border-0 bg-transparent" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</button>
            <button className="nav-link border-0 bg-transparent" onClick={() => scrollToSection(aboutSectionRef)}>About Us</button>
            <button className="nav-link border-0 bg-transparent" onClick={() => scrollToSection(facilitiesSectionRef)}>Classes</button>
            <button className="nav-link border-0 bg-transparent" onClick={() => scrollToSection(contactSectionRef)}>Contact Us</button>
          </div>
          <Link to="/login" className="btn btn-primary rounded-pill px-3 ms-lg-3 my-2 my-lg-0">
            Join Us <i className="fa fa-arrow-right ms-2"></i>
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
                alt=""
                style={{ height: "600px", objectFit: "cover" }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ background: "rgba(0, 0, 0, .2)" }}>
                <div className="text-center text-white px-3">
                  <h1 className="display-4 mb-3">The Best Kindergarten School</h1>
                  <p className="fs-5 mb-4">Vero elitr justo clita lorem...</p>
                  <div className="d-flex justify-content-center flex-wrap gap-2">
                    <a href="#" className="btn btn-primary rounded-pill py-2 px-4">Learn More</a>
                    <a href="#" className="btn btn-dark rounded-pill py-2 px-4">Our Classes</a>
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
                alt=""
                style={{ height: "600px", objectFit: "cover" }}
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                style={{ background: "rgba(0, 0, 0, .2)" }}>
                <div className="text-center text-white px-3">
                  <h1 className="display-4 mb-3">Make A Brighter Future</h1>
                  <p className="fs-5 mb-4">Vero elitr justo clita lorem...</p>
                  <div className="d-flex justify-content-center flex-wrap gap-2">
                    <a href="#" className="btn btn-primary rounded-pill py-2 px-4">Learn More</a>
                    <a href="#" className="btn btn-dark rounded-pill py-2 px-4">Our Classes</a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      {/* Carousel End */}

      {/* Facilities Start */}
      <div ref={aboutSectionRef} className="container-xxl py-5">
        <div className="container">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: "600px" }}>
            <h1 className="mb-3">User Roles</h1>
            <p>Découvrez les différents profils utilisateurs de notre plateforme et leurs fonctionnalités principales pour une meilleure expérience éducative.</p>
          </div>
          <div className="row g-4 text-center">
            {[
              { title: "Professeur", icon: "fa-chalkboard-teacher", color: "primary", text: "Le professeur peut noter les élèves, gérer les fichiers pédagogiques, créer des quiz et définir la durée des examens." },
              { title: "Administration", icon: "fa-user-shield", color: "success", text: "Gèrent les comptes utilisateurs, supervisent les examens et veillent au bon déroulement des sessions d’évaluation." },
              { title: "Parent", icon: "fa-user-friends", color: "warning", text: "Suit la progression de son enfant, échange avec les enseignants et consulte les bulletins." },
              { title: "Étudiant", icon: "fa-user-graduate", color: "info", text: "Accède aux cours, réalise les devoirs et suit ses résultats scolaires en temps réel." },
            ].map((role, idx) => (
              <div key={idx} className="col-lg-3 col-md-6">
                <div className={`facility-item border rounded p-3 h-100`}>
                  <div className={`facility-icon mb-3`}>
                    <i className={`fa ${role.icon} fa-3x text-${role.color}`}></i>
                  </div>
                  <div className="facility-text">
                    <h3 className={`text-${role.color} mb-3`}>{role.title}</h3>
                    <p>{role.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Facilities End */}

      {/* About Start */}
      <div ref={facilitiesSectionRef} className="container-xxl py-5">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6 col-md-12">
              <h1 className="mb-4">Découvrez Notre Mission et Nos Activités Culturelles</h1>
              <p>Notre plateforme vise à enrichir l’expérience éducative en combinant apprentissage académique et activités culturelles...</p>
            </div>
            <div className="col-lg-6 col-md-12">
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <img src="img/friends-sitting-class_1098-2687.jpg" className="img-fluid rounded-circle" style={{ width: "200px", height: "200px", objectFit: "cover" }} alt="" />
                <img src="img/intelligent-primary-students-class.jpg" className="img-fluid rounded-circle" style={{ width: "200px", height: "200px", objectFit: "cover" }} alt="" />
                <img src="img/schoolchildren-standing-classroom-hugging_23-2147663526.jpg" className="img-fluid rounded-circle" style={{ width: "200px", height: "200px", objectFit: "cover" }} alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* About End */}

      {/* Contact Start */}
      <div ref={contactSectionRef} className="container-xxl py-5">
        <div className="container">
          <div className="row g-0 bg-light rounded overflow-hidden">
            <div className="col-lg-6 col-md-12 p-5">
              <h1 className="mb-4">Contactez-nous</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input type="text" className="form-control" placeholder="Nom complet" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <input type="email" className="form-control" placeholder="Email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                  <textarea className="form-control" placeholder="Message" name="message" value={formData.message} onChange={handleChange} style={{ height: "100px" }} required></textarea>
                </div>
                <button className="btn btn-primary w-100" type="submit">Envoyer</button>
                <p className="text-center mt-2">{status}</p>
              </form>
            </div>
            <div className="col-lg-6 col-md-12">
              <img src="img/appointment.jpg" className="img-fluid h-100 w-100" style={{ objectFit: "cover" }} alt="contact" />
            </div>
          </div>
        </div>
      </div>
      {/* Contact End */}

      {/* Footer Start */}
      
<div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5 wow fadeIn" data-wow-delay="0.1s" style={{marginTop: "150px"}}> <div className="containerr py-5"> <div className="row g-5"> <div className="col-lg-3 col-md-6"> <h3 className="text-white mb-4">Get In Touch</h3> <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p> <p className="mb-2"><i className="fa fa-phone-alt me-3"></i>+012 345 67890</p> <p className="mb-2"><i className="fa fa-envelope me-3"></i>info@example.com</p> <div className="d-flex pt-2"> <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-twitter"></i></a> <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-facebook-f"></i></a> <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-youtube"></i></a> <a className="btn btn-outline-light btn-social" href=""><i className="fab fa-linkedin-in"></i></a> </div> </div> <div className="col-lg-3 col-md-6"> <h3 className="text-white mb-4">Quick Links</h3> <a className="btn btn-link text-white-50" href="">About Us</a> <a className="btn btn-link text-white-50" href="">Contact Us</a> <a className="btn btn-link text-white-50" href="">Our Services</a> <a className="btn btn-link text-white-50" href="">Privacy Policy</a> <a className="btn btn-link text-white-50" href="">Terms & Condition</a> </div> <div className="col-lg-3 col-md-6"> <h3 className="text-white mb-4">Photo Gallery</h3> <div className="row g-2 pt-2"> <div className="col-4"> <img className="img-fluid rounded bg-light p-1" src="img/classes-1.jpg" alt="" /> </div> <div className="col-4"> <img className="img-fluid rounded bg-light p-1" src="img/classes-2.jpg" alt="" /> </div> <div className="col-4"> <img className="img-fluid rounded bg-light p-1" src="img/classes-3.jpg" alt="" /> </div> <div className="col-4"> <img className="img-fluid rounded bg-light p-1" src="img/classes-4.jpg" alt="" /> </div> <div className="col-4"> <img className="img-fluid rounded bg-light p-1" src="img/classes-5.jpg" alt="" /> </div> <div className="col-4"> <img className="img-fluid rounded bg-light p-1" src="img/classes-6.jpg" alt="" /> </div> </div> </div> <div className="col-lg-3 col-md-6"> </div> </div> </div> <div className="container4"> <div className="copyright"> <div className="row"> <div className="col-md-6 text-center text-md-start mb-3 mb-md-0"> &copy; <a className="border-bottom" href="#">Scolycx</a>, All Right Reserved. </div> <div className="col-md-6 text-center text-md-end"> <div className="footer-menu"> <a href="">Home</a> <a href="">Cookies</a> <a href="">Help</a> <a href="">FQAs</a> </div> </div> </div> </div> </div> </div>
    </div>
  );
};

export default Acceuil;
