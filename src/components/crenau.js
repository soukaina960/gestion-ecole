import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClock, FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreneauList = () => {
  const [creneaux, setCreneaux] = useState([]);
  const [formData, setFormData] = useState({
    heure_debut: '',
    heure_fin: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer les créneaux
  useEffect(() => {
    const fetchCreneaux = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/creneaux');
        setCreneaux(response.data);
      } catch (error) {
        toast.error('Erreur de récupération des créneaux');
      } finally {
        setLoading(false);
      }
    };
    fetchCreneaux();
  }, []);

  // Gestion des changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire (création/mise à jour)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.heure_debut || !formData.heure_fin) {
      toast.error('Les heures de début et de fin sont requises');
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/creneaux/${editingId}`, formData);
        setCreneaux(creneaux.map(c => c.id === editingId ? { ...c, ...formData } : c));
        toast.success('Créneau mis à jour avec succès');
      } else {
        const response = await axios.post('http://localhost:8000/api/creneaux', formData);
        setCreneaux([...creneaux, response.data]);
        toast.success('Créneau créé avec succès');
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  // Pré-remplir le formulaire pour édition
  const handleEdit = (creneau) => {
    setFormData({
      heure_debut: creneau.heure_debut,
      heure_fin: creneau.heure_fin
    });
    setEditingId(creneau.id);
  };

  // Supprimer un créneau
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) {
      try {
        await axios.delete(`http://localhost:8000/api/creneaux/${id}`);
        setCreneaux(creneaux.filter(c => c.id !== id));
        toast.success('Créneau supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({ heure_debut: '', heure_fin: '' });
    setEditingId(null);
  };

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0 d-flex align-items-center">
            <FaClock className="me-2" />
            Gestion des Créneaux Horaires
          </h2>
        </div>
        
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Heure de début</label>
                <input
                  type="time"
                  className="form-control"
                  name="heure_debut"
                  value={formData.heure_debut}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="col-md-5">
                <label className="form-label">Heure de fin</label>
                <input
                  type="time"
                  className="form-control"
                  name="heure_fin"
                  value={formData.heure_fin}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-primary me-2">
                  {editingId ? <FaCheck /> : <FaPlus />}
                  {editingId ? ' Mettre à jour' : ' Ajouter'}
                </button>
                
                {editingId && (
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>
          </form>

          <hr />
          
          <h3 className="mt-4">Liste des Créneaux</h3>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : creneaux.length === 0 ? (
            <div className="alert alert-info">Aucun créneau disponible</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Heure de début</th>
                    <th>Heure de fin</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {creneaux.map(creneau => (
                    <tr key={creneau.id}>
                      <td>{creneau.id}</td>
                      <td>{creneau.heure_debut}</td>
                      <td>{creneau.heure_fin}</td>
                      <td>
                        <button 
                          onClick={() => handleEdit(creneau)}
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(creneau.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreneauList;