// src/pages/mededecins/Medecins.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/barrenav/navebar';

const Medecins = () => {
  const location = useLocation();
  console.log(location);
  const {nom, prenom, adresse, cp, id, ville } = location.state || {};
  return (
    <>
    <Navbar />

    <div>
      <h1>Medecins Page {nom} {prenom}</h1>
    </div>
    </>
  );
};


export default Medecins;