import React from 'react';
import ContactForm from './contact';
import NosServices from './description';
import Fonctionnalite from './Fonctionnaliter';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      
      <main>
        <section id="services" style={styles.section}>
          <NosServices />
        </section>
        
        <div style={{...styles.divider, ...styles.sectionSpacing}} />
        
        <section id="features" style={styles.sectionDark}>
          <Fonctionnalite />
        </section>
        
        <div style={{...styles.divider, ...styles.sectionSpacing}} />
        
        <section id="contact" style={styles.section}>
          <ContactForm />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  section: {
 
    padding: '80px 5%',
    position: 'relative',
  },
  sectionDark: {

    padding: '80px 5%',
    color: '#ffffff',
    position: 'relative',
  },
  divider: {
    height: '1px',
   marginTop: '200px',

    marginLeft: '5%',
    marginBottom: '50px',
  },
  sectionSpacing: {
    margin: '0 5%',
  }
};

export default Layout;