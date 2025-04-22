import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDashboardStats();
        console.log("Données reçues du backend :", data); // 🔍 Debug
        setStats(data); // ✅ Pas .data car c'est fetch
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des stats :', error);
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <p>Chargement...</p>;

  if (!stats) return <p>Aucune donnée disponible.</p>;

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold">Étudiants</h2>
        <p>{stats.etudiants || 0}</p>
      </div>
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold">Professeurs</h2>
        <p>{stats.professeurs || 0}</p>
      </div>
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold">Classes</h2>
        <p>{stats.classes || 0}</p>
      </div>
      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-bold">Revenus</h2>
        <p>{stats.revenus || 0} MAD</p>
      </div>
      <div className="bg-white shadow rounded-xl p-6">
    <h2 className="text-xl font-bold">Total des salaires des professeurs</h2>
    <p>{stats.profs || 0} MAD</p>
    </div>
    <div className="bg-white shadow rounded-xl p-6">
    <h2 className="text-xl font-bold">Charges</h2>
    <p>{stats.charges || 0} MAD</p>
    </div>

      <div className="bg-white shadow rounded-xl p-6">
    <h2 className="text-xl font-bold">Dépenses</h2>
    <p>{stats.depenses || 0} MAD</p>
    </div>
    <div className="bg-white shadow rounded-xl p-6">
  <h2 className="text-xl font-bold">Reste (Solde net)</h2>
  <p>{stats.reste || 0} MAD</p>
</div>


    </div>
  );
};

export default Dashboard;
