import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';

const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const EmploiDuTemps = () => {
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [salles, setSalles] = useState([]);
  const [selectedClasseId, setSelectedClasseId] = useState('');
  const [emplois, setEmplois] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [formData, setFormData] = useState({
    matiere_id: '',
    professeur_id: '',
    salle: '',
    jour: '',
    creneau_id: ''
  });
  const emploiRef = useRef(null);

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesRes, matieresRes, professeursRes, sallesRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/classrooms'),
          fetch('http://127.0.0.1:8000/api/matieres'),
          fetch('http://127.0.0.1:8000/api/professeurs'),
          fetch('http://127.0.0.1:8000/api/salles')
        ]);
        
        setClasses(await classesRes.json());
        setMatieres(await matieresRes.data.json());
        setProfesseurs(await professeursRes.json());
        setSalles(await sallesRes.json());
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };
    
    fetchData();
  }, []);

  // Charger les créneaux horaires
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/creneaux')
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));
        setCreneaux(sorted);
      });
  }, []);

  // Charger l'emploi du temps quand une classe est sélectionnée
  useEffect(() => {
    if (selectedClasseId) {
      fetch(`http://127.0.0.1:8000/api/emplois-temps/${selectedClasseId}`)
        .then(res => res.json())
        .then(data => setEmplois(data))
        .catch(error => console.error("Erreur lors du chargement de l'emploi du temps:", error));
    }
  }, [selectedClasseId]);

  // Mettre à jour le formulaire quand une séance est sélectionnée
  useEffect(() => {
    if (selectedSeance) {
      setFormData({
        matiere_id: selectedSeance.matiere_id || '',
        professeur_id: selectedSeance.professeur_id || '',
        salle: selectedSeance.salle || '',
        jour: selectedSeance.jour || '',
        creneau_id: selectedSeance.creneau_id || ''
      });
    }
  }, [selectedSeance]);

  // Afficher le contenu d'une séance dans le tableau
  const getSeance = (jour, creneauId) => {
    const seance = emplois.find(e => e.jour === jour && e.creneau_id === creneauId);
    if (seance) {
      return (
        <div className="space-y-1">
          <div><strong>{seance.matiere?.nom}</strong></div>
          <div>{seance.professeur?.nom}</div>
          <div>Salle: {seance.salle}</div>
          
        </div>
      );
    }
    return <span>—</span>;
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const method = selectedSeance.id ? 'PUT' : 'POST';
      const url = selectedSeance.id 
        ? `http://127.0.0.1:8000/api/emplois-temps/${selectedSeance.id}`
        : 'http://127.0.0.1:8000/api/emplois-temps';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          classe_id: selectedClasseId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (selectedSeance.id) {
        // Pour la modification
        setEmplois(prev => prev.map(e => 
          e.id === selectedSeance.id ? { ...e, ...data } : e
        ));
      } else {
        // Pour l'ajout
        setEmplois(prev => [...prev, data]);
      }
      
      setSelectedSeance(null);
      setFormData({
        matiere_id: '',
        professeur_id: '',
        salle: '',
        jour: '',
        creneau_id: ''
      });
      
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      alert(`Erreur: ${error.message}`);
    }
  };

  // Supprimer une séance
  const supprimerSeance = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      try {
        await fetch(`http://127.0.0.1:8000/api/emplois-temps/${id}`, {
          method: 'DELETE',
        });
        setEmplois(prev => prev.filter(e => e.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  // Télécharger l'emploi du temps en PDF
  const telechargerPDF = () => {
    const element = emploiRef.current;
    const opt = {
      margin: 0.5,
      filename: `emploi-du-temps-${selectedClasseId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <>
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            body, html {
              background: white !important;
            }
            table {
              width: 100% !important;
            }
          }
        `}
      </style>

      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Gestion des emplois du temps</h2>

        <div className="mb-4 no-print">
          <label className="mr-2 font-medium">Classe :</label>
          <select
            className="border p-2 rounded"
            value={selectedClasseId}
            onChange={(e) => setSelectedClasseId(e.target.value)}
          >
            <option value="">-- Choisir une classe --</option>
            {classes.map(classe => (
              <option key={classe.id} value={classe.id}>{classe.name}</option>
            ))}
          </select>
        </div>

        {selectedClasseId && (
          <>
            <div className="flex justify-end mb-4 gap-4 no-print">
              <button
                onClick={telechargerPDF}
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
              >
                Télécharger PDF
              </button>
            </div>

            <div className="overflow-x-auto" ref={emploiRef}>
              <table className="table-auto border-collapse w-full text-sm text-center">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 bg-gray-100">Jour / Créneau</th>
                    {creneaux.map(cr => (
                      <th key={cr.id} className="border px-4 py-2 bg-gray-100">
                        {cr.heure_debut.slice(0, 5)} - {cr.heure_fin.slice(0, 5)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jours.map(jour => (
                    <tr key={jour}>
                      <td className="border font-bold px-4 py-2 text-left bg-gray-50">{jour}</td>
                      {creneaux.map(cr => (
                        <td 
                          key={cr.id} 
                          className="border px-2 py-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setSelectedSeance({
                              jour,
                              creneau_id: cr.id,
                              classe_id: selectedClasseId
                            });
                          }}
                        >
                          {getSeance(jour, cr.id)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

       
      </div>
    </>
  );
};

export default EmploiDuTemps;