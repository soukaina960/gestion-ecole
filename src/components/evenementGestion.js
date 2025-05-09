import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaTimes, FaSearch } from 'react-icons/fa';

const Evenements = () => {
  const [evenements, setEvenements] = useState([]);
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    date_debut: '',
    date_fin: '',
    lieu: '',
    class_id: ''
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const eventData = {
      ...formData,
      class_id: formData.class_id || null
    };

    const request = editId 
      ? axios.put(`http://localhost:8000/api/evenements/${editId}`, eventData)
      : axios.post('http://localhost:8000/api/evenements', eventData);

    request.then(() => {
      fetchEvenements();
      resetForm();
    })
    .catch(err => console.error(err));
  };

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      date_debut: '',
      date_fin: '',
      lieu: '',
      class_id: ''
    });
    setEditId(null);
  };

  const handleEdit = (event) => {
    setEditId(event.id);
    setFormData({
      titre: event.titre,
      description: event.description,
      date_debut: event.date_debut,
      date_fin: event.date_fin,
      lieu: event.lieu,
      class_id: event.class_id || ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet événement ?")) {
      axios.delete(`http://localhost:8000/api/evenements/${id}`)
        .then(() => setEvenements(evenements.filter(e => e.id !== id)))
        .catch(err => console.error(err));
    }
  };

  const filteredEvents = evenements.filter(event => {
    const matchesSearch = event.titre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = filterClass === '' || event.class_id == filterClass;
    return matchesSearch && matchesClass;
  });

  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleString('fr-FR', options);
  };

  return (
    <div className="container py-4">
      <div className="card shadow mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="h4 mb-0">
            <FaCalendarAlt className="me-2" />
            {editId ? "Modifier un événement" : "Ajouter un nouvel événement"}
          </h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Titre</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Classe</label>
                <select 
                  className="form-select" 
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleInputChange}
                >
                  <option value="">-- Toutes classes --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-control" 
                  rows="3"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Date et heure de début</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Date et heure de fin</label>
                <input 
                  type="datetime-local" 
                  className="form-control" 
                  name="date_fin"
                  value={formData.date_fin}
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="col-12">
                <label className="form-label">Lieu</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="lieu"
                  value={formData.lieu}
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="col-12 d-flex justify-content-end gap-2">
                {editId && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    <FaTimes className="me-1" /> Annuler
                  </button>
                )}
                <button type="submit" className="btn btn-primary">
                  {editId ? <><FaEdit className="me-1" /> Mettre à jour</> : <><FaPlus className="me-1" /> Ajouter</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow">
        <div className="card-header bg-light">
          <h3 className="h5 mb-0">Liste des événements</h3>
        </div>
        <div className="card-body">
          <div className="row mb-3 g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
              >
                <option value="">Toutes les classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover">
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
                {filteredEvents.length > 0 ? (
                  filteredEvents.map(event => (
                    <tr key={event.id}>
                      <td className="fw-bold">{event.titre}</td>
                      <td>{event.description}</td>
                      <td>{formatDateTime(event.date_debut)}</td>
                      <td>{formatDateTime(event.date_fin)}</td>
                      <td>{event.lieu}</td>
                      <td>{event.classe?.name || '—'}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-outline-primary" 
                            onClick={() => handleEdit(event)}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger" 
                            onClick={() => handleDelete(event.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      Aucun événement trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evenements;