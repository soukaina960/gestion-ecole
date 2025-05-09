import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaUserGraduate } from 'react-icons/fa';
import "bootstrap/dist/css/bootstrap.min.css";

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
    const [showEditForm, setShowEditForm] = useState(false);

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
                setShowEditForm(false);
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
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce professeur ?")) {
            await axios.delete(`http://127.0.0.1:8000/api/professeurs/${id}`);
            loadProfesseurs();
        }
    };

    const handleEdit = (professeur) => {
        setFormData(professeur);
        setEditId(professeur.id);
        setShowEditForm(true);
    };

    return (
        <div className="container py-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">
                        <FaUserGraduate className="me-2" />
                        Liste des Professeurs
                    </h3>
                </div>

                {showEditForm && (
                    <div className="card-body border-bottom">
                        <h4 className="mb-4">Modifier Professeur</h4>
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label">Nom</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.nom}
                                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Niveau d'Enseignement</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.niveau_enseignement}
                                    onChange={(e) => setFormData({ ...formData, niveau_enseignement: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Diplôme</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.diplome}
                                    onChange={(e) => setFormData({ ...formData, diplome: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label">Date d'Embauche</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={formData.date_embauche}
                                    onChange={(e) => setFormData({ ...formData, date_embauche: e.target.value })}
                                />
                            </div>
                            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={() => {
                                        setShowEditForm(false);
                                        setEditId(null);
                                    }}
                                >
                                    Annuler
                                </button>
                                <button className="btn btn-primary" onClick={handleSubmit}>
                                    Enregistrer
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Niveau</th>
                                    <th>Diplôme</th>
                                    <th>Embauche</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {professeurs.map((professeur) => (
                                    <tr key={professeur.id}>
                                        <td>{professeur.id}</td>
                                        <td>
                                            <Link to={`/professeur/${professeur.id}`} className="text-decoration-none">
                                                {professeur.nom}
                                            </Link>
                                        </td>
                                        <td>{professeur.email}</td>
                                        <td>{professeur.niveau_enseignement}</td>
                                        <td>{professeur.diplome}</td>
                                        <td>{professeur.date_embauche}</td>
                                        <td className="text-center">
                                            <div className="btn-group">
                                                <button 
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => handleEdit(professeur)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button 
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDelete(professeur.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}