import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfessorDashboard from './components/ProfessorDashboard';
import CourseManagement from './components/CourseManagement';
import StudentResults from './components/StudentResults';
import Communication from './components/Communication';
import AssignmentsExams from './components/AssignmentsExams';
import AttendanceTracking from './components/AttendanceTracking';
import Sidebar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<ProfessorDashboard />} />
            <Route path="/courses" element={<CourseManagement />} />
            <Route path="/results" element={<StudentResults />} />
            <Route path="/communication" element={<Communication />} />
            <Route path="/assignments" element={<AssignmentsExams />} />
            <Route path="/attendance" element={<AttendanceTracking />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;