import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
} from 'recharts';
import axios from 'axios';
import PropTypes from 'prop-types';

const moisLabels = [
  '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const CustomizedLabel = ({ x, y, stroke, value }) => {
  if (value === undefined || value === null) return null;
  
  return (
    <text x={x} y={y} dy={-10} fill={stroke} fontSize={10} textAnchor="middle">
      {value} DH
    </text>
  );
};

CustomizedLabel.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  stroke: PropTypes.string,
  value: PropTypes.number
};

const DiagrammeLigneRestes = () => {
  const [data, setData] = useState([]);
  const [annee, setAnnee] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000'}/api/statistiques-mensuelles`,
          { params: { annee } }
        );

        console.log('Données reçues:', response.data); // Debug

        // Create data for all months
        const allMonthsData = Array.from({ length: 12 }, (_, index) => {
          const moisNumero = index + 1;
          const matchingData = response.data.find(item => item.mois === moisNumero);
          
          return {
            moisNumero,
            mois: moisLabels[moisNumero],
            reste: matchingData ? Number(matchingData.reste) : null
          };
        }).map(item => ({
          ...item,
          reste: item.reste === null ? 0 : item.reste
        }));

        console.log('Données formatées:', allMonthsData); // Debug
        setData(allMonthsData);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des données:', err);
        setError('Erreur lors du chargement des données. Veuillez réessayer.');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [annee]);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  if (loading) {
    return <div className="p-4 text-center">Chargement en cours...</div>;
  }

  return (
    <div className="p-4 bg-white shadow rounded" aria-label="Graphique d'évolution du reste mensuel">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Évolution du reste mensuel ({annee})</h2>
        <select 
          value={annee}
          onChange={(e) => setAnnee(Number(e.target.value))}
          className="border rounded px-3 py-1"
          aria-label="Sélectionner l'année"
        >
          {yearOptions.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      {error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            aria-label="Graphique en ligne montrant l'évolution du reste mensuel"
          >
            <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
            <XAxis 
              dataKey="mois" 
              tick={{ fill: '#555' }}
              tickMargin={10}
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(value) => `${value} DH`}
              tick={{ fill: '#555' }}
            />

            <Tooltip 
              formatter={(value) => [`${value !== null ? value : 'N/A'} DH`, 'Reste']}
              labelFormatter={(label) => `Mois: ${label}`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="reste"
              name="Reste"
              stroke="#4f81bd"
              strokeWidth={3}
              dot={{ r: 5 }}
              isAnimationActive={false}
            >
              <LabelList content={<CustomizedLabel />} position="top" />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Aucune donnée disponible pour l'année sélectionnée
        </div>
      )}
    </div>
  );
};

export default DiagrammeLigneRestes;