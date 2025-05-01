import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Evenements = () => {
  const [evenements, setEvenements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [lieu, setLieu] = useState('');
  const [classId, setClassId] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchEvenements();
    fetchClasses();
  }, []);

  const fetchEvenements = () => {
    axios.get('http://localhost:8000/api/evenements')
      .then(res => setEvenements(res.data))
      .catch(err => console.error(err));
  };

  const fetchClasses = () => {
    axios.get('http://localhost:8000/api/classrooms')
      .then(res => setClasses(res.data))
      .catch(err => console.error(err));
  };

  const resetForm = () => {
    setTitre('');
    setDescription('');
    setDateDebut('');
    setDateFin('');
    setLieu('');
    setClassId('');
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      titre,
      description,
      date_debut: dateDebut,
      date_fin: dateFin,
      lieu,
      class_id: classId || null,
    };

    if (editId) {
      axios.put(`http://localhost:8000/api/evenements/${editId}`, eventData)
        .then(() => {
          fetchEvenements();
          resetForm();
        })
        .catch(err => console.error(err));
    } else {
      axios.post('http://localhost:8000/api/evenements', eventData)
        .then(res => {
          setEvenements([...evenements, res.data]);
          resetForm();
        })
        .catch(err => console.error(err));
    }
  };

  const handleEdit = (event) => {
    setEditId(event.id);
    setTitre(event.titre);
    setDescription(event.description);
    setDateDebut(event.date_debut);
    setDateFin(event.date_fin);
    setLieu(event.lieu);
    setClassId(event.class_id || '');
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      axios.delete(`http://localhost:8000/api/evenements/${id}`)
        .then(() => setEvenements(evenements.filter(e => e.id !== id)))
        .catch(err => console.error(err));
    }
  };

  return (
    <div className="container">
      <h2>{editId ? "Modifier l'événement" : "Ajouter un événement"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Titre</label>
          <input type="text" className="form-control" value={titre} onChange={e => setTitre(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Description</label>
          <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Date début</label>
          <input type="datetime-local" className="form-control" value={dateDebut} onChange={e => setDateDebut(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Date fin</label>
          <input type="datetime-local" className="form-control" value={dateFin} onChange={e => setDateFin(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Lieu</label>
          <input type="text" className="form-control" value={lieu} onChange={e => setLieu(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Classe</label>
          <select className="form-select" value={classId} onChange={e => setClassId(e.target.value)}>
            <option value="">-- Aucune --</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success">{editId ? "Mettre à jour" : "Ajouter"}</button>
        {editId && <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>Annuler</button>}
      </form>

      <h3 className="mt-5">Liste des événements</h3>
      <table className="table table-bordered text-center">
        <thead className="table-light">
          <tr>
            <th>Titre</th>
            <th>Description</th>
            <th>Date Début</th>
            <th>Date Fin</th>
            <th>Lieu</th>
            <th>Classe</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {evenements.map(event => (
            <tr key={event.id}>
              <td>{event.titre}</td>
              <td>{event.description}</td>
              <td>{new Date(event.date_debut).toLocaleString()}</td>
              <td>{new Date(event.date_fin).toLocaleString()}</td>
              <td>{event.lieu}</td>
              <td>{event.classe?.name || '—'}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(event)}>Modifier</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(event.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Evenements;
