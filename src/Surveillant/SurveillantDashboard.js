import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './NavBar';

const SurveillantDashboard = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch statistics data
        axios.get('http://127.0.0.1:8000/api/statistics-surveillant')  // Replace with your backend URL
            .then((response) => {
                setStatistics(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("There was an error fetching the statistics!", error);
                setLoading(false);
            });
    }, []);

    return (

        <div className="dashboard">
          <Navbar />
            <h1>Tableau de bord du Surveillant</h1>

            {loading ? (
                <p>Chargement des statistiques...</p>
            ) : (
                <div className="stats">
                    <p><strong>Total Étudiants:</strong> {statistics.studentsCount}</p>
                    <p><strong>Total Absences:</strong> {statistics.absencesCount}</p>
                    <p><strong>Absences Justifiées:</strong> {statistics.justifiedAbsencesCount}</p>
                    <p><strong>Absences Injustifiées:</strong> {statistics.unjustifiedAbsencesCount}</p>
                    <p><strong>Total Incidents:</strong> {statistics.incidentsCount}</p>
                </div>
            )}
        </div>
    );
};

export default SurveillantDashboard;
