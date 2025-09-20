import React from "react";

const ContactForm = () => {
  return (
    <div style={styles.container}>
      <div style={styles.contactForm}>
        <div style={styles.formLeft}>
          <h3 style={styles.heading}>Get in touch with us</h3>
          <input type="text" placeholder="Full Name" style={styles.input} />
          <input type="email" placeholder="Email Address" style={styles.input} />
          <input type="text" placeholder="Subject" style={styles.input} />
          <textarea placeholder="Message" rows="4" style={styles.textarea}></textarea>
          <button style={styles.button}>Send Message</button>
        </div>
        <div style={styles.formRight}>
          <img src="img.png" alt="Contact" style={styles.image} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
   
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  contactForm: {
    display: "flex",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(167, 139, 250, 0.2)",
    overflow: "hidden",
    width: "800px",
  },
  formLeft: {
    flex: 1,
    padding: "30px",
  },
  heading: {
    marginBottom: "20px",
    color: "#7e5bef",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#d8b4fe",
    color: "#4c1d95",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    transition: "background-color 0.3s",
    cursor: "pointer",
  },
  formRight: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  image: {
    width: "400px",
  },
};

export default ContactForm;