import React, { useEffect, useState } from "react";
import { getClassrooms, addClassroom, deleteClassroom } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function ClassroomList() {
    const [classrooms, setClassrooms] = useState([]);
    const [name, setName] = useState("");
    const [capacite, setCapacite] = useState("");
    const [niveau, setNiveau] = useState("");
    const [filiereId, setFiliereId] = useState("");
    const [filieres, setFilieres] = useState([]);
    const [selectedClassroomId, setSelectedClassroomId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    async function loadFilieres() {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/filieres");
            const filieresData = await response.json();
            setFilieres(filieresData.data || filieresData);
        } catch (error) {
            console.error("Erreur lors de la récupération des filières", error);
        }
    }
    
    useEffect(() => {
        loadClassrooms();
        loadFilieres();
    }, []);

    async function handleEditClassroom() {
        try {
            const dataToSend = {
                name,
                capacite: parseInt(capacite),
                niveau,
                ...(filiereId && { filiere_id: filiereId }),
            };

            await fetch(`http://127.0.0.1:8000/api/classrooms/${selectedClassroomId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            });

            resetForm();
            loadClassrooms();
        } catch (error) {
            console.error("Erreur lors de la modification:", error);
            alert(`Erreur: ${error.message}`);
        }
    }

    function handleUpdateClassroom(classroom) {
        setName(classroom.name);
        setCapacite(classroom.capacite);
        setNiveau(classroom.niveau);
        setFiliereId(classroom.filiere_id || "");
        setSelectedClassroomId(classroom.id);
        setIsEditing(true);
    }

    function resetForm() {
        setName("");
        setCapacite("");
        setNiveau("");
        setFiliereId("");
        setSelectedClassroomId(null);
        setIsEditing(false);
    }

    async function loadClassrooms() {
        try {
            const data = await getClassrooms();
            setClassrooms(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des classes", error);
        }
    }

    async function handleAddClassroom() {
        try {
            const dataToSend = {
                name,
                capacite: parseInt(capacite),
                niveau
            };
    
            if (filiereId) {
                dataToSend.filiere_id = filiereId;
            }
    
            await addClassroom(dataToSend);
            resetForm();
            loadClassrooms();
        } catch (error) {
            console.error("Erreur complète:", error);
            alert(`Erreur: ${error.message}`);
        }
    }
    
    async function handleDeleteClassroom(id) {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette classe ?")) {
            try {
                await deleteClassroom(id);
                loadClassrooms();
            } catch (error) {
                console.error("Erreur lors de la suppression:", error);
                alert(`Erreur: ${error.message}`);
            }
        }
    }

    return (
        <div className="container mt-4">
            <div className="">
                <div className="row mb-3">
                    <div className="col-md-3">
                        <input 
                            className="form-control" 
                            placeholder="Nom de la classe" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div className="col-md-2">
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Capacité" 
                            value={capacite} 
                            onChange={(e) => setCapacite(e.target.value)} 
                            min="1"
                        />
                    </div>
                    <div className="col-md-2">
                        <select
                            className="form-control"
                            value={niveau}
                            onChange={(e) => setNiveau(e.target.value)}
                        >
                            <option value="">Sélectionner un niveau</option>
                            <option value="Primaire">Primaire</option>
                            <option value="Secondaire">Secondaire</option>
                            <option value="Universitaire">Universitaire</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <select 
                            className="form-control" 
                            value={filiereId} 
                            onChange={(e) => setFiliereId(e.target.value)} 
                        >
                            <option value="">Sélectionner une filière</option>
                            {filieres.map((filiere) => (
                                <option key={filiere.id} value={filiere.id}>
                                    {filiere.nom}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2 mt-md-0 mt-2">
                        {isEditing ? (
                            <>
                                <button className="btn btn-success w-100 me-2" onClick={handleEditClassroom}>
                                    <i className="bi bi-check-circle me-2"></i> Valider
                                </button>
                                <button className="btn btn-secondary w-100 mt-2" onClick={resetForm}>
                                    <i className="bi bi-x-circle me-2"></i> Annuler
                                </button>
                            </>
                        ) : (
                            <button className="btn btn-primary w-100" onClick={handleAddClassroom}>
                                <i className="bi bi-plus-circle me-2"></i> Ajouter
                            </button>
                        )}
                    </div>
                </div>

                <h2 className="text-center text-primary mt-5">Liste des classes</h2>
                {classrooms.length === 0 ? (
                    <div className="alert alert-info text-center">Aucune classe disponible</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead className="table-primary">
                                <tr>
                                    <th>Nom</th>
                                    <th>Capacité</th>
                                    <th>Niveau</th>
                                    <th>Filière</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classrooms.map((classroom) => (
                                    <tr key={classroom.id}>
                                        <td>{classroom.name}</td>
                                        <td>{classroom.capacite}</td>
                                        <td>{classroom.niveau}</td>
                                        <td>
                                            {classroom.filiere ? classroom.filiere.nom : 'Aucune filière'}
                                        </td>
                                        <td className="text-center">
                                            <div className="dropdown">
                                                <button 
                                                    className="btn btn-light dropdown-toggle" 
                                                    type="button" 
                                                    data-bs-toggle="dropdown" 
                                                    aria-expanded="false"
                                                >
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </button>
                                                <ul className="dropdown-menu">
                                                    <li>
                                                        <button 
                                                            className="dropdown-item text-primary" 
                                                            onClick={() => handleUpdateClassroom(classroom)}
                                                        >
                                                            <i className="bi bi-pencil-square me-2"></i> Modifier
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button 
                                                            className="dropdown-item text-danger" 
                                                            onClick={() => handleDeleteClassroom(classroom.id)}
                                                        >
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
                )}
            </div>
        </div>
    );
}