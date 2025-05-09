// Librairies & CSS
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './acceuil/Layout';
import SurveillantLayout from './Surveillant/SurveillantLayout';
import ParentLayout from './Parent/ParentLayout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Composants partagés
import Acceuil from './acceuil/index';
import ProtectedRoute from './components/ProtectedRoute';
import ChatBot from './components/ChatBot';
import Fonctionnaliter from './acceuil/Fonctionnaliter';

// Pages générales
import Login from './Login';
import CreateAccount from './pages/CreateAccount';

// Admin components
import AdminLayout from './layout/layoutAdmin';
import AdminDashboard from './pages/AdminDashboard';
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
import EmploiDuTempsComplet from './components/listeemploi';
import GenererEmploiTemps from './components/EmploiTemps';
import Evenements from './components/evenementGestion';
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
import EtudiantCours from './components/Etudiant/EtudiantCours';
import EtudiantNotes from './components/Etudiant/EtudiantNotes';
import EtudiantAbsences from './components/Etudiant/EtudiantAbsences';
import EtudiantInfos from './components/Etudiant/EtudiantInfos';
import EtudiantPayer from './components/Etudiant/EtudiantPayer';
import ListeDemandesEtudiant from './components/Etudiant/MesDemandes';
import DemanderAttestation from './components/Etudiant/DemandeEtudiant';
import DiagrammeLigneRestes from './components/ComparaisonRestesParMois';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
          <Route index element={<Acceuil />} />
          <Route path="login" element={<Login />} />
          <Route path="chatbot" element={<ChatBot />} />
          <Route path="creer-compte" element={<CreateAccount />} />
          <Route path="fonctionnalites" element={<Fonctionnaliter />} />
        {/* Admin routes */}
        <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
        <Route path="comparaison-restes" element={<DiagrammeLigneRestes />} />
          <Route index element={<AdminDashboard />} />
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

        {/* Etudiant routes */}
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

        {/* Parent routes */}
        <Route path="/parent" element={<ProtectedRoute allowedRoles={['parent']}><ParentLayout /></ProtectedRoute>}>
          <Route index element={<ParentDashboard />} />
          <Route path="profile" element={<ParentProfile />} />
          <Route path="absences" element={<Absences />} />
          <Route path="retards" element={<Retards />} />
          <Route path="notes" element={<Notes />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="reclamation" element={<ParentReclamationForm />} />
          <Route path="paiement" element={<PaiementsParent />} />
        </Route>

        {/* Surveillant routes */}
        <Route path="/surveillant" element={<ProtectedRoute allowedRoles={['surveillant']}><SurveillantLayout /></ProtectedRoute>}>
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

        {/* Route 404 - Add this if you have a NotFound component */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;