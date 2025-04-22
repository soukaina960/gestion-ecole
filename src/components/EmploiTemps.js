import React, { useEffect, useState } from "react";
import { getEmploisTemps, addEmploiTemps } from "../services/api";

export default function EmploiTemps() {
    const [emplois, setEmplois] = useState([]);
    const [classeId, setClasseId] = useState("");
    const [jour, setJour] = useState("Lundi");
    const [heureDebut, setHeureDebut] = useState("");
    const [heureFin, setHeureFin] = useState("");
    const [matiere, setMatiere] = useState("");
    const [professeurId, setProfesseurId] = useState("");
    const [salle, setSalle] = useState("");

    useEffect(() => {
        loadEmplois();
    }, []);

    async function loadEmplois() {
        const data = await getEmploisTemps();
        setEmplois(data);
    }

    async function handleAdd() {
        await addEmploiTemps({ classe_id: classeId, jour, heure_debut: heureDebut, heure_fin: heureFin, matiere, professeur_id: professeurId, salle });
        loadEmplois();
    }

    return (
        <div className="container mt-4">
            <h2>Gestion des Emplois du Temps</h2>
            <div>
                <input type="text" placeholder="ID Classe" value={classeId} onChange={(e) => setClasseId(e.target.value)} />
                <input type="text" placeholder="Matière" value={matiere} onChange={(e) => setMatiere(e.target.value)} />
                <input type="time" value={heureDebut} onChange={(e) => setHeureDebut(e.target.value)} />
                <input type="time" value={heureFin} onChange={(e) => setHeureFin(e.target.value)} />
                <input type="text" placeholder="ID Professeur" value={professeurId} onChange={(e) => setProfesseurId(e.target.value)} />
                <input type="text" placeholder="Salle" value={salle} onChange={(e) => setSalle(e.target.value)} />
                <button onClick={handleAdd}>Ajouter</button>
            </div>

            <h3>Liste des Emplois du Temps</h3>
            <ul>
                {emplois.map((emploi) => (
                    <li key={emploi.id}>{emploi.jour} - {emploi.heure_debut} à {emploi.heure_fin} - {emploi.matiere} ({emploi.salle})</li>
                ))}
            </ul>
        </div>
    );
}
