import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button,
  Badge,
  Form
} from 'react-bootstrap';

const EtudiantBulletin = () => {
  // États principaux
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading] = useState({
    bulletins: true,
    annees: false,
    semestres: false,
    download: false,
    etudiant: true
  });
  const [error, setError] = useState({
    bulletins: '',
    annees: '',
    semestres: '',
    download: '',
    etudiant: ''
  });
  const [state, setState] = useState({
    etudiantId: null,
    annees: [],
    semestres: [],
    selectedAnnee: '',
    selectedSemestre: ''
  });

  const navigate = useNavigate();

  // Fonctions de mise à jour de l'état
  const updateState = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const updateLoading = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  const updateError = (key, value) => {
    setError(prev => ({ ...prev, [key]: value }));
  };

  // Récupérer l'étudiant connecté
  useEffect(() => {
    const fetchData = async () => {
      try {
        updateLoading('etudiant', true);
        updateError('etudiant', '');
        
        const userData = localStorage.getItem('utilisateur');
        if (!userData) {
          throw new Error("Utilisateur non connecté");
        }

        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id;

        const etudiantResponse = await axios.get(
          `http://127.0.0.1:8000/api/etudiants`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        const etudiant = etudiantResponse.data.find(p => p.utilisateur_id === userId);
        if (!etudiant) {
          throw new Error("Aucun étudiant trouvé pour cet utilisateur");
        }

        updateState('etudiantId', etudiant.id);
      } catch (err) {
        updateError('etudiant', err.message || "Une erreur est survenue");
        console.error("Erreur:", err);
      } finally {
        updateLoading('etudiant', false);
      }
    };

    fetchData();
  }, []);

  // Récupérer les années scolaires
  useEffect(() => {
    if (!state.etudiantId) return;

    const fetchAnnees = async () => {
      updateLoading('annees', true);
      updateError('annees', '');
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/annees_scolaires', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (res.data?.length > 0) {
          updateState('annees', res.data);
          updateState('selectedAnnee', res.data[0].id);
        } else {
          updateError('annees', "Aucune année scolaire disponible");
        }
      } catch (err) {
        console.error("Erreur années scolaires:", err);
        updateError('annees', "Erreur lors du chargement des années scolaires");
      } finally {
        updateLoading('annees', false);
      }
    };

    fetchAnnees();
  }, [state.etudiantId]);

  // Récupérer les semestres
  useEffect(() => {
    if (!state.etudiantId) return;

    const fetchSemestres = async () => {
      updateLoading('semestres', true);
      updateError('semestres', '');
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/semestres', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const semestresData = res.data?.data || res.data || [];
        
        if (semestresData.length > 0) {
          updateState('semestres', semestresData);
          updateState('selectedSemestre', semestresData[0].id);
        } else {
          updateError('semestres', "Aucun semestre disponible");
        }
      } catch (err) {
        console.error("Erreur semestres:", err);
        updateError('semestres', "Erreur lors du chargement des semestres");
      } finally {
        updateLoading('semestres', false);
      }
    };

    fetchSemestres();
  }, [state.etudiantId]);

  // Récupérer les bulletins
  useEffect(() => {
    if (!state.etudiantId || !state.selectedAnnee || !state.selectedSemestre) return;

    const fetchBulletins = async () => {
      updateLoading('bulletins', true);
      updateError('bulletins', '');
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/etudiants/${state.etudiantId}/bulletins`,
          {
            params: {
              annee_id: state.selectedAnnee,
              semestre_id: state.selectedSemestre
            },
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        let bulletinsData = [];
        
        if (Array.isArray(res.data)) {
          bulletinsData = res.data;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          bulletinsData = res.data.data;
        } else if (res.data?.id) {
          bulletinsData = [res.data];
        }

        const normalizedBulletins = bulletinsData.map(b => ({
          ...b,
          moyenne_generale: parseFloat(b.moyenne_generale) || 0
        }));

        setBulletins(normalizedBulletins);
        
        if (normalizedBulletins.length === 0) {
          updateError('bulletins', "Aucun bulletin disponible pour cette période");
        } else {
          updateError('bulletins', '');
        }
      } catch (err) {
        if (err.response?.status === 404) {
          updateError('bulletins', "Aucun bulletin disponible pour cette période");
          setBulletins([]);
        } else {
          updateError('bulletins', err.response?.data?.message || err.message);
        }
        console.error("Erreur bulletins:", err);
      } finally {
        updateLoading('bulletins', false);
      }
    };

    fetchBulletins();
  }, [state.etudiantId, state.selectedAnnee, state.selectedSemestre]);

  const handleDownloadBulletin = async (bulletinId) => {
    if (!state.selectedAnnee || !state.selectedSemestre) {
      updateError('download', 'Veuillez choisir une année et un semestre');
      return;
    }

    updateLoading('download', true);
    updateError('download', '');

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/bulletin/parent/${state.etudiantId}/${state.selectedSemestre}/${state.selectedAnnee}`,
        {
          responseType: 'blob',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bulletin_${state.etudiantId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      if (err.response?.status === 404) {
        updateError('download', 'Aucun bulletin disponible pour téléchargement');
      } else {
        updateError('download', 'Erreur lors du téléchargement du bulletin');
      }
      console.error("Download error:", err);
    } finally {
      updateLoading('download', false);
    }
  };

  const formatMoyenne = (moyenne) => {
    const num = typeof moyenne === 'number' 
      ? moyenne 
      : parseFloat(moyenne);
    return isNaN(num) ? 'N/A' : num.toFixed(2);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateState(name, value);
  };

  if (loading.etudiant) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Chargement des informations étudiant...</p>
      </Container>
    );
  }

  if (error.etudiant) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error.etudiant}
          <Button 
            variant="link" 
            onClick={() => window.location.reload()}
            className="p-0 ms-2"
          >
            Réessayer
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Mes bulletins scolaires</h2>
      
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group controlId="formAnnee">
                  <Form.Label className='text-dark'>Année scolaire</Form.Label>
                  {loading.annees ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <Form.Select
                      name="selectedAnnee"
                      value={state.selectedAnnee}
                      onChange={handleFilterChange}
                      disabled={!state.annees.length}
                    >
                      {state.annees.map(annee => (
                        <option key={annee.id} value={annee.id}>
                          {annee.annee}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                  {error.annees && <Form.Text className="text-danger">{error.annees}</Form.Text>}
                </Form.Group>
              </Col>
              
              <Col md={4}>
                <Form.Group controlId="formSemestre">
                  <Form.Label className='text-dark'>Semestre</Form.Label>
                  {loading.semestres ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    <Form.Select
                      name="selectedSemestre"
                      value={state.selectedSemestre}
                      onChange={handleFilterChange}
                      disabled={!state.semestres.length}
                    >
                      {state.semestres.map(semestre => (
                        <option key={semestre.id} value={semestre.id}>
                          {semestre.nom}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                  {error.semestres && <Form.Text className="text-danger">{error.semestres}</Form.Text>}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {error.download && (
        <Alert variant="danger" className="mb-3" dismissible onClose={() => updateError('download', '')}>
          {error.download}
        </Alert>
      )}

      {loading.bulletins ? (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Chargement des bulletins...</p>
        </div>
      ) : error.bulletins || bulletins.length === 0 ? (
        <Alert variant="info" className="text-center">
          {error.bulletins || "Aucun bulletin disponible pour les critères sélectionnés"}
          <div className="mt-2">
            
          </div>
        </Alert>
      ) : (
        <Row>
          {bulletins.map(bulletin => (
            <Col key={bulletin.id} md={6} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <Card.Title className="mb-0">
                    Bulletin - {bulletin.semestre?.nom || 'Semestre inconnu'} (
                    {bulletin.annee_scolaire?.annee || 'Année inconnue'})
                  </Card.Title>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="fw-bold">Moyenne Générale:</span>
                    <Badge 
                      bg={bulletin.moyenne_generale >= 10 ? 'success' : 'danger'} 
                      className="fs-6"
                    >
                      {formatMoyenne(bulletin.moyenne_generale)}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">Statut:</span>
                    <Badge bg={bulletin.est_traite ? 'success' : 'warning'}>
                      {bulletin.est_traite ? 'Traité' : 'En attente'}
                    </Badge>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-light d-flex justify-content-between">
                 
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleDownloadBulletin(bulletin.id)}
                    disabled={loading.download}
                  >
                    {loading.download ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      'Télécharger'
                    )}
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default EtudiantBulletin;