import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Select, MenuItem, FormControl, 
  InputLabel, Card, CardContent, Typography, 
  Dialog, DialogTitle, DialogContent, 
  DialogActions, Box, CircularProgress, Alert,
  List, ListItem, ListItemText, Divider, Chip
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const Communication = () => {
  // États
  const [form, setForm] = useState({
    message: '',
    selectedFiliere: '',
    selectedClasse: ''
  });
  
  const [data, setData] = useState({
    classes: [],
    filieres: [],
    etudiants: [],
    parents: {}
  });
  
  const [ui, setUi] = useState({
    openDialog: false,
    currentEtudiant: null,
    recipientType: 'etudiant',
    loading: {
      filieres: false,
      classes: false,
      etudiants: false,
      parents: false,
      sending: false
    },
    error: null
  });

  // Récupération des filières
  useEffect(() => {
    const fetchFilieres = async () => {
      setUi(prev => ({...prev, 
        loading: {...prev.loading, filieres: true},
        error: null
      }));
      
      try {
        const response = await axios.get(`${API_URL}/filieres`);
        setData(prev => ({...prev, filieres: response.data.data || response.data}));
      } catch (err) {
        setUi(prev => ({...prev, 
          error: "Erreur chargement filières"
        }));
        console.error(err);
      } finally {
        setUi(prev => ({...prev, 
          loading: {...prev.loading, filieres: false}
        }));
      }
    };
    
    fetchFilieres();
  }, []);

  // Récupération des classes quand filière changée
  useEffect(() => {
    const fetchClasses = async () => {
      if (!form.selectedFiliere) {
        setData(prev => ({...prev, classes: []}));
        setForm(prev => ({...prev, selectedClasse: ''}));
        return;
      }
      
      setUi(prev => ({...prev, 
        loading: {...prev.loading, classes: true},
        error: null
      }));
      
      try {
        const response = await axios.get(
          `${API_URL}/filieres/${form.selectedFiliere}/classes`
        );
        setData(prev => ({...prev, classes: response.data.data || response.data}));
      } catch (err) {
        setUi(prev => ({...prev, 
          error: "Erreur chargement classes"
        }));
        console.error(err);
      } finally {
        setUi(prev => ({...prev, 
          loading: {...prev.loading, classes: false}
        }));
      }
    };
    
    fetchClasses();
  }, [form.selectedFiliere]);

  // Récupération des étudiants et parents
  const fetchEtudiants = async () => {
    if (!form.selectedFiliere || !form.selectedClasse) return;
    
    try {
      setUi(prev => ({...prev, 
        loading: {...prev.loading, etudiants: true, parents: true},
        error: null
      }));
      
      // Récupération étudiants
      const etudiantsRes = await axios.get(`${API_URL}/etudiants`, {
        params: {
          filiere_id: form.selectedFiliere,
          class_id: form.selectedClasse
        }
      });
      
      const etudiantsData = etudiantsRes.data.data || etudiantsRes.data;
      setData(prev => ({...prev, etudiants: etudiantsData}));
      
      // Récupération IDs parents uniques
      const parentIds = [...new Set(
        etudiantsData
          .filter(e => e.parent_id)
          .map(e => e.parent_id)
          .filter(id => id) // Ensure we only have truthy values
      )];
      
      // Only fetch parents if we have IDs
      if (parentIds.length > 0) {
        try {
          console.log('Fetching parents with IDs:', parentIds.join(','));
          const parentsRes = await axios.get(`${API_URL}/parents`, {
            params: { ids: parentIds.join(',') }
          });
          
          console.log('Parents response:', parentsRes);
          
          const parentsData = parentsRes.data.data || parentsRes.data;
          const parentsMap = Array.isArray(parentsData)
            ? parentsData.reduce((acc, p) => ({...acc, [p.id]: p}), {})
            : parentsData;
          
          setData(prev => ({...prev, parents: parentsMap}));
        } catch (parentError) {
          console.error('Error fetching parents:', parentError);
          setUi(prev => ({...prev, 
            error: 'Erreur chargement des parents'
          }));
          setData(prev => ({...prev, parents: {}}));
        }
      } else {
        setData(prev => ({...prev, parents: {}}));
      }
      
    } catch (error) {
      setUi(prev => ({...prev, 
        error: 'Erreur chargement données'
      }));
      console.error('Erreur:', error);
    } finally {
      setUi(prev => ({...prev, 
        loading: {...prev.loading, etudiants: false, parents: false}
      }));
    }
  };

  // Gestion envoi message
  const handleSendMessage = async () => {
    if (!ui.currentEtudiant || !form.message) return;
    
    try {
      setUi(prev => ({...prev, 
        loading: {...prev.loading, sending: true},
        error: null
      }));
      
      let recipientEmail, recipientName;
      
      if (ui.recipientType === 'etudiant') {
        recipientEmail = ui.currentEtudiant.email;
        recipientName = `${ui.currentEtudiant.prenom} ${ui.currentEtudiant.nom}`;
      } else {
        if (!ui.currentEtudiant.parent_id) {
          throw new Error("Aucun parent associé");
        }
        
        const parent = data.parents[ui.currentEtudiant.parent_id];
        if (!parent?.email) {
          throw new Error("Email parent non disponible");
        }
        
        recipientEmail = parent.email;
        recipientName = `${parent.prenom} ${parent.nom}`;
      }
      
      await axios.post(`${API_URL}/send-message`, {
        message: form.message,
        recipient_email: recipientEmail,
        recipient_type: ui.recipientType,
        etudiant_id: ui.currentEtudiant.id
      });
      
      setUi(prev => ({...prev, openDialog: false}));
      setForm(prev => ({...prev, message: ''}));
      
      alert(`Message envoyé à ${recipientName} (${recipientEmail})`);
    } catch (error) {
      setUi(prev => ({...prev, 
        error: error.message || 'Erreur envoi message'
      }));
      console.error('Erreur:', error);
    } finally {
      setUi(prev => ({...prev, 
        loading: {...prev.loading, sending: false}
      }));
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Communication École-Parents
      </Typography>
      
      {ui.error && (
        <Alert severity="error" onClose={() => setUi(prev => ({...prev, error: null}))} sx={{ mb: 2 }}>
          {ui.error}
        </Alert>
      )}
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Filtres</Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Filière</InputLabel>
              <Select
                value={form.selectedFiliere}
                onChange={(e) => setForm(prev => ({...prev, selectedFiliere: e.target.value}))}
                label="Filière"
                disabled={ui.loading.filieres}
              >
                {ui.loading.filieres ? (
                  <MenuItem disabled>Chargement...</MenuItem>
                ) : data.filieres.map((filiere) => (
                  <MenuItem key={filiere.id} value={filiere.id}>
                    {filiere.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
    
            <FormControl fullWidth>
              <InputLabel>Classe</InputLabel>
              <Select
                value={form.selectedClasse}
                onChange={(e) => setForm(prev => ({...prev, selectedClasse: e.target.value}))}
                label="Classe"
                disabled={!form.selectedFiliere || ui.loading.classes}
              >
                {ui.loading.classes ? (
                  <MenuItem disabled>Chargement...</MenuItem>
                ) : data.classes.map((classe) => (
                  <MenuItem key={classe.id} value={classe.id}>
                    {classe.nom}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={fetchEtudiants}
            disabled={!form.selectedFiliere || !form.selectedClasse || ui.loading.etudiants}
            startIcon={ui.loading.etudiants ? <CircularProgress size={20} /> : null}
          >
            {ui.loading.etudiants ? 'Chargement...' : 'Afficher les étudiants'}
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Liste des Étudiants
            {form.selectedFiliere && ` - Filière: ${data.filieres.find(f => f.id === form.selectedFiliere)?.nom}`}
            {form.selectedClasse && ` - Classe: ${data.classes.find(c => c.id === form.selectedClasse)?.nom}`}
          </Typography>
          
          {ui.loading.etudiants ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : data.etudiants.length > 0 ? (
            <List>
              {data.etudiants.map(etudiant => {
                const parent = etudiant.parent_id ? data.parents[etudiant.parent_id] : null;
                
                return (
                  <div key={etudiant.id}>
                    <ListItem>
                      <ListItemText
                        primary={`${etudiant.prenom} ${etudiant.nom}`}
                        secondary={
                          <>
                            <div>Email: {etudiant.email}</div>
                            <div>Matricule: {etudiant.matricule}</div>
                            {etudiant.parent_id && (
                              <Box sx={{ mt: 1 }}>
                                <Chip 
                                  label="Parent" 
                                  size="small" 
                                  color="secondary" 
                                  sx={{ mr: 1 }}
                                />
                                {parent ? (
                                  <>
                                    {parent.prenom} {parent.nom}
                                    {parent.email ? (
                                      <span style={{ marginLeft: '8px', color: '#666' }}>
                                        ({parent.email})
                                      </span>
                                    ) : (
                                      <span style={{ marginLeft: '8px', color: 'orange' }}>
                                        (email non renseigné)
                                      </span>
                                    )}
                                  </>
                                ) : (
                                  <span style={{ color: '#999' }}>
                                    {ui.loading.parents ? 'Chargement...' : 'Information non disponible'}
                                  </span>
                                )}
                              </Box>
                            )}
                          </>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          onClick={() => setUi(prev => ({
                            ...prev,
                            openDialog: true,
                            currentEtudiant: etudiant,
                            recipientType: 'etudiant'
                          }))}
                        >
                          Envoyer à l'étudiant
                        </Button>
                        <Button 
                          variant="outlined" 
                          size="small"
                          color="secondary"
                          onClick={() => setUi(prev => ({
                            ...prev,
                            openDialog: true,
                            currentEtudiant: etudiant,
                            recipientType: 'parent'
                          }))}
                          disabled={!etudiant.parent_id || ui.loading.parents}
                        >
                          Envoyer au parent
                        </Button>
                      </Box>
                    </ListItem>
                    <Divider />
                  </div>
                );
              })}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary" sx={{ py: 2 }}>
              {form.selectedFiliere && form.selectedClasse 
                ? "Aucun étudiant trouvé pour ces critères" 
                : "Veuillez sélectionner une filière et une classe"}
            </Typography>
          )}
        </CardContent>
      </Card>
      
      <Dialog 
        open={ui.openDialog} 
        onClose={() => setUi(prev => ({...prev, openDialog: false}))}
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>
          Envoyer un message à {ui.recipientType === 'etudiant' 
            ? "l'étudiant" 
            : "le parent"} {ui.currentEtudiant?.prenom} {ui.currentEtudiant?.nom}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
            Destinataire: {ui.recipientType === 'etudiant' 
              ? ui.currentEtudiant?.email 
              : (ui.currentEtudiant?.parent_id 
                  ? (data.parents[ui.currentEtudiant.parent_id]?.email || 'Email non disponible') 
                  : "Aucun parent associé")}
          </Typography>
          
          <TextField
            label="Votre message"
            multiline
            rows={6}
            fullWidth
            value={form.message}
            onChange={(e) => setForm(prev => ({...prev, message: e.target.value}))}
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setUi(prev => ({...prev, openDialog: false}))} 
            color="secondary"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSendMessage} 
            color="primary"
            variant="contained"
            disabled={
              !form.message || 
              ui.loading.sending || 
              (ui.recipientType === 'parent' && 
                (!ui.currentEtudiant?.parent_id || !data.parents[ui.currentEtudiant.parent_id]?.email))
            }
            startIcon={ui.loading.sending ? <CircularProgress size={20} /> : null}
          >
            {ui.loading.sending ? 'Envoi en cours...' : 'Envoyer'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Communication;