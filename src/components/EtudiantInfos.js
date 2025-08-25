import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert, Card, Spinner } from 'react-bootstrap';

function ProfesseursInfos() {
  const [professeur, setProfesseur] = useState({
    id: '',
    nom: '',
    email: '',
    niveau_enseignement: '',
    diplome: '',
    date_embauche: '',
    telephone: '',
    adresse: '',
    photo_profil: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const userData = JSON.parse(localStorage.getItem("utilisateur"));
        
        if (!userData || userData?.role !== "professeur") {
          setError(userData ? "Accès réservé aux professeurs" : "Utilisateur non connecté");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/professeurs?user=${userData.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.data && response.data.length > 0) {
          const profData = response.data.find(p => p.user_id === userData.id);
          if (profData) {
            setProfesseur({
              id: profData.id,
              nom: profData.nom,
              email: profData.email,
              niveau_enseignement: profData.niveau_enseignement,
              diplome: profData.diplome,
              date_embauche: profData.date_embauche,
              telephone: profData.utilisateur?.telephone || '',
              adresse: profData.utilisateur?.adresse || '',
              photo_profil: profData.utilisateur?.photo_profil || ''
            });
            localStorage.setItem("professeur_id", profData.id);
          }
        }
      } catch (error) {
        console.error('Erreur de chargement', error);
        setError(error.response?.data?.message || 'Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    const newErrors = {};
    if (!professeur.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!professeur.email.trim()) newErrors.email = 'L\'email est requis';
    if (!professeur.niveau_enseignement.trim()) newErrors.niveau_enseignement = 'Le niveau d\'enseignement est requis';
    if (!professeur.diplome.trim()) newErrors.diplome = 'Le diplôme est requis';
    if (!professeur.date_embauche) newErrors.date_embauche = 'La date d\'embauche est requise';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const professeurId = localStorage.getItem('professeur_id');
      
      if (!professeurId) throw new Error("ID professeur non trouvé");

      await axios.put(
        `http://localhost:8000/api/professeurs/${professeurId}`,
        {
          nom: professeur.nom,
          email: professeur.email,
          niveau_enseignement: professeur.niveau_enseignement,
          diplome: professeur.diplome,
          date_embauche: professeur.date_embauche,
          telephone: professeur.telephone,
          adresse: professeur.adresse
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess('Profil mis à jour avec succès');
      setEditMode(false);
      setErrors({});
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      setError(error.response?.data?.message || 'Erreur lors de la mise à jour');
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && !editMode) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="shadow-lg p-4 mx-auto" style={{ maxWidth: '600px' }}>
        <Card.Body>
          <h3 className="text-center mb-4">Profil Professeur</h3>
          
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          {editMode ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Nom *</Form.Label>
                <Form.Control
                  type="text"
                  value={professeur.nom}
                  onChange={(e) => setProfesseur({...professeur, nom: e.target.value})}
                  isInvalid={!!errors.nom}
                />
                <Form.Control.Feedback type="invalid">{errors.nom}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={professeur.email}
                  onChange={(e) => setProfesseur({...professeur, email: e.target.value})}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  type="text"
                  value={professeur.telephone}
                  onChange={(e) => setProfesseur({...professeur, telephone: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Adresse</Form.Label>
                <Form.Control
                  as="textarea"
                  value={professeur.adresse}
                  onChange={(e) => setProfesseur({...professeur, adresse: e.target.value})}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Niveau d'enseignement *</Form.Label>
                <Form.Control
                  type="text"
                  value={professeur.niveau_enseignement}
                  onChange={(e) => setProfesseur({...professeur, niveau_enseignement: e.target.value})}
                  isInvalid={!!errors.niveau_enseignement}
                />
                <Form.Control.Feedback type="invalid">{errors.niveau_enseignement}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Diplôme *</Form.Label>
                <Form.Control
                  type="text"
                  value={professeur.diplome}
                  onChange={(e) => setProfesseur({...professeur, diplome: e.target.value})}
                  isInvalid={!!errors.diplome}
                />
                <Form.Control.Feedback type="invalid">{errors.diplome}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Date d'embauche *</Form.Label>
                <Form.Control
                  type="date"
                  value={professeur.date_embauche}
                  onChange={(e) => setProfesseur({...professeur, date_embauche: e.target.value})}
                  isInvalid={!!errors.date_embauche}
                />
                <Form.Control.Feedback type="invalid">{errors.date_embauche}</Form.Control.Feedback>
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="primary" onClick={handleUpdate} disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
                <Button variant="secondary" onClick={() => setEditMode(false)} disabled={loading}>
                  Annuler
                </Button>
              </div>
            </>
          ) : (
            <>
              {professeur.photo_profil && professeur.photo_profil !== 'default_image.png' && (
                <div className="text-center mb-3">
                  <img 
                    src={`http://localhost:8000/storage/${professeur.photo_profil}`} 
                    alt="Photo de profil" 
                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                </div>
              )}
              
              <p><strong>Nom :</strong> {professeur.nom || 'Non renseigné'}</p>
              <p><strong>Email :</strong> {professeur.email || 'Non renseigné'}</p>
              <p><strong>Téléphone :</strong> {professeur.telephone || 'Non renseigné'}</p>
              <p><strong>Adresse :</strong> {professeur.adresse || 'Non renseignée'}</p>
              <p><strong>Niveau d'enseignement :</strong> {professeur.niveau_enseignement || 'Non renseigné'}</p>
              <p><strong>Diplôme :</strong> {professeur.diplome || 'Non renseigné'}</p>
              <p><strong>Date d'embauche :</strong> {professeur.date_embauche ? new Date(professeur.date_embauche).toLocaleDateString('fr-FR') : 'Non renseignée'}</p>

              <Button variant="primary" onClick={() => setEditMode(true)} className="mt-3">
                Modifier le profil
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ProfesseursInfos;