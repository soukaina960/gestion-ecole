import React from 'react';
import ContactForm from './contact';
import NosServices from './description';
import Fonctionnalite from './Fonctionnaliter';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="section" style={styles.section}>
        <NosServices />
      </div>
      <div className="section" style={styles.section}>
        <Fonctionnalite />
      </div>
      <div className="section" style={styles.section}>
        <ContactForm />
      </div>
      <Footer />
    </>
  );
};

const styles = {
  section: {
    backgroundColor: "#f9f8ff", // Couleur unifiée pour le fond de chaque section
    paddingTop: "50px", // Espacement supérieur pour chaque section
    paddingBottom: "50px", // Espacement inférieur pour chaque section
  },
};

export default Layout;
