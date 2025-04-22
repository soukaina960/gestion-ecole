import React, { useEffect, useState } from "react";
import { getClassrooms, addClassroom, deleteClassroom } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ClassroomList() {
    const [classrooms, setClassrooms] = useState([]);
    const [name, setName] = useState("");
    const [capacite, setCapacite] = useState("");
    const [niveau, setNiveau] = useState("");
    const [filiereId, setFiliereId] = useState("");
    const [filieres, setFilieres] = useState([]);

    async function loadFilieres() {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/filieres");
            const filieresData = await response.json();
            console.log("Données des filières:", filieresData);
            // Vérifiez la structure des données ici
            setFilieres(filieresData.data || filieresData); // Selon la structure de votre API
        } catch (error) {
            console.error("Erreur lors de la récupération des filières", error);
        }
    }
    
    useEffect(() => {
        loadClassrooms();
        loadFilieres();
    }, []);

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
    
            // Ajouter filiere_id seulement si sélectionné
            if (filiereId) {
                dataToSend.filiere_id = filiereId;
            }
    
            await addClassroom(dataToSend);
            setName("");
            setCapacite("");
            setNiveau("");
            setFiliereId("");
            loadClassrooms();
        } catch (error) {
            console.error("Erreur complète:", error);
            alert(`Erreur: ${error.message}`);
        }
    }
    
    async function handleDeleteClassroom(id) {
        await deleteClassroom(id);
        loadClassrooms();
    }

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow-lg">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <input 
                            className="form-control" 
                            placeholder="Nom de la classe" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div className="col-md-4">
                        <input 
                            type="number" 
                            className="form-control" 
                            placeholder="Capacité" 
                            value={capacite} 
                            onChange={(e) => setCapacite(e.target.value)} 
                        />
                    </div>
                    <div className="col-md-4">
                        <input 
                            className="form-control" 
                            placeholder="Niveau (ex: Primaire, Secondaire)" 
                            value={niveau} 
                            onChange={(e) => setNiveau(e.target.value)} 
                        />
                    </div>
                    <div className="col-md-4 mt-3">
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
                    <div className="col-md-12 mt-3">
                        <button className="btn btn-primary w-100" onClick={handleAddClassroom}>Ajouter la classe</button>
                    </div>
                </div>

                <h2 className="text-center text-primary mt-5">Liste des classes</h2>
                <table className="table table-bordered">
                    <thead>
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
                                <td>
                                    <button className="btn btn-danger" onClick={() => handleDeleteClassroom(classroom.id)}>
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}