import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, TextField, Dialog, DialogActions, DialogContent, 
  DialogTitle, Select, MenuItem, FormControl, InputLabel, CircularProgress,
  Alert, Snackbar, Typography, Box
} from '@mui/material';
import axios from 'axios';

const AssignmentsExams = () => {
  // États principaux
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  
  // États pour les modales et formulaires
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  // État pour le nouveau devoir
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    due_date: '',
    course_id: '',
    type: 'assignment'
  });

  // États pour le chargement
  const [loading, setLoading] = useState({
    assignments: true,
    courses: true,
    submissions: false
  });

  // États pour les erreurs
  const [error, setError] = useState({
    assignments: null,
    courses: null,
    submissions: null
  });

  // Snackbar (notifications)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Récupération des données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchAssignments(), fetchCourses()]);
      } catch (error) {
        console.error('Initial data loading error:', error);
      }
    };
    fetchData();
  }, []);

  // Fonctions de récupération des données
  const fetchAssignments = async () => {
    setLoading(prev => ({...prev, assignments: true}));
    setError(prev => ({...prev, assignments: null}));
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/assignments');
      const data = response.data?.data || response.data || [];
      setAssignments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      setError(prev => ({...prev, assignments: error.message}));
      showSnackbar('Erreur lors du chargement des devoirs', 'error');
    } finally {
      setLoading(prev => ({...prev, assignments: false}));
    }
  };

  const fetchCourses = async () => {
    setLoading(prev => ({...prev, courses: true}));
    setError(prev => ({...prev, courses: null}));
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/courses');
      const data = response.data?.data || response.data || [];
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError(prev => ({...prev, courses: error.message}));
      showSnackbar('Erreur lors du chargement des cours', 'error');
    } finally {
      setLoading(prev => ({...prev, courses: false}));
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    setLoading(prev => ({...prev, submissions: true}));
    setError(prev => ({...prev, submissions: null}));
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/assignments/${assignmentId}/submissions`);
      const data = response.data?.data || response.data || [];
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setError(prev => ({...prev, submissions: error.message}));
      showSnackbar('Erreur lors du chargement des soumissions', 'error');
    } finally {
      setLoading(prev => ({...prev, submissions: false}));
    }
  };

  // Gestion des formulaires
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitAssignment = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/assignments', newAssignment);
      showSnackbar('Devoir créé avec succès', 'success');
      fetchAssignments();
      handleCloseDialog();
    } catch (error) {
      console.error('Error creating assignment:', error);
      showSnackbar('Erreur lors de la création du devoir', 'error');
    }
  };

  const handleSubmitGrade = async (submission) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/assignments/${selectedAssignment.id}/submissions`,
        {
          student_id: submission.student_id,
          grade: submission.grade
        }
      );
      showSnackbar('Note enregistrée avec succès', 'success');
      fetchSubmissions(selectedAssignment.id);
    } catch (error) {
      console.error('Error updating grade:', error);
      showSnackbar('Erreur lors de l\'enregistrement de la note', 'error');
    }
  };

  // Gestion des interactions
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewAssignment({
      title: '',
      description: '',
      due_date: '',
      course_id: '',
      type: 'assignment'
    });
  };

  const handleViewSubmissions = (assignment) => {
    setSelectedAssignment(assignment);
    fetchSubmissions(assignment.id);
  };

  const handleCloseSubmissions = () => setSelectedAssignment(null);

  // Helper functions
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Affichage conditionnel
  if (loading.assignments || loading.courses) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error.assignments || error.courses) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error.assignments || error.courses}
      </Alert>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Gestion des devoirs et examens
      </Typography>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpenDialog}
        sx={{ mb: 3 }}
      >
        Créer un nouveau devoir/examen
      </Button>

      {/* Liste des devoirs */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Titre</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Cours</TableCell>
              <TableCell>Date d'échéance</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.length > 0 ? (
              assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>
                    {assignment.type === 'assignment' ? 'Devoir' : 'Examen'}
                  </TableCell>
                  <TableCell>
                    {courses.find(c => c.id === assignment.course_id)?.name || 'Non attribué'}
                  </TableCell>
                  <TableCell>
                    {new Date(assignment.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      onClick={() => handleViewSubmissions(assignment)}
                    >
                      Voir les soumissions
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Aucun devoir/examen trouvé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog pour créer un nouveau devoir */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>
          {newAssignment.id ? 'Modifier le devoir' : 'Créer un nouveau devoir/examen'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={newAssignment.type}
              onChange={handleInputChange}
              label="Type"
            >
              <MenuItem value="assignment">Devoir</MenuItem>
              <MenuItem value="exam">Examen</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="normal"
            name="title"
            label="Titre"
            fullWidth
            value={newAssignment.title}
            onChange={handleInputChange}
          />

          <TextField
            margin="normal"
            name="description"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newAssignment.description}
            onChange={handleInputChange}
          />

          <TextField
            margin="normal"
            name="due_date"
            label="Date d'échéance"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newAssignment.due_date}
            onChange={handleInputChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Cours</InputLabel>
            <Select
              name="course_id"
              value={newAssignment.course_id}
              onChange={handleInputChange}
              label="Cours"
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmitAssignment} 
            color="primary"
            disabled={!newAssignment.title || !newAssignment.course_id}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog pour voir les soumissions */}
      <Dialog 
        open={!!selectedAssignment} 
        onClose={handleCloseSubmissions} 
        fullWidth 
        maxWidth="md"
      >
        <DialogTitle>
          Soumissions pour: {selectedAssignment?.title}
        </DialogTitle>
        <DialogContent>
          {loading.submissions ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : error.submissions ? (
            <Alert severity="error">{error.submissions}</Alert>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Étudiant</TableCell>
                    <TableCell>Date de soumission</TableCell>
                    <TableCell>Note</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.length > 0 ? (
                    submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.student_name}</TableCell>
                        <TableCell>
                          {new Date(submission.submitted_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            type="number"
                            value={submission.grade || ''}
                            onChange={(e) => {
                              const updatedSubmissions = submissions.map(s => 
                                s.id === submission.id ? { ...s, grade: e.target.value } : s
                              );
                              setSubmissions(updatedSubmissions);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleSubmitGrade(submission)}
                          >
                            Enregistrer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        Aucune soumission trouvée
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubmissions}>Fermer</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AssignmentsExams;