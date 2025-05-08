import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './acceuil/Layout';
import SurveillantLayout from './Surveillant/SurveillantLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import CreateAccount from './pages/CreateAccount';

// import EntrerNotes from './components/EntrerNotes';

// import AjouterFichier from './components/AjouterFichier';
// import ListeDemandesEtudiant from './components/Etudiant/MesDemandes';

// import EtudiantDetail from './components/EtudiantDetail'; 
// import Dashboard from './components/Dashboard'; // Importer le composant Dashboard
// import ProfesseurDetail from './components/ProfDetail'; // Importer le composant de détail du professeur

// // import Layout from './layout/layout';    // Pour l'administration
// import  ChargeForm from './components/charge'; // Pour les charges
// import ConfigAttestationForm from './components/ConfigAttestationForm'; // Pour la configuration de l'attestation
// import FiliereManager from './components/FiliereManager'; // Pour la gestion des filières

// Pages
// import Login from './Login';


import SurveillantDashboard from './Surveillant/SurveillantDashboard';
import AbsenceList from './Surveillant/Absence';
import EmploiList from './Surveillant/EmploiSur';
import IncidentList from './Surveillant/Incident';
import RetardList from './Surveillant/Retard';
import NotificationList from './Surveillant/Notification';
import ParentLayout from './Parent/ParentLayout';
import ParentDashboard from './Parent/ParentDashboard';
import Notes from './Parent/Notes';
import Retards from './Parent/Retards';
import Login from './Login';
import AbsenceTable from './Surveillant/ListAbsence';
import ListeRetards from './Surveillant/ListRetard';
import ListeIncidents from './Surveillant/ListIncident';
import Absences from './Parent/Absences';
import Incidents from './Parent/Incident';
import ParentProfile from './Parent/ParentProfile';
import ParentReclamationForm from './Parent/ParentReclamation';
import SurveillantReclamationList from './Surveillant/ListReclamations';
import PaiementsParent from './Parent/ParentPayment';

// import MatiereManager from './components/matiere'; // Pour la gestion des matières


function App() {
      return (
        <Router>
          <Routes>

            <Route path="/" element={<Layout />} />
            <Route path="/login" element={<Login />} />

            {/* parent */}
            <Route path="/surveillant" element={<SurveillantLayout />}>
              <Route index element={<SurveillantDashboard />} />
              <Route path="absence" element={<AbsenceList />} />
              <Route path="retard" element={<RetardList />} />
              <Route path="incident" element={<IncidentList />} />
              <Route path="emploi" element={<EmploiList />} />
              <Route path="notification" element={<NotificationList />} />
              <Route path="absenceList" element={<AbsenceTable />} />
              <Route path="retardList" element={<ListeRetards />} />
              <Route path="incidentList" element={<ListeIncidents />} />
              <Route path="reclamationList" element={<SurveillantReclamationList />} />
              
            </Route>

            {/* parent */}
            <Route path="/" element={<ParentLayout />}>
              <Route path="parent" element={<ParentDashboard />} />
              <Route path="parent-profile" element={<ParentProfile />} />
              <Route path="absences" element={<Absences />} />
              <Route path="retards" element={<Retards />} />
              <Route path="notes" element={<Notes />} />
              <Route path="incidents" element={<Incidents />} />
              <Route path="parent-reclamation" element={<ParentReclamationForm />} />
              <Route path="parent-paiement" element={<PaiementsParent />} />
            </Route>
 
              {/* <Route path="/matiere" element={<MatiereManager />} /> Page de gestion des matières */}
          {/* <Route path="/filiere" element={<FiliereManager />} /> {/* Page de gestion des filières */}
        {/* <Route path="/admin" element={<Layout />} />
        <Route path="/config-attestation" element={<ConfigAttestationForm />} /> {/* Page de configuration des attestations */}
        {/* <Route path="/charge" element={<ChargeForm />} /> */}
          {/* Accueil */}
          {/* <Route path="/" element={<LayoutAccueil />} /> */}
          {/* <Route path="/Dashboard" element={<Dashboard />} />
        </Route> */}
        <Route path="/" element={<Layout />} />  
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/creer-compte" element={<CreateAccount />} />
{/*         
        Routes protégées */}
        {/* <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/enseignant/dashboard" element={<ProtectedRoute allowedRoles={['professeur']}><EnseignantDashboard /></ProtectedRoute>} />
        <Route path="/etudiant/dashboard" element={<ProtectedRoute allowedRoles={['étudiant']}><EtudiantDashboard /></ProtectedRoute>} />
        <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />
        <Route path="/surveillant/dashboard" element={<ProtectedRoute allowedRoles={['surveillant']}><SurveillantDashboard /></ProtectedRoute>} /> */}
        {/* <Route path="/mes-demandes/:etudiantId" element={<ListeDemandesEtudiant />} />
        <Route path="/enregistrer/absence" element={<EnregistrerAbsence />} />
        <Route path="/entrer-notes" element={<EntrerNotes />} />
        <Route path="/ajouter-fichier" element={<AjouterFichier />} />
                  {/* Admin */}
                  {/* <Route path="/etudiants/:id" element={<EtudiantDetail />} />
          <Route path="/professeur/:id" element={<ProfesseurDetail />} /> */} 
          </Routes>
        </Router>
      );
    }
    
 





import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Composants communs
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './acceuil/Navbar';
import Footer from './acceuil/Footer';
import Layout from './acceuil/Layout';

// Pages générales

// Layouts
import AdminLayout from './layout/layoutAdmin';
import Layout from './acceuil/Layout';

// Pages

import Login from './Login';
import CreateAccount from './pages/CreateAccount';
import Dashboard from './components/Dashboard';
import Fonctionnaliter from './acceuil/Fonctionnaliter';


// Dashboards utilisateurs
import AdminDashboard from './pages/AdminDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';
import EtudiantDashboard from './pages/EtudiantDashboard';
import ParentDashboard from './pages/ParentDashboard';
import SurveillantDashboard from './Surveillant/SurveillantDashboard';

// Admin - gestion
import AdminLayout from './layout/layoutAdmin';

// Admin components
import CreneauList from './components/crenau';
import EmploiTempsForm from './components/EmploiTempsForm';

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

import GenererEmploiTemps from './components/EmploiTemps';
import EmploiDuTempsComplet from './components/listeemploi';
import Evenements from './components/evenementGestion';
import EmploiTempsParProf from './components/emploiprof';

// Surveillant components
import SurveillantDashboard from './Surveillant/SurveillantDashboard';
import AbsenceList from './Surveillant/AbsenceList';
import EmploiList from './Surveillant/EmploiSur';
import IncidentList from './Surveillant/Incident';
import NotificationList from './Surveillant/Notification';

// Etudiant components

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

// Dashboards
import AdminDashboard from './pages/AdminDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';
import EtudiantDashboard from './pages/EtudiantDashboard';
import ParentDashboard from './pages/ParentDashboard';
import DemandeAttestationList from './components/DemandeAttestationList';
// Security
import ProtectedRoute from './components/ProtectedRoute';
import  ChatBot from './components/ChatBot';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';


function App() {
  return (
    <Router>
      <Routes>

        {/* Accueil / Authentification */}

        {/* Public routes */}

        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path='/chart' element={<ChatBot />} />
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

        <Route path="/evenements" element={<Evenements />} />
        <Route path="/emploiprof" element={<EmploiTempsParProf />} />
        <Route path="/emploi-create" element={<EmploiTempsForm />} />
        <Route path="etudiants/:id" element={<EtudiantDetail />} />
        <Route path="/DemandeAttestationList" element={<DemandeAttestationList />} />
        <Route path="/filiere" element={<FiliereManager />} />
        <Route path='/admin' element={<AdminLayout />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="matiere" element={<MatiereManager />} />
        <Route path="filiere" element={<FiliereManager />} />
        <Route path="charge" element={<ChargeForm />} />
        <Route path="creneaux" element={<CreneauList />} />
        <Route path="generer-emploi" element={<GenererEmploiTemps />} />
        <Route path="liste-emploi" element={<EmploiDuTempsComplet />} />
        <Route path="config-attestation" element={<ConfigAttestationForm />} />
        <Route path="professeur/:id" element={<ProfesseurDetail />} />
        <Route path="enregistrer-absence" element={<EnregistrerAbsence />} />
        <Route path="entrer-notes" element={<EntrerNotes />} />
        <Route path="ajouter-fichier" element={<AjouterFichier />} />

        {/* Protected teacher routes */}
        <Route path="/enseignant/dashboard" element={<ProtectedRoute allowedRoles={['professeur']}><EnseignantDashboard /></ProtectedRoute>} />

        {/* Protected student routes */}
        <Route path="/etudiant" element={<ProtectedRoute allowedRoles={['étudiant']}><EtudiantDashboard /></ProtectedRoute>}>
          <Route path="dashboard" element={<EtudiantDashboard />} />
          <Route path="cours" element={<EtudiantCours />} />
          <Route path="notes" element={<EtudiantNotes />} />
          <Route path="absences" element={<EtudiantAbsences />} />
          <Route path="infos" element={<EtudiantInfos />} />
          <Route path="payer" element={<EtudiantPayer />} />
          <Route path="mes-demandes/:etudiantId" element={<ListeDemandesEtudiant />} />
          <Route path="demander-attestation" element={<DemanderAttestation />} />
        </Route>

        {/* Protected parent routes */}
        <Route path="/parent/dashboard" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>} />

        {/* Protected surveillant routes */}
        <Route path="/surveillant" element={<ProtectedRoute allowedRoles={['surveillant']}><SurveillantDashboard /></ProtectedRoute>}>
          <Route path="dashboard" element={<SurveillantDashboard />} />
          <Route path="absences" element={<AbsenceList />} />
          <Route path="emplois" element={<EmploiList />} />
          <Route path="incidents" element={<IncidentList />} />
          <Route path="notifications" element={<NotificationList />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
