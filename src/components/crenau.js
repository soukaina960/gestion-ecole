import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreneauList = () => {
  const [creneaux, setCreneaux] = useState([]);
  const [heureDebut, setHeureDebut] = useState('');
  const [heureFin, setHeureFin] = useState('');
  const [editingCreneau, setEditingCreneau] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Récupérer les créneaux
  useEffect(() => {
    axios.get('http://localhost:8000/api/creneaux')
      .then(response => setCreneaux(response.data))
      .catch(error => setError('Erreur de récupération des créneaux'));
  }, []);

  // Créer un créneau
  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!heureDebut || !heureFin) {
      setError("Les heures de début et de fin sont requises.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/creneaux', {
        heure_debut: heureDebut,
        heure_fin: heureFin,
      });
      setCreneaux([...creneaux, response.data]);
      setSuccess("Créneau créé avec succès !");
    } catch (err) {
      setError("Erreur lors de la création du créneau.");
    }
  };

  // Modifier un créneau
  const handleEdit = (creneau) => {
    setEditingCreneau(creneau);
    setHeureDebut(creneau.heure_debut);
    setHeureFin(creneau.heure_fin);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!heureDebut || !heureFin) {
      setError("Les heures de début et de fin sont requises.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8000/api/creneaux/${editingCreneau.id}`, {
        heure_debut: heureDebut,
        heure_fin: heureFin,
      });
      setCreneaux(creneaux.map(creneau => creneau.id === editingCreneau.id ? response.data : creneau));
      setSuccess("Créneau mis à jour avec succès !");
      setEditingCreneau(null);
    } catch (err) {
      setError("Erreur lors de la mise à jour du créneau.");
    }
  };

  // Supprimer un créneau
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce créneau ?")) {
      try {
        await axios.delete(`http://localhost:8000/api/creneaux/${id}`);
        setCreneaux(creneaux.filter(creneau => creneau.id !== id));
        setSuccess("Créneau supprimé avec succès !");
      } catch (err) {
        setError("Erreur lors de la suppression du créneau.");
      }
    }
  };

  return (
    <div className="container">
      <h2>{editingCreneau ? "Modifier un créneau" : "Créer un créneau"}</h2>
      <form onSubmit={editingCreneau ? handleUpdate : handleCreate}>
        <div className="mb-3">
          <label htmlFor="heureDebut" className="form-label">Heure de début</label>
          <input
            type="time"
            className="form-control"
            id="heureDebut"
            value={heureDebut}
            onChange={(e) => setHeureDebut(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="heureFin" className="form-label">Heure de fin</label>
          <input
            type="time"
            className="form-control"
            id="heureFin"
            value={heureFin}
            onChange={(e) => setHeureFin(e.target.value)}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <button type="submit" className="btn btn-primary">{editingCreneau ? "Mettre à jour" : "Créer"}</button>
      </form>

      <h3>Liste des créneaux</h3>
      <ul className="list-group">
        {creneaux.map(creneau => (
          <li key={creneau.id} className="list-group-item">
            {creneau.heure_debut} - {creneau.heure_fin}
            <button className="btn btn-warning btn-sm ms-2" onClick={() => handleEdit(creneau)}>Modifier</button>
            <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDelete(creneau.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreneauList;
