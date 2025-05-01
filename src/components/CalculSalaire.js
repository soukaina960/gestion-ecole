import React, { useState, useEffect } from "react";
import axios from "axios";

function CalculSalaireProfesseur() {
    const [selectedProfesseur, setSelectedProfesseur] = useState("");
    const [prime, setPrime] = useState("");
    const [pourcentage, setPourcentage] = useState("");
    const [salaire, setSalaire] = useState(null);
    const [messageErreur, setMessageErreur] = useState("");
    const [professeurs, setProfesseurs] = useState([]);
    const [etudiants, setEtudiants] = useState([]);
    const [refresh, setRefresh] = useState(false);

    // Récupérer la liste des professeurs et étudiants
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profResponse, etudResponse] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/professeurs"),
                    axios.get("http://127.0.0.1:8000/api/etudiants")
                ]);
                setProfesseurs(profResponse.data);
                setEtudiants(etudResponse.data);
            } catch (error) {
                console.error("Erreur lors du chargement des données", error);
            }
        };

        fetchData();
    }, [refresh]);

    // Calculer le salaire
    const handleCalculerSalaire = async () => {
        if (!selectedProfesseur) {
            setMessageErreur("Veuillez sélectionner un professeur");
            return;
        }
        
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/professeurs/${selectedProfesseur}/calculer-salaire`,
                { prime: parseFloat(prime), pourcentage: parseFloat(pourcentage) }
            );
            setSalaire(response.data.salaire);
            setMessageErreur("");
        } catch (error) {
            setSalaire(null);
            setMessageErreur("Erreur lors du calcul du salaire");
            console.error(error);
        }
    };

    // Supprimer un étudiant et recalculer automatiquement
    const handleSupprimerEtudiant = async (etudiantId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/etudiants/${etudiantId}`);
            
            // Si un professeur est sélectionné, recalculer son salaire
            if (selectedProfesseur) {
                const response = await axios.post(
                    `http://127.0.0.1:8000/api/professeurs/${selectedProfesseur}/calculer-salaire`,
                    { prime: parseFloat(prime), pourcentage: parseFloat(pourcentage) }
                );
                setSalaire(response.data.salaire);
            }
            
            // Actualiser les données
            setRefresh(!refresh);
            setMessageErreur("");
        } catch (error) {
            setMessageErreur("Erreur lors de la suppression");
            console.error(error);
        }
    };


    return (
        <div className=" mt-5">
            <h1 className="text-center mb-4">Calcul du Salaire du Professeur</h1>
            <div className="row">
                <div className="mb-4 col-md-3">
                    <label htmlFor="professeurSelect" className="form-label">
                        Professeur :
                    </label>
                    <select
                        id="professeurSelect"
                        value={selectedProfesseur}
                        onChange={(e) => setSelectedProfesseur(e.target.value)}
                        className="form-select"
                    >
                        <option value="">Sélectionnez un professeur</option>
                        {professeurs.map((professeur) => (
                            <option key={professeur.id} value={professeur.id}>
                                {professeur.nom}
                            </option>
                        ))}
                    </select>
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
                        className="btn btn-primary w-100"
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
                    {professeurs.map((professeur) => (
                        <tr key={professeur.id}>
                            <td>{professeur.nom}</td>
                            <td>{professeur.total}</td>
                            <td>{professeur.pourcentage} %</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CalculSalaireProfesseur;