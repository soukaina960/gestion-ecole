import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Spinner, Alert, Button, Table, Form, Badge } from 'react-bootstrap';
import { Download } from 'react-bootstrap-icons';

const EtudiantCours = () => {
  const [state, setState] = useState({
    fichiers: [],
    loading: true,
    error: null,
    semestreId: 1,
    matiereId: null,
    matieres: [],
    semestres: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Récupérer l'ID de l'étudiant connecté
        const userData = JSON.parse(localStorage.getItem('utilisateur'));
        const etudiantResponse = await axios.get('http://127.0.0.1:8000/api/etudiants', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        const etudiant = etudiantResponse.data.find(e => e.utilisateur_id === userData.id);
        if (!etudiant) throw new Error("Étudiant non trouvé");

        // 2. Charger les données nécessaires
        const [fichiersResponse, matieresResponse, semestresResponse] = await Promise.all([
          axios.get('http://127.0.0.1:8000/api/fichiers-pedagogiques', {
            params: { classe_id: etudiant.classe_id },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://127.0.0.1:8000/api/matieres', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get('http://127.0.0.1:8000/api/semestres', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        setState(prev => ({
          ...prev,
          fichiers: fichiersResponse.data.data,
          matieres: matieresResponse.data.data,
          semestres: semestresResponse.data.data,
          loading: false
        }));

      } catch (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }));
      }
    };

    fetchData();
  }, []);

  const handleDownload = (cheminFichier, nomFichier) => {
    const fileUrl = `http://127.0.0.1:8000/storage/${cheminFichier}`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', nomFichier);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredFiles = state.fichiers.filter(fichier => {
    const matchesSemestre = fichier.semestre_id === state.semestreId;
    const matchesMatiere = !state.matiereId || fichier.matiere_id === state.matiereId;
    return matchesSemestre && matchesMatiere;
  });

  if (state.loading) return (
    <Container className="text-center mt-4">
      <Spinner animation="border" />
      <p>Chargement en cours...</p>
    </Container>
  );

  if (state.error) return (
    <Container className="mt-4">
      <Alert variant="danger">
        {state.error}
        <Button variant="link" onClick={() => window.location.reload()}>Réessayer</Button>
      </Alert>
    </Container>
  );

  return (
    <Container className="mt-4">
      <h2 className="mb-4">📚 Mes Cours</h2>

      <div className="row mb-4">
        <div className="col-md-4">
          <Form.Group>
            <Form.Label>Semestre :</Form.Label>
            <Form.Select
              value={state.semestreId}
              onChange={e => setState(prev => ({ ...prev, semestreId: Number(e.target.value) }))}
            >
              {state.semestres.map(s => (
                <option key={s.id} value={s.id}>{s.nom}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        <div className="col-md-8">
          <Form.Group>
            <Form.Label>Matière :</Form.Label>
            <Form.Select
              value={state.matiereId || ''}
              onChange={e => setState(prev => ({
                ...prev,
                matiereId: e.target.value ? Number(e.target.value) : null
              }))}
            >
              <option value="">Toutes les matières</option>
              {state.matieres.map(m => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Type</th>
            <th>Nom du fichier</th>
            <th>Matière</th>
            <th>Professeur</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles.length > 0 ? (
            filteredFiles.map(fichier => (
              <tr key={fichier.id}>
                <td>
                  <Badge bg={fichier.type_fichier === 'cours' ? 'primary' : 'warning'}>
                    {fichier.type_fichier}
                  </Badge>
                </td>
                <td>{fichier.nom_fichier}</td>
                <td>{fichier.matiere?.nom || '-'}</td>
                <td>{fichier.professeur?.nom || '-'}</td>
                <td>{new Date(fichier.created_at).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="success"
                    size="sm"
                    target="_blank"
                    onClick={() => handleDownload(fichier.chemin_fichier, fichier.nom_fichier)}
                  >
                    <Download /> Télécharger
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                Aucun fichier disponible
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default EtudiantCours;