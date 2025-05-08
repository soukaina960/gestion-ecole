import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmploiSurveillance = () => {
  const [emplois, setEmplois] = useState([]);
  const [jour, setJour] = useState('');
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [surveillantId, setSurveillantId] = useState('');
  const [surveillants, setSurveillants] = useState([]);
  const [message, setMessage] = useState('');

  // Charger la liste des emplois du temps
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/emploi_surveillances')
      .then(res => {
        setEmplois(res.data);
      })
      .catch(err => {
        setMessage('Erreur lors du chargement des emplois du temps.');
      });
  }, []);

  // Charger la liste des surveillants pour le formulaire
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/surveillants')
      .then(res => {
        setSurveillants(res.data);
      })
      .catch(err => {
        setMessage('Erreur lors du chargement des surveillants.');
      });
  }, []);

  // Ajouter un emploi du temps pour un surveillant
  const handleAddEmploi = () => {
    const emploiData = {
      jour: jour,
      heure_debut: heureDebut,
      heure_fin: heureFin,
      surveillant_id: surveillantId,
    };

    axios.post('http://127.0.0.1:8000/api/emploi_surveillances', emploiData)
      .then(res => {
        setEmplois([...emplois, res.data]);  // Ajouter l'emploi à la liste
        setMessage('Emploi ajouté avec succès.');
        // Réinitialiser les champs du formulaire
        setJour('');
        setHeureDebut('');
        setHeureFin('');
        setSurveillantId('');
      })
      .catch(err => {
        setMessage('Erreur lors de l\'ajout de l\'emploi.');
      });
  };

  // Supprimer un emploi
  const handleDelete = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/emploi_surveillances/${id}`)
      .then(() => {
        setEmplois(emplois.filter(emploi => emploi.id !== id));
        setMessage('Emploi supprimé avec succès.');
      })
      .catch(() => {
        setMessage('Erreur lors de la suppression de l\'emploi.');
      });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>Emploi du Temps des Surveillants</h2>

      <h3>Ajouter un Emploi du Temps</h3>
      <div>
        <label>Jour:</label>
        <input
          type="date"
          value={jour}
          onChange={(e) => setJour(e.target.value)}
          style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
        />
      </div>

      <div>
        <label>Heure de Début:</label>
        <input
          type="time"
          value={heureDebut}
          onChange={(e) => setHeureDebut(e.target.value)}
          style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
        />
      </div>

      <div>
        <label>Heure de Fin:</label>
        <input
          type="time"
          value={heureFin}
          onChange={(e) => setHeureFin(e.target.value)}
          style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
        />
      </div>

      <div>
        <label>Surveillant:</label>
        <select
          value={surveillantId}
          onChange={(e) => setSurveillantId(e.target.value)}
          style={{ padding: '5px', width: '100%', marginBottom: '10px' }}
        >
          <option value="">Sélectionner un surveillant</option>
          {surveillants.map(surveillant => (
            <option key={surveillant.id} value={surveillant.id}>
              {surveillant.nom} {surveillant.prenom}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddEmploi}
        style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
      >
        Ajouter Emploi
      </button>

      <h3 style={{ marginTop: '20px' }}>Liste des Emplois du Temps</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Surveillant</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Jour</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Heure de Début</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Heure de Fin</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {emplois.map(emploi => (
            <tr key={emploi.id}>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{emploi.surveillant.nom} {emploi.surveillant.prenom}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{new Date(emploi.jour).toLocaleDateString()}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{emploi.heure_debut}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{emploi.heure_fin}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>
                <button
                  onClick={() => handleDelete(emploi.id)}
                  style={{ backgroundColor: '#f44336', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {message && <p>{message}</p>}
    </div>
  );
};

export default EmploiSurveillance;
