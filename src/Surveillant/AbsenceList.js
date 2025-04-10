import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Absence = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedProfessor, setSelectedProfessor] = useState('');
  const [date, setDate] = useState('');
  const [absences, setAbsences] = useState({});
  const [message, setMessage] = useState('');

  // Charger les classes
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/classrooms').then(res => setClassrooms(res.data));
  }, []);

  // Charger les professeurs
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/professeurs').then(res => setProfessors(res.data));
  }, []);

  // Charger les étudiants de la classe
  useEffect(() => {
    if (selectedClassroom) {
      axios.get(`http://127.0.0.1:8000/api/classrooms/${selectedClassroom}/students`).then(res => setStudents(res.data));
    }
  }, [selectedClassroom]);

  const handleInputChange = (studentId, field, value) => {
    setAbsences(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      }
    }));
  };

  const handleSubmit = async () => {
    // Récupérer toutes les absences des étudiants de la classe sélectionnée
    const absencesData = Object.keys(absences).map(studentId => {
      const absence = absences[studentId];
      return {
        etudiant_id: parseInt(studentId),  // Convertir en nombre l'ID de l'étudiant
        date: date,                        // Date de l'absence
        justifiee: absence.justifiee,      // Absence justifiée ou non
        professeur_id: parseInt(selectedProfessor),  // Convertir en nombre l'ID du professeur
        motif: absence.motif,              // Motif de l'absence
        class_id: parseInt(selectedClassroom),  // Convertir en nombre l'ID de la classe
      };
    });
  
    // Vérification si absencesData est correctement défini
    console.log("Absences Data:", absencesData);
  
    // Envoi des absences à l'API
    const response = await fetch('http://127.0.0.1:8000/api/absences', {
      method: 'POST',
      body: JSON.stringify(absencesData),
      headers: { 'Content-Type': 'application/json' },
    });
  
    // Lire la réponse en texte pour mieux comprendre l'erreur
    const responseText = await response.text();
    console.log("Réponse brute de l'API:", responseText);
  
    if (!response.ok) {
      setMessage(`Erreur : ${response.status} - ${responseText}`);
      return;
    }
  
    // Tenter de parser la réponse JSON seulement si la réponse est OK
    try {
      const result = JSON.parse(responseText);
      console.log(result);
      setMessage("Les absences ont été enregistrées avec succès !");
    } catch (error) {
      setMessage(`Erreur de parsing JSON : ${error.message}`);
    }
  };
  
  

  

console.log("selectedClassroom: ", selectedClassroom);  // Déboguer la valeur avant l'envoi


  return (
    <div>
      <h2>Saisie des Absences</h2>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      <div>
  <label>Classe:</label>
  <select value={selectedClassroom} onChange={e => setSelectedClassroom(e.target.value)}>
    <option value="">--Choisir une classe--</option>
    {classrooms.map(cls => (
      <option key={cls.id} value={cls.id}>{cls.name}</option> 
    ))}
  </select>
</div>


      <div>
        <label>Date d'absence:</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
      </div>

      <div>
        <label>Professeur:</label>
        <select value={selectedProfessor} onChange={e => setSelectedProfessor(e.target.value)}>
          <option value="">--Choisir un professeur--</option>
          {professors.map(prof => (
            <option key={prof.id} value={prof.id}>{prof.nom} {prof.prenom}</option>
          ))}
        </select>
      </div>

      {students.length > 0 && (
        <>
          <h3>Liste des étudiants</h3>
          <table>
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>Absent</th>
                <th>Motif</th>
                <th>Justifiée ?</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.nom} {student.prenom}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={absences[student.id]?.checked || false}
                      onChange={e => handleInputChange(student.id, 'checked', e.target.checked)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={absences[student.id]?.motif || ''}
                      onChange={e => handleInputChange(student.id, 'motif', e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      value={absences[student.id]?.justifiee || 'non'}
                      onChange={e => handleInputChange(student.id, 'justifiee', e.target.value)}
                    >
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleSubmit}>Enregistrer les absences</button>
        </>
      )}
    </div>
  );
};

export default Absence;
