import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReclamationList = ({ refresh }) => {
  const [reclamations, setReclamations] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [hoveredCard, setHoveredCard] = useState(null);
  const parentId = localStorage.getItem('parent_id');

  const fetchReclamations = async () => {
    try {
      const url = `http://127.0.0.1:8000/api/reclamations?parent_id=${parentId}`;
      const response = await axios.get(url);
      let data = response.data;

      data.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      });

      setReclamations(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/reclamations/${id}`);
      fetchReclamations();
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, [refresh, sortOrder]);

  return (
    <div className="container mt-5">
      <div className="card shadow-sm border-0">
        <div
          className="card-header text-white text-center"
          style={{ backgroundColor: '#3498db' }}
        >
          <h4 style={{ color: 'white' }}>Mes Réclamations</h4>
        </div>

        <div className="card-body bg-light">
          {/* Sorting */}
          <div className="mb-4 d-flex justify-content-end">
            <select
              className="form-select w-auto fw-bold text-white"
              style={{ backgroundColor: '#3498db', border: 'none' }}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">Récentes d'abord</option>
              <option value="asc">Anciennes d'abord</option>
            </select>
          </div>

          {/* List */}
          {reclamations.length === 0 ? (
            <div className="alert alert-info text-center">
              Aucune réclamation trouvée
            </div>
          ) : (
            <div className="list-group">
              {reclamations.map((rec) => (
                <div
                  key={rec.id}
                  className={`list-group-item mb-3 shadow-sm rounded ${
                    hoveredCard === rec.id ? 'border border-danger' : ''
                  }`}
                  style={{
                    transition: 'all 0.3s ease',
                    transform: hoveredCard === rec.id ? 'scale(1.01)' : 'scale(1)',
                    backgroundColor: '#ffffff',
                    borderLeft: '5px solid #3498db',
                  }}
                  onMouseEnter={() => setHoveredCard(rec.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <p className="mb-1">
                    <strong style={{ color: '#3498db' }}>Titre:</strong> {rec.titre}
                  </p>
                  <p className="mb-2">{rec.message}</p>
                  <p className="mb-2">
                    <strong>Statut:</strong>{' '}
                    <span
                      className={`fw-bold ${
                        rec.statut === 'en attente' ? 'text-warning' : 'text-success'
                      }`}
                    >
                      {rec.statut}
                    </span>
                  </p>
                  <p className="text-muted small mb-2">
                    Créé le: {new Date(rec.created_at).toLocaleDateString()}
                  </p>
                  {rec.statut === 'en attente' && (
                    <div className="text-end">
                      <button
                        className="btn fw-bold text-white"
                        style={{
                          backgroundColor: '#3498db',
                          borderRadius: '20px',
                          padding: '6px 15px',
                          transition: 'transform 0.2s',
                        }}
                        onMouseOver={(e) => (e.target.style.transform = 'scale(1.1)')}
                        onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                        onClick={() => handleDelete(rec.id)}
                      >
                        Annuler
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReclamationList;
