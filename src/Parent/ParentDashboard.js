import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell, // ✅ ICI l'ajout de Cell
} from 'recharts';


const ParentDashboard = () => {
  const [parent, setParent] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const parentId = localStorage.getItem('parent_id');

    if (!token || !parentId) {
      setErrorMessage('Utilisateur non authentifié.');
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/parents/${parentId}`);
        setParent(response.data);
      } catch (error) {
        setErrorMessage('Erreur lors de la récupération des données du parent.');
      }
    };

    const fetchParentData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/parent-dashboard/${parentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data.stats);
      } catch (error) {
        setErrorMessage('Erreur lors de la récupération des statistiques.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchParentData();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Chargement...</p>;
  if (errorMessage) return <p style={{ textAlign: 'center', color: 'red' }}>{errorMessage}</p>;

  const graphData = [
    { name: 'Moyenne', value: stats.moyenne },
    { name: 'Retards', value: stats.retards },
    { name: 'Notes', value: stats.notes },
    { name: 'Incidents', value: stats.incidents },
  ];

  const containerStyle = {
    padding: '50px',
    fontFamily: 'Poppins, sans-serif',
    background: 'linear-gradient(to right, #fdfbfb, #ebedee)',
    minHeight: '100vh',
    color: '#34495e',
  };

  const titleStyle = {
    textAlign: 'center',
    fontSize: '28px',
    color: '#2c3e50',
    fontWeight: '600',
    marginBottom: '40px',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
    width: 'fit-content',
    margin: '0 auto 40px auto',
  };

  const chartContainerStyle = {
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    padding: '20px',
    height: 350,
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>
        Bienvenue dans votre espace parent : <span style={{ color: '#2980b9' }}>{parent?.nom}</span>
      </h2>

      <div style={chartContainerStyle}>
      <ResponsiveContainer width="100%" height="100%">
  <BarChart
    layout="vertical"
    data={graphData}
    margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis type="number" />
    <YAxis type="category" dataKey="name" />
    <Tooltip
      contentStyle={{
        backgroundColor: '#2980b9',
        borderRadius: '8px',
        color: '#fff',
      }}
    />
    <Bar dataKey="value" barSize={25} radius={[5, 5, 0, 0]}>
      {graphData.map((entry, index) => {
        const colors = ['#f39c12', '#f1c40f', '#2ecc71', '#1abc9c']; // couleurs fraîches
        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
      })}
    </Bar>
  </BarChart>
</ResponsiveContainer>

      </div>
    </div>
  );
};

export default ParentDashboard;
