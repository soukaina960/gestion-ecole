import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  

  return (
    <nav >
      <ul >
        <li ><NavLink to="/absences" >Absences</NavLink></li>
        <li ><NavLink to="/retards" >Retards</NavLink></li>
        <li ><NavLink to="/emplois" >Emplois</NavLink></li>
        <li ><NavLink to="/incidents">Incidents</NavLink></li>
        <li ><NavLink to="/notification">Notifications</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
