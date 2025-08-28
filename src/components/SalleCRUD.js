import React, { useState, useEffect } from "react";
import axios from "axios";

function SalleCRUD() {
  const [salles, setSalles] = useState([]);
  const [nom, setNom] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Charger les salles
  const fetchSalles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/api/salles");
      setSalles(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des salles", error);
      setMessage("Erreur lors du chargement des salles");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalles();
  }, []);

  // Créer ou mettre à jour une salle
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim()) return;

    try {
      setLoading(true);
      if (editId) {
        await axios.put(`http://127.0.0.1:8000/api/salles/${editId}`, { nom });
        setMessage("Salle mise à jour avec succès");
      } else {
        await axios.post("http://127.0.0.1:8000/api/salles", { nom });
        setMessage("Salle créée avec succès");
      }
      setNom("");
      setEditId(null);
      fetchSalles();
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une salle
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette salle ?")) return;
    try {
      setLoading(true);
      await axios.delete(`http://127.0.0.1:8000/api/salles/${id}`);
      setMessage("Salle supprimée avec succès");
      fetchSalles();
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  // Préparer l’édition
  const handleEdit = (salle) => {
    setNom(salle.nom);
    setEditId(salle.id);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Gestion des Salles</h2>

      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="mb-4 d-flex gap-2">
        <input
          type="text"
          placeholder="Nom de la salle"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="form-control"
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {editId ? "Mettre à jour" : "Ajouter"}
        </button>
        {editId && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => { setNom(""); setEditId(null); }}
          >
            Annuler
          </button>
        )}
      </form>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Nom de la salle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {salles.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                Aucune salle disponible
              </td>
            </tr>
          ) : (
            salles.map((salle) => (
              <tr key={salle.id}>
                <td>{salle.id}</td>
                <td>{salle.nom}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(salle)}
                    disabled={loading}
                  >
                    Éditer
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(salle.id)}
                    disabled={loading}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SalleCRUD;
