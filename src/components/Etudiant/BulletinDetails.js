import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button, Table, Badge } from 'react-bootstrap';
import axios from 'axios';

const BulletinDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bulletin, setBulletin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBulletinDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/bulletin/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data) {
          setBulletin(response.data);
        } else {
          setError('Bulletin non trouvé');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement du bulletin');
      } finally {
        setLoading(false);
      }
    };

    fetchBulletinDetails();
  }, [id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Chargement du bulletin...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error}
          <Button 
            variant="link" 
            onClick={() => navigate(-1)}
            className="p-0 ms-2"
          >
            Retour
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!bulletin) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          Aucune donnée de bulletin disponible
          <Button 
            variant="link" 
            onClick={() => navigate(-1)}
            className="p-0 ms-2"
          >
            Retour
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <Card.Title>
            Bulletin de {bulletin.etudiant?.prenom || 'Prénom non disponible'} {bulletin.etudiant?.nom || 'Nom non disponible'}
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <h5>Informations générales</h5>
            <p><strong>Classe:</strong> {bulletin.etudiant?.classe || 'Non spécifié'}</p>
            <p><strong>Semestre:</strong> {bulletin.semestre || 'Non spécifié'}</p>
            <p><strong>Année scolaire:</strong> {bulletin.annee_scolaire || 'Non spécifié'}</p>
            <p>
              <strong>Moyenne générale:</strong> 
              <Badge 
                bg={(bulletin.moyenne_generale ?? 0) >= 10 ? 'success' : 'danger'} 
                className="ms-2"
              >
                {(bulletin.moyenne_generale?.toFixed(2)) ?? 'N/A'}
              </Badge>
            </p>
          </div>

          <h5 className="mb-3">Détails des évaluations</h5>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Matière</th>
                <th>Professeur</th>
                <th>Note</th>
                <th>Coefficient</th>
                <th>Appréciation</th>
              </tr>
            </thead>
            <tbody>
              {bulletin.evaluations?.length > 0 ? (
                bulletin.evaluations.map((evaluation, index) => (
                  <tr key={index}>
                    <td>{evaluation.matiere || '-'}</td>
                    <td>{evaluation.professeur || '-'}</td>
                    <td>{evaluation.note_finale?.toFixed(2) ?? 'N/A'}</td>
                    <td>{evaluation.facteur ?? '-'}</td>
                    <td>{evaluation.appreciation || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">Aucune évaluation disponible</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="bg-light d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Retour
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate(`/bulletins/${id}/pdf`)}
          >
            Télécharger PDF
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default BulletinDetails;