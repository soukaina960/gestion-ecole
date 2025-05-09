import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFilePdf, FaCheck, FaSpinner, FaListAlt } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const DemandeAttestationList = () => {
    const [demandes, setDemandes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchDemandes();
    }, []);

    const fetchDemandes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://127.0.0.1:8000/api/demandes-attestations');
            setDemandes(response.data);
        } catch (error) {
            toast.error('Erreur lors du chargement des demandes');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const traiterDemande = async (id) => {
        try {
            setProcessingId(id);
            await axios.post(`http://127.0.0.1:8000/api/demandes-attestations/${id}/traiter`);
            toast.success('Demande traitée avec succès');
            fetchDemandes();
        } catch (error) {
            toast.error('Erreur lors du traitement');
            console.error(error);
        } finally {
            setProcessingId(null);
        }
    };

    const getFileUrl = (path) => {
        if (!path) return null;
        const cleanedPath = path.replace('storage/app/public/', '');
        return `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/storage/${cleanedPath}`;
    };

    return (
        <div className="container py-4">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h2 className="mb-0 d-flex align-items-center">
                        <FaListAlt className="me-2" />
                        Demandes d'Attestations
                    </h2>
                </div>
                
                <div className="card-body">
                    {loading ? (
                        <div className="text-center py-5">
                            <FaSpinner className="fa-spin me-2" size="2em" />
                            <p>Chargement des demandes...</p>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>Étudiant</th>
                                        <th className="text-center">Statut</th>
                                        <th className="text-center">Attestation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {demandes.map(demande => (
                                        <tr key={demande.id}>
                                            <td>
                                                {demande.etudiant?.nom} {demande.etudiant?.prenom}
                                                <br />
                                                <small className="text-muted">{demande.etudiant?.matricule}</small>
                                            </td>
                                            <td className="text-center">
                                                {demande.traitee ? (
                                                    <span className="badge bg-success">Traitée</span>
                                                ) : (
                                                    <span className="badge bg-warning text-dark">En attente</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {demande.lien_attestation ? (
                                                    <a
                                                        href={getFileUrl(demande.lien_attestation)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline-primary"
                                                    >
                                                        <FaFilePdf className="me-1" />
                                                        Télécharger
                                                    </a>
                                                ) : (
                                                    <span className="text-muted">Non disponible</span>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                {!demande.traitee && (
                                                    <button
                                                        onClick={() => traiterDemande(demande.id)}
                                                        disabled={processingId === demande.id}
                                                        className="btn btn-sm btn-success"
                                                    >
                                                        {processingId === demande.id ? (
                                                            <>
                                                                <FaSpinner className="fa-spin me-1" />
                                                                Traitement...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FaCheck className="me-1" />
                                                                Traiter
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DemandeAttestationList;