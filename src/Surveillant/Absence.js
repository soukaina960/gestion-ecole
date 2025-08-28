import React, { useState, useEffect } from "react";
import axios from "axios";
import './AbsenceForm.css'; // Import du fichier CSS

const Absence = () => {
  const [professeurs, setProfesseurs] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedProfesseurId, setSelectedProfesseurId] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedEtudiantId, setSelectedEtudiantId] = useState('');
  const [motif, setMotif] = useState('');
  const [isJustifiee, setIsJustifiee] = useState(false);
  const [matieres, setMatieres] = useState([]);
  const [selectedMatiereId, setSelectedMatiereId] = useState('');

  const surveillantId = localStorage.getItem('surveillant_id'); // Récupérer l'ID du surveillant depuis le localStorage
console.log("Surveillant ID:", surveillantId); // Vérification de l'ID du surveillant
  useEffect(() => {
    if (selectedClassId && selectedProfesseurId) {
      axios.get(`http://localhost:8000/api/matieres-par-prof-classe`, {
        params: {
          professeur_id: selectedProfesseurId,
          classe_id: selectedClassId,
        }
      }).then(res => {
        setMatieres(res.data);
      }).catch(err => {
        console.error("Erreur lors du chargement des matières:", err);
      });
    }
  }, [selectedClassId, selectedProfesseurId]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/classrooms")
      .then((response) => {
        setClassrooms(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des classes:", error);
      });

    axios.get("http://localhost:8000/api/professeurs")
      .then((response) => {
        setProfesseurs(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des professeurs:", error);
      });

    if (selectedClassId) {
      axios.get(`http://127.0.0.1:8000/api/classrooms/${selectedClassId}/students`)
        .then(res => setEtudiants(res.data));
    }
  }, [selectedClassId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = new Date(selectedDate).toISOString().slice(0, 10);

    const dataToSend = {
      date: formattedDate,
      professeur_id: selectedProfesseurId,
      matiere_id: selectedMatiereId,
      class_id: selectedClassId,
      etudiant_id: selectedEtudiantId,
      motif: motif,
      justifiee: isJustifiee ? "oui" : "non",
      surveillant_id: surveillantId // Ajout de l'ID du surveillant
    };

    try {
      const response = await axios.post('http://localhost:8000/api/absences', dataToSend);
      setSelectedEtudiantId('');
      setSelectedProfesseurId('');
      setSelectedClassId('');
      setSelectedDate('');
      setMotif('');
      setIsJustifiee(false);
    } catch (error) {
      console.error('Erreur lors de l\'envoi des absences:', error.response ? error.response.data : error);
    }
  };

  return (
    <div className="absence-container">
      <h2>Enregistrer une Absence</h2>
      <form onSubmit={handleSubmit} className="absence-form">
        <div>
          <label htmlFor="class_id">Classe:</label>
          <select
            id="class_id"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            required
          >
            <option value="">Choisir une classe</option>
            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="etudiant_id">Étudiant:</label>
          <select
            id="etudiant_id"
            value={selectedEtudiantId}
            onChange={(e) => setSelectedEtudiantId(e.target.value)}
            required
          >
            <option value="">Choisir un étudiant</option>
            {etudiants.map((etudiant) => (
              <option key={etudiant.id} value={etudiant.id}>
                {etudiant.nom} {etudiant.prenom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="professeur_id">Professeur:</label>
          <select
            id="professeur_id"
            value={selectedProfesseurId}
            onChange={(e) => setSelectedProfesseurId(e.target.value)}
            required
          >
            <option value="">Choisir un professeur</option>
            {professeurs.map((professeur) => (
              <option key={professeur.id} value={professeur.id}>
                {professeur.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="matiere_id">Matière:</label>
          <select
            id="matiere_id"
            value={selectedMatiereId}
            onChange={(e) => setSelectedMatiereId(e.target.value)}
            required
          >
            <option value="">Choisir une matière</option>
            {matieres.map((matiere) => (
              <option key={matiere.id} value={matiere.id}>
                {matiere.nom}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="date">Date de l'absence:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="motif">Motif:</label>
          <input
            type="text"
            id="motif"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Absence justifiée:</label>
          <div className="radio-container">
            <label>
              <input
                type="radio"
                name="justifiee"
                value="oui"
                checked={isJustifiee === true}
                onChange={() => setIsJustifiee(true)}
              />{" "}Oui
            </label>
            <label>
              <input
                type="radio"
                name="justifiee"
                value="non"
                checked={isJustifiee === false}
                onChange={() => setIsJustifiee(false)}
              />{" "}Non
            </label>
          </div>
        </div>

        <button type="submit">Envoyer</button>
      </form>
    </div>
  );
};

export default Absence;
