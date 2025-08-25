import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Alert, Card, Spinner, Button, Form, Image } from 'react-bootstrap';

function EtudiantInfos() {
  const [etudiant, setEtudiant] = useState({
    id: '',
    nom: '',
    prenom: '',
    matricule: '',
    email: '',
    date_naissance: '',
    sexe: '',
    adresse: '',
    photo_profil: '',
    classe: { id: '', name: '', niveau: '' }
  });

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState({
    initial: true,
    etudiant: false,
    update: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  // Fonctions utilitaires
  const updateLoading = (key, value) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  const updateError = (message) => {
    setError(message);
  };

  const updateState = (key, value) => {
    if (key === 'etudiantId') {
      setEtudiant(prev => ({ ...prev, id: value }));
    }
  };

  const apiGet = async (endpoint) => {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(
      `http://localhost:8000/api/${endpoint}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  };

  // Récupérer l'étudiant connecté
  useEffect(() => {
    const fetchData = async () => {
      try {
        updateLoading('etudiant', true);
        
        // 1. Récupérer l'utilisateur connecté
        const userData = localStorage.getItem('utilisateur');
        if (!userData) {
          throw new Error("Utilisateur non connecté");
        }

        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id;

        // 2. Rechercher l'étudiant lié
        const etudiants = await apiGet('etudiants');
        const foundEtudiant = etudiants.find(p => p.utilisateur_id === userId);
        
        if (!foundEtudiant) {
          throw new Error("Aucun étudiant trouvé pour cet utilisateur");
        }

        updateState('etudiantId', foundEtudiant.id);
        
        // 3. Récupérer les détails complets de l'étudiant
        const studentDetails = await apiGet(`etudiants/${foundEtudiant.id}`);
        
        setEtudiant({
          id: studentDetails.id,
          nom: studentDetails.nom,
          prenom: studentDetails.prenom,
          matricule: studentDetails.matricule,
          email: studentDetails.email,
          date_naissance: studentDetails.date_naissance,
          sexe: studentDetails.sexe,
          adresse: studentDetails.adresse,
          photo_profil: studentDetails.photo_profil_url || 'default_image.png',
          classe: {
            id: studentDetails.classroom?.id || '',
            name: studentDetails.classroom?.name || 'Non spécifiée',
            niveau: studentDetails.classroom?.niveau || 'Non spécifié'
          }
        });

        updateLoading('initial', false);
      } catch (err) {
        updateError(err.message || "Erreur d'authentification");
        console.error("Erreur:", err);
      } finally {
        updateLoading('etudiant', false);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!etudiant.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!etudiant.prenom.trim()) newErrors.prenom = 'Le prénom est requis';
    if (!etudiant.matricule.trim()) newErrors.matricule = 'Le matricule est requis';
    if (!etudiant.email.trim()) newErrors.email = 'L\'email est requis';
    if (!etudiant.date_naissance) newErrors.date_naissance = 'La date de naissance est requise';
    if (!etudiant.classe.id) newErrors.classe = 'La classe est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      updateLoading('update', true);
      const token = localStorage.getItem('access_token');
      
      const payload = {
        nom: etudiant.nom,
        prenom: etudiant.prenom,
        matricule: etudiant.matricule,
        email: etudiant.email,
        date_naissance: etudiant.date_naissance,
        sexe: etudiant.sexe,
        adresse: etudiant.adresse,
        classe_id: etudiant.classe.id
      };

      await axios.put(
        `http://localhost:8000/api/etudiants/${etudiant.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Profil mis à jour avec succès');
      setEditMode(false);
      setErrors({});
    } catch (err) {
      console.error('Erreur:', err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
      updateError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      updateLoading('update', false);
    }
  };

  if (loading.initial) return <Spinner animation="border" className="d-block mx-auto my-5" />;
  if (error && !editMode) return <Alert variant="danger" className="m-3">{error}</Alert>;

  return (
    <Container className="my-4">
      <Card className="shadow-sm">
        <Card.Body>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          {editMode ? (
            <Form onSubmit={handleSubmit}>
              <div className="text-center mb-4">
                <Image 
                  src={etudiant.photo_profil} 
                  roundedCircle 
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  className="border"
                  alt="Profil"
                />
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Matricule *</Form.Label>
                <Form.Control
                  value={etudiant.matricule}
                  onChange={(e) => setEtudiant({...etudiant, matricule: e.target.value})}
                  isInvalid={!!errors.matricule}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.matricule}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nom *</Form.Label>
                <Form.Control
                  value={etudiant.nom}
                  onChange={(e) => setEtudiant({...etudiant, nom: e.target.value})}
                  isInvalid={!!errors.nom}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nom}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Prénom *</Form.Label>
                <Form.Control
                  value={etudiant.prenom}
                  onChange={(e) => setEtudiant({...etudiant, prenom: e.target.value})}
                  isInvalid={!!errors.prenom}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.prenom}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={etudiant.email}
                  onChange={(e) => setEtudiant({...etudiant, email: e.target.value})}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date de naissance *</Form.Label>
                <Form.Control
                  type="date"
                  value={etudiant.date_naissance}
                  onChange={(e) => setEtudiant({...etudiant, date_naissance: e.target.value})}
                  isInvalid={!!errors.date_naissance}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.date_naissance}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Sexe</Form.Label>
                <Form.Select
                  value={etudiant.sexe}
                  onChange={(e) => setEtudiant({...etudiant, sexe: e.target.value})}
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Adresse</Form.Label>
                <Form.Control
                  as="textarea"
                  value={etudiant.adresse}
                  onChange={(e) => setEtudiant({...etudiant, adresse: e.target.value})}
                />
              </Form.Group>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button variant="outline-secondary" onClick={() => setEditMode(false)}>
                  Annuler
                </Button>
                <Button variant="primary" type="submit" disabled={loading.update}>
                  {loading.update ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </Form>
          ) : (
            <>
              <div className="text-center mb-4">
                <Image 
                  src={etudiant.photo_profil} 
                  roundedCircle 
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  className="border"
                  alt="Profil"
                />
                <h4 className="mt-3">{etudiant.prenom} {etudiant.nom}</h4>
                <small className="text-muted">Matricule: {etudiant.matricule}</small>
              </div>

              <div className="mb-4">
                <h5>Informations personnelles</h5>
                <p><strong>Email:</strong> {etudiant.email}</p>
                <p><strong>Date de naissance:</strong> {new Date(etudiant.date_naissance).toLocaleDateString('fr-FR')}</p>
                <p><strong>Sexe:</strong> {etudiant.sexe === 'M' ? 'Masculin' : 'Féminin'}</p>
                <p><strong>Adresse:</strong> {etudiant.adresse || 'Non renseignée'}</p>
              </div>

              <div className="mb-4">
                <h5>Informations académiques</h5>
                <p><strong>Classe:</strong> {etudiant.classe.name}</p>
                <p><strong>Niveau:</strong> {etudiant.classe.niveau}</p>
              </div>

              <Button 
                variant="primary" 
                onClick={() => setEditMode(true)}
                className="w-100"
                disabled={loading.etudiant}
              >
                {loading.etudiant ? 'Chargement...' : 'Modifier le profil'}
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EtudiantInfos;