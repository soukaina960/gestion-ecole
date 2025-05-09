import React, { useEffect } from "react";
import "./footer.css";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaGithub
} from "react-icons/fa";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

import "./footer.css";
const styles = {
  footer: {
    background: "linear-gradient(90deg, rgb(186, 85, 236), rgb(135, 206, 250))",
    color: "white",
    padding: "3rem 0 1rem",
    marginTop: "100px",
    width: "100%",
    overflow: "hidden"
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
    padding: "0 2rem",
    
  },
  section: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "1rem",
    marginBottom: "1.5rem"
  },
  logo: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    cursor: "pointer"
  },
  description: {
    fontSize: "0.9rem",
    opacity: 0.9,
    lineHeight: 1.5
  },
  heading: {
    fontSize: "1.2rem",
    marginBottom: "1rem",
    position: "relative",
    paddingBottom: "0.5rem",
    cursor: "pointer",
    display: "inline-block"
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem"
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontSize: "0.95rem"
  },
  contactInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    fontSize: "0.95rem",
    opacity: 0.9
  },
  socialLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
    marginTop: "0.5rem",
    fontSize: "1.5rem",
    color: "white"
  },
  bottom: {
    gridColumn: "1 / -1",
    textAlign: "center",
    paddingTop: "1.5rem",
    marginTop: "1rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem"
  },
  legalLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
    fontSize: "0.85rem"
  }
};

import "./footer.css";


const Footer = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const socialVariants = {
    hover: {
      y: -5,
      scale: 1.1,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  return (
    <motion.footer
      className="gradient-footer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        ref={ref}
        className="footer-container"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        {/* Section Logo et description */}
        <motion.div className="footer-section" variants={itemVariants}>
          <motion.div
            className="logo"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            LOGO
          </motion.div>
          <motion.p
            className="footer-description"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Une brève description de votre entreprise ou application.
            Quelques mots sur votre valeur ajoutée.
          </motion.p>
        </motion.div>

        {/* Section Navigation */}
        <motion.div className="footer-section" variants={itemVariants}>
          <motion.h3 whileHover={{ scale: 1.05 }}>Navigation</motion.h3>
          <nav className="footer-nav">
            {["Accueil", "À propos", "Services", "Contact"].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                variants={itemVariants}
                whileHover={{ x: 5, color: "rgba(255, 255, 255, 0.9)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {item}
              </motion.a>
            ))}
          </nav>
        </motion.div>

        {/* Section Contact */}
        <motion.div className="footer-section" variants={itemVariants}>
          <motion.h3 whileHover={{ scale: 1.05 }}>Contact</motion.h3>
          <motion.div className="contact-info" variants={containerVariants}>
            {["email@exemple.com", "+123 456 7890", "Adresse, Ville"].map(
              (item, index) => (
                <motion.p key={index} variants={itemVariants}>
                  {item}
                </motion.p>
              )
            )}
          </motion.div>
        </motion.div>

        {/* Section Réseaux sociaux */}
        <motion.div className="footer-section" variants={itemVariants}>
          <motion.h3 whileHover={{ scale: 1.05 }}>Réseaux sociaux</motion.h3>
          <motion.div className="social-links" variants={containerVariants}>
            {[
              { icon: <FaFacebook />, label: "Facebook" },
              { icon: <FaTwitter />, label: "Twitter" },
              { icon: <FaInstagram />, label: "Instagram" },
              { icon: <FaLinkedin />, label: "LinkedIn" },
              { icon: <FaGithub />, label: "GitHub" }
            ].map((social) => (
              <motion.a
                key={social.label}
                href={`https://${social.label.toLowerCase()}.com`}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover="hover"
                // variants={socialVariants}
              >
                {social.icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="footer-bottom"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.p
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            &copy; {new Date().getFullYear()} Mon Application. Tous droits
            réservés.
          </motion.p>
          <motion.div className="legal-links" variants={containerVariants}>
            {[
              "Politique de confidentialité",
              "Conditions d'utilisation"
            ].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  color: "rgba(255, 255, 255, 0.9)"
                }}
              >
                {item}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;
