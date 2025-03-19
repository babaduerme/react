import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import Rapports from './Rapports'; // Importez le composant Rapports

const MedecinDetails = ({ medecin, handleMedecinChange, setMedecinSelectionne, userInfo }) => {
  const [affichage, setAffichage] = useState('fiche'); // Choix de l'affichage, fiche par défaut
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

        await fetchMedecinUpdated(); // Récupérer les données mises à jour
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
    <div className="mt-6 p-4 border rounded-md bg-white shadow">
      <div className="flex min-h-full flex-col justify-center">
        <ul className="flex border-b mb-4">
          <li className="-mb-px mr-1">
            <button 
              className={`inline-block border-1 border-t border-r rounded-t py-2 px-4 font-semibold ${
                affichage === 'fiche' ? 'bg-white text-blue-900' : 'text-blue-500 hover:text-blue-800'
              }`} 
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
              className={`inline-block py-2 px-4 font-semibold ${
                affichage === 'rapports' ? 'bg-white text-blue-900' : 'text-blue-500 hover:text-blue-800'
              }`} 
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
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={medecin.nom}
              onChange={handleMedecinChange}
              className="w-full h-10 bg-white border border-gray-300 rounded-md px-3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={medecin.prenom}
              onChange={handleMedecinChange}
              className="w-full h-10 bg-white border border-gray-300 rounded-md px-3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              name="adresse"
              value={medecin.adresse}
              onChange={handleMedecinChange}
              className="w-full h-10 bg-white border border-gray-300 rounded-md px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="text"
              name="tel"
              value={medecin.tel}
              onChange={handleMedecinChange}
              className="w-full h-10 bg-white border border-gray-300 rounded-md px-3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Spécialité complémentaire</label>
            <input
              type="text"
              name="specialitecomplementaire"
              value={medecin.specialitecomplementaire || ''}
              onChange={handleMedecinChange}
              className="w-full h-10 bg-white border border-gray-300 rounded-md px-3"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Département</label>
            <input
              type="text"
              name="departement"
              value={medecin.departement}
              onChange={handleMedecinChange}
              className="w-full h-10 bg-white border border-gray-300 rounded-md px-3"
            />
          </div>

          {/* Affichage des notifications */}
          {notification.show && (
            <div className={`mb-4 p-3 rounded-md ${
              notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {notification.message}
            </div>
          )}

          {/* Bouton pour mettre à jour le médecin */}
          <div className='mb-4'>
            <button
              onClick={handleMajMedecin}
              className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg w-full hover:text-white">
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