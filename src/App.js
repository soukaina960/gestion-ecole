// Librairies & CSS
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Composants partagés
import Acceuil from './acceuil/index';
import ProtectedRoute from './components/ProtectedRoute';
import ChatBot from './components/ChatBot';
// import NotFound from './components/NotFound'; // À créer
// Pages générales
import Login from './Login';
import CreateAccount from './pages/CreateAccount';
import Fonctionnaliter from './acceuil/Fonctionnaliter';

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
import DemandeAttestationList from './components/DemandeAttestationList';
import AjouterExamen from './components/AjouterExamen';
import GenererEmploiTemps from './components/EmploiTemps';
import EmploiDuTempsComplet from './components/listeemploi';
import Evenements from './components/evenementGestion';
// import EmploiTempsParProf from './components/EmploiProf';
import EmploiTempsParProf from './components/EmploiProf'; // Chemin exact correspondant au fichier

// Composants étudiant
import EtudiantCours from './components/Etudiant/EtudiantCours';
import EtudiantNotes from './components/Etudiant/EtudiantNotes';
import EtudiantAbsences from './components/Etudiant/EtudiantAbsences';
import EtudiantInfos from './components/Etudiant/EtudiantInfos';
import EtudiantPayer from './components/Etudiant/EtudiantPayer';
import ListeDemandesEtudiant from './components/Etudiant/MesDemandes';
import DemanderAttestation from './components/Etudiant/DemandeEtudiant';

// Composants surveillant
import AbsenceList from './Surveillant/ListAbsence';
import EmploiList from './Surveillant/EmploiSur';
import IncidentList from './Surveillant/Incident';
import NotificationList from './Surveillant/Notification';

function App() {
  return (
    <Router>
      <Routes>
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
          <Route path="cours" element={<EtudiantCours />} />
          <Route path="notes" element={<EtudiantNotes />} />
          <Route path="absences" element={<EtudiantAbsences />} />
          <Route path="informations" element={<EtudiantInfos />} />
          <Route path="paiements" element={<EtudiantPayer />} />
          <Route path="mes-demandes/:etudiantId" element={<ListeDemandesEtudiant />} />
          <Route path="demander-attestation" element={<DemanderAttestation />} />
        </Route>

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
    
      </Routes>
    </Router>
  );
}

export default App;