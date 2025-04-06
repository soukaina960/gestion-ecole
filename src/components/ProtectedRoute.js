import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem('role'); // Récupérer le rôle de l'utilisateur du localStorage

    if (!role || !allowedRoles.includes(role)) {
        return <Navigate to="/login" />; // Rediriger si le rôle n'est pas autorisé
    }

    return children; // Rendre les enfants si le rôle est autorisé
};

export default ProtectedRoute;
