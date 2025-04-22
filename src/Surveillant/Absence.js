import React, { useState, useEffect } from "react";
import axios from "axios";

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
      justifiee: isJustifiee ? "oui" : "non"
    };

    console.log('Données envoyées:', dataToSend);

    try {
      const response = await axios.post('http://localhost:8000/api/absences', dataToSend);
      console.log('Absence envoyée avec succès:', response.data);
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

  const containerStyle = {
    maxWidth: '600px',
    margin: '30px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxShadow: '0 0 15px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#fff'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px'
  };

  const radioContainerStyle = {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '15px'
  };

  const buttonStyle = {
    padding: '12px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px'
  };

  const titleStyle = {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333'
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Enregistrer une Absence</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="class_id" style={labelStyle}>Classe:</label>
          <select
            id="class_id"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            required
            style={inputStyle}
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
          <label htmlFor="etudiant_id" style={labelStyle}>Étudiant:</label>
          <select
            id="etudiant_id"
            value={selectedEtudiantId}
            onChange={(e) => setSelectedEtudiantId(e.target.value)}
            required
            style={inputStyle}
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
          <label htmlFor="professeur_id" style={labelStyle}>Professeur:</label>
          <select
            id="professeur_id"
            value={selectedProfesseurId}
            onChange={(e) => setSelectedProfesseurId(e.target.value)}
            required
            style={inputStyle}
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
  <label htmlFor="matiere_id" style={labelStyle}>Matière:</label>
  <select
    id="matiere_id"
    value={selectedMatiereId}
    onChange={(e) => setSelectedMatiereId(e.target.value)}
    required
    style={inputStyle}
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
          <label htmlFor="date" style={labelStyle}>Date de l'absence:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="motif" style={labelStyle}>Motif:</label>
          <input
            type="text"
            id="motif"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Absence justifiée:</label>
          <div style={radioContainerStyle}>
            <label>
              <input
                type="radio"
                name="justifiee"
                value="oui"
                checked={isJustifiee === true}
                onChange={() => setIsJustifiee(true)}
              />
              {" "}Oui
            </label>
            <label>
              <input
                type="radio"
                name="justifiee"
                value="non"
                checked={isJustifiee === false}
                onChange={() => setIsJustifiee(false)}
              />
              {" "}Non
            </label>
          </div>
        </div>

        <button type="submit" style={buttonStyle}>Envoyer</button>
      </form>
    </div>
  );
};

export default Absence;
