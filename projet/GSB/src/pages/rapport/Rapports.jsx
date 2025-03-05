// src/pages/rapport/Rapports.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Rapports = () => {
  const location = useLocation();
  const { nom, prenom, adresse, cp, id, ville } = location.state || {};

  return (  
    <div className="flex justify-center items-center h-screen bg-slate-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Rapports</h1>
        <table className="min-w-full bg-white border border-gray-200 rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left py-2 px-4 border-b">Champ</th>
              <th className="text-left py-2 px-4 border-b">Valeur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b">Nom</td>
              <td className="py-2 px-4 border-b">{nom || 'Non spécifié'}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Prénom</td>
              <td className="py-2 px-4 border-b">{prenom || 'Non spécifié'}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Adresse</td>
              <td className="py-2 px-4 border-b">{adresse || 'Non spécifiée'}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Code Postal</td>
              <td className="py-2 px-4 border-b">{cp || 'Non spécifié'}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">Ville</td>
              <td className="py-2 px-4 border-b">{ville || 'Non spécifiée'}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b">ID</td>
              <td className="py-2 px-4 border-b">{id || 'Non spécifié'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rapports;