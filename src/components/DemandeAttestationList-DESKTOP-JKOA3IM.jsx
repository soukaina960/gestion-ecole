import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DemandeAttestationList = () => {
    const [demandes, setDemandes] = useState([]);

    useEffect(() => {
        fetchDemandes();
    }, []);

    const fetchDemandes = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/demandes-attestations');
            setDemandes(response.data);
        } catch (error) {
            console.error("Failed to fetch requests:", error);
        }
    };

    const traiterDemande = async (id) => {
        try {
            await axios.post(`http://localhost:8000/api/demandes-attestations/${id}/traiter`);
            fetchDemandes(); // Refresh list
        } catch (error) {
            console.error("Failed to process request:", error);
            alert("Error processing request!");
        }
    };

    return (
        <div>
            <h1>Demandes d'Attestations</h1>
            <table>
                <thead>
                    <tr>
                        <th>Étudiant</th>
                        <th>Traité</th>
                        <th>Action</th>
                        <th>Lien</th>
                    </tr>
                </thead>
                <tbody>
                    {demandes.map(demande => (
                        <tr key={demande.id}>
                            <td>{demande.etudiant.nom} {demande.etudiant.prenom}</td>
                            <td>{demande.traitee ? 'Oui' : 'Non'}</td>
                            <td>
                                {!demande.traitee && (
                                    <button onClick={() => traiterDemande(demande.id)}>
                                        Traiter
                                    </button>
                                )}
                            </td>
                            <td>
    {demande.lien_attestation ? (
        <a 
            href={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${demande.lien_attestation}`} 
            target="_blank"
            rel="noopener noreferrer"
        >
            Voir PDF
        </a>
    ) : (
        <span>Aucun fichier</span>
    )}
</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DemandeAttestationList;