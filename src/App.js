// Librairies & UtilisateurFormSS
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


// CSS & Bootstrap


import SurveillantLayout from './Surveillant/SurveillantLayout';
import ParentLayout from './Parent/ParentLayout';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';




// Layouts




// Composants partagés
import Acceuil from './acceuil/index';
import ProtectedRoute from './components/ProtectedRoute';



// Pages générales
import Login from './Login';
import CreateAccount from './pages/CreateAccount';

import Fonctionnaliter from './acceuil/Fonctionnaliter';
import Dashboard from './components/Dashboard';

// Dashboards

// Surveillant

import AbsenceSanctionTable from './Surveillant/ListAbsence';
import SurveillantProfile from './Surveillant/SurveillantProfile';
import BulletinForm from './Surveillant/Bulletin';



// Admin components
import AdminLayout from './layout/layoutAdmin';
import AdminDashboard from './pages/AdminDashboard';
import CreneauList from './components/crenau';
import EmploiTempsForm from './components/EmploiTempsForm';

import ChargeForm from './components/charge';
import ConfigAttestationForm from './components/ConfigAttestationForm';
import FiliereManager from './components/FiliereManager';
import MatiereManager from './components/matiere';


// Étudiant


import EmploiDuTempsComplet from './components/listeemploi';
import GenererEmploiTemps from './components/EmploiTemps';
import AjouterExamen from './components/AjouterExamen';

import EnseignantDashboard from './pages/EnseignantDashboard';
// Surveillant components
import SurveillantDashboard from './Surveillant/SurveillantDashboard';
import AbsenceList from './Surveillant/Absence';
import IncidentList from './Surveillant/Incident';
import RetardList from './Surveillant/Retard';
import ListeRetards from './Surveillant/ListRetard';
import ListeIncidents from './Surveillant/ListIncident';
import SurveillantReclamationList from './Surveillant/ListReclamations';
import SalleCRUD from './components/SalleCRUD'

// Parent components


// import ParentDashboard from './Parent/ParentDashboard';
// import Notes from './Parent/Notes';
// import Retards from './Parent/Retards';
// import Absences from './Parent/Absences';
// import Incidents from './Parent/Incident';
// import ParentProfile from './Parent/ParentProfile';
// import ParentReclamationForm from './Parent/ParentReclamation';
// import PaiementsParent from './Parent/ParentPayment';

// Etudiant components
import EtudiantDashboard from './pages/EtudiantDashboard';


import EtudiantCours from './components/Etudiant/EtudiantCours';
import EtudiantNotes from './components/Etudiant/EtudiantNotes';
import EtudiantAbsences from './components/Etudiant/EtudiantAbsences';
import EtudiantInfos from './components/Etudiant/EtudiantInfos';
import EtudiantPayer from './components/Etudiant/EtudiantPayer';
import ListeDemandesEtudiant from './components/Etudiant/MesDemandes';
import DemanderAttestation from './components/Etudiant/DemandeEtudiant';
import EtudiantBulletin from './components/Etudiant/EtudiantBulletin';
import BulletinDetails from './components/Etudiant/BulletinDetails';


// Autres
import AjouterFichier from './components/AjouterFichier';
import EntrerNotes from './components/EntrerNotes';
import EnregistrerAbsence from './components/EnregistrerAbsence';
import EtudiantDetail from './components/EtudiantDetail';
import ProfesseurDetail from './components/ProfDetail';
import DemandeAttestationList from './components/DemandeAttestationList';

import Evenements from './components/evenementGestion';
import EmploiTempsParProf from './components/emploiparprof';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';


import DiagrammeLigneRestes from './components/ComparaisonRestesParMois';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
          <Route index element={<Acceuil />} />
          <Route path="login" element={<Login />} />
         
          <Route path="creer-compte" element={<CreateAccount />} />
          <Route path="fonctionnalites" element={<Fonctionnaliter />} />
        {/* Admin routes */}
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="comparaison-restes" element={<DiagrammeLigneRestes />} />
          <Route index element={<AdminDashboard />} />
        <Route path="salle-crud" element={<SalleCRUD />} />
          <Route path="matieres" element={<MatiereManager />} />
          <Route path="filieres" element={<FiliereManager />} />
          <Route path="creneaux" element={<CreneauList />} />
          <Route path="config-attestation" element={<ConfigAttestationForm />} />
          <Route path="charges" element={<ChargeForm />} />
          <Route path="generer-emploi" element={<GenererEmploiTemps />} />
          <Route path="emplois" element={<EmploiDuTempsComplet />} />
          <Route path="creer-emploi" element={<EmploiTempsForm />} />
          <Route path="etudiants/:id" element={<EtudiantDetail />} />
          <Route path="professeurs/:id" element={<ProfesseurDetail />} />
          <Route path="enregistrer-absence" element={<EnregistrerAbsence />} />
          <Route path="ajouter-fichier" element={<AjouterFichier />} />
          <Route path="ajouter-examen" element={<AjouterExamen />} />
          <Route path="demandes-attestation" element={<DemandeAttestationList />} />
          <Route path="evenements" element={<Evenements />} />
        </Route>

        {/* Enseignant routes */}
        <Route path="/enseignant" element={<ProtectedRoute allowedRoles={['professeur']}><EnseignantDashboard /></ProtectedRoute>}>
          <Route index element={<EnseignantDashboard />} />
        </Route>



        {/* Dashboards protégés */}
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/enseignant/dashboard" element={<ProtectedRoute allowedRoles={['professeur']}><EnseignantDashboard /></ProtectedRoute>} />
        <Route path="/etudiant/dashboard" element={<ProtectedRoute allowedRoles={['étudiant']}><EtudiantDashboard /></ProtectedRoute>} />
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

        {/* Etudiant routes */}
           <Route path="/bulletins" element={<EtudiantBulletin />} />
        <Route path="/bulletins/:id" element={<BulletinDetails />} />

        <Route path="/etudiant" element={<ProtectedRoute allowedRoles={['étudiant']}><EtudiantDashboard /></ProtectedRoute>}>
          <Route index element={<EtudiantDashboard />} />
          <Route path="cours" element={<EtudiantCours />} />
          <Route path="notes" element={<EtudiantNotes />} />
          <Route path="absences" element={<EtudiantAbsences />} />
          <Route path="informations" element={<EtudiantInfos />} />
          <Route path="paiements" element={<EtudiantPayer />} />
          <Route path="mes-demandes/:etudiantId" element={<ListeDemandesEtudiant />} />
          <Route path="demander-attestation" element={<DemanderAttestation />} />
       
        </Route>


        {/* Protected parent routes */}
        <Route path="/parent" element={<ParentLayout />} />


        {/* Protected surveillant routes */}
        <Route path="/surveillant" element={<SurveillantLayout />} />

        {/* Parent routes */}



        {/* Route 404 - Add this if you have a NotFound component */}
        {/* <Route path="*" element={<NotFound />} /> */}

      </Routes>
    </Router>
  );
}

export default App;