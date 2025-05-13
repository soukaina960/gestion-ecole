import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
`;

const FormContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const FormTitle = styled.h3`
  color: #3498db;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border 0.3s;

  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#3498db' : props.danger ? '#e74c3c' : '#2c3e50'};
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${props => props.primary ? '#2980b9' : props.danger ? '#c0392b' : '#34495e'};
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  background: white;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MatiereInfo = styled.div`
  flex: 1;
  color: #2c3e50;
  font-weight: 500;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 2rem;
  color: #3498db;
  font-size: 1.2rem;
`;

const MatiereManager = () => {
    const [matieres, setMatieres] = useState([]);
    const [newMatiere, setNewMatiere] = useState({ nom: '', code: '' });
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/matieres')
            .then(response => {
                setMatieres(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des matières:', error);
                setLoading(false);
            });
    }, []);

    const handleAdd = () => {
        axios.post('http://127.0.0.1:8000/api/matieres', newMatiere)
            .then(response => {
                setMatieres([...matieres, response.data.data]);
                setNewMatiere({ nom: '', code: '' });
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout de la matière:', error);
            });
    };

    const handleEdit = (id) => {
        const matiereToEdit = matieres.find(matiere => matiere.id === id);
        setEditing(matiereToEdit);
    };

    const handleUpdate = () => {
        axios.put(`http://127.0.0.1:8000/api/matieres/${editing.id}`, editing)
            .then(response => {
                setMatieres(matieres.map(matiere => 
                    matiere.id === editing.id ? response.data.data : matiere
                ));
                setEditing(null);
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour de la matière:', error);
            });
    };

    const handleDelete = (id) => {
        axios.delete(`http://127.0.0.1:8000/api/matieres/${id}`)
            .then(() => {
                setMatieres(matieres.filter(matiere => matiere.id !== id));
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de la matière:', error);
            });
    };

    if (loading) {
        return <Loading>Chargement...</Loading>;
    }

    return (
        <Container>
            <Title>Gestion des Matières</Title>

            <FormContainer>
                {editing ? (
                    <div>
                        <FormTitle>Modifier la matière</FormTitle>
                        <Input
                            type="text"
                            value={editing.nom}
                            onChange={(e) => setEditing({ ...editing, nom: e.target.value })}
                            placeholder="Nom"
                        />
                        <Input
                            type="text"
                            value={editing.code}
                            onChange={(e) => setEditing({ ...editing, code: e.target.value })}
                            placeholder="Code"
                        />
                        <Button primary onClick={handleUpdate}>Mettre à jour</Button>
                        <Button onClick={() => setEditing(null)}>Annuler</Button>
                    </div>
                ) : (
                    <div>
                        <FormTitle>Ajouter une matière</FormTitle>
                        <Input
                            type="text"
                            value={newMatiere.nom}
                            onChange={(e) => setNewMatiere({ ...newMatiere, nom: e.target.value })}
                            placeholder="Nom"
                        />
                        <Input
                            type="text"
                            value={newMatiere.code}
                            onChange={(e) => setNewMatiere({ ...newMatiere, code: e.target.value })}
                            placeholder="Code"
                        />
                        <Button primary onClick={handleAdd}>Ajouter</Button>
                    </div>
                )}
            </FormContainer>

            <List>
                {matieres.map(matiere => (
                    <ListItem key={matiere.id}>
                        <MatiereInfo>
                            {matiere.nom} - {matiere.code}
                        </MatiereInfo>
                        <ButtonGroup>
                            <Button onClick={() => handleEdit(matiere.id)}>Éditer</Button>
                            <Button danger onClick={() => handleDelete(matiere.id)}>Supprimer</Button>
                        </ButtonGroup>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default MatiereManager;