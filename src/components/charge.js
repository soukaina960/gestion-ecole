import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChargeForm() {
  const [description, setDescription] = useState('');
  const [montant, setMontant] = useState('');
  const [charges, setCharges] = useState([]);
  const [mois, setMois] = useState(new Date().getMonth() + 1);
  const [annee, setAnnee] = useState(new Date().getFullYear());

  const fetchCharges = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/charges`, {
        params: { mois, annee },
      });
      console.log("Réponse complète de l'API:", response); // ← Affiche tout
      console.log("Données reçues:", response.data); // ← Cible les données
  
      // Ajustez cette ligne selon la structure réelle de la réponse
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
      await axios.post('http://127.0.0.1:8000/api/charges', {
        description,
        montant,
      });
      setDescription('');
      setMontant('');
      fetchCharges();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la charge:', error);
    }
  };

  return (
    <div>
      <h2>Ajouter une charge</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Montant"
          value={montant}
          onChange={(e) => setMontant(e.target.value)}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      <div>
        <select onChange={(e) => setMois(e.target.value)} value={mois}>
          <option value="1">Janvier</option>
          <option value="2">Février</option>
          <option value="3">Mars</option>
          <option value="4">Avril</option>
          <option value="5">Mai</option>
          <option value="6">Juin</option>
          <option value="7">Juillet</option>
          <option value="8">Août</option>
          <option value="9">Septembre</option>
          <option value="10">Octobre</option>
          <option value="11">Novembre</option>
          <option value="12">Décembre</option>
        </select>

        <select onChange={(e) => setAnnee(e.target.value)} value={annee}>
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

      <div>
        <h3>Liste des charges pour {mois}/{annee}</h3>
        <ul>
          {Array.isArray(charges) && charges.length > 0 ? (
            charges.map((charge) => (
              <li key={charge.id}>
                {charge.description}: {charge.montant} MAD
              </li>
            ))
          ) : (
            <li>Aucune charge trouvée pour ce mois.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ChargeForm;