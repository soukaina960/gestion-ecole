import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
 import { jsPDF } from "jspdf";

export default function EtudiantDetail() {
  const { id } = useParams();
  const [etudiant, setEtudiant] = useState(null);

  useEffect(() => {
    const fetchEtudiant = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/etudiants/${id}`);
        setEtudiant(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement de l'étudiant :", error);
      }
    };

    fetchEtudiant();
  }, [id]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(`Détail de l'étudiant`, 10, 10);
    doc.text(`Nom: ${etudiant.nom} ${etudiant.prenom}`, 10, 20);
    doc.text(`Email: ${etudiant.email}`, 10, 30);
    doc.text(`Matricule: ${etudiant.matricule}`, 10, 40);
    doc.text(`Classe: ${etudiant.classroom?.name || "Aucune classe"}`, 10, 50);
    doc.text(`Origine: ${etudiant.origine || "Non renseignée"}`, 10, 60);
    doc.text(`Date de naissance: ${etudiant.date_naissance}`, 10, 70);
    doc.text(`Sexe: ${etudiant.sexe === "M" ? "Masculin" : "Féminin"}`, 10, 80);
    doc.text(`Adresse: ${etudiant.adresse}`, 10, 90);

    if (etudiant.photo_profil_url) {
      doc.addImage(etudiant.photo_profil_url, "JPEG", 10, 100, 30, 30);
    }

    doc.save(`detail_etudiant_${etudiant.matricule}.pdf`);
  };

  if (!etudiant) return <div className="text-center mt-5">Chargement...</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Détail de l'étudiant</h4>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Infos texte */}
            <div className="col-md-8">
              <p><strong>Nom :</strong> {etudiant.nom} {etudiant.prenom}</p>
              <p><strong>Email :</strong> {etudiant.email}</p>
              <p><strong>Matricule :</strong> {etudiant.matricule}</p>
              <p><strong>Classe :</strong> {etudiant.classroom?.name || "Aucune classe"}</p>
              <p><strong>Origine :</strong> {etudiant.origine || "Non renseignée"}</p>
              <p><strong>Date de naissance :</strong> {etudiant.date_naissance}</p>
              <p><strong>Sexe :</strong> {etudiant.sexe === "M" ? "Masculin" : "Féminin"}</p>
              <p><strong>Adresse :</strong> {etudiant.adresse}</p>
            </div>

            {/* Photo de profil */}
            <div className="col-md-4 text-center">
              {etudiant.photo_profil_url ? (
                <img
                  src={etudiant.photo_profil_url}
                  alt="Photo de profil"
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "200px" }}
                />
              ) : (
                <p className="text-muted">Pas de photo disponible</p>
              )}
            </div>
          </div>
        </div>

        <div className="card-footer text-end">
          <button onClick={generatePDF} className="btn btn-success">
            📄 Télécharger en PDF
          </button>
        </div>
            <button
      onClick={() =>
        window.open(`http://127.0.0.1:8000/attestations/${id}/download`, "_blank")
      }
      className="btn btn-primary ms-2"
    >
      🎓 Télécharger Attestation
    </button>

      </div>
    </div>
  );
}
