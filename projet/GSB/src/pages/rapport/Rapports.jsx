// src/pages/rapport/Rapports.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import api from '../../api/api';

const Rapports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nom, prenom, adresse, cp, id, ville } = location.state || {};

  // State to manage the current view
  const [affichage, setAffichage] = useState('fiche'); // Default to 'fiche'
  const [nomMedecins, setNomMedecins] = useState('');
  const [listeMedecins, setListeMedecins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medecinSelectionne, setMedecinSelectionne] = useState(null);

  const handleInputChange = (event) => {
    setNomMedecins(event.target.value);
    if (event.target.value.trim() === '') {
      setListeMedecins([]);
    } else {
      rechercherMedecins(event.target.value);
    }
  };
  const handleMedecinChange = (event) => {
    const { name, value } = event.target;
    setMedecinSelectionne((prevMedecin) => ({
      ...prevMedecin,
      [name]: value,
    }));
  };

  const rechercherMedecins = async (nom) => {
    setLoading(true);
    try {
      const response = await api.get(`/medecins?nom=${nom}`);
      const data = response.data;
      setListeMedecins(data);
    } catch (error) {
      console.error('Erreur lors de la recherche des médecins :', error);
    } finally {
      setLoading(false);
    }
  };

  const selectMedecin = (medecin) => {
    setMedecinSelectionne(medecin);
    setNomMedecins(`${medecin.nom} ${medecin.prenom}`);
    setListeMedecins([]);

    navigate(`/acceuil/rapports/${medecin.id}`, {
      state: { ...location.state, medecinSelectionne: medecin },
    });
  };

  return (
    <div className="mt-6 p-6 bg-white border rounded-md shadow-sm">
  <div className="flex flex-col">
    <ul className="flex border-b mb-6">
      <li className="-mb-px mr-2">

        <button
          className={`px-4 py-2 border font-semibold rounded-t-md ${
            affichage === 'fiche' 
              ? 'bg-white text-blue-900 border-b-0'
              : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
          }`}
          onClick={() => setAffichage('fiche')}>
          Ajouter un rapport
        </button>
      </li>

      <li>
      <button
        className={`px-4 py-2 border font-semibold rounded-t-md ${affichage === 'rapports' ? 'bg-white text-blue-900 border-b-0' : 'bg-gray-100 text-blue-600 hover:bg-gray-200'}`}
        onClick={() => {
       setAffichage('rapports');
       setNomMedecins('');
       setListeMedecins([]);
       navigate('/acceuil/rapports',  { state: location.state });  // Redirection vers la liste des rapports
       }}>
        Modifier un rapport
      </button>
      </li>

    </ul>

    {affichage === 'fiche' && (
      <div className="w-full px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-lg font-medium mb-4 text-gray-700">Recherchez un médecin :</h1>
          <input
            type="text"
            value={nomMedecins}
            onChange={handleInputChange}
            className="w-full h-12 bg-white placeholder-gray-400 text-gray-700 border border-gray-300 rounded-md px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Rechercher un médecin"
          />
          {loading && <p className="text-sm text-gray-500 mt-3">Chargement...</p>}
          {listeMedecins.length > 0 && (
            <ul className="mt-4">
              {listeMedecins.map((medecin) => (
                <li
                  key={medecin.id}
                  className="p-4 mb-2 bg-gray-100 rounded-md cursor-pointer hover:bg-blue-50"
                  onClick={() => selectMedecin(medecin)}
                >
                  {medecin.nom} {medecin.prenom}
                </li>
              ))}
            </ul>
          )}
          {listeMedecins.length === 0 && !loading && nomMedecins.trim() !== '' && !medecinSelectionne && (
            <p className="text-red-500 mt-2">Aucun médecin trouvé.</p>
          )}
        </div>
      </div>
    )}

    {affichage === 'rapports' && (
      <div className="px-4">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Fiche Rapports</h2>
        <p className="text-gray-600">Rapports pour le médecin sélectionné</p>
      </div>
    )}

    <div className="mt-6">
      <Outlet context={{ setMedecinSelectionne }} />
    </div>
  </div>
</div>

  );
};

export default Rapports;
