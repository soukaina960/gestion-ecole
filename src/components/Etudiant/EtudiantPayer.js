import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EtudiantPayer = () => {
    const [paiements, setPaiements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPaiements = async () => {
            try {
                const userData = localStorage.getItem('utilisateur');
                if (!userData) {
                    setError('Utilisateur non connecté');
                    return;
                }

                const user = JSON.parse(userData);
                const response = await axios.get(`http://localhost:8000/api/paiements-mensuels/${user.id}`);
                
                if (response.data.message) {
                    setError(response.data.message);
                } else {
                    setPaiements(response.data);
                }
            } catch (error) {
                setError(error.response?.data?.message || 'Erreur de connexion au serveur');
            } finally {
                setLoading(false);
            }
        };

        fetchPaiements();
    }, []);

    if (loading) return <div>Chargement en cours...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="paiement-container">
            <h2>Mes Paiements</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Mois</th>
                        <th>Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {paiements.map(p => (
                        <tr key={p.id}>
                            <td>{new Date(p.mois).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</td>
                            <td style={{ color: p.est_paye ? 'green' : 'red' }}>
                                {p.est_paye ? 'Payé' : 'Non payé'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EtudiantPayer;
