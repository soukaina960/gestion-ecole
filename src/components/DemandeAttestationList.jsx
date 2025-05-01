import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DemandeAttestationList = () => {
    const [demandes, setDemandes] = useState([]);

    useEffect(() => {
        fetchDemandes();
    }, []);

    const fetchDemandes = async () => {
        const response = await axios.get('http://127.0.0.1:8000/api/demandes-attestations');
        setDemandes(response.data);
    };

    const traiterDemande = async (id) => {
        await axios.post(`http://127.0.0.1:8000/api/demandes-attestations/${id}/traiter`);
        fetchDemandes(); // refresh list
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
                                <a href={`${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${demande.lien_attestation.replace('storage/app/public/', '')}`} 
                                target="_blank"
                                rel="noopener noreferrer">
                                Voir PDF
                                </a>
                                        
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DemandeAttestationList;
