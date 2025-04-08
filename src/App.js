import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './acceuil/Layout';
import Login from './Login';
<<<<<<< HEAD
import SurveillantDashboard from './Surveillant/SurveillantDashboard';
import AbsenceList from './Surveillant/AbsenceList';
import EmploiList from './Surveillant/EmploiSur';
import IncidentList from './Surveillant/Incident';
import NotificationList from './Surveillant/Notification';
=======
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';
import EtudiantDashboard from './pages/EtudiantDashboard';
import ParentDashboard from './pages/ParentDashboard';
import EnregistrerAbsence from './components/EnregistrerAbsence';


import './App.css';
import CreateAccount from './pages/CreateAccount';
import EntrerNotes from './components/EntrerNotes';
>>>>>>> 99f0065 (partie prf ajouter note)

function App() {
  return (
    <Router>
      <div className="app-container">
<<<<<<< HEAD
        <Routes>
          {/* Main page route */}
          <Route path="/" element={<Layout />} />  
          <Route path="/surveillant" element={<SurveillantDashboard />} /> 
          <Route path="/absences" element={<AbsenceList />} />
          <Route path="/emplois" element={<EmploiList />} />
          <Route path="/incidents" element={<IncidentList />} />     
             
          <Route path="/login" element={<Login />} />
          
          {/* You can add more routes here as needed */}
        </Routes>
=======
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Fonctionnaliter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/enregistrer/absence" element={<EnregistrerAbsence />} />
            <Route path="/creer-compte" element={<CreateAccount />} />
            <Route path="entrer-notes" element={<EntrerNotes />} />
            {/* Routes protégées */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/enseignant/dashboard" element={<ProtectedRoute allowedRoles={['professeur']}><EnseignantDashboard /></ProtectedRoute>} />
            <Route path="/etudiant/dashboard" element={<ProtectedRoute allowedRoles={['étudiant']}><EtudiantDashboard /></ProtectedRoute>} />
            <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
            
          </Routes>
        </main>
        <Footer />
>>>>>>> 99f0065 (partie prf ajouter note)
      </div>
    </Router>
  );
}

export default App;