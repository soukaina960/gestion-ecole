import React, { useState, useEffect } from "react";
import axios from "axios";

function CalculSalaireProfesseur() {
    const [professeurId, setProfesseurId] = useState(""); // ID du professeur
    const [prime, setPrime] = useState(""); // Prime à entrer
    const [pourcentage, setPourcentage] = useState(""); // Pourcentage à entrer
    const [salaire, setSalaire] = useState(null); // Stockage du salaire calculé
    const [messageErreur, setMessageErreur] = useState(""); // Message d'erreur en cas de problème
    const [professeurs, setProfesseurs] = useState([]); // Liste des professeurs

    // Fonction pour récupérer la liste des professeurs
    useEffect(() => {
        const fetchProfesseurs = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/professeurs");
                setProfesseurs(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des professeurs", error);
            }
        };

        fetchProfesseurs();
    }, []);

    // Fonction pour calculer le salaire
    const handleCalculerSalaire = async () => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/professeurs/${professeurId}/calculer-salaire`,
                {
                    prime: parseFloat(prime),
                    pourcentage: parseFloat(pourcentage),
                }
            );
            setSalaire(response.data.salaire); // Met à jour le salaire calculé
            setMessageErreur(""); // Réinitialise les erreurs si l'opération réussit
        } catch (error) {
            setSalaire(null);
            setMessageErreur("Erreur lors du calcul du salaire. Vérifiez les informations et réessayez.");
            console.error(error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Calcul du Salaire du Professeur</h1>
            <div className="row">
            <div className="mb-4 col-md-3">
                <label htmlFor="professeurId" className="form-label">
                    ID du Professeur :
                </label>
                <input
                    type="text"
                    id="professeurId"
                    value={professeurId}
                    onChange={(e) => setProfesseurId(e.target.value)}
                    placeholder="Entrez l'ID du professeur"
                    className="form-control"
                />
            </div>

            <div className="mb-4 col-md-3">
                <label htmlFor="prime" className="form-label">
                    Prime (MAD) :
                </label>
                <input
                    type="number"
                    id="prime"
                    value={prime}
                    onChange={(e) => setPrime(e.target.value)}
                    placeholder="Entrez la prime"
                    className="form-control"
                />
            </div>

            <div className="mb-4 col-md-3">
                <label htmlFor="pourcentage" className="form-label">
                    Pourcentage (%) :
                </label>
                <input
                    type="number"
                    id="pourcentage"
                    value={pourcentage}
                    onChange={(e) => setPourcentage(e.target.value)}
                    placeholder="Entrez le pourcentage"
                    className="form-control"
                />
            </div>
            <div className="col-md-3 mb-4 mt-4">
            <button
                onClick={handleCalculerSalaire}
                className="btn btn-primary w-100 "
            >
                Calculer le Salaire
            </button>
            </div>
            </div>
            {salaire !== null && (
                <div className="mt-4 alert alert-success">
                    <strong>Salaire calculé :</strong> {salaire.toFixed(2)} MAD
                </div>
            )}

            {messageErreur && (
                <div className="mt-4 alert alert-danger">
                    {messageErreur}
                </div>
            )}

            {/* Tableau des professeurs */}
            <h2 className="text-center mt-5">Liste des Professeurs</h2>
            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Montant Total</th>
                        <th>Pourcentage</th>
                    </tr>
                </thead>
                <tbody>
                    {professeurs.map((professeur) => {
                        
                        return (
                            <tr key={professeur.id}>
                                <td>{professeur.nom}</td>
                                <td>{professeur.total}</td>
                                <td>{professeur.pourcentage} %</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default CalculSalaireProfesseur;
