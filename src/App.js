import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './acceuil/Navbar';
import Footer from './acceuil/Footer';
import Fonctionnaliter from './acceuil/Fonctionnaliter';
import Login from './Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          {/* Main page route */}
          <Route path="/" element={<Fonctionnaliter />} />
          
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          
          {/* You can add more routes here as needed */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;