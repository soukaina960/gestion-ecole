import React, { useState, useEffect } from "react";
import axios from "axios";

function CalculSalaireProfesseur() {
    const [selectedProfesseur, setSelectedProfesseur] = useState("");
    const [prime, setPrime] = useState("");
    const [pourcentage, setPourcentage] = useState("");
    const [salaire, setSalaire] = useState(null);
    const [messageErreur, setMessageErreur] = useState("");
    const [professeurs, setProfesseurs] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [mois, setMois] = useState("");
    const [annee, setAnnee] = useState(new Date().getFullYear());
    const [salairesProfesseurs, setSalairesProfesseurs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Chargement des professeurs
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const profResponse = await axios.get("http://127.0.0.1:8000/api/professeurs");
                setProfesseurs(profResponse.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des professeurs", error);
                setMessageErreur("Erreur lors du chargement des professeurs");
                setLoading(false);
            }
        };
        fetchData();
    }, [refresh]);

    // Récupération des salaires existants
    useEffect(() => {
        const fetchSalairesExistants = async () => {
            if (!mois || !annee) return;

            try {
                setLoading(true);
                const response = await axios.get("http://127.0.0.1:8000/api/salaires-mensuels", {
                    params: { mois, annee }
                });
                setSalairesProfesseurs(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors de la récupération des salaires", error);
                setMessageErreur("Erreur lors de la récupération des salaires");
                setLoading(false);
            }
        };

        fetchSalairesExistants();
    }, [mois, annee, refresh]);

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
                // Rafraîchir la liste des salaires après calcul
                const updatedSalaires = await axios.get("http://127.0.0.1:8000/api/salaires-mensuels", {
                    params: { mois, annee }
                });
                setSalairesProfesseurs(updatedSalaires.data);
            } else {
                setMessageErreur("Réponse inattendue du serveur");
            }
            setLoading(false);
        } catch (error) {
            setSalaire(null);
            const errorMessage = error.response?.data?.message || 
                                "Erreur lors du calcul du salaire";
            setMessageErreur(errorMessage);
            setLoading(false);
        }
    };

    const calculerTousLesSalaires = async () => {
        try {
            setLoading(true);
            await axios.post("http://127.0.0.1:8000/api/calculer-salaires", {
                mois: parseInt(mois),
                annee: parseInt(annee)
            });
            
            // Rafraîchir la liste des salaires après calcul
            const response = await axios.get("http://127.0.0.1:8000/api/salaires-mensuels", {
                params: { mois, annee }
            });
            setSalairesProfesseurs(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Erreur lors du calcul des salaires", error);
            setMessageErreur("Erreur lors du calcul des salaires");
            setLoading(false);
        }
    };

    // Générer les années possibles (5 dernières années)
    const anneesPossibles = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

    // Formater le nom du mois
    const getMonthName = (monthNumber) => {
        return new Date(0, monthNumber - 1).toLocaleString("fr-FR", { month: "long" });
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Gestion des Salaires des Professeurs</h1>
            
            {messageErreur && (
                <div className="alert alert-danger mb-4">{messageErreur}</div>
            )}

            {/* Section de calcul individuel */}
            <div className="card mb-4">
                <div className="card-header">
                    <h2>Calcul individuel</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="mb-3 col-md-3">
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

                        <div className="mb-3 col-md-2">
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
                                        {getMonthName(i + 1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3 col-md-2">
                            <label htmlFor="annee" className="form-label">Année :</label>
                            <select
                                id="annee"
                                value={annee}
                                onChange={(e) => setAnnee(e.target.value)}
                                className="form-select"
                                disabled={loading}
                            >
                                {anneesPossibles.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-3 col-md-2">
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

                        <div className="mb-3 col-md-2">
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

                        <div className="col-md-1 mb-3 d-flex align-items-end">
                            <button
                                onClick={handleCalculerSalaire}
                                className="btn btn-primary w-100"
                                disabled={loading || !selectedProfesseur}
                            >
                                {loading ? 'Calcul...' : 'Calculer'}
                            </button>
                        </div>
                    </div>

                    {salaire !== null && (
                        <div className="mt-3 alert alert-success">
                            <strong>Salaire calculé :</strong> {salaire.toFixed(2)} MAD
                        </div>
                    )}
                </div>
            </div>

            {/* Tableau des salaires mensuels */}
            <div className="card mb-4">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">Salaires des Professeurs</h2>
                    <button
                        onClick={calculerTousLesSalaires}
                        className="btn btn-secondary"
                        disabled={loading || !mois || !annee}
                    >
                        {loading ? 'Calcul en cours...' : 'Recalculer tous'}
                    </button>
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
                                <option value="">Sélectionnez un mois</option>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {getMonthName(i + 1)}
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
                                {anneesPossibles.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th>Nom du Professeur</th>
                                    <th>Mois</th>
                                    <th>Année</th>
                                    <th>Salaire Total (dh)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salairesProfesseurs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center">
                                            Aucun salaire enregistré pour cette période.
                                        </td>
                                    </tr>
                                ) : (
                                    salairesProfesseurs.map((salaire) => (
                                        <tr key={salaire.id}>
                                            <td>{salaire.professeur_nom}</td>
                                            <td>{getMonthName(salaire.mois)}</td>
                                            <td>{salaire.annee}</td>
                                            <td>{salaire.salaire}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default CalculSalaireProfesseur;