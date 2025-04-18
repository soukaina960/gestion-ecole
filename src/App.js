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
      </div>
    </Router>
  );
}

export default App;
