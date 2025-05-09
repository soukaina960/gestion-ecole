import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  transition: border 0.3s;
  resize: vertical;

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

const Message = styled.p`
  color: ${props => props.error ? '#e74c3c' : '#27ae60'};
  background: ${props => props.error ? '#fadbd8' : '#d5f5e3'};
  padding: 0.8rem;
  border-radius: 4px;
  margin: 1rem 0;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  background: white;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FiliereHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const FiliereTitle = styled.strong`
  color: #2c3e50;
  font-size: 1.1rem;
`;

const FiliereCode = styled.span`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const FiliereDescription = styled.p`
  color: #34495e;
  margin: 0.5rem 0 1rem 0;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const EmptyState = styled.p`
  text-align: center;
  color: #7f8c8d;
  padding: 2rem;
  background: white;
  border-radius: 6px;
`;

const FiliereManager = () => {
  const [filieres, setFilieres] = useState([]);
  const [formData, setFormData] = useState({ nom: '', code: '', description: '', id: null });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState({ text: '', error: false });

  const fetchFilieres = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/filieres');
      setFilieres(res.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des filières :', error);
      setMessage({ text: 'Erreur lors du chargement des filières', error: true });
    }
  };

  useEffect(() => {
    fetchFilieres();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(`http://127.0.0.1:8000/api/filieres/${formData.id}`, formData);
        setMessage({ text: 'Filière modifiée avec succès', error: false });
      } else {
        await axios.post('http://127.0.0.1:8000/api/filieres', formData);
        setMessage({ text: 'Filière ajoutée avec succès', error: false });
      }

      setFormData({ nom: '', code: '', description: '', id: null });
      setIsEditing(false);
      fetchFilieres();
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      setMessage({ text: "Une erreur s'est produite", error: true });
    }
  };

  const handleEdit = (filiere) => {
    setFormData(filiere);
    setIsEditing(true);
    setMessage({ text: '', error: false });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette filière ?')) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/filieres/${id}`);
        setMessage({ text: 'Filière supprimée avec succès', error: false });
        fetchFilieres();
      } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        setMessage({ text: "Impossible de supprimer cette filière", error: true });
      }
    }
  };

  const handleCancel = () => {
    setFormData({ nom: '', code: '', description: '', id: null });
    setIsEditing(false);
    setMessage({ text: '', error: false });
  };

  return (
    <Container>
      <Title>{isEditing ? 'Modifier une Filière' : 'Gestion des Filières'}</Title>

      <FormContainer>
        <FormTitle>{isEditing ? 'Modifier la filière' : 'Ajouter une nouvelle filière'}</FormTitle>
        <form onSubmit={handleSubmit}>
          <Input
            name="nom"
            placeholder="Nom de la filière"
            value={formData.nom}
            onChange={handleChange}
            required
          />
          <Input
            name="code"
            placeholder="Code de la filière"
            value={formData.code}
            onChange={handleChange}
            required
          />
          <TextArea
            name="description"
            placeholder="Description de la filière"
            value={formData.description}
            onChange={handleChange}
          />
          <Button primary type="submit">
            {isEditing ? 'Modifier' : 'Ajouter'}
          </Button>
          {isEditing && (
            <Button type="button" onClick={handleCancel}>
              Annuler
            </Button>
          )}
        </form>
      </FormContainer>

      {message.text && <Message error={message.error}>{message.text}</Message>}

      <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Liste des Filières</h3>
      {filieres.length === 0 ? (
        <EmptyState>Aucune filière trouvée.</EmptyState>
      ) : (
        <List>
          {filieres.map((filiere) => (
            <ListItem key={filiere.id}>
              <FiliereHeader>
                <div>
                  <FiliereTitle>{filiere.nom}</FiliereTitle>
                  <FiliereCode> ({filiere.code})</FiliereCode>
                </div>
                <ButtonGroup>
                  <Button onClick={() => handleEdit(filiere)}>Modifier</Button>
                  <Button danger onClick={() => handleDelete(filiere.id)}>Supprimer</Button>
                </ButtonGroup>
              </FiliereHeader>
              {filiere.description && (
                <FiliereDescription>{filiere.description}</FiliereDescription>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};

export default FiliereManager;