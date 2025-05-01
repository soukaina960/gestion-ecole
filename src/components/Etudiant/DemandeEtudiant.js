import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DemandeEtudiant() {
  const [demandes, setDemandes] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/demandes-non-traitees')
      .then(res => setDemandes(res.data))
      .catch(err => console.error(err));
  }, []);

  const traiterDemande = async (id) => {
    try {
      const res = await axios.post(`http://127.0.0.1:8000/api/traiter-demande/${id}`);
      alert("✅ Attestation générée !");
      setDemandes(prev => prev.filter(d => d.id !== id)); // retirer de la liste
      // facultatif : window.open(`http://127.0.0.1:8000/${res.data.lien}`, '_blank');
    } catch (err) {
  console.error("Erreur traitement :", err.response); // Voir les détails
  alert("Erreur lors du traitement");
}

  };

  return (
    <div className="container mt-4">
      <h3>📄 Demandes d'attestation non traitées</h3>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Matricule</th>
            <th>Classe</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {demandes.map((d) => (
            <tr key={d.id}>
              <td>{d.etudiant.nom} {d.etudiant.prenom}</td>
              <td>{d.etudiant.matricule}</td>
              <td>{d.etudiant.classroom?.name || "N/A"}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => traiterDemande(d.id)}
                >
                  Générer attestation
                </button>
              </td>
            </tr>
          ))}
          {demandes.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">Aucune demande en attente</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
