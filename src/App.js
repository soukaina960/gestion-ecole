import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './acceuil/Navbar';
import Footer from './acceuil/Footer';
import Fonctionnaliter from './acceuil/Fonctionnaliter';
import Login from './Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';
import EtudiantDashboard from './pages/EtudiantDashboard';
import ParentDashboard from './pages/ParentDashboard';
import EnregistrerAbsence from './components/EnregistrerAbsence';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Fonctionnaliter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/enregistrer/absence" element={<EnregistrerAbsence />} />
            
            {/* Routes protégées */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/enseignant/dashboard" element={<ProtectedRoute allowedRoles={['professeur']}><EnseignantDashboard /></ProtectedRoute>} />
            <Route path="/etudiant/dashboard" element={<ProtectedRoute allowedRoles={['étudiant']}><EtudiantDashboard /></ProtectedRoute>} />
            <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
