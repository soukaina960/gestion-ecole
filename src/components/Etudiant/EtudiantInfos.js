import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EtudiantInfos.css';

function EtudiantInfos() {
    const [etudiantInfo, setEtudiantInfo] = useState(null);
    const [etudiantDetails, setEtudiantDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        matricule: '',
        email: '',
        adresse: '',
        telephone: '',
        role: '',
        origine: '',
        parent_id: '',
        date_naissance: '',
        sexe: '',
        montant_a_payer: '',
        classe_id: '',
    });

    useEffect(() => {
        const fetchEtudiantInfo = async () => {
            try {
                const userData = localStorage.getItem('utilisateur');
                if (!userData) {
                    setError('Utilisateur non connecté');
                    return;
                }

                const parsedUser = JSON.parse(userData);
                const userId = parsedUser.id;

                // Récupérer les informations de l'utilisateur
                const response = await axios.get(`http://127.0.0.1:8000/api/utilisateurs/${userId}`);
                
                if (response.data && response.data.id) {
                    setEtudiantInfo(response.data);
                    // Récupérer les détails de l'étudiant à partir d'un autre endpoint
                    const etudiantResponse = await axios.get(`http://127.0.0.1:8000/api/etudiants/${userId}`);
                    setEtudiantDetails(etudiantResponse.data); // Mettre à jour avec les détails d'étudiant
                    setFormData({
                        nom: response.data.nom || '',
                        matricule: response.data.matricule || '',
                        email: response.data.email || '',
                        adresse: response.data.adresse || '',
                        telephone: response.data.telephone || '',
                        role: response.data.role || '',
                        origine: etudiantResponse.data.origine || '',
                        parent_id: etudiantResponse.data.parent_id || '',
                        date_naissance: etudiantResponse.data.date_naissance || '',
                        sexe: etudiantResponse.data.sexe || '',
                        montant_a_payer: etudiantResponse.data.montant_a_payer || '',
                        classe_id: etudiantResponse.data.classe_id || '',
                    });
                } else {
                    setError('Aucune donnée trouvée pour cet étudiant');
                }
            } catch (error) {
                setError('Erreur lors de la récupération des données');
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEtudiantInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const userData = localStorage.getItem('utilisateur');
            const parsedUser = JSON.parse(userData);
            const userId = parsedUser.id;

            const response = await axios.put(`http://127.0.0.1:8000/api/utilisateurs/${userId}`, formData);

            if (response.status === 200) {
                setEtudiantInfo(response.data);
                setIsEditing(false);
            } else {
                setError('Échec de la mise à jour des informations');
            }
        } catch (error) {
            setError('Erreur lors de la mise à jour des données');
            console.error('Erreur:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        const etudiantData = etudiantDetails || {};
        setFormData({
            nom: etudiantInfo.nom || '',
            matricule: etudiantInfo.matricule || '',
            email: etudiantInfo.email || '',
            adresse: etudiantInfo.adresse || '',
            telephone: etudiantInfo.telephone || '',
            role: etudiantInfo.role || '',
            origine: etudiantData.origine || '',
            parent_id: etudiantData.parent_id || '',
            date_naissance: etudiantData.date_naissance || '',
            sexe: etudiantData.sexe || '',
            montant_a_payer: etudiantData.montant_a_payer || '',
            classe_id: etudiantData.classe_id || '',
        });
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Information de l'Étudiant</h1>
            <div className="space-y-4">
                {isEditing ? (
                    <div>
                        {/* Formulaire d'édition */}
                    </div>
                ) : (
                    <div>
                        <p><strong>Nom:</strong> {etudiantInfo.nom}</p>
                        <p><strong>Matricule:</strong> {etudiantInfo.matricule}</p>
                        <p><strong>Email:</strong> {etudiantInfo.email}</p>
                        <p><strong>Adresse:</strong> {etudiantInfo.adresse}</p>
                        <p><strong>Téléphone:</strong> {etudiantInfo.telephone}</p>
                        <p><strong>Rôle:</strong> {etudiantInfo.role}</p>
                        <p><strong>Origine:</strong> {etudiantDetails ? etudiantDetails.origine : ''}</p>
                        <p><strong>Date de naissance:</strong> {etudiantDetails ? etudiantDetails.date_naissance : ''}</p>
                        <p><strong>Sexe:</strong> {etudiantDetails ? etudiantDetails.sexe : ''}</p>
                        <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white p-2 rounded">Modifier</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EtudiantInfos;
