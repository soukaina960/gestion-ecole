import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './acceuil/Layout';
import Login from './Login';
import SurveillantDashboard from './Surveillant/SurveillantDashboard';
import AbsenceList from './Surveillant/AbsenceList';
import EmploiList from './Surveillant/EmploiSur';
import IncidentList from './Surveillant/Incident';
import NotificationList from './Surveillant/Notification';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Main page route */}
          <Route path="/" element={<Layout />} />  
          <Route path="/surveillant" element={<SurveillantDashboard />} /> 
          <Route path="/absences" element={<AbsenceList />} />
          <Route path="/emplois" element={<EmploiList />} />
          <Route path="/incidents" element={<IncidentList />} />     
          <Route path="/notifications" element={<NotificationList />} />   
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          
          {/* You can add more routes here as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;