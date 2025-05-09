import React, { useEffect, useState } from "react";
import axios from "axios";

const BulletinForm = () => {
  const [classes, setClasses] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [filteredEtudiants, setFilteredEtudiants] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  console.log('evaluation' , evaluations);
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
  console.log("Id Etudiants:", formData.etudiant_id);

  useEffect(() => {
    // Vérifie si un étudiant est sélectionné
    if (formData.etudiant_id) {
      // Appel à l'API pour récupérer ses évaluations
      axios.get(`http://localhost:8000/api/evaluations/etudiants/${formData.etudiant_id}`)
        .then((res) => {
            console.log("API response:", res.data.evaluations);
            setEvaluations(res.data.evaluations);
        });
    } else {
      // Si aucun étudiant n'est sélectionné, vide la liste des évaluations
      setEvaluations([]);
    }
  }, [formData.etudiant_id]); // Dépendance : relance si l'ID étudiant change
  

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
      const res = await axios.post("http://localhost:8000/api/create-bulletin", {
        ...formData,
        est_traite: true,
      });
      setMessage("✅ Bulletin généré avec succès.");
    } catch (error) {
      setMessage("❌ Erreur: " + (error.res?.data?.message || error.message));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Créer un Bulletin</h2>

      <form onSubmit={handleSubmit}>
      <label>Année scolaire:</label>
        <select name="annee_scolaire_id" value={formData.annee_scolaire_id} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
          <option value="">-- Sélectionner --</option>
          {annees.map((a) => (
            <option key={a.id} value={a.id}>{a.annee}</option>
          ))}
        </select>

        <label>Semestre:</label>
        <select name="semestre_id" value={formData.semestre_id} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
          <option value="">-- Sélectionner --</option>
          {semestres.map((s) => (
            <option key={s.id} value={s.id}>{s.nom}</option>
          ))}
        </select>
        <label>Classe:</label>
        <select name="classe_id" value={formData.classe_id} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
          <option value="">-- Sélectionner --</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>Rechercher un étudiant:</label>
        <input
          type="text"
          name="search"
          value={search}
          onChange={handleChange}
          placeholder="Nom ou prénom"
          className="w-full p-2 mb-4 border rounded"
        />

        <label>Étudiant:</label>
        <select name="etudiant_id" value={formData.etudiant_id} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
          <option value="">-- Sélectionner --</option>
          {filteredEtudiants.map((e) => (
            <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
          ))}
        </select>
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Évaluations :</h3>
            <table className="w-full text-sm table-auto border">
              <thead>
                <tr className="bg-gray-100">
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
                    <tr key={ev.id} className="text-center">
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
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
        >
          Générer Bulletin
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default BulletinForm;
