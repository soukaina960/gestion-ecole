import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './acceuil/Layout';
import Login from './Login';

import SurveillantDashboard from './Surveillant/SurveillantDashboard';
import AbsenceList from './Surveillant/AbsenceList';
import EmploiList from './Surveillant/EmploiSur';
import IncidentList from './Surveillant/Incident';
import NotificationList from './Surveillant/Notification';

import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';
import EtudiantDashboard from './pages/EtudiantDashboard';
import ParentDashboard from './pages/ParentDashboard';
import EnregistrerAbsence from './components/EnregistrerAbsence';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import CreateAccount from './pages/CreateAccount';
import EntrerNotes from './components/EntrerNotes';
import Fonctionnaliter from './acceuil/Fonctionnaliter';
import Navbar from './acceuil/Navbar';
import Footer from './acceuil/Footer';
import AjouterFichier from './components/AjouterFichier';
import EtudiantCours from './components/Etudiant/EtudiantCours';
import EtudiantNotes from './components/Etudiant/EtudiantNotes';
import EtudiantAbsences from './components/Etudiant/EtudiantAbsences';
import EtudiantInfos from './components/Etudiant/EtudiantInfos';
import EtudiantPayer from './components/Etudiant/EtudiantPayer';
import ListeDemandesEtudiant from './components/Etudiant/MesDemandes';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main page route */}
        <Route path="/" element={<Layout />} />  
        <Route path="/login" element={<Login />} />
        <Route path="/creer-compte" element={<CreateAccount />} />
        
        {/* Routes protégées */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/enseignant/dashboard" element={<ProtectedRoute allowedRoles={['professeur']}><EnseignantDashboard /></ProtectedRoute>} />
        <Route path="/etudiant/dashboard" element={<ProtectedRoute allowedRoles={['étudiant']}><EtudiantDashboard /></ProtectedRoute>} />
        <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
        <Route path="/surveillant/dashboard" element={<ProtectedRoute allowedRoles={['surveillant']}><SurveillantDashboard /></ProtectedRoute>} />
        <Route path="/mes-demandes/:etudiantId" element={<ListeDemandesEtudiant />} />


        {/* Surveillant Routes */}
        <Route path="/surveillant/absences" element={<AbsenceList />} />
        <Route path="/surveillant/emplois" element={<EmploiList />} />
        <Route path="/surveillant/incidents" element={<IncidentList />} />
        <Route path="/surveillant/notifications" element={<NotificationList />} />

        {/* Etudiant Routes */}
        <Route path="/etudiant/cours" element={<EtudiantCours />} />
        <Route path="/etudiant/notes" element={<EtudiantNotes />} />
        <Route path="/etudiant/absences" element={<EtudiantAbsences />} />
        <Route path="/etudiant/infos" element={<EtudiantInfos />} />
        <Route path="/etudiant/payer" element={<EtudiantPayer />} />
        
        {/* Admin routes */}
        <Route path="/enregistrer/absence" element={<EnregistrerAbsence />} />
        <Route path="/entrer-notes" element={<EntrerNotes />} />
        <Route path="/ajouter-fichier" element={<AjouterFichier />} />
      </Routes>
    </Router>
  );
}

export default App;
