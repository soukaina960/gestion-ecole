import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const COLORS = ['#4b2e83', '#00c49f', '#ff7f50', '#ff8042', '#8884d8'];

const SurveillantDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://127.0.0.1:8000/api/statistics-surveillant');
        setStatistics(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur de chargement des stats !", err);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMenuOpen]);

  const pieData = statistics ? [
    { name: 'Justifiées', value: statistics.justifiedAbsencesCount },
    { name: 'Injustifiées', value: statistics.unjustifiedAbsencesCount },
    { name: 'Incidents', value: statistics.incidentsCount },
  ] : [];

  const barData = statistics ? [
    { name: 'Étudiants', value: statistics.studentsCount },
    { name: 'Absences', value: statistics.absencesCount },
    { name: 'Incidents', value: statistics.incidentsCount },
  ] : [];

  // Styles as JavaScript object with media queries
  const styles = {
    dashboard: {
      flex: 1,
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      background: '#f7f9fc',
      minHeight: '100vh',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#4b2e83',
      color: '#fff',
      padding: '10px 20px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: '8px',
      marginBottom: '20px',
    },
    navbarTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
    },
    hamburgerBtn: {
      fontSize: '24px',
      background: 'none',
      border: 'none',
      color: '#fff',
      cursor: 'pointer',
      display: 'none',
      '@media (max-width: 768px)': {
        display: 'block',
      },
    },
    mobileMenu: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#fff',
      position: 'absolute',
      top: '60px',
      right: '20px',
      width: '200px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      zIndex: 10,
      overflow: 'hidden',
    },
    menuButton: {
      padding: '12px 16px',
      border: 'none',
      background: 'none',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: '#f0f0f0',
      },
    },
    chartContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: '20px',
      marginTop: '20px',
    },
    chartCard: {
      backgroundColor: '#ffffff',
      borderRadius: '15px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
      padding: '20px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      flex: '1 1 300px',
      minWidth: '300px',
      maxWidth: '500px',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
      },
    },
    chartTitle: {
      textAlign: 'center',
      color: '#4b2e83',
      fontSize: '18px',
      marginBottom: '15px',
      fontWeight: 'bold',
    },
    errorMessage: {
      textAlign: 'center',
      color: '#d32f2f',
      padding: '20px',
      backgroundColor: '#ffebee',
      borderRadius: '8px',
      margin: '20px',
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
    },
    spinner: {
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #4b2e83',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
    },
    // Media queries
    '@media (max-width: 768px)': {
      chartContainer: {
        flexDirection: 'column',
        alignItems: 'center',
      },
      chartCard: {
        width: '100%',
        maxWidth: '100%',
      },
    },
  };

  // Inline styles for elements
  const getResponsiveStyle = (baseStyle) => {
    return baseStyle;
  };

  return (
    <div style={getResponsiveStyle(styles.dashboard)}>
      {/* Navbar */}
      <div style={getResponsiveStyle(styles.navbar)}>
        <div style={getResponsiveStyle(styles.navbarTitle)}>Tableau de Bord du Surveillant 📈</div>
        <button
          style={getResponsiveStyle(styles.hamburgerBtn)}
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          aria-label="Menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={getResponsiveStyle(styles.mobileMenu)}>
          <button 
            style={getResponsiveStyle(styles.menuButton)}
            onClick={() => setIsMenuOpen(false)}
          >
            Répartition des absences
          </button>
          <button 
            style={getResponsiveStyle(styles.menuButton)}
            onClick={() => setIsMenuOpen(false)}
          >
            Statistiques générales
          </button>
          <button 
            style={getResponsiveStyle(styles.menuButton)}
            onClick={() => setIsMenuOpen(false)}
          >
            Paramètres
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={getResponsiveStyle(styles.loadingSpinner)}>
          <div style={getResponsiveStyle(styles.spinner)}></div>
        </div>
      ) : error ? (
        <div style={getResponsiveStyle(styles.errorMessage)}>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#4b2e83',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div style={getResponsiveStyle(styles.chartContainer)}>
          {/* Pie Chart */}
          <div style={getResponsiveStyle(styles.chartCard)}>
            <h2 style={getResponsiveStyle(styles.chartTitle)}>Répartition des absences</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, 'Nombre']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div style={getResponsiveStyle(styles.chartCard)}>
            <h2 style={getResponsiveStyle(styles.chartTitle)}>Statistiques générales</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => [`${value}`, 'Nombre']} />
                <Legend />
                <Bar dataKey="value" fill="#4b2e83" name="Quantité" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Add CSS for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SurveillantDashboard;