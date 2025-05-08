import React from "react";

const services = [
  { icon: "📚", title: "Programmes variés", description: "Des cours adaptés aux besoins spécifiques des élèves." },
  { icon: "✏️", title: "Suivi individualisé", description: "Un accompagnement personnalisé pour chaque élève." },
  { icon: "🖥️", title: "Outils numériques", description: "Plateforme moderne pour simplifier les apprentissages." },
  { icon: "🏫", title: "Environnement sécurisé", description: "Un cadre sûr et agréable pour étudier." },
  { icon: "✏️", title: "Cours interactifs", description: "Apprentissage interactif pour stimuler les élèves." },
  { icon: "📊", title: "Résultats garantis", description: "Suivi constant pour garantir la réussite." },
];

const NosServices = () => {
  return (
    <div className="container py-5" style={{ backgroundColor: "#f9f8ff" }}>
      {/* Fond de la section */}
      <h2 className="text-center mb-5 fw-bold">Nos Services</h2>
      <div className="row g-4">
        {services.map((service, index) => (
          <div className="col-md-4" key={index}>
            <div className="card p-4 text-center" style={styles.card}>
              <div className="mb-3 fs-1">{service.icon}</div>
              <h5 className="fw-bold">{service.title}</h5>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  
  card: {
    transition: "transform 0.3s ease",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // Couleur de fond de chaque carte
    color: "#000",
    boxShadow: "0 4px 12px rgba(167, 139, 250, 0.2)",
    border: "none",
    borderRadius: "10px", // Arrondir les bords des cartes
    padding: "20px", // Un peu de padding pour éviter que le contenu soit trop proche des bords
    minHeight: "200px", // Assurer une hauteur minimale pour éviter que les cartes soient trop petites
    margin: "0 auto", // Centrer chaque carte
  },
  
};

export default NosServices;
