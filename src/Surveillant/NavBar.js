import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const navbarStyles = {
    backgroundColor: '#0073e6',
    padding: '10px',
    borderRadius: '5px',
  };

  const ulStyles = {
    display: 'flex',
    listStyle: 'none',
    justifyContent: 'space-around',
  };

  const liStyles = {
    marginRight: '20px',
  };

  const linkStyles = {
    textDecoration: 'none',
    color: 'white',
    fontWeight: 'bold',
    padding: '10px',
    borderRadius: '5px',
  };

  const linkHoverStyles = {
    backgroundColor: '#005bb5',
  };

  return (
    <nav style={navbarStyles}>
      <ul style={ulStyles}>
        <li style={liStyles}><NavLink to="/absences" style={linkStyles}>Absences</NavLink></li>
        <li style={liStyles}><NavLink to="/retards" style={linkStyles}>Retards</NavLink></li>
        <li style={liStyles}><NavLink to="/emplois" style={linkStyles}>Emplois</NavLink></li>
        <li style={liStyles}><NavLink to="/incidents" style={linkStyles}>Incidents</NavLink></li>
        <li style={liStyles}><NavLink to="/notifications" style={linkStyles}>Notifications</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
