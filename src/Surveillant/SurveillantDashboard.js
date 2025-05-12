import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';

const COLORS = ['#4b2e83', '#00c49f', '#ff7f50'];

const styles = {
  dashboard: {
    flex: 1,
    padding: '40px 20px',
    fontFamily: 'Arial, sans-serif',
    background: '#f7f9fc',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  chartContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '60px',
    marginTop: '30px',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
    padding: '20px',
    transition: 'transform 0.3s ease',
  },
  chartCardHover: {
    transform: 'scale(1.02)',
  },
  chartTitle: {
    textAlign: 'center',
    color: '#4b2e83',
    fontSize: '20px',
    marginBottom: '10px',
  },
};

const SurveillantDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/statistics-surveillant')
      .then((response) => {
        setStatistics(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de chargement des stats !", error);
        setLoading(false);
      });
  }, []);

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

  return (
    <div style={styles.dashboard}>
      <h1 style={{
  fontSize: '36px',
  color: '#4b2e83',
  marginBottom: '20px',
  fontWeight: 'bold',
  textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
}}>
  Tableau de Bord du Surveillant 📈
</h1>
      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        
        <div style={styles.chartContainer}>
          {/* Pie Chart */}
          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>Répartition des absences</h2>
            <PieChart width={300} height={300}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </div>

          {/* Bar Chart */}
          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>Statistiques générales</h2>
            <BarChart width={350} height={300} data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4b2e83" />
            </BarChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveillantDashboard;
