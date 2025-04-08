import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EnseignantDashboard = () => {
    const [utilisateur, setUtilisateur] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const userData = localStorage.getItem('utilisateur');
            if (userData) {
                setUtilisateur(JSON.parse(userData));
            }
        } catch (err) {
            setError("Erreur de chargement des données utilisateur");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('utilisateur');
        localStorage.removeItem('access_token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Example: Handle file upload logic here
        console.log("Selected file:", file.name);
        
        // You would typically:
        // 1. Validate file type/size
        // 2. Upload to server
        // 3. Show success/error message
        alert(`Fichier ${file.name} sélectionné pour téléchargement`);
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const professeurId = utilisateur ? utilisateur.id : null;

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                {utilisateur && (
                    <h2 className="text-2xl font-bold">Bonjour, {utilisateur.nom} 👋</h2>
                )}
                <button 
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                    Déconnexion
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                    onClick={() => navigate('/enregistrer/absence')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
                >
                    ➕ Enregistrer une absence
                </button>
                <button 
                    onClick={() => navigate('/consulter-absences')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
                >
                    📄 Consulter les absences
                </button>
                <button 
                    onClick={() => navigate('/entrer-notes', { state: { professeurId } })}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
                >
                    📝 Entrer des notes
                </button>
                
                {/* File Upload Button */}
                <div className="relative">
                    <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                    />
                    <label 
                        htmlFor="file-upload"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors flex items-center justify-center cursor-pointer"
                    >
                        📁 Ajouter un fichier
                    </label>
                </div>
            </div>
        </div>
    );
};

export default EnseignantDashboard;