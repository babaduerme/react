import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Rapports from './Rapports';

const MedecinDetails = ({ medecin, handleMedecinChange, setMedecinSelectionne, userInfo }) => {
  const [affichage, setAffichage] = useState('fiche');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  if (!medecin) return null;

  const handleMajMedecin = async () => {
    try {
        const medecinData = { ...medecin, specialite: medecin.specialitecomplementaire };
        delete medecinData.specialitecomplementaire;

        const response = await api.put('/majMedecin', medecinData);

        setNotification({
            show: true,
            type: 'success',
            message: 'Médecin mis à jour avec succès!'
        });

        await fetchMedecinUpdated();
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        setNotification({
            show: true,
            type: 'error',
            message: 'Erreur lors de la mise à jour du médecin'
        });
    } finally {
        setTimeout(() => {
            setNotification({ show: false, type: '', message: '' });
        }, 8000);
    }
  };

  const fetchMedecinUpdated = async () => {
    try {
        const response = await api.get(`/medecins/${medecin.id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError("La réponse reçue n'est pas au format JSON attendu.");
        }

        const updatedMedecin = await response.json();
        setMedecinSelectionne(updatedMedecin);
    } catch (error) {
        //console.warn("Erreur lors de la récupération des données mises à jour. Veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="mt-6 p-6 bg-zinc-900 border-2 border-zinc-700 rounded shadow-lg">
      <div className="flex min-h-full flex-col justify-center">
        <ul className="flex border-b border-zinc-700 mb-6">
          <li className="-mb-px mr-2">
            <button 
              className={`px-4 py-2 border-2 font-mono uppercase tracking-wide ${
                affichage === 'fiche' 
                  ? 'bg-zinc-800 text-amber-500 border-amber-600 border-b-0' 
                  : 'bg-zinc-900 text-gray-400 border-zinc-700 hover:bg-zinc-800 hover:text-amber-500'
              } rounded-t-md`}
              onClick={(e) => {
                e.preventDefault();
                setAffichage('fiche');
              }}
            >
              Fiche Médecin
            </button>
          </li>
          <li className="mr-1">
            <button 
              className={`px-4 py-2 border-2 font-mono uppercase tracking-wide ${
                affichage === 'rapports' 
                  ? 'bg-zinc-800 text-amber-500 border-amber-600 border-b-0' 
                  : 'bg-zinc-900 text-gray-400 border-zinc-700 hover:bg-zinc-800 hover:text-amber-500'
              } rounded-t-md`}
              onClick={(e) => {
                e.preventDefault();
                setAffichage('rapports');
              }}
            >
              Fiche Rapports
            </button>
          </li>
        </ul>
      </div>

      {affichage === 'fiche' && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-mono uppercase tracking-wide text-amber-500 mb-2">Nom</label>
            <input
              type="text"
              name="nom"
              value={medecin.nom}
              onChange={handleMedecinChange}
              className="w-full h-12 bg-zinc-800 text-gray-300 border border-zinc-700 rounded px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-mono uppercase tracking-wide text-amber-500 mb-2">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={medecin.prenom}
              onChange={handleMedecinChange}
              className="w-full h-12 bg-zinc-800 text-gray-300 border border-zinc-700 rounded px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-mono uppercase tracking-wide text-amber-500 mb-2">Adresse</label>
            <input
              type="text"
              name="adresse"
              value={medecin.adresse}
              onChange={handleMedecinChange}
              className="w-full h-12 bg-zinc-800 text-gray-300 border border-zinc-700 rounded px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-mono uppercase tracking-wide text-amber-500 mb-2">Téléphone</label>
            <input
              type="text"
              name="tel"
              value={medecin.tel}
              onChange={handleMedecinChange}
              className="w-full h-12 bg-zinc-800 text-gray-300 border border-zinc-700 rounded px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-mono uppercase tracking-wide text-amber-500 mb-2">Spécialité complémentaire</label>
            <input
              type="text"
              name="specialitecomplementaire"
              value={medecin.specialitecomplementaire || ''}
              onChange={handleMedecinChange}
              className="w-full h-12 bg-zinc-800 text-gray-300 border border-zinc-700 rounded px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-mono uppercase tracking-wide text-amber-500 mb-2">Département</label>
            <input
              type="text"
              name="departement"
              value={medecin.departement}
              onChange={handleMedecinChange}
              className="w-full h-12 bg-zinc-800 text-gray-300 border border-zinc-700 rounded px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
            />
          </div>

          {/* Affichage des notifications */}
          {notification.show && (
            <div className={`mb-4 p-4 rounded-md ${
              notification.type === 'success' ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-red-900 text-red-300 border border-red-700'
            }`}>
              {notification.message}
            </div>
          )}

          {/* Bouton pour mettre à jour le médecin */}
          <div className='mb-4'>
            <button
              onClick={handleMajMedecin}
              className="bg-amber-600 hover:bg-amber-700 text-white font-mono uppercase tracking-wide py-3 px-4 rounded w-full transition-colors duration-200">
              Mettre à jour
            </button>
          </div>
        </>
      )}
      
      {affichage === 'rapports' && (
        <Rapports medecinId={medecin.id} />
      )}
    </div>
  );
};

export default MedecinDetails;