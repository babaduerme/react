// src/pages/rapport/Rapports.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Rapports = () => {
  const location = useLocation();
  const { nom, prenom, adresse, cp, id, ville } = location.state || {};

  return (
    <>
      
      <div className="flex justify-normal h-screen bg-slate-100">
        <p>faire un tableaux</p>
        <h1>Rapports Page</h1>
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

export default Rapports;