import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaEllipsisV } from 'react-icons/fa';
import './ChargeForm.css';

function ChargeForm() {
  const [description, setDescription] = useState('');
  const [montant, setMontant] = useState('');
  const [charges, setCharges] = useState([]);
  const [mois, setMois] = useState(new Date().getMonth() + 1);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [editingId, setEditingId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRefs = useRef({});

  // Gestion du clic en dehors du dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target)) {
          setDropdownOpen(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCharges = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/charges`, {
        params: { mois, annee },
      });
      const chargesData = response.data.data || response.data;
      setCharges(Array.isArray(chargesData) ? chargesData : []);
    } catch (error) {
      console.error('Erreur:', error);
      setCharges([]);
    }
  };

  useEffect(() => {
    fetchCharges();
  }, [mois, annee]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/api/charges/${editingId}`, {
          description,
          montant,
        });
        setEditingId(null);
      } else {
        await axios.post('http://127.0.0.1:8000/api/charges', {
          description,
          montant,
        });
      }
      setDescription('');
      setMontant('');
      fetchCharges();
    } catch (error) {
      console.error('Erreur lors de l\'ajout/modification de la charge:', error);
    }
  };

  const handleEdit = (charge) => {
    setDescription(charge.description);
    setMontant(charge.montant);
    setEditingId(charge.id);
    setDropdownOpen(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/charges/${id}`);
      fetchCharges();
      setDropdownOpen(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const toggleDropdown = (id, event) => {
    event.stopPropagation();
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  return (
    <div className="charge-container">
      <h2 className="title">Gestion des Charges</h2>
      
      <form onSubmit={handleSubmit} className="charge-form">
        <div className="form-group">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Montant (MAD)"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="submit-btn">
          {editingId ? 'Modifier' : 'Ajouter'}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => {
              setEditingId(null);
              setDescription('');
              setMontant('');
            }}
            className="cancel-btn"
          >
            Annuler
          </button>
        )}
      </form>

      <div className="filter-section">
        <div className="filter-group">
          <label>Mois:</label>
          <select 
            onChange={(e) => setMois(e.target.value)} 
            value={mois}
            className="filter-select"
          >
            {Array.from({ length: 12 }, (_, i) => {
              const month = i + 1;
              return (
                <option key={month} value={month}>
                  {new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })}
                </option>
              );
            })}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Année:</label>
          <select 
            onChange={(e) => setAnnee(e.target.value)} 
            value={annee}
            className="filter-select"
          >
            {Array.from({ length: new Date().getFullYear() - 2019 }, (_, i) => {
              const year = 2020 + i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="charges-list">
        <h3 className="list-title">Liste des charges pour {mois}/{annee}</h3>
        {Array.isArray(charges) && charges.length > 0 ? (
          <ul className="charge-items">
            {charges.map((charge) => (
              <li key={charge.id} className="charge-item">
                <div className="charge-info">
                  <span className="charge-description">{charge.description}</span>
                  <span className="charge-amount">{charge.montant} MAD</span>
                </div>
                
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(charge)}
                  >
                    Modifier
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(charge.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-charges">Aucune charge trouvée pour cette période.</p>
        )}
      </div>
    </div>
  );
}

export default ChargeForm;