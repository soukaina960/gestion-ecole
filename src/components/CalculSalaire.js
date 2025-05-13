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
    const [mois, setMois] = useState("");
    const [annee, setAnnee] = useState(new Date().getFullYear());
    const [salairesProfesseurs, setSalairesProfesseurs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [profResponse, etudResponse] = await Promise.all([
                    axios.get("http://127.0.0.1:8000/api/professeurs"),
                    axios.get("http://127.0.0.1:8000/api/etudiants")
                ]);
                setProfesseurs(profResponse.data);
                setEtudiants(etudResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des données", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [refresh]);

    useEffect(() => {
        const fetchSalaires = async () => {
            if (!mois || !annee) return;

            try {
                setLoading(true);
                const result = await Promise.all(
                    professeurs.map(async (prof) => {
                        try {
                            const response = await axios.post(
                                `http://127.0.0.1:8000/api/professeurs/${prof.id}/calculer-salaire-mensuel`,
                                {
                                    prime: parseFloat(prof.prime || 0),
                                    pourcentage: parseFloat(prof.pourcentage || 0),
                                    mois: parseInt(mois),
                                    annee: parseInt(annee)
                                }
                            );
                            return { 
                                id: prof.id,
                                nom: prof.nom, 
                                salaire: response.data.salaire,
                                prime: prof.prime,
                                pourcentage: prof.pourcentage
                            };
                        } catch (error) {
                            console.error(`Erreur pour le professeur ${prof.nom}`, error);
                            return { 
                                id: prof.id,
                                nom: prof.nom, 
                                salaire: 0,
                                prime: prof.prime,
                                pourcentage: prof.pourcentage,
                                error: true
                            };
                        }
                    })
                );
                setSalairesProfesseurs(result);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du calcul des salaires globaux", error);
                setLoading(false);
            }
        };

        fetchSalaires();
    }, [mois, annee, professeurs]);

    const handleCalculerSalaire = async () => {
        if (!selectedProfesseur || !mois || !annee) {
            setMessageErreur("Veuillez sélectionner un professeur, un mois et une année");
            return;
        }
    
        try {
            setLoading(true);
            const response = await axios.post(
                `http://127.0.0.1:8000/api/professeurs/${selectedProfesseur}/calculer-salaire-mensuel`,
                {
                    prime: parseFloat(prime) || 0,
                    pourcentage: parseFloat(pourcentage) || 0,
                    mois: parseInt(mois),
                    annee: parseInt(annee)
                }
            );
            

            
            if (response.data.salaire !== undefined) {
                setSalaire(response.data.salaire);
                setMessageErreur("");
            } else {
                setMessageErreur("Réponse inattendue du serveur");
                console.error("Réponse du serveur:", response.data);
            }
            setLoading(false);
        } catch (error) {
            setSalaire(null);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.erreur || 
                                "Erreur lors du calcul du salaire";
            setMessageErreur(errorMessage);
            console.error("Détails de l'erreur:", error.response?.data || error.message);
            setLoading(false);
        }
    };

    const handleSupprimerEtudiant = async (etudiantId) => {
        try {
            setLoading(true);
            await axios.delete(`http://127.0.0.1:8000/api/etudiants/${etudiantId}`);

            if (selectedProfesseur && mois && annee) {
                const response = await axios.post(
                    `http://127.0.0.1:8000/api/professeurs/${selectedProfesseur}/calculer-salaire-mensuel`,
                    {
                        prime: parseFloat(prime) || 0,
                        pourcentage: parseFloat(pourcentage) || 0,
                        mois: parseInt(mois),
                        annee: parseInt(annee)
                    }
                );
                setSalaire(response.data.salaire);
            }

            setRefresh(!refresh);
            setMessageErreur("");
            setLoading(false);
        } catch (error) {
            setMessageErreur("Erreur lors de la suppression");
            console.error(error);
            setLoading(false);
        }
    };

    // Générer les années possibles (5 dernières années)
    const anneesPossibles = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Calcul du Salaire du Professeur</h1>
            
            {/* Section de calcul individuel */}
            <div className="card mb-4">
                <div className="card-header">
                    <h2>Calcul individuel</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="mb-4 col-md-3">
                            <label htmlFor="professeurSelect" className="form-label">Professeur :</label>
                            <select
                                id="professeurSelect"
                                value={selectedProfesseur}
                                onChange={(e) => {
                                    setSelectedProfesseur(e.target.value);
                                    const prof = professeurs.find(p => p.id == e.target.value);
                                    if (prof) {
                                        setPrime(prof.prime || "");
                                        setPourcentage(prof.pourcentage || "");
                                    }
                                }}
                                className="form-select"
                                disabled={loading}
                            >
                                <option value="">Sélectionnez un professeur</option>
                                {professeurs.map((prof) => (
                                    <option key={prof.id} value={prof.id}>
                                        {prof.nom}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4 col-md-2">
                            <label htmlFor="mois" className="form-label">Mois :</label>
                            <select
                                id="mois"
                                value={mois}
                                onChange={(e) => setMois(e.target.value)}
                                className="form-select"
                                disabled={loading}
                            >
                                <option value="">Sélectionnez un mois</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString("fr-FR", { month: "long" })}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4 col-md-2">
                            <label htmlFor="annee" className="form-label">Année :</label>
                            <select
                                id="annee"
                                value={annee}
                                onChange={(e) => setAnnee(e.target.value)}
                                className="form-select"
                                disabled={loading}
                            >
                                {anneesPossibles.map((annee) => (
                                    <option key={annee} value={annee}>
                                        {annee}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4 col-md-2">
                            <label htmlFor="prime" className="form-label">Prime (MAD) :</label>
                            <input
                                type="number"
                                id="prime"
                                value={prime}
                                onChange={(e) => setPrime(e.target.value)}
                                className="form-control"
                                disabled={loading}
                            />
                        </div>

                        <div className="mb-4 col-md-2">
                            <label htmlFor="pourcentage" className="form-label">Pourcentage (%) :</label>
                            <input
                                type="number"
                                id="pourcentage"
                                value={pourcentage}
                                onChange={(e) => setPourcentage(e.target.value)}
                                className="form-control"
                                disabled={loading}
                            />
                        </div>

                        <div className="col-md-1 mb-4 d-flex align-items-end">
                            <button
                                onClick={handleCalculerSalaire}
                                className="btn btn-primary w-100"
                                disabled={loading}
                            >
                                {loading ? 'Calcul...' : 'Calculer'}
                            </button>
                        </div>
                    </div>

                    {salaire !== null && (
                        <div className="mt-4 alert alert-success">
                            <strong>Salaire calculé :</strong> {salaire.toFixed(2)} MAD
                        </div>
                    )}

                    {messageErreur && (
                        <div className="mt-4 alert alert-danger">{messageErreur}</div>
                    )}
                </div>
            </div>

            {/* Tableau des salaires mensuels */}
            <div className="card mb-4">
                <div className="card-header">
                    <h2>Salaires des Professeurs</h2>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-md-3">
                            <label htmlFor="moisGlobal" className="form-label">Mois :</label>
                            <select
                                id="moisGlobal"
                                value={mois}
                                onChange={(e) => setMois(e.target.value)}
                                className="form-select"
                                disabled={loading}
                            >
                                <option value="">Tous les mois</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {new Date(0, i).toLocaleString("fr-FR", { month: "long" })}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="anneeGlobal" className="form-label">Année :</label>
                            <select
                                id="anneeGlobal"
                                value={annee}
                                onChange={(e) => setAnnee(e.target.value)}
                                className="form-select"
                                disabled={loading}
                            >
                                {anneesPossibles.map((annee) => (
                                    <option key={annee} value={annee}>
                                        {annee}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading && salairesProfesseurs.length === 0 ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Chargement...</span>
                            </div>
                        </div>
                    ) : salairesProfesseurs.length > 0 && mois && annee ? (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Nom du Professeur</th>
                                        <th>Prime (MAD)</th>
                                        <th>Pourcentage (%)</th>
                                        <th>Salaire (MAD)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salairesProfesseurs.map((item, index) => (
                                        <tr key={index} className={item.error ? "table-danger" : ""}>
                                            <td>{item.nom}</td>
                                            <td>{item.prime || 0}</td>
                                            <td>{item.pourcentage || 0}</td>
                                            <td>
                                                {item.error ? 
                                                    " non salaire existe pour ce professeur  " : 
                                                    item.salaire.toFixed(2) + " MAD"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-3 text-end">
                                <strong>Total des salaires : </strong>
                                {salairesProfesseurs.reduce((sum, item) => sum + (item.error ? 0 : item.salaire), 0).toFixed(2)} MAD
                            </div>
                        </div>
                    ) : (
                        <div className="alert alert-info">
                            {mois && annee ? "Aucun salaire à afficher" : "Veuillez sélectionner un mois et une année"}
                        </div>
                    )}
                </div>
            </div>
            </div>
    );
}

export default CalculSalaireProfesseur;