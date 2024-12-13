// src/pages/acceuil/acceuil.jsx

import React from 'react';
import Navbar from '../../components/barrenav/navebar';
import { useLocation } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const Acceuil = () => {
 const location = useLocation();
 const {nom, prenom, adresse, cp, id, ville } = location.state || {};

  return (
    <>
      <Navbar />
      <div className="flex justify-normal h-screen bg-gray-100">
      <h1>Bonjour {nom} {prenom}, {adresse} {id} {cp} {ville}</h1> 
      <Outlet />
      </div>
    </>
  );
};

export default Acceuil;

