import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Composants communs
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './acceuil/Navbar';
import Footer from './acceuil/Footer';
import Layout from './acceuil/Layout';

// Pages générales
import Login from './Login';
import CreateAccount from './pages/CreateAccount';
import Dashboard from './components/Dashboard';

// Dashboards utilisateurs
import AdminDashboard from './pages/AdminDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';
import EtudiantDashboard from './pages/EtudiantDashboard';
import ParentDashboard from './pages/ParentDashboard';
import SurveillantDashboard from './Surveillant/SurveillantDashboard';

// Admin - gestion
import AdminLayout from './layout/layoutAdmin';
import ChargeForm from './components/charge';
import ConfigAttestationForm from './components/ConfigAttestationForm';
import FiliereManager from './components/FiliereManager';
import MatiereManager from './components/matiere';
import AjouterFichier from './components/AjouterFichier';
import EntrerNotes from './components/EntrerNotes';
import EnregistrerAbsence from './components/EnregistrerAbsence';
import EtudiantDetail from './components/EtudiantDetail';
import ProfesseurDetail from './components/ProfDetail';
import CreneauList from './components/crenau';
import GenererEmploiTemps from './components/EmploiTemps';
import EmploiDuTempsComplet from './components/listeemploi';

// Étudiant
import EtudiantCours from './components/Etudiant/EtudiantCours';
import EtudiantNotes from './components/Etudiant/EtudiantNotes';
import EtudiantAbsences from './components/Etudiant/EtudiantAbsences';
import EtudiantInfos from './components/Etudiant/EtudiantInfos';
import EtudiantPayer from './components/Etudiant/EtudiantPayer';
import ListeDemandesEtudiant from './components/Etudiant/MesDemandes';
import DemanderAttestation from './components/Etudiant/DemandeEtudiant';

// Surveillant
import AbsenceList from './Surveillant/AbsenceList';
import EmploiList from './Surveillant/EmploiSur';
import IncidentList from './Surveillant/Incident';
import NotificationList from './Surveillant/Notification';
import AjouterExamen from './components/AjouterExamen';

function App() {
  return (
    <Router>
      <Routes>
        {/* Accueil / Authentification */}
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/creer-compte" element={<CreateAccount />} />

        {/* Dashboards protégés */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/enseignant/dashboard" element={<ProtectedRoute allowedRoles={['professeur']}><EnseignantDashboard /></ProtectedRoute>} />
        <Route path="/etudiant/dashboard" element={<ProtectedRoute allowedRoles={['étudiant']}><EtudiantDashboard /></ProtectedRoute>} />
        <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
        <Route path="/surveillant/dashboard" element={<ProtectedRoute allowedRoles={['surveillant']}><SurveillantDashboard /></ProtectedRoute>} />
       

<Route path="/ajouter" element={<AjouterExamen />} />

        {/* Admin - gestion */}
        <Route path="/matiere" element={<MatiereManager />} />
        <Route path="/filiere" element={<FiliereManager />} />
        <Route path="/config-attestation" element={<ConfigAttestationForm />} />
        <Route path="/charge" element={<ChargeForm />} />
        <Route path="/admin" element={<AdminLayout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/etudiants/:id" element={<EtudiantDetail />} />
        <Route path="/professeur/:id" element={<ProfesseurDetail />} />
        <Route path="/enregistrer/absence" element={<EnregistrerAbsence />} />
        <Route path="/entrer-notes" element={<EntrerNotes />} />
        <Route path="/ajouter-fichier" element={<AjouterFichier />} />
        <Route path="/creaux" element={<CreneauList />} />
        <Route path='/GenererEmploiTemps' element={<GenererEmploiTemps />} />
        <Route path='/listeemploi' element={<EmploiDuTempsComplet />} />

        {/* Étudiant */}
        <Route path="/etudiant/cours" element={<EtudiantCours />} />
        <Route path="/etudiant/notes" element={<EtudiantNotes />} />
        <Route path="/etudiant/absences" element={<EtudiantAbsences />} />
        <Route path="/etudiant/infos" element={<EtudiantInfos />} />
        <Route path="/etudiant/payer" element={<EtudiantPayer />} />
        <Route path="/mes-demandes/:etudiantId" element={<ListeDemandesEtudiant />} />
        <Route path="/demander-attestation" element={<DemanderAttestation />} />

        {/* Surveillant */}
        <Route path="/surveillant/absences" element={<AbsenceList />} />
        <Route path="/surveillant/emplois" element={<EmploiList />} />
        <Route path="/surveillant/incidents" element={<IncidentList />} />
        <Route path="/surveillant/notifications" element={<NotificationList />} />
      </Routes>
    </Router>
  );
}

export default App;
