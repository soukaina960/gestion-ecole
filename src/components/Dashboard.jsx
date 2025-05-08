import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import './Dashboard.css';
import {
  FaUsers,
  FaChalkboardTeacher,
  FaSchool,
  FaMoneyBillWave,
  FaWallet,
  FaChartLine,
  FaMoneyCheckAlt,
  FaPiggyBank
} from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDashboardStats();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des stats :', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatNumber = (num) => {
    return num ? new Intl.NumberFormat('fr-FR').format(num) : 0;
  };

  const getIconClass = (title, reste) => {
    switch (title) {
      case 'Étudiants': return 'icon-blue';
      case 'Professeurs': return 'icon-purple';
      case 'Classes': return 'icon-green';
      case 'Revenus': return 'icon-indigo';
      case 'Salaires': return 'icon-rose';
      case 'Charges': return 'icon-yellow';
      case 'Dépenses': return 'icon-orange';
      case 'Solde Net': return reste >= 0 ? 'icon-teal' : 'icon-red';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '5px solid #93c5fd',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ background: '#fef3c7', borderLeft: '4px solid #facc15', padding: '1rem', color: '#92400e' }}>
        Aucune donnée disponible pour le moment.
      </div>
    );
  }

  const cards = [
    { title: 'Étudiants', value: stats.etudiants, icon: <FaUsers size={36} /> },
    { title: 'Professeurs', value: stats.professeurs, icon: <FaChalkboardTeacher size={36} /> },
    { title: 'Classes', value: stats.classes, icon: <FaSchool size={36} /> },
    { title: 'Revenus', value: `${formatNumber(stats.revenus)} MAD`, icon: <FaMoneyBillWave size={36} /> },
    { title: 'Salaires', value: `${formatNumber(stats.profs)} MAD`, icon: <FaWallet size={36} /> },
    { title: 'Charges', value: `${formatNumber(stats.charges)} MAD`, icon: <FaMoneyCheckAlt size={36} /> },
    { title: 'Dépenses', value: `${formatNumber(stats.depenses)} MAD`, icon: <FaChartLine size={36} /> },
    { title: 'Solde Net', value: `${formatNumber(stats.reste)} MAD`, icon: <FaPiggyBank size={36} /> }
  ];

  return (
    <div className=" ">
      <h1 className="dashboard-title">📊 Tableau de Bord</h1>

      <div className="row">
        {cards.map((card, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-content">
                <div className={`card-icon ${getIconClass(card.title, stats.reste)}`}>
                  {card.icon}
                </div>
                <div className="card-text">
                  <h2 className="card-title">{card.title}</h2>
                  <p className="card-value">{card.value}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;