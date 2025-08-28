import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BulletinForm.css";

const BulletinForm = () => {
  const [classes, setClasses] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [filteredEtudiants, setFilteredEtudiants] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    classe_id: "",
    etudiant_id: "",
    annee_scolaire_id: "",
    semestre_id: "",
  });

  const [annees, setAnnees] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Charger les données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [classesRes, anneesRes, semestresRes] = await Promise.all([
          axios.get("http://localhost:8000/api/classrooms"),
          axios.get("http://localhost:8000/api/annees-scolaires"),
          axios.get("http://localhost:8000/api/semestres")
        ]);
        
        setClasses(classesRes.data);
        setAnnees(anneesRes.data);
        setSemestres(semestresRes.data.data || semestresRes.data);
      } catch (err) {
        setError("Erreur lors du chargement des données initiales");
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Charger les étudiants quand la classe change
  useEffect(() => {
    const fetchEtudiants = async () => {
      if (!formData.classe_id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await axios.get(
          `http://localhost:8000/api/etudiants?classe_id=${formData.classe_id}`
        );
        
        setEtudiants(res.data);
        setFilteredEtudiants(res.data);
        setFormData(prev => ({ ...prev, etudiant_id: "" })); // Réinitialiser l'étudiant sélectionné
      } catch (err) {
        setError("Erreur lors du chargement des étudiants");
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEtudiants();
  }, [formData.classe_id]);

  // Charger les évaluations quand l'étudiant change
  useEffect(() => {
    const fetchEvaluations = async () => {
      if (!formData.etudiant_id || !formData.annee_scolaire_id || !formData.semestre_id) {
        setEvaluations([]);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const res = await axios.get(
          `http://localhost:8000/api/evaluations/etudiants/${formData.etudiant_id}`,
          {
            params: {
              annee_scolaire_id: formData.annee_scolaire_id,
              semestre_id: formData.semestre_id
            }
          }
        );
        
        setEvaluations(res.data.evaluations || []);
      } catch (err) {
        setError("Erreur lors du chargement des évaluations");
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvaluations();
  }, [formData.etudiant_id, formData.annee_scolaire_id, formData.semestre_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "search") {
      setSearch(value);
      setFilteredEtudiants(
        etudiants.filter((e) =>
          `${e.nom} ${e.prenom}`.toLowerCase().includes(value.toLowerCase())
        )
      );
      return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setError(null);

    // Validation
    if (!formData.classe_id || !formData.etudiant_id || 
        !formData.annee_scolaire_id || !formData.semestre_id) {
      setMessage({ 
        text: "Veuillez remplir tous les champs obligatoires", 
        type: "error" 
      });
      return;
    }

    if (evaluations.length === 0) {
      setMessage({ 
        text: "Aucune évaluation trouvée pour cet étudiant", 
        type: "error" 
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        "http://localhost:8000/api/create-bulletin",
        {
          ...formData,
          est_traite: true,
        },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      setMessage({ 
        text: "Bulletin généré avec succès", 
        type: "success" 
      });
      
      // Réinitialiser le formulaire si nécessaire
      // setFormData({
      //   classe_id: "",
      //   etudiant_id: "",
      //   annee_scolaire_id: "",
      //   semestre_id: "",
      // });
      
      console.log("Réponse du serveur:", response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         "Erreur lors de la création du bulletin";
      
      setMessage({ text: errorMessage, type: "error" });
      console.error("Erreur détaillée:", err.response || err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bulletin-container">
      <h2 className="bulletin-title">Créer un Bulletin</h2>

      {isLoading && <div className="loading">Chargement...</div>}
      {error && <div className="error-message">{error}</div>}
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="bulletin-label">Année scolaire:</label>
          <select
            name="annee_scolaire_id"
            value={formData.annee_scolaire_id}
            onChange={handleChange}
            className="bulletin-select"
            required
          >
            <option value="">-- Sélectionner --</option>
            {annees.map((a) => (
              <option key={a.id} value={a.id}>
                {a.annee}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="bulletin-label">Semestre:</label>
          <select
            name="semestre_id"
            value={formData.semestre_id}
            onChange={handleChange}
            className="bulletin-select"
            required
          >
            <option value="">-- Sélectionner --</option>
            {semestres.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="bulletin-label">Classe:</label>
          <select
            name="classe_id"
            value={formData.classe_id}
            onChange={handleChange}
            className="bulletin-select"
            required
          >
            <option value="">-- Sélectionner --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="bulletin-label">Rechercher un étudiant:</label>
          <input
            type="text"
            name="search"
            value={search}
            onChange={handleChange}
            placeholder="Nom ou prénom"
            className="bulletin-input"
            disabled={!formData.classe_id}
          />
        </div>

        <div className="form-group">
          <label className="bulletin-label">Étudiant:</label>
          <select
            name="etudiant_id"
            value={formData.etudiant_id}
            onChange={handleChange}
            className="bulletin-select"
            required
            disabled={!formData.classe_id}
          >
            <option value="">-- Sélectionner --</option>
            {filteredEtudiants.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nom} {e.prenom}
              </option>
            ))}
          </select>
        </div>

        {evaluations.length > 0 && (
          <div className="evaluations-section">
            <h3 className="bulletin-label">Évaluations :</h3>
            <div className="table-container">
              <table className="bulletin-table">
                <thead>
                  <tr>
                    <th>Matière</th>
                    <th>Note1</th>
                    <th>Note2</th>
                    <th>Note3</th>
                    <th>Note4</th>
                    <th>Finale</th>
                    <th>Remarque</th>
                  </tr>
                </thead>
                <tbody>
                  {evaluations.map((ev) => (
                    <tr key={ev.id}>
                      <td>{ev.matiere?.nom || "N/A"}</td>
                      <td>{ev.note1 ?? "-"}</td>
                      <td>{ev.note2 ?? "-"}</td>
                      <td>{ev.note3 ?? "-"}</td>
                      <td>{ev.note4 ?? "-"}</td>
                      <td>{ev.note_finale ?? "-"}</td>
                      <td>{ev.remarque || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || evaluations.length === 0}
          className={`bulletin-button ${isLoading ? "loading" : ""}`}
        >
          {isLoading ? "Traitement..." : "Générer Bulletin"}
        </button>
      </form>
    </div>
  );
};

export default BulletinForm;