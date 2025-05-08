import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import '../css/style.css';
import '../css/bootstrap.min.css';


const Acceuil = () => {
    return (
        <div className="container-xxl bg-white p-0">

            <nav className="navbar navbar-expand-lg bg-white navbar-light sticky-top px-4 px-lg-5 py-lg-0">
                <a href="index.html" className="navbar-brand">
                <h1 className="m-0 text-primary"><i className="fa fa-book-reader me-3"></i>Skolyx</h1>
                </a>
                
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav mx-auto">
                        <a href="index.html" className="nav-item nav-link active">Home</a>
                        <a href="about.html" className="nav-item nav-link">About Us</a>
                        <a href="classes.html" className="nav-item nav-link">Classes</a>
                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                            <div className="dropdown-menu rounded-0 rounded-bottom border-0 shadow-sm m-0">
                                <a href="facility.html" className="dropdown-item">School Facilities</a>
                                <a href="team.html" className="dropdown-item">Popular Teachers</a>
                                <a href="call-to-action.html" className="dropdown-item">Become A Teachers</a>
                                <a href="appointment.html" className="dropdown-item">Make Appointment</a>
                                <a href="testimonial.html" className="dropdown-item">Testimonial</a>
                                <a href="404.html" className="dropdown-item">404 Error</a>
                            </div>
                        </div>
                        <a href="contact.html" className="nav-item nav-link">Contact Us</a>
                    </div>
                    <Link to="/login" className="btn btn-primary rounded-pill px-3 d-none d-lg-block">
                        Join Us <i className="fa fa-arrow-right ms-3"></i>
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
                src="img/carousel-1.jpg" 
                alt="" 
                style={{ height: "600px", objectFit: "cover" }} 
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" 
                   style={{ background: "rgba(0, 0, 0, .2)" }}>
                <div className="container">
                  <div className="row justify-content-start">

                    <div className="col-10 col-lg-8">
                      <h1 className="display-2 text-white mb-4">The Best Kindergarten School</h1>
                      <p className="fs-5 fw-medium text-white mb-4 pb-2">Vero elitr justo clita lorem...</p>
                      <div className="d-flex">
                        <a href="" className="btn btn-primary rounded-pill py-sm-3 px-sm-5 me-3">Learn More</a>
                        <a href="" className="btn btn-dark rounded-pill py-sm-3 px-sm-5">Our Classes</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="position-relative">
              <img 
                className="img-fluid w-100" 
                src="img/carousel-2.jpg" 
                alt="" 
                style={{ height: "600px", objectFit: "cover" }} 
              />
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center" 
                   style={{ background: "rgba(0, 0, 0, .2)" }}>
                <div className="container">
                  <div className="row justify-content-start">
                    <div className="col-10 col-lg-8">
                      <h1 className="display-2 text-white mb-4">Make A Brighter Future</h1>
                      <p className="fs-5 fw-medium text-white mb-4 pb-2">Vero elitr justo clita lorem...</p>
                      <div className="d-flex">
                        <a href="" className="btn btn-primary rounded-pill py-sm-3 px-sm-5 me-3">Learn More</a>
                        <a href="" className="btn btn-dark rounded-pill py-sm-3 px-sm-5">Our Classes</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
            {/* Carousel End */}

            {/* Facilities Start */}
            <div className="container-xxl py-5" style={{marginTop: "150px"}}>
                <div className="container">
                    <div className="text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s" style={{maxWidth: "600px"}}>
                        <h1 className="mb-3">School Facilities</h1>
                        <p>Eirmod sed ipsum dolor sit rebum labore magna erat. Tempor ut dolore lorem kasd vero ipsum sit eirmod sit. Ipsum diam justo sed rebum vero dolor duo.</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="facility-item">
                                <div className="facility-icon bg-primary">
                                    <span className="bg-primary"></span>
                                    <i className="fa fa-bus-alt fa-3x text-primary"></i>
                                    <span className="bg-primary"></span>
                                </div>
                                <div className="facility-text bg-primary">
                                    <h3 className="text-primary mb-3">School Bus</h3>
                                    <p className="mb-0">Eirmod sed ipsum dolor sit rebum magna erat lorem kasd vero ipsum sit</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.3s">
                            <div className="facility-item">
                                <div className="facility-icon bg-success">
                                    <span className="bg-success"></span>
                                    <i className="fa fa-futbol fa-3x text-success"></i>
                                    <span className="bg-success"></span>
                                </div>
                                <div className="facility-text bg-success">
                                    <h3 className="text-success mb-3">Playground</h3>
                                    <p className="mb-0">Eirmod sed ipsum dolor sit rebum magna erat lorem kasd vero ipsum sit</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.5s">
                            <div className="facility-item">
                                <div className="facility-icon bg-warning">
                                    <span className="bg-warning"></span>
                                    <i className="fa fa-home fa-3x text-warning"></i>
                                    <span className="bg-warning"></span>
                                </div>
                                <div className="facility-text bg-warning">
                                    <h3 className="text-warning mb-3">Healthy Canteen</h3>
                                    <p className="mb-0">Eirmod sed ipsum dolor sit rebum magna erat lorem kasd vero ipsum sit</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-sm-6 wow fadeInUp" data-wow-delay="0.7s">
                            <div className="facility-item">
                                <div className="facility-icon bg-info">
                                    <span className="bg-info"></span>
                                    <i className="fa fa-chalkboard-teacher fa-3x text-info"></i>
                                    <span className="bg-info"></span>
                                </div>
                                <div className="facility-text bg-info">
                                    <h3 className="text-info mb-3">Positive Learning</h3>
                                    <p className="mb-0">Eirmod sed ipsum dolor sit rebum magna erat lorem kasd vero ipsum sit</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Facilities End */}

            {/* About Start */}
            <div className="container-xxl py-5" style={{marginTop: "150px"}}>
                <div className="container">
                    <div className="row g-5 align-items-center">
                        <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
                            <h1 className="mb-4">Learn More About Our Work And Our Cultural Activities</h1>
                            <p>Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet</p>
                            <p className="mb-4">Stet no et lorem dolor et diam, amet duo ut dolore vero eos. No stet est diam rebum amet diam ipsum. Clita clita labore, dolor duo nonumy clita sit at, sed sit sanctus dolor eos, ipsum labore duo duo sit no sea diam. Et dolor et kasd ea. Eirmod diam at dolor est vero nonumy magna.</p>
                            <div className="row g-4 align-items-center">
                                <div className="col-sm-6">
                                    <a className="btn btn-primary rounded-pill py-3 px-5" href="">Read More</a>
                                </div>
                                <div className="col-sm-6">
                                    <div className="d-flex align-items-center">
                                        <img className="rounded-circle flex-shrink-0" src="img/user.jpg" alt="" style={{width: "45px", height: "45px"}} />
                                        <div className="ms-3">
                                            <h6 className="text-primary mb-1">Jhon Doe</h6>
                                            <small>CEO & Founder</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 about-img wow fadeInUp" data-wow-delay="0.5s">
                            <div className="row">
                                <div className="col-12 text-center">
                                    <img className="img-fluid w-75 rounded-circle bg-light p-3" src="img/about-1.jpg" alt="" />
                                </div>
                                <div className="col-6 text-start" style={{marginTop: "-150px"}}>
                                    <img className="img-fluid w-100 rounded-circle bg-light p-3" src="img/about-2.jpg" alt="" />
                                </div>
                                <div className="col-6 text-end" style={{marginTop: "-150px"}}>
                                    <img className="img-fluid w-100 rounded-circle bg-light p-3" src="img/about-3.jpg" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* About End */}

            {/* Call To Action Start */}
            <div className="container-xxl py-5" style={{marginTop: "150px"}}>
                <div className="container">
                    <div className="bg-light rounded">
                        <div className="row g-0">
                            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s" style={{minHeight: "400px"}}>
                                <div className="position-relative h-100">
                                    <img className="position-absolute w-100 h-100 rounded" src="img/call-to-action.jpg" style={{objectFit: "cover"}} alt="" />
                                </div>
                            </div>
                            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s">
                                <div className="h-100 d-flex flex-column justify-content-center p-5">
                                    <h1 className="mb-4">Become A Teacher</h1>
                                    <p className="mb-4">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos.
                                        Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet
                                    </p>
                                    <a className="btn btn-primary py-3 px-5" href="">Get Started Now<i className="fa fa-arrow-right ms-2"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Call To Action End */}

            {/* Appointment Start */}
            <div className="container-xxl py-5" style={{marginTop: "150px"}}>
                <div className="container">
                    <div className="bg-light rounded">
                        <div className="row g-0">
                            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.1s">
                                <div className="h-100 d-flex flex-column justify-content-center p-5">
                                    <h1 className="mb-4">Make Appointment</h1>
                                    <form>
                                        <div className="row g-3">
                                            <div className="col-sm-6">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control border-0" id="gname" placeholder="Gurdian Name" />
                                                    <label htmlFor="gname">Gurdian Name</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-floating">
                                                    <input type="email" className="form-control border-0" id="gmail" placeholder="Gurdian Email" />
                                                    <label htmlFor="gmail">Gurdian Email</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control border-0" id="cname" placeholder="Child Name" />
                                                    <label htmlFor="cname">Child Name</label>
                                                </div>
                                            </div>
                                            <div className="col-sm-6">
                                                <div className="form-floating">
                                                    <input type="text" className="form-control border-0" id="cage" placeholder="Child Age" />
                                                    <label htmlFor="cage">Child Age</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <div className="form-floating">
                                                    <textarea className="form-control border-0" placeholder="Leave a message here" id="message" style={{height: "100px"}}></textarea>
                                                    <label htmlFor="message">Message</label>
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <button className="btn btn-primary w-100 py-3" type="submit">Submit</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="col-lg-6 wow fadeIn" data-wow-delay="0.5s" style={{minHeight: "400px"}}>
                                <div className="position-relative h-100">
                                    <img className="position-absolute w-100 h-100 rounded" src="img/appointment.jpg" style={{objectFit: "cover"}} alt="" />
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
                        <h1 className="mb-3">Popular Teachers</h1>
                        <p>Eirmod sed ipsum dolor sit rebum labore magna erat. Tempor ut dolore lorem kasd vero ipsum sit
                            eirmod sit. Ipsum diam justo sed rebum vero dolor duo.</p>
                    </div>
                    <div className="row g-4">
                        <div className="col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                            <div className="team-item position-relative">
                                <img className="img-fluid rounded-circle w-75" src="img/team-1.jpg" alt="" />
                                <div className="team-text">
                                    <h3>Full Name</h3>
                                    <p>Designation</p>
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
                                <img className="img-fluid rounded-circle w-75" src="img/team-2.jpg" alt="" />
                                <div className="team-text">
                                    <h3>Full Name</h3>
                                    <p>Designation</p>
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
                                <img className="img-fluid rounded-circle w-75" src="img/team-3.jpg" alt="" />
                                <div className="team-text">
                                    <h3>Full Name</h3>
                                    <p>Designation</p>
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
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-lg-3 col-md-6">
                            <h3 className="text-white mb-4">Get In Touch</h3>
                            <p className="mb-2"><i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p>
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
                            <h3 className="text-white mb-4">Quick Links</h3>
                            <a className="btn btn-link text-white-50" href="">About Us</a>
                            <a className="btn btn-link text-white-50" href="">Contact Us</a>
                            <a className="btn btn-link text-white-50" href="">Our Services</a>
                            <a className="btn btn-link text-white-50" href="">Privacy Policy</a>
                            <a className="btn btn-link text-white-50" href="">Terms & Condition</a>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <h3 className="text-white mb-4">Photo Gallery</h3>
                            <div className="row g-2 pt-2">
                                <div className="col-4">
                                    <img className="img-fluid rounded bg-light p-1" src="img/classes-1.jpg" alt="" />
                                </div>
                                <div className="col-4">
                                    <img className="img-fluid rounded bg-light p-1" src="img/classes-2.jpg" alt="" />
                                </div>
                                <div className="col-4">
                                    <img className="img-fluid rounded bg-light p-1" src="img/classes-3.jpg" alt="" />
                                </div>
                                <div className="col-4">
                                    <img className="img-fluid rounded bg-light p-1" src="img/classes-4.jpg" alt="" />
                                </div>
                                <div className="col-4">
                                    <img className="img-fluid rounded bg-light p-1" src="img/classes-5.jpg" alt="" />
                                </div>
                                <div className="col-4">
                                    <img className="img-fluid rounded bg-light p-1" src="img/classes-6.jpg" alt="" />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <h3 className="text-white mb-4">Newsletter</h3>
                            <p>Dolor amet sit justo amet elitr clita ipsum elitr est.</p>
                            <div className="position-relative mx-auto" style={{maxWidth: "400px"}}>
                                <input className="form-control bg-transparent w-100 py-3 ps-4 pe-5" type="text" placeholder="Your email" />
                                <button type="button" className="btn btn-primary py-2 position-absolute top-0 end-0 mt-2 me-2">SignUp</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="copyright">
                        <div className="row">
                            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                                &copy; <a className="border-bottom" href="#">Your Site Name</a>, All Right Reserved.
                            </div>
                            <div className="col-md-6 text-center text-md-end">
                                <div className="footer-menu">
                                    <a href="">Home</a>
                                    <a href="">Cookies</a>
                                    <a href="">Help</a>
                                    <a href="">FQAs</a>
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