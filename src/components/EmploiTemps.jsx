import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaDownload, FaPrint, FaSearch } from 'react-icons/fa';

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
  const [selectedProf, setSelectedProf] = useState('');
    const emploiTempsRef = useRef();
  
  const [formData, setFormData] = useState({
    matiere_id: '',
    professeur_id: '',
    salle: '',
    jour: '',
    creneau_id: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
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
        setMatieres(await matieresRes.json());
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
        <div className="p-2">
          <div className="fw-bold text-primary">{seance.matiere?.nom}</div>
          <div className="text-dark ">{seance.professeur?.nom}</div>
          <div className="badge bg-light text-dark">Salle: {seance.salle}</div>
        </div>
      );
    }
    return <span className="text-muted">—</span>;
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

  // Imprimer l'emploi du temps
  const imprimerEmploi = () => {
    window.print();
  };

  // Filtrer les classes
  const filteredClasses = classes.filter(classe => 
    classe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-4">
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
           
            .table {
              width: 100% !important;
              font-size: 12px !important;
            }
            .table th, .table td {
              padding: 4px !important;
            }
          }
        `}
      </style>

      <div className="card shadow-sm mb-4">
       
        <div className="card-body">
          <div className="row mb-4 no-print">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher une classe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={selectedClasseId}
                onChange={(e) => setSelectedClasseId(e.target.value)}
              >
                <option value="">-- Choisir une classe --</option>
                {filteredClasses.map(classe => (
                  <option key={classe.id} value={classe.id}>{classe.name}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedClasseId && (
            <>
              <div className="d-flex justify-content-end mb-3 gap-2 no-print">
                <button
                  onClick={telechargerPDF}
                  className="btn btn-success"
                >
                  <FaDownload className="me-2" />
                  Télécharger PDF
                </button>
                <button
                  onClick={imprimerEmploi}
                  className="btn btn-outline-primary"
                >
                  <FaPrint className="me-2" />
                  Imprimer
                </button>
              </div>

              <div className="table-responsive" ref={emploiRef}>
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '120px' }}>Jour / Créneau</th>
                      {creneaux.map(cr => (
                        <th key={cr.id}>
                          {cr.heure_debut.slice(0, 5)} - {cr.heure_fin.slice(0, 5)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {jours.map(jour => (
                      <tr key={jour}>
                        <td className="fw-bold bg-light">{jour}</td>
                        {creneaux.map(cr => (
                          <td 
                            key={cr.id} 
                            className="align-top hover-bg"
                            style={{ minWidth: '150px', cursor: 'pointer' }}
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
      </div>
    </div>
  );
};

export default EmploiDuTemps;