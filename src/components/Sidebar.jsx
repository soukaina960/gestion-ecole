import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Dashboard, Class, School, Email, Assignment, People } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><Dashboard /></ListItemIcon>
          <ListItemText primary="Tableau de bord" />
        </ListItem>
        
        <ListItem button component={Link} to="/courses">
          <ListItemIcon><Class /></ListItemIcon>
          <ListItemText primary="Gestion des cours" />
        </ListItem>
        
        <ListItem button component={Link} to="/results">
          <ListItemIcon><School /></ListItemIcon>
          <ListItemText primary="Résultats étudiants" />
        </ListItem>
        
        <ListItem button component={Link} to="/communication">
          <ListItemIcon><Email /></ListItemIcon>
          <ListItemText primary="Communication" />
        </ListItem>
        
        <ListItem button component={Link} to="/assignments">
          <ListItemIcon><Assignment /></ListItemIcon>
          <ListItemText primary="Devoirs/Examens" />
        </ListItem>
        
        <ListItem button component={Link} to="/attendance">
          <ListItemIcon><People /></ListItemIcon>
          <ListItemText primary="Présences" />
        </ListItem>
      </List>
      
      <Divider />
    </div>
  );
};

export default Sidebar;