import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';
import {
  TextField, Button, Container, Box, Typography,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Paper,
  Table, TableHead, TableBody, TableRow, TableCell, Dialog,
  DialogTitle, DialogContent, DialogActions, Alert
} from '@mui/material';

const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

const EmploiDuTemps = () => {
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [creneaux, setCreneaux] = useState([]);
  const [selectedClasseId, setSelectedClasseId] = useState('');
  const [emplois, setEmplois] = useState([]);
  const [selectedSeance, setSelectedSeance] = useState(null);
  const [formData, setFormData] = useState({
    matiere_id: '',
    professeur_id: '',
    salle: '',
    jour: '',
    creneau_id: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const emploiRef = useRef(null);

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [classesRes, creneauxRes, matieresRes, professeursRes] = await Promise.all([
          axios.get('http://localhost:8000/api/classrooms'),
          axios.get('http://localhost:8000/api/creneaux'),
          axios.get('http://127.0.0.1:8000/api/matieres'),
          axios.get('http://localhost:8000/api/professeurs')
        ]);

        setClasses(classesRes.data || []);
        setCreneaux((creneauxRes.data || []).sort((a, b) => a.heure_debut.localeCompare(b.heure_debut)));
        const matieresData = matieresRes.data.data || matieresRes.data;
        setMatieres(matieresData || []);
        setProfesseurs(professeursRes.data || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Charger l'emploi du temps quand une classe est sélectionnée
  useEffect(() => {
    if (selectedClasseId) {
      const fetchEmplois = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`http://localhost:8000/api/emplois-temps/${selectedClasseId}`);
          setEmplois(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
          console.error("Erreur lors du chargement de l'emploi du temps:", err);
          setError("Erreur lors du chargement de l'emploi du temps");
        } finally {
          setLoading(false);
        }
      };

      fetchEmplois();
    }
  }, [selectedClasseId]);

  // Mettre à jour le formulaire quand une séance est sélectionnée
  useEffect(() => {
    if (selectedSeance) {
      setFormData({
        matiere_id: selectedSeance.matiere_id || '',
        professeur_id: selectedSeance.professeur_id || '',
        salle: selectedSeance.salle || '',
        jour: selectedSeance.jour || selectedSeance.jour,
        creneau_id: selectedSeance.creneau_id || selectedSeance.creneau_id
      });
      setOpenDialog(true);
    }
  }, [selectedSeance]);

  // Afficher le contenu d'une séance dans le tableau
  const getSeance = (jour, creneauId) => {
    const seance = emplois.find(e => e.jour === jour && e.creneau_id == creneauId);
    if (seance) {
      const matiere = matieres.find(m => m.id == seance.matiere_id);
      const professeur = professeurs.find(p => p.id == seance.professeur_id);
      
      return (
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2">{matiere?.nom || 'Inconnue'}</Typography>
          <Typography variant="body2">{professeur?.nom || 'Inconnu'}</Typography>
          <Typography variant="caption">Salle: {seance.salle}</Typography>
        </Box>
      );
    }
    return <Typography variant="body2">—</Typography>;
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const dataToSend = {
        ...formData,
        classe_id: selectedClasseId
      };

      let response;
      if (selectedSeance?.id) {
        // Modification
        response = await axios.put(`http://localhost:8000/api/emplois-temps/${selectedSeance.id}`, dataToSend);
        setEmplois(prev => prev.map(e => 
          e.id === selectedSeance.id ? { ...e, ...response.data } : e
        ));
      } else {
        // Ajout
        response = await axios.post('http://localhost:8000/api/emplois-temps', dataToSend);
        setEmplois(prev => [...prev, response.data]);
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      if (error.response?.status === 422) {
        const errorMessages = [];
        for (const field in error.response.data.errors) {
          errorMessages.push(...error.response.data.errors[field]);
        }
        setError(errorMessages.join(', '));
      } else {
        setError(error.response?.data?.message || 'Erreur lors de la sauvegarde');
      }
    }
  };

  // Supprimer une séance
  const supprimerSeance = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette séance ?')) {
      try {
        await axios.delete(`http://localhost:8000/api/emplois-temps/${id}`);
        setEmplois(prev => prev.filter(e => e.id !== id));
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        setError("Erreur lors de la suppression");
      }
    }
  };

  // Télécharger l'emploi du temps en PDF
  const telechargerPDF = () => {
    const element = emploiRef.current;
    const opt = {
      margin: 0.5,
      filename: `emploi-du-temps-${selectedClasseId}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSeance(null);
    setFormData({
      matiere_id: '',
      professeur_id: '',
      salle: '',
      jour: '',
      creneau_id: ''
    });
    setError(null);
  };

  if (loading && !selectedClasseId) {
    return (
      <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !selectedClasseId) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">{error}</Alert>
        <Button onClick={() => window.location.reload()} sx={{ mt: 2 }}>Réessayer</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Classe</InputLabel>
          <Select
            value={selectedClasseId}
            onChange={(e) => setSelectedClasseId(e.target.value)}
            label="Classe"
          >
            <MenuItem value="">-- Choisir une classe --</MenuItem>
            {classes.map(classe => (
              <MenuItem key={classe.id} value={classe.id}>{classe.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedClasseId && (
        <>
         

          <Paper ref={emploiRef} sx={{ overflowX: 'auto', mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>Jour / Créneau</TableCell>
                  {creneaux.map(cr => (
                    <TableCell key={cr.id} align="center" sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>
                      {cr.heure_debut.slice(0, 5)} - {cr.heure_fin.slice(0, 5)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {jours.map(jour => (
                  <TableRow key={jour}>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'background.default' }}>{jour}</TableCell>
                    {creneaux.map(cr => {
                      const seance = emplois.find(e => e.jour === jour && e.creneau_id == cr.id);
                      return (
                        <TableCell 
                          key={cr.id} 
                          align="center"
                          sx={{ 
                            cursor: 'pointer',
                            '&:hover': { bgcolor: 'action.hover' },
                            minWidth: 150
                          }}
                          onClick={() => {
                            setSelectedSeance(
                              seance ? seance : { 
                                jour, 
                                creneau_id: cr.id,
                                classe_id: selectedClasseId
                              }
                            );
                          }}
                        >
                          {seance ? (
                            <Box>
                              {getSeance(jour, cr.id)}
                              <Button 
                                size="small" 
                                color="error"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  supprimerSeance(seance.id);
                                }}
                              >
                                Supprimer
                              </Button>
                            </Box>
                          ) : (
                            <Typography variant="body2">+ Ajouter</Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedSeance?.id ? 'Modifier la séance' : 'Ajouter une nouvelle séance'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <FormControl fullWidth margin="normal">
              <InputLabel>Jour</InputLabel>
              <Select
                name="jour"
                value={formData.jour}
                onChange={handleInputChange}
                required
                label="Jour"
              >
                {jours.map(jour => (
                  <MenuItem key={jour} value={jour}>{jour}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Créneau</InputLabel>
              <Select
                name="creneau_id"
                value={formData.creneau_id}
                onChange={handleInputChange}
                required
                label="Créneau"
              >
                {creneaux.map(creneau => (
                  <MenuItem key={creneau.id} value={creneau.id}>
                    {creneau.heure_debut.slice(0, 5)} - {creneau.heure_fin.slice(0, 5)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Matière</InputLabel>
              <Select
                name="matiere_id"
                value={formData.matiere_id}
                onChange={handleInputChange}
                required
                label="Matière"
              >
                {matieres.map(matiere => (
                  <MenuItem key={matiere.id} value={matiere.id}>
                    {matiere.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Professeur</InputLabel>
              <Select
                name="professeur_id"
                value={formData.professeur_id}
                onChange={handleInputChange}
                required
                label="Professeur"
              >
                {professeurs.map(prof => (
                  <MenuItem key={prof.id} value={prof.id}>
                    {prof.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label="Salle"
              name="salle"
              value={formData.salle}
              onChange={handleInputChange}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmploiDuTemps;