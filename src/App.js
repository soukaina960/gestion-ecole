import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './acceuil/Layout';
import SurveillantLayout from './Surveillant/SurveillantLayout';
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

import EtudiantDetail from './components/EtudiantDetail'; 
import Dashboard from './components/Dashboard'; // Importer le composant Dashboard
import ProfesseurDetail from './components/ProfDetail'; // Importer le composant de détail du professeur

import LayoutAccueil from './acceuil/Layout'; // Pour la page d'accueil
import Layout from './layout/layout';    // Pour l'administration
import  ChargeForm from './components/charge'; // Pour les charges
import ConfigAttestationForm from './components/ConfigAttestationForm'; // Pour la configuration de l'attestation
import FiliereManager from './components/FiliereManager'; // Pour la gestion des filières

// Pages
import Login from './Login';


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

import MatiereManager from './components/matiere'; // Pour la gestion des matières


function App() {
      return (
        <Router>
          <Routes>

            <Route path="/" element={<Layout />} />
            <Route path="/login" element={<Login />} />
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

            </Route>
            <Route path="/parent" element={<ParentLayout />}>
              <Route path="" element={<ParentDashboard />} />
              <Route path="retards" element={<Retards />} />
              <Route path="notes" element={<Notes />} />
              <Route path="/matiere" element={<MatiereManager />} /> {/* Page de gestion des matières */}
          <Route path="/filiere" element={<FiliereManager />} /> {/* Page de gestion des filières */}
        <Route path="/admin" element={<Layout />} />
        <Route path="/config-attestation" element={<ConfigAttestationForm />} /> {/* Page de configuration des attestations */}
        <Route path="/charge" element={<ChargeForm />} /> {/* Page des charges */}
          {/* Accueil */}
          {/* <Route path="/" element={<LayoutAccueil />} /> */}
          <Route path="/Dashboard" element={<Dashboard />} />
        </Route>
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
        <Route path="/enregistrer/absence" element={<EnregistrerAbsence />} />
        <Route path="/entrer-notes" element={<EntrerNotes />} />
        <Route path="/ajouter-fichier" element={<AjouterFichier />} />
                  {/* Admin */}
                  <Route path="/etudiants/:id" element={<EtudiantDetail />} />
          <Route path="/professeur/:id" element={<ProfesseurDetail />} />
          </Routes>
        </Router>
      );
    }
    
 
export default App;



