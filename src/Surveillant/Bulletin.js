import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BulletinForm.css";

const BulletinForm = () => {
  const [classes, setClasses] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [filteredEtudiants, setFilteredEtudiants] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    classe_id: "",
    etudiant_id: "",
    annee_scolaire_id: "",
    semestre_id: "",
  });

  const [annees, setAnnees] = useState([]);
  const [semestres, setSemestres] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/classrooms").then((res) => setClasses(res.data));
    axios.get("http://localhost:8000/api/annees-scolaires").then((res) => setAnnees(res.data));
    axios.get("http://localhost:8000/api/semestres").then((res) => setSemestres(res.data.data));
  }, []);

  useEffect(() => {
    if (formData.classe_id) {
      axios.get(`http://localhost:8000/api/etudiants?classe_id=${formData.classe_id}`).then((res) => {
        setEtudiants(res.data);
        setFilteredEtudiants(res.data);
      });
    }
  }, [formData.classe_id]);

  useEffect(() => {
    if (formData.etudiant_id) {
      axios.get(`http://localhost:8000/api/evaluations/etudiants/${formData.etudiant_id}`)
        .then((res) => {
          setEvaluations(res.data.evaluations);
        });
    } else {
      setEvaluations([]);
    }
  }, [formData.etudiant_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "search") {
      setSearch(value);
      setFilteredEtudiants(
        etudiants.filter((e) =>
          `${e.nom} ${e.prenom}`.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post("http://localhost:8000/api/create-bulletin", {
        ...formData,
        est_traite: true,
      });
      setMessage("✅ Bulletin généré avec succès.");
    } catch (error) {
      setMessage("❌ Erreur: " + (error.res?.data?.message || error.message));
    }
  };

  return (
    <div className="bulletin-container">
      <h2 className="bulletin-title">Créer un Bulletin</h2>

      <form onSubmit={handleSubmit}>
        <label className="bulletin-label">Année scolaire:</label>
        <select name="annee_scolaire_id" value={formData.annee_scolaire_id} onChange={handleChange} className="bulletin-select">
          <option value="">-- Sélectionner --</option>
          {annees.map((a) => (
            <option key={a.id} value={a.id}>{a.annee}</option>
          ))}
        </select>

        <label className="bulletin-label">Semestre:</label>
        <select name="semestre_id" value={formData.semestre_id} onChange={handleChange} className="bulletin-select">
          <option value="">-- Sélectionner --</option>
          {semestres.map((s) => (
            <option key={s.id} value={s.id}>{s.nom}</option>
          ))}
        </select>

        <label className="bulletin-label">Classe:</label>
        <select name="classe_id" value={formData.classe_id} onChange={handleChange} className="bulletin-select">
          <option value="">-- Sélectionner --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label className="bulletin-label">Rechercher un étudiant:</label>
        <input
          type="text"
          name="search"
          value={search}
          onChange={handleChange}
          placeholder="Nom ou prénom"
          className="bulletin-input"
        />

        <label className="bulletin-label">Étudiant:</label>
        <select name="etudiant_id" value={formData.etudiant_id} onChange={handleChange} className="bulletin-select">
          <option value="">-- Sélectionner --</option>
          {filteredEtudiants.map((e) => (
            <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
          ))}
        </select>

        <div>
          <h3 className="bulletin-label">Évaluations :</h3>
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
                  <td>{ev.matiere.nom}</td>
                  <td>{ev.note1}</td>
                  <td>{ev.note2}</td>
                  <td>{ev.note3}</td>
                  <td>{ev.note4}</td>
                  <td>{ev.note_finale}</td>
                  <td>{ev.remarque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="submit"
          disabled={evaluations.length === 0}
          className="bulletin-button"
        >
          Générer Bulletin
        </button>
      </form>

      {message && <p className="bulletin-message">{message}</p>}
    </div>
  );
};

export default BulletinForm;
