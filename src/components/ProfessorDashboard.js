import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Grid } from '@mui/material';

const ProfessorDashboard = () => {
  return (
    <div>
      <Typography variant="h4" gutterBottom>Tableau de bord du Professeur</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/courses" style={{ textDecoration: 'none' }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Gestion des cours</Typography>
                <Typography>Créer, modifier et consulter les plannings</Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/results" style={{ textDecoration: 'none' }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Suivi des résultats</Typography>
                <Typography>Noter et suivre les performances</Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/communication" style={{ textDecoration: 'none' }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Communication</Typography>
                <Typography>Messages aux élèves et parents</Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/assignments" style={{ textDecoration: 'none' }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Devoirs et examens</Typography>
                <Typography>Assigner et corriger des travaux</Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Link to="/attendance" style={{ textDecoration: 'none' }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Suivi des présences</Typography>
                <Typography>Marquer les absences/présences</Typography>
              </CardContent>
            </Card>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfessorDashboard;