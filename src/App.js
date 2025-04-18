import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EtudiantDetail from './components/EtudiantDetail'; 
import Dashboard from './components/Dashboard'; // Importer le composant Dashboard
import ProfesseurDetail from './components/ProfDetail'; // Importer le composant de détail du professeur

// Composants
import LayoutAccueil from './acceuil/Layout'; // Pour la page d'accueil
import Layout from './layout/layout';    // Pour l'administration
import  ChargeForm from './components/charge'; // Pour les charges
import ConfigAttestationForm from './components/ConfigAttestationForm'; // Pour la configuration de l'attestation
import FiliereManager from './components/FiliereManager'; // Pour la gestion des filières

// Pages
import Login from './Login';

import SurveillantDashboard from './Surveillant/SurveillantDashboard';
import AbsenceList from './Surveillant/AbsenceList';
import EmploiList from './Surveillant/EmploiSur';
import IncidentList from './Surveillant/Incident';
import NotificationList from './Surveillant/Notification';
import MatiereManager from './components/matiere'; // Pour la gestion des matières

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


function App() {
  return (
    <Router>
      <div className="app-container">

        <Routes>
          <Route path="/matiere" element={<MatiereManager />} /> {/* Page de gestion des matières */}
          <Route path="/filiere" element={<FiliereManager />} /> {/* Page de gestion des filières */}
        <Route path="/admin" element={<Layout />} />
        <Route path="/config-attestation" element={<ConfigAttestationForm />} /> {/* Page de configuration des attestations */}
        <Route path="/charge" element={<ChargeForm />} /> {/* Page des charges */}
          {/* Accueil */}
          <Route path="/" element={<LayoutAccueil />} />
          <Route path="/Dashboard" element={<Dashboard />} />
          

          {/* Dashboard surveillant */}
          <Route path="/surveillant" element={<SurveillantDashboard />} />
          <Route path="/absences" element={<AbsenceList />} />
          <Route path="/emplois" element={<EmploiList />} />
          <Route path="/incidents" element={<IncidentList />} />
          <Route path="/notifications" element={<NotificationList />} />

          {/* Authentification */}
          <Route path="/login" element={<Login />} />

          {/* Admin */}
          <Route path="/etudiants/:id" element={<EtudiantDetail />} />
          <Route path="/professeur/:id" element={<ProfesseurDetail />} />

        </Routes>

        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Fonctionnaliter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/enregistrer/absence" element={<EnregistrerAbsence />} />
            <Route path="/creer-compte" element={<CreateAccount />} />
            <Route path="entrer-notes" element={<EntrerNotes />} />
            <Route path="/ajouter-fichier" element={<AjouterFichier />} />
            {/* Routes protégées */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/enseignant/dashboard" element={<ProtectedRoute allowedRoles={['professeur']}><EnseignantDashboard /></ProtectedRoute>} />
            <Route
          path="/etudiant/dashboard"
          element={
            <ProtectedRoute allowedRoles={['étudiant']}>
              <EtudiantDashboard />
            </ProtectedRoute>
          }
/>
            <Route path="/etudiant/cours" element={<EtudiantCours />} />
            <Route path="/etudiant/notes" element={<EtudiantNotes />} />
            <Route path="/etudiant/absences" element={<EtudiantAbsences />} />
            <Route path="/etudiant/infos" element={<EtudiantInfos />} />
            <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
            <Route path="/surveillant/dashboard" element={<ProtectedRoute allowedRoles={['surveillant']}><SurveillantDashboard /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />

      </div>
    </Router>
  );
}

export default App;
