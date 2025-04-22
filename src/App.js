import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

<<<<<<< HEAD
// Pages générales
=======
// Composants
import AdminLayout  from './layout/layoutAdmin';    // Pour l'administration
import  ChargeForm from './components/charge'; // Pour les charges
import ConfigAttestationForm from './components/ConfigAttestationForm'; // Pour la configuration de l'attestation
import FiliereManager from './components/FiliereManager'; // Pour la gestion des filières
import CreneauList from './components/crenau'; // Pour la gestion des créneaux

// Pages
>>>>>>> b8e84f61ccfd49eb322067db03b3fb03cf35ac68
import Login from './Login';
import CreateAccount from './pages/CreateAccount';

import Dashboard from './components/Dashboard';

// Composants admin / gestion

import ChargeForm from './components/charge';
import ConfigAttestationForm from './components/ConfigAttestationForm';
import FiliereManager from './components/FiliereManager';
import MatiereManager from './components/matiere';
import AjouterFichier from './components/AjouterFichier';
import EntrerNotes from './components/EntrerNotes';
import EnregistrerAbsence from './components/EnregistrerAbsence';
import EtudiantDetail from './components/EtudiantDetail';
import ProfesseurDetail from './components/ProfDetail';

// Composants surveillant
import SurveillantDashboard from './Surveillant/SurveillantDashboard';
import AbsenceList from './Surveillant/AbsenceList';
import EmploiList from './Surveillant/EmploiSur';
import IncidentList from './Surveillant/Incident';
import NotificationList from './Surveillant/Notification';

<<<<<<< HEAD
// Composants étudiant
=======
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';
import EtudiantDashboard from './pages/EtudiantDashboard';
import ParentDashboard from './pages/ParentDashboard';
import EnregistrerAbsence from './components/EnregistrerAbsence';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CreateAccount from './pages/CreateAccount';
import EntrerNotes from './components/EntrerNotes';
import Fonctionnaliter from './acceuil/Fonctionnaliter';
import Navbar from './acceuil/Navbar';
import Footer from './acceuil/Footer';
import AjouterFichier from './components/AjouterFichier';
>>>>>>> b8e84f61ccfd49eb322067db03b3fb03cf35ac68
import EtudiantCours from './components/Etudiant/EtudiantCours';
import EtudiantNotes from './components/Etudiant/EtudiantNotes';
import EtudiantAbsences from './components/Etudiant/EtudiantAbsences';
import EtudiantInfos from './components/Etudiant/EtudiantInfos';
<<<<<<< HEAD
import GenererEmploiTemps from './components/EmploiTemps'; // Pour la génération de l'emploi du temps
import EmploiDuTempsComplet from './components/listeemploi'; // Pour la gestion des emplois du temps

=======
import EtudiantPayer from './components/Etudiant/EtudiantPayer';
import ListeDemandesEtudiant from './components/Etudiant/MesDemandes';
>>>>>>> 4617749c6b028b61b0f86d7bd3dcdd8b1cf9c243

// Dashboards utilisateurs
import AdminDashboard from './pages/AdminDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';
import EtudiantDashboard from './pages/EtudiantDashboard';
import ParentDashboard from './pages/ParentDashboard';

// Sécurité
import ProtectedRoute from './components/ProtectedRoute';
import DemanderAttestation from './components/Etudiant/DemandeEtudiant';
import Layout from './acceuil/Layout';
// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Page d'accueil et login */}
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/creer-compte" element={<CreateAccount />} />

<<<<<<< HEAD
        {/* Dashboards protégés */}
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
        />
        <Route
          path="/enseignant/dashboard"
          element={<ProtectedRoute allowedRoles={['professeur']}><EnseignantDashboard /></ProtectedRoute>}
        />
        <Route
          path="/etudiant/dashboard"
          element={<ProtectedRoute allowedRoles={['étudiant']}><EtudiantDashboard /></ProtectedRoute>}
        />
        <Route
          path="/parent/dashboard"
          element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>}
        />
        <Route
          path="/surveillant/dashboard"
          element={<ProtectedRoute allowedRoles={['surveillant']}><SurveillantDashboard /></ProtectedRoute>}
        />

        {/* Admin - gestion */}
        <Route path="/matiere" element={<MatiereManager />} />
        <Route path="/filiere" element={<FiliereManager />} />
        <Route path="/config-attestation" element={<ConfigAttestationForm />} />
        <Route path="/charge" element={<ChargeForm />} />
        <Route path="/admin" element={<Layout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/etudiants/:id" element={<EtudiantDetail />} />
        <Route path="/professeur/:id" element={<ProfesseurDetail />} />
        <Route path="/enregistrer/absence" element={<EnregistrerAbsence />} />
        <Route path="/entrer-notes" element={<EntrerNotes />} />
        <Route path="/ajouter-fichier" element={<AjouterFichier />} />
=======
<<<<<<< HEAD
=======
        <Routes>
          <Route path="/creaux" element={<CreneauList />} /> {/* Page de gestion des créneaux */}
          <Route path='/GenererEmploiTemps' element={<GenererEmploiTemps />} /> {/* Page de génération de l'emploi du temps */}
        <Route path="/admin" element={<AdminLayout  />} />
        <Route path='/listeemploi' element={<EmploiDuTempsComplet />} /> {/* Page de gestion des emplois du temps */}
          <Route path="/matiere" element={<MatiereManager />} /> {/* Page de gestion des matières */}
          <Route path="/filiere" element={<FiliereManager />} /> {/* Page de gestion des filières */}
        <Route path="/config-attestation" element={<ConfigAttestationForm />} /> {/* Page de configuration des attestations */}
        <Route path="/charge" element={<ChargeForm />} /> {/* Page des charges */}
          {/* Accueil */}
          <Route path="/Dashboard" element={<Dashboard />} />
          
>>>>>>> b8e84f61ccfd49eb322067db03b3fb03cf35ac68


<<<<<<< HEAD
        {/* Étudiant */}
=======
          {/* Authentification */}
          <Route path="/login" element={<Login />} />

          {/* Admin */}
          <Route path="/etudiants/:id" element={<EtudiantDetail />} />
          <Route path="/professeur/:id" element={<ProfesseurDetail />} />

        </Routes>
>>>>>>> 9b2f84d045c97926a1471fa954e828dc062988a3

<<<<<<< HEAD
      
=======
        {/* Surveillant Routes */}
        <Route path="/surveillant/absences" element={<AbsenceList />} />
        <Route path="/surveillant/emplois" element={<EmploiList />} />
        <Route path="/surveillant/incidents" element={<IncidentList />} />
        <Route path="/surveillant/notifications" element={<NotificationList />} />
>>>>>>> 4617749c6b028b61b0f86d7bd3dcdd8b1cf9c243

        {/* Etudiant Routes */}
>>>>>>> b8e84f61ccfd49eb322067db03b3fb03cf35ac68
        <Route path="/etudiant/cours" element={<EtudiantCours />} />
        <Route path="/etudiant/notes" element={<EtudiantNotes />} />
        <Route path="/etudiant/absences" element={<EtudiantAbsences />} />
        <Route path="/etudiant/infos" element={<EtudiantInfos />} />
        <Route path="/etudiant/payer" element={<EtudiantPayer />} />
        <Route path="/mes-demandes/:etudiantId" element={<ListeDemandesEtudiant />} />
        <Route path="/demander-attestation" element={<DemanderAttestation />} />

        {/* Surveillant */}
        <Route path="/surveillant" element={<SurveillantDashboard />} />
        <Route path="/surveillant/absences" element={<AbsenceList />} />
        <Route path="/surveillant/emplois" element={<EmploiList />} />
        <Route path="/surveillant/incidents" element={<IncidentList />} />
        <Route path="/surveillant/notifications" element={<NotificationList />} />
      </Routes>
    </Router>
  );
}

export default App;
