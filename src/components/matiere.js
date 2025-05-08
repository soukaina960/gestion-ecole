import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MatiereManager = () => {
    const [matieres, setMatieres] = useState([]);
    const [newMatiere, setNewMatiere] = useState({ nom: '', code: '' });
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);

    // Récupérer les matières au chargement du composant
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/matieres')
            .then(response => {
                setMatieres(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des matières:', error);
                setLoading(false);
            });
    }, []);

    // Ajouter une nouvelle matière
    const handleAdd = () => {
        axios.post('http://127.0.0.1:8000/api/matieres', newMatiere)
            .then(response => {
                setMatieres([...matieres, response.data.data]);
                setNewMatiere({ nom: '', code: '' });
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout de la matière:', error);
            });
    };

    // Modifier une matière
    const handleEdit = (id) => {
        const matiereToEdit = matieres.find(matiere => matiere.id === id);
        setEditing(matiereToEdit);
    };

    const handleUpdate = () => {
        axios.put(`http://127.0.0.1:8000/api/matieres/${editing.id}`, editing)
            .then(response => {
                setMatieres(matieres.map(matiere => 
                    matiere.id === editing.id ? response.data.data : matiere
                ));
                setEditing(null);
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour de la matière:', error);
            });
    };

    // Supprimer une matière
    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/matieres/${id}`)
            .then(() => {
                setMatieres(matieres.filter(matiere => matiere.id !== id));
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de la matière:', error);
            });
    };

    if (loading) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <h2>Gestion des Matières</h2>

            {/* Formulaire d'ajout ou modification */}
            <div>
                {editing ? (
                    <div>
                        <h3>Modifier la matière</h3>
                        <input
                            type="text"
                            value={editing.nom}
                            onChange={(e) => setEditing({ ...editing, nom: e.target.value })}
                            placeholder="Nom"
                        />
                        <input
                            type="text"
                            value={editing.code}
                            onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                            placeholder="Code"
                        />
                        <button onClick={handleUpdate}>Mettre à jour</button>
                    </div>
                ) : (
                    <div>
                        <h3>Ajouter une matière</h3>
                        <input
                            type="text"
                            value={newMatiere.nom}
                            onChange={(e) => setNewMatiere({ ...newMatiere, nom: e.target.value })}
                            placeholder="Nom"
                        />
                        <input
                            type="text"
                            value={newMatiere.code}
                            onChange={(e) => setNewMatiere({ ...newMatiere, code: e.target.value })}
                            placeholder="Code"
                        />
                        <button onClick={handleAdd}>Ajouter</button>
                    </div>
                )}
            </div>

            {/* Liste des matières */}
            <ul>
                {matieres.map(matiere => (
                    <li key={matiere.id}>
                        {matiere.nom} - {matiere.code}
                        <button onClick={() => handleEdit(matiere.id)}>Éditer</button>
                        <button onClick={() => handleDelete(matiere.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MatiereManager;
