import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EvenementsParent() {
  const [enfants, setEnfants] = useState([]);
  const [selectedEnfantId, setSelectedEnfantId] = useState(null);
  const [evenements, setEvenements] = useState([]);
  const [notFound, setNotFound] = useState(false); // Pour gérer 404
    const parentId = localStorage.getItem('parent_id');

  useEffect(() => {
    const parentId = parseInt(localStorage.getItem("parent_id"));

    axios.get("http://127.0.0.1:8000/api/etudiants")
      .then((res) => {
        const enfantsFiltres = res.data.filter((e) => e.parent_id === parentId);
        setEnfants(enfantsFiltres);

        if (enfantsFiltres.length > 0) {
          setSelectedEnfantId(enfantsFiltres[0].id);
        }
      })
      .catch((err) => console.error("Erreur chargement enfants :", err));
  }, []);

  useEffect(() => {
    if (selectedEnfantId) {
      const enfant = enfants.find((e) => e.id === parseInt(selectedEnfantId));
      if (enfant) {
        const classId = enfant.classe_id;
        setNotFound(false); // Reset avant appel

        axios.get(`http://127.0.0.1:8000/api/evenements/by-parent-id/${parentId}`)
  .then((res) => {
    const eventsFiltres = res.data.filter(ev => ev.class_id === classId); // 🔧 sécurité côté front
    setEvenements(eventsFiltres);
  })

          .catch((error) => {
            if (error.response && error.response.status === 404) {
              setEvenements([]);
              setNotFound(true); // Gérer erreur 404
            } else {
              console.error("Erreur chargement événements :", error);
            }
          });
      }
    } else {
      setEvenements([]);
      setNotFound(false);
    }
  }, [selectedEnfantId, enfants]);

  return (
    <div>
      <h2>📌 Liste des événements pour vos enfants</h2>

      {/* Sélecteur enfant */}
      <select
        onChange={(e) => setSelectedEnfantId(e.target.value)}
        value={selectedEnfantId || ""}
      >
        <option value="">-- Sélectionner un enfant --</option>
        {enfants.map((enfant) => (
          <option key={enfant.id} value={enfant.id}>
            {enfant.nom} {enfant.prenom}
          </option>
        ))}
      </select>

      {/* Affichage des événements */}
      <ul className="mt-3">
        {evenements.length > 0 ? (
          evenements.map((event) => (
            <li key={event.id}>
              <strong>{event.titre}</strong> – {event.description} <br />
              📍 {event.lieu} <br />
              🗓️ {event.date_debut} à {event.date_fin}
            </li>
          ))
        ) : notFound ? (
          <p className="text-danger">❌ Aucun événement trouvé pour cet enfant.</p>
        ) : null}
      </ul>
    </div>
  );
}
