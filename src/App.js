// Librairies & CSS
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
<<<<<<< HEAD
import Layout from './acceuil/Layout';
import SurveillantLayout from './Surveillant/SurveillantLayout';
import ParentLayout from './Parent/ParentLayout';
import AdminLayout from './layout/layoutAdmin';
=======
>>>>>>> 4ff383b4df22939c6201cdb25dd2d9a2fa2fbfa6
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Composants partagés
import Acceuil from './acceuil/index';
import ProtectedRoute from './components/ProtectedRoute';
import ChatBot from './components/ChatBot';
<<<<<<< HEAD

=======
// import NotFound from './components/NotFound'; // À créer
>>>>>>> 4ff383b4df22939c6201cdb25dd2d9a2fa2fbfa6
// Pages générales
import Login from './Login';
import CreateAccount from './pages/CreateAccount';
import Fonctionnaliter from './acceuil/Fonctionnaliter';
<<<<<<< HEAD
import ComparaisonRestesParMois from './components/ComparaisonRestesParMois'
// Admin components
=======

// Dashboards
import AdminDashboard from './pages/AdminDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';
import EtudiantDashboard from './pages/EtudiantDashboard';
import ParentDashboard from './pages/ParentDashboard';
import SurveillantDashboard from './Surveillant/SurveillantDashboard';

// Composants admin
import AdminLayout from './layout/layoutAdmin';
import CreneauList from './components/crenau';
import EmploiTempsForm from './components/EmploiTempsForm';
import ChargeForm from './components/charge';
import ConfigAttestationForm from './components/ConfigAttestationForm';
import FiliereManager from './components/FiliereManager';
import MatiereManager from './components/matiere';
import AjouterFichier from './components/AjouterFichier';
import EnregistrerAbsence from './components/EnregistrerAbsence';
import EtudiantDetail from './components/EtudiantDetail';
import ProfesseurDetail from './components/ProfDetail';
<<<<<<< HEAD
import EmploiDuTempsComplet from './components/listeemploi';
=======
import DemandeAttestationList from './components/DemandeAttestationList';
import AjouterExamen from './components/AjouterExamen';
>>>>>>> 4ff383b4df22939c6201cdb25dd2d9a2fa2fbfa6
import GenererEmploiTemps from './components/EmploiTemps';
import Evenements from './components/evenementGestion';
<<<<<<< HEAD
import EmploiTempsParProf from './components/emploiprof';
import AjouterExamen from './components/AjouterExamen';
import DemandeAttestationList from './components/DemandeAttestationList';


// Surveillant components
import SurveillantDashboard from './Surveillant/SurveillantDashboard';
import AbsenceList from './Surveillant/Absence';
import EmploiList from './Surveillant/EmploiSur';
import IncidentList from './Surveillant/Incident';
import RetardList from './Surveillant/Retard';
import NotificationList from './Surveillant/Notification';
import AbsenceTable from './Surveillant/ListAbsence';
import ListeRetards from './Surveillant/ListRetard';
import ListeIncidents from './Surveillant/ListIncident';
import SurveillantReclamationList from './Surveillant/ListReclamations';

// Parent components
import ParentDashboard from './Parent/ParentDashboard';
import Notes from './Parent/Notes';
import Retards from './Parent/Retards';
import Absences from './Parent/Absences';
import Incidents from './Parent/Incident';
import ParentProfile from './Parent/ParentProfile';
import ParentReclamationForm from './Parent/ParentReclamation';
import PaiementsParent from './Parent/ParentPayment';

// Etudiant components
import EtudiantDashboard from './pages/EtudiantDashboard';
import EnseignantDashboard from './pages/EnseignantDashboard';
=======
// import EmploiTempsParProf from './components/EmploiProf';
import EmploiTempsParProf from './components/EmploiProf'; // Chemin exact correspondant au fichier

// Composants étudiant
>>>>>>> 4ff383b4df22939c6201cdb25dd2d9a2fa2fbfa6
import EtudiantCours from './components/Etudiant/EtudiantCours';
import EtudiantNotes from './components/Etudiant/EtudiantNotes';
import EtudiantAbsences from './components/Etudiant/EtudiantAbsences';
import EtudiantInfos from './components/Etudiant/EtudiantInfos';
import EtudiantPayer from './components/Etudiant/EtudiantPayer';
import ListeDemandesEtudiant from './components/Etudiant/MesDemandes';
import DemanderAttestation from './components/Etudiant/DemandeEtudiant';
<<<<<<< HEAD
import DiagrammeLigneRestes from './components/ComparaisonRestesParMois';
=======

// Composants surveillant
import AbsenceList from './Surveillant/ListAbsence';
import EmploiList from './Surveillant/EmploiSur';
import IncidentList from './Surveillant/Incident';
import NotificationList from './Surveillant/Notification';
>>>>>>> 4ff383b4df22939c6201cdb25dd2d9a2fa2fbfa6

function App() {
  return (
    <Router>
      <Routes>
<<<<<<< HEAD
        {/* Public routes */}
        <Route path="/" element={<Layout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chart" element={<ChatBot />} />
        <Route path="/creer-compte" element={<CreateAccount />} />
        <Route path="matiere" element={<MatiereManager />} />
        <Route path="filiere" element={<FiliereManager />} />
        <Route path="charge" element={<ChargeForm />} />
        <Route path='/ComparaisonRestesParMois' element={<DiagrammeLigneRestes />} />
        {/* Surveillant routes */}
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

        {/* Parent routes */}
        <Route path="/parent" element={<ParentLayout />}>
          <Route index element={<ParentDashboard />} />
          <Route path="profile" element={<ParentProfile />} />
          <Route path="absences" element={<Absences />} />
          <Route path="retards" element={<Retards />} />
          <Route path="notes" element={<Notes />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="reclamation" element={<ParentReclamationForm />} />
          <Route path="paiement" element={<PaiementsParent />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="matiere" element={<MatiereManager />} />
          <Route path="filiere" element={<FiliereManager />} />
          <Route path="charge" element={<ChargeForm />} />
          <Route path="generer-emploi" element={<GenererEmploiTemps />} />
          <Route path="liste-emploi" element={<EmploiDuTempsComplet />} />
          <Route path="config-attestation" element={<ConfigAttestationForm />} />
          <Route path="etudiants/:id" element={<EtudiantDetail />} />
          <Route path="professeur/:id" element={<ProfesseurDetail />} />
          <Route path="enregistrer-absence" element={<EnregistrerAbsence />} />
          <Route path="entrer-notes" element={<EntrerNotes />} />
          <Route path="ajouter-fichier" element={<AjouterFichier />} />
          <Route path="creaux" element={<CreneauList />} />
          <Route path="emploi-create" element={<EmploiTempsForm />} />
          <Route path="demandes-attestation" element={<DemandeAttestationList />} />
          <Route path="evenements" element={<Evenements />} />
          <Route path="emploiprof" element={<EmploiTempsParProf />} />
          <Route path="ajouter-examen" element={<AjouterExamen />} />
        </Route>

        {/* Etudiant routes */}
        <Route path="/etudiant" element={<ProtectedRoute allowedRoles={['étudiant']}><EtudiantDashboard /></ProtectedRoute>}>
          <Route index element={<EtudiantDashboard />} />
=======
        {/* Routes publiques */}
        <Route path="/" element={<Acceuil />} />
        <Route path="/login" element={<Login />} />
        <Route path="/creer-compte" element={<CreateAccount />} />
        <Route path="/fonctionnalites" element={<Fonctionnaliter />} />
        <Route path="/chatbot" element={<ChatBot />} />

        {/* Routes Admin */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
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

        {/* Routes Enseignant */}
        <Route path="/enseignant" element={<ProtectedRoute allowedRoles={['professeur']}><EnseignantDashboard /></ProtectedRoute>}>
          <Route index element={<EnseignantDashboard />} />
          <Route path="dashboard" element={<EnseignantDashboard />} />
          <Route path="emploi-du-temps" element={<EmploiTempsParProf />} />
          {/* Ajouter d'autres routes enseignant ici */}
        </Route>

        {/* Routes Étudiant */}
        <Route path="/etudiant" element={<ProtectedRoute allowedRoles={['étudiant']}><EtudiantDashboard /></ProtectedRoute>}>
          <Route index element={<EtudiantDashboard />} />
          <Route path="dashboard" element={<EtudiantDashboard />} />
>>>>>>> 4ff383b4df22939c6201cdb25dd2d9a2fa2fbfa6
          <Route path="cours" element={<EtudiantCours />} />
          <Route path="notes" element={<EtudiantNotes />} />
          <Route path="absences" element={<EtudiantAbsences />} />
          <Route path="informations" element={<EtudiantInfos />} />
          <Route path="paiements" element={<EtudiantPayer />} />
          <Route path="mes-demandes/:etudiantId" element={<ListeDemandesEtudiant />} />
          <Route path="demander-attestation" element={<DemanderAttestation />} />
        </Route>

<<<<<<< HEAD
        {/* Enseignant routes */}
        <Route path="/enseignant" element={<ProtectedRoute allowedRoles={['professeur']}><EnseignantDashboard /></ProtectedRoute>}>
          <Route index element={<EnseignantDashboard />} />
        </Route>
=======
        {/* Routes Parent */}
        <Route path="/parent" element={<ProtectedRoute allowedRoles={['parent']}><ParentDashboard /></ProtectedRoute>}>
          <Route index element={<ParentDashboard />} />
          <Route path="dashboard" element={<ParentDashboard />} />
          {/* Ajouter d'autres routes parent ici */}
        </Route>

        {/* Routes Surveillant */}
        <Route path="/surveillant" element={<ProtectedRoute allowedRoles={['surveillant']}><SurveillantDashboard /></ProtectedRoute>}>
          <Route index element={<SurveillantDashboard />} />
          <Route path="dashboard" element={<SurveillantDashboard />} />
          <Route path="absences" element={<AbsenceList />} />
          <Route path="emplois" element={<EmploiList />} />
          <Route path="incidents" element={<IncidentList />} />
          <Route path="notifications" element={<NotificationList />} />
        </Route>

        {/* Route 404 */}
    
>>>>>>> 4ff383b4df22939c6201cdb25dd2d9a2fa2fbfa6
      </Routes>
    </Router>
  );
}

export default App;