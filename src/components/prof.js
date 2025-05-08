import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ProfesseurList() {
    const [professeurs, setProfesseurs] = useState([]);
    const [formData, setFormData] = useState({
        user_id: "",
        nom: "",
        email: "",
        niveau_enseignement: "",
        diplome: "",
        date_embauche: "",
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        loadProfesseurs();
    }, []);

    const loadProfesseurs = async () => {
        const response = await axios.get("http://127.0.0.1:8000/api/professeurs");
        setProfesseurs(response.data);
    };

    const handleSubmit = async () => {
        try {
            if (editId) {
                await axios.put(`http://127.0.0.1:8000/api/professeurs/${editId}`, formData);
                setEditId(null);
            } else {
                await axios.post("http://127.0.0.1:8000/api/professeurs", formData);
                alert("Professeur ajouté avec succès!");
            }
            setFormData({
                user_id: "",
                nom: "",
                email: "",
                specialite: "",
                niveau_enseignement: "",
                diplome: "",
                date_embauche: "",
            });
            loadProfesseurs();
        } catch (error) {
            console.error("Error:", error.response);
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://127.0.0.1:8000/api/professeurs/${id}`);
        loadProfesseurs();
    };

    const handleEdit = (professeur) => {
        setFormData(professeur);
        setEditId(professeur.id);
    };

    return (
        <div className=" mt-4">

            <div className="row mb-3">
                <div className="col-md-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="User ID"
                        value={formData.user_id}
                        onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    />
                </div>
                <div className="col-md-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nom"
                        value={formData.nom}
                        onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    />
                </div>
                <div className="col-md-2">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                
                <div className="col-md-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Niveau d'Enseignement"
                        value={formData.niveau_enseignement}
                        onChange={(e) => setFormData({ ...formData, niveau_enseignement: e.target.value })}
                    />
                </div>
                <div className="col-md-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Diplôme"
                        value={formData.diplome}
                        onChange={(e) => setFormData({ ...formData, diplome: e.target.value })}
                    />
                </div>
                <div className="col-md-2 ">
                    <input
                        type="date"
                        className="form-control"
                        value={formData.date_embauche}
                        onChange={(e) => setFormData({ ...formData, date_embauche: e.target.value })}
                    />
                </div>
                </div>
                <div className="  w-100">
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        {editId ? "Modifier" : "Ajouter"}
                    </button>
                </div>
            <h3 className="mb-4">Liste des Professeurs</h3>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Email</th>
                        <th>Niveau d'Enseignement</th>
                        <th>Diplôme</th>
                        <th>Date d'Embauche</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {professeurs.map((professeur) => (
                        <tr key={professeur.id}>
                            <td>{professeur.id}</td>
                            <td>
                                <Link to={`/professeur/${professeur.id}`}>{professeur.nom}</Link>
                            </td>
                            <td>{professeur.email}</td>
                            <td>{professeur.niveau_enseignement}</td>
                            <td>{professeur.diplome}</td>
                            <td>{professeur.date_embauche}</td>
                            <td>
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Actions
                                </button>
                                <ul className="dropdown-menu">
                                <li>
                                    <button className="dropdown-item" onClick={() => handleEdit(professeur)}>
                                    <i className="bi bi-pencil-square me-2"></i> Modifier
                                    </button>
                                </li>
                                <li>
                                    <button className="dropdown-item text-danger" onClick={() => handleDelete(professeur.id)}>
                                    <i className="bi bi-trash me-2"></i> Supprimer
                                    </button>
                                </li>
                                </ul>
                            </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
