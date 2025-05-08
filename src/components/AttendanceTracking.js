import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Select, MenuItem, FormControl, InputLabel, 
  Checkbox, Box, CircularProgress, Typography, Alert
} from '@mui/material';
import axios from 'axios';

const AttendanceTracking = () => {
  const [filieres, setFilieres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [selectedClasse, setSelectedClasse] = useState('');
  const [etudiants, setEtudiants] = useState([]);
  const [absenceRecords, setAbsenceRecords] = useState({});
  const [loading, setLoading] = useState({
    filieres: false,
    classes: false,
    etudiants: false
  });
  const [error, setError] = useState(null);

  // Récupérer les filières au montage
  useEffect(() => {
    const fetchFilieres = async () => {
      setLoading(prev => ({...prev, filieres: true}));
      setError(null);
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/filieres');
        const data = response.data.data || response.data;
        setFilieres(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Erreur lors du chargement des filières");
        console.error(err);
      } finally {
        setLoading(prev => ({...prev, filieres: false}));
      }
    };
    fetchFilieres();
  }, []);

  // Récupérer les classes quand une filière est sélectionnée
  useEffect(() => {
    const fetchClasses = async () => {
      if (!selectedFiliere) {
        setClasses([]);
        setSelectedClasse('');
        return;
      }
      
      setLoading(prev => ({...prev, classes: true}));
      setError(null);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/filieres/${selectedFiliere}/classes`);
        const data = response.data.data || response.data;
        setClasses(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Erreur lors du chargement des classes");
        console.error(err);
      } finally {
        setLoading(prev => ({...prev, classes: false}));
      }
    };
    fetchClasses();
  }, [selectedFiliere]);

  // Récupérer les étudiants et leurs absences quand une classe est sélectionnée
  const fetchEtudiantsAndAbsences = async (classeId) => {
    if (!classeId) {
      setEtudiants([]);
      return;
    }
    
    setLoading(prev => ({...prev, etudiants: true}));
    setError(null);
    try {
      const [etudiantsRes, attendancesRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/classes/${classeId}/etudiants`),
        axios.get(`http://127.0.0.1:8000/api/classes/${classeId}/attendances`)
      ]);

      // Gestion des données des étudiants
      const etudiantsData = etudiantsRes.data.data || etudiantsRes.data || [];
      setEtudiants(Array.isArray(etudiantsData) ? etudiantsData : []);

      // Gestion des absences (inverser la logique: true = absent)
      const records = {};
      const attendancesData = attendancesRes.data.data || attendancesRes.data || [];
      attendancesData.forEach(record => {
        records[record.etudiant_id] = record.status === 'absent';
      });
      setAbsenceRecords(records);
    } catch (err) {
      setError("Erreur lors du chargement des étudiants et des absences");
      console.error(err);
    } finally {
      setLoading(prev => ({...prev, etudiants: false}));
    }
  };

  useEffect(() => {
    fetchEtudiantsAndAbsences(selectedClasse);
  }, [selectedClasse]);

  const handleAbsenceChange = (etudiantId, isAbsent) => {
    setAbsenceRecords(prev => ({
      ...prev,
      [etudiantId]: isAbsent
    }));
  };

  const submitAbsences = async () => {
    setLoading(prev => ({...prev, etudiants: true}));
    setError(null);
  
    try {
      const payload = {
        attendances: etudiants.map(etudiant => ({
          etudiant_id: etudiant.id,
          classe_id: parseInt(selectedClasse),
          course_id: null, // Ajout explicite de course_id
          date: new Date().toISOString().split('T')[0],
          status: absenceRecords[etudiant.id] ? 'absent' : 'present',
          notes: "" // Champ optionnel mais explicitement défini
        }))
      };
  
      console.log('Données envoyées:', payload);
  
      const response = await axios.post(
        `http://127.0.0.1:8000/api/classes/${selectedClasse}/attendances`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        alert('Enregistrement réussi!');
        fetchEtudiantsAndAbsences(selectedClasse);
      } else {
        throw new Error(response.data.message || 'Erreur serveur');
      }
    } catch (error) {
      const errorDetails = error.response?.data?.errors 
                        || error.response?.data?.message
                        || error.message;
      setError(`Échec de l'enregistrement: ${JSON.stringify(errorDetails)}`);
      console.error('Erreur complète:', {
        request: error.config,
        response: error.response?.data
      });
    } finally {
      setLoading(prev => ({...prev, etudiants: false}));
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Suivi des absences des élèves
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Filière</InputLabel>
          <Select
            value={selectedFiliere}
            onChange={(e) => setSelectedFiliere(e.target.value)}
            label="Filière"
            disabled={loading.filieres}
          >
            {loading.filieres ? (
              <MenuItem disabled>Chargement...</MenuItem>
            ) : filieres.map((filiere) => (
              <MenuItem key={filiere.id} value={filiere.id}>
                {filiere.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Classe</InputLabel>
          <Select
            value={selectedClasse}
            onChange={(e) => setSelectedClasse(e.target.value)}
            label="Classe"
            disabled={!selectedFiliere || loading.classes}
          >
            {loading.classes ? (
              <MenuItem disabled>Chargement...</MenuItem>
            ) : classes.map((classe) => (
              <MenuItem key={classe.id} value={classe.id}>
                {classe.nom}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {loading.etudiants ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        selectedClasse && (
          <>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom</TableCell>
                    <TableCell>Prénom</TableCell>
                    <TableCell>Absent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {etudiants.length > 0 ? (
                    etudiants.map((etudiant) => (
                      <TableRow key={etudiant.id}>
                        <TableCell>{etudiant.nom}</TableCell>
                        <TableCell>{etudiant.prenom}</TableCell>
                        <TableCell>
                          <Checkbox
                            checked={!!absenceRecords[etudiant.id]}
                            onChange={(e) => handleAbsenceChange(etudiant.id, e.target.checked)}
                            color="error"
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        Aucun étudiant trouvé dans cette classe
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {etudiants.length > 0 && (
              <Button 
                variant="contained" 
                color="primary" 
                onClick={submitAbsences}
                size="large"
                disabled={loading.etudiants}
              >
                Enregistrer les absences
              </Button>
            )}
          </>
        )
      )}
    </Box>
  );
};

export default AttendanceTracking;