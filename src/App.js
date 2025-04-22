import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './acceuil/Layout';
import SurveillantLayout from './Surveillant/SurveillantLayout';


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
          
        </Route>
          </Routes>
        </Router>
      );
    }
    
 
export default App;