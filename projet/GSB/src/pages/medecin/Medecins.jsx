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

    <div className="flex justify-normal h-screen bg-slate-100">
    <h1>Médecins Page</h1>
        <p>Nom: {nom}</p>
        <p>Prénom: {prenom}</p>
        <p>Adresse: {adresse}</p>
        <p>Code Postal: {cp}</p>
        <p>Ville: {ville}</p>
        <p>ID: {id}</p>
    </div>
    </>
  );
};


export default Medecins;