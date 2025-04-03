import React, { useState, useEffect } from 'react';
import { 
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import axios from 'axios';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    professor_id: '',
    classroom_id: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState({
    courses: true,
    professors: true,
    classrooms: true,
    submitting: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchCourses(),
        fetchProfessors(),
        fetchClassrooms()
      ]);
    } catch (error) {
      showSnackbar('Erreur lors du chargement des données initiales', 'error');
    }
  };

  const fetchCourses = async () => {
    setLoading(prev => ({...prev, courses: true}));
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/courses');
      setCourses(response.data.data || response.data);
    } catch (error) {
      console.error('Erreur cours:', error.response);
      showSnackbar('Erreur lors du chargement des cours', 'error');
    } finally {
      setLoading(prev => ({...prev, courses: false}));
    }
  };

  const fetchProfessors = async () => {
    setLoading(prev => ({...prev, professors: true}));
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/professeurs');
      setProfessors(response.data.data || response.data);
    } catch (error) {
      console.error('Erreur professeurs:', error.response);
      showSnackbar('Erreur lors du chargement des professeurs', 'error');
    } finally {
      setLoading(prev => ({...prev, professors: false}));
    }
  };

  const fetchClassrooms = async () => {
    setLoading(prev => ({...prev, classrooms: true}));
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/classrooms');
      setClassrooms(response.data.data || response.data);
    } catch (error) {
      console.error('Erreur salles:', error.response);
      showSnackbar('Erreur lors du chargement des salles', 'error');
    } finally {
      setLoading(prev => ({...prev, classrooms: false}));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({...prev, submitting: true}));
    
    try {
      const url = editingId 
        ? `http://127.0.0.1:8000/api/courses/${editingId}`
        : 'http://127.0.0.1:8000/api/courses';
      
      const method = editingId ? 'put' : 'post';
      
      await axios[method](url, formData);
      showSnackbar(
        `Cours ${editingId ? 'modifié' : 'créé'} avec succès`, 
        'success'
      );
      resetForm();
      fetchCourses();
    } catch (error) {
      if (error.response?.status === 422) {
        showSnackbar(
          'Erreur de validation: ' + 
          Object.values(error.response.data.errors).join(', '), 
          'error'
        );
      } else {
        showSnackbar(
          error.response?.data?.message || 'Une erreur est survenue', 
          'error'
        );
      }
    } finally {
      setLoading(prev => ({...prev, submitting: false}));
    }
  };

  const handleEdit = (course) => {
    setFormData({
      name: course.name,
      description: course.description,
      professor_id: course.professor_id,
      classroom_id: course.classroom_id
    });
    setEditingId(course.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/courses/${id}`);
      showSnackbar('Cours supprimé avec succès', 'success');
      fetchCourses();
    } catch (error) {
      showSnackbar('Erreur lors de la suppression du cours', 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      professor_id: '',
      classroom_id: ''
    });
    setEditingId(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading.courses || loading.professors || loading.classrooms) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Gestion des Cours
      </Typography>

      {/* Formulaire d'ajout/modification */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          {editingId ? 'Modifier un Cours' : 'Ajouter un Nouveau Cours'}
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Nom du Cours"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="normal" required sx={{ mb: 2 }}>
            <InputLabel>Professeur</InputLabel>
            <Select
              name="professor_id"
              value={formData.professor_id}
              onChange={handleChange}
              label="Professeur"
            >
              {professors.map(professor => (
                <MenuItem key={professor.id} value={professor.id}>
                  {professor.nom} - {professor.specialite}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required sx={{ mb: 3 }}>
            <InputLabel>Salle de Classe</InputLabel>
            <Select
              name="classroom_id"
              value={formData.classroom_id}
              onChange={handleChange}
              label="Salle de Classe"
            >
              {classrooms.map(classroom => (
                <MenuItem key={classroom.id} value={classroom.id}>
                  {classroom.name} (Capacité: {classroom.capacite})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading.submitting}
            >
              {loading.submitting ? (
                <CircularProgress size={24} />
              ) : editingId ? (
                'Mettre à Jour'
              ) : (
                'Créer'
              )}
            </Button>

            {editingId && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={resetForm}
              >
                Annuler
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* Liste des cours */}
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
          Liste des Cours
        </Typography>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Professeur</TableCell>
                <TableCell>Salle</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            
            <TableBody>
              {courses.length > 0 ? (
                courses.map(course => {
                  const professor = professors.find(p => p.id === course.professor_id);
                  const classroom = classrooms.find(c => c.id === course.classroom_id);
                  
                  return (
                    <TableRow key={course.id}>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.description}</TableCell>
                      <TableCell>
                        {professor ? `${professor.nom} (${professor.specialite})` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {classroom ? `${classroom.name}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => handleEdit(course)}
                          sx={{ mr: 1 }}
                        >
                          Modifier
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(course.id)}
                        >
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Aucun cours trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Notification Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CourseManagement;