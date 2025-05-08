import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaExclamationCircle } from 'react-icons/fa'; // Icône d'avertissement
import { FaCheckCircle } from 'react-icons/fa'; // Icône de succès

const Notification = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [parentInfo, setParentInfo] = useState(null);
  const [message, setMessage] = useState('');

  // Charger les étudiants
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/etudiants')
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des étudiants:", error);
        setMessage('Erreur lors du chargement des étudiants.');
      });
  }, []);

  // Fonction pour sélectionner un étudiant
  const handleStudentSelection = (event) => {
    const studentId = event.target.value;
    const student = students.find(stud => stud.id === parseInt(studentId));
    setSelectedStudent(student);

    // Récupérer les informations du parent après la sélection de l'étudiant
    axios.get(`http://127.0.0.1:8000/api/etudiant/${studentId}/parent`)
      .then(response => {
        setParentInfo(response.data); // Enregistrer les infos du parent
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des informations du parent:", error);
        setParentInfo(null); // Si une erreur se produit, réinitialiser les données du parent
      });
  };

  // Fonction pour envoyer la notification au parent
  const sendNotification = () => {
    if (!selectedStudent) {
      toast.error('Veuillez sélectionner un étudiant.');
      return;
    }

    if (!parentInfo) {
      toast.error('Informations du parent non trouvées.');
      return;
    }

    // Envoi de l'email et SMS
    axios.post('http://127.0.0.1:8000/api/send-email-sms-notification', {
      parent_email: parentInfo.email,
      parent_phone: parentInfo.phone,
      student_name: selectedStudent.nom,
      student_prenom: selectedStudent.prenom,
      // Ajouter d'autres détails ici si nécessaire
    })
    .then(() => {
      toast.success(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaCheckCircle style={{ marginRight: '10px', color: '#4CAF50' }} />
          Notification envoyée au parent de {selectedStudent.nom} !
        </div>,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
          hideProgressBar: true,
          closeButton: true,
          style: { background: '#4CAF50', color: '#fff' },
        }
      );
    })
    .catch(() => {
      toast.error(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaExclamationCircle style={{ marginRight: '10px', color: '#F44336' }} />
          Erreur lors de l'envoi de la notification !
        </div>,
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 5000,
          hideProgressBar: true,
          closeButton: true,
          style: { background: '#F44336', color: '#fff' },
        }
      );
    });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Sélectionner un étudiant</h2>
      <ToastContainer />
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="student">Choisir un étudiant: </label>
        <select id="student" onChange={handleStudentSelection}>
          <option value="">Sélectionner un étudiant</option>
          {students.map(student => (
            <option key={student.id} value={student.id}>
              {student.nom} {student.prenom}
            </option>
          ))}
        </select>
      </div>

      {selectedStudent && parentInfo && (
        <div>
          <h3>Informations de l'étudiant</h3>
          <p><strong>Nom de l'étudiant:</strong> {selectedStudent.nom} {selectedStudent.prenom}</p>
          <p><strong>Email de l'étudiant:</strong> {selectedStudent.email}</p>
          <p><strong>Classe:</strong> {selectedStudent.classroom.name}</p>

          <h3>Informations du parent</h3>
          <p><strong>Email du parent:</strong> {parentInfo.email}</p>
          <p><strong>Téléphone du parent:</strong> {parentInfo.phone}</p>

          <button onClick={sendNotification} style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', cursor: 'pointer' }}>
            Envoyer la notification
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
