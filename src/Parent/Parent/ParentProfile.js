import React, { useEffect, useState } from "react";
import axios from "axios";

const ParentProfile = () => {
  const [parent, setParent] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    profession: ''
  });

  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const parentId = localStorage.getItem('parent_id');

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/parents/${parentId}`)
      .then(response => {
        // Vu que l'API te retourne un OBJET simple
        setParent(response.data);  // directement response.data
        setLoading(false);
      })
      .catch(error => {
        setError("Erreur lors du chargement des informations.");
        setLoading(false);
      });
  }, [parentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.put(`http://127.0.0.1:8000/api/parent/update/${parentId}`, {
      ...parent,
      email: parent.email,  // email ajouté ici
      password: parent.password // password aussi
    })
      .then(response => {
        setMessage("Informations mises à jour avec succès !");
        setError('');
      })
      .catch(error => {
        setError("Erreur lors de la mise à jour.");
        setMessage('');
      });
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h2>Mon Profil</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Nom :</label>
          <input
            type="text"
            name="nom"
            value={parent.nom || ''}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Prénom :</label>
          <input
            type="text"
            name="prenom"
            value={parent.prenom || ''}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Téléphone :</label>
          <input
            type="text"
            name="telephone"
            value={parent.telephone || ''}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Adresse :</label>
          <input
            type="text"
            name="adresse"
            value={parent.adresse || ''}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Profession :</label>
          <input
            type="text"
            name="profession"
            value={parent.profession || ''}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={parent.email || ''}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={parent.mot_de_passe || ''}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Mettre à jour
        </button>
      </form>
    </div>
  );
};

export default ParentProfile;
