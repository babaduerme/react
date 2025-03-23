// src/pages/rapport/Rapports.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet, useParams } from 'react-router-dom';
import api from '../../api/api';
import RapportsModification from './RapportsModification'; // Importez le composant

const Rapports = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const { nom, prenom, adresse, cp, id, ville } = location.state || {};

  const [affichage, setAffichage] = useState('fiche');
  const [nomMedecins, setNomMedecins] = useState('');
  const [listeMedecins, setListeMedecins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [medecinSelectionne, setMedecinSelectionne] = useState(null);
  const [dateRapport, setDateRapport] = useState('');
  const [listeRapports, setListeRapports] = useState([]);
  const [message, setMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);
  const [selectedRapport, setSelectedRapport] = useState(null);

  // Expression régulière pour valider le format AAAA-MM-JJ
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  // Fonction pour formater la date si nécessaire
  const formatDate = (dateString) => {
    if (dateRegex.test(dateString)) {
      return dateString;
    }
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      return dateString;
    }
  };

  // Fonction pour afficher un message temporaire
  const showMessage = (text, duration = 8000) => {
    setMessage(text);
    setTimeout(() => setMessage(''), duration);
  };

  // Fonction auxiliaire pour normaliser les réponses de l'API
  const normalizeApiResponse = (responseData) => {
    if (responseData === '' || responseData === null || responseData === undefined) {
      return [];
    }
    if (Array.isArray(responseData)) {
      return responseData;
    }
    console.warn("Format de réponse inattendu:", responseData);
    return [];
  };

  const handleDateChange = async (event) => {
    const selectedDate = event.target.value;
    setDateRapport(selectedDate);
    setSelectedRapport(null); // Réinitialiser le rapport sélectionné

    if (!dateRegex.test(selectedDate)) {
      showMessage('Format de date invalide. Utilisez AAAA-MM-JJ.');
      setListeRapports([]);
      return;
    }

    if (!id) {
      showMessage("Erreur: ID du visiteur manquant.");
      setListeRapports([]);
      return;
    }

    try {
      const formattedDate = formatDate(selectedDate);
      console.log('Recherche de rapports pour la date:', formattedDate, 'et idVisiteur:', id);

      const response = await api.get('/rapports_a_date', {
        params: {
          idVisiteur: id,
          date: formattedDate
        }
      });

      console.log('Réponse de l\'API:', response);
      setDebugInfo({
        requestParams: { idVisiteur: id, date: formattedDate },
        responseStatus: response.status,
        responseData: response.data
      });

      const normalizedData = normalizeApiResponse(response.data);

      const rapportsTraites = normalizedData.map(rapport => {
        return {
          idRapport: rapport.idRapport || rapport[0],
          nomMedecin: rapport[1] || rapport.NomMedecin || "Non spécifié",
          prenomMedecin: rapport[2] || rapport.prenomMedecin || "",
          motif: rapport.motif || rapport[3] || "Non spécifié",
          bilan: rapport.bilan || rapport[4] || "Non spécifié"
        };
      });

      setListeRapports(rapportsTraites);

      if (rapportsTraites.length === 0) {
        showMessage("Aucun rapport trouvé pour cette date.");
        console.log("Aucun rapport trouvé pour cette date.");
      } else {
        setMessage('');
        console.log(`${rapportsTraites.length} rapports trouvés.`);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche des rapports :', error);
      setListeRapports([]);
      showMessage(`Erreur: ${error.message || "Erreur lors de la récupération des rapports."}`);
      setDebugInfo({
        requestParams: { idVisiteur: id, date: formatDate(selectedDate) },
        error: error.message,
        stack: error.stack
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (event) => {
    setNomMedecins(event.target.value);
    if (event.target.value.trim() === '') {
      setListeMedecins([]);
    } else {
      rechercherMedecins(event.target.value);
    }
  };

  const rechercherMedecins = async (nom) => {
    setLoading(true);
    try {
      const response = await api.get(`/medecins?nom=${nom}`);
      setListeMedecins(response.data);
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

  // Nouvelle fonction pour sélectionner un rapport
  const handleSelectRapport = (rapport) => {
    setSelectedRapport(rapport);
    navigate(`/acceuil/rapports/${rapport.idRapport}`, {
      state: { ...location.state, idRapport: rapport.idRapport }
    });
  };

  // Fonction pour réinitialiser la sélection de rapport
  const handleResetSelectedRapport = () => {
    setSelectedRapport(null);
    navigate('/acceuil/rapports', { state: location.state });
  };

  // Lorsque le rapport a été modifié avec succès
  const handleRapportUpdated = () => {
    // Recharger la liste des rapports avec la date actuelle
    if (dateRapport) {
      handleDateChange({ target: { value: dateRapport } });
    }
    handleResetSelectedRapport();
  };

  return (
    //<div className="mt-6 p-6 bg-white border rounded-md shadow-sm">
    <div className="mt-6 p-6 bg-zinc-900 border-2 border-zinc-700 rounded shadow-lg">
      <div className="flex flex-col">
      <ul className="flex border-b border-zinc-700 mb-6">
  <li className="-mb-px mr-2">
    <button
      className={`px-4 py-2 border-2 font-mono uppercase tracking-wide ${
        affichage === 'fiche' 
          ? 'bg-zinc-800 text-amber-500 border-amber-600 border-b-0' 
          : 'bg-zinc-900 text-gray-400 border-zinc-700 hover:bg-zinc-800 hover:text-amber-500'
      } rounded-t-md`}
      onClick={() => {
        setAffichage('fiche')
        setDateRapport('');
        setListeRapports([]);
        setSelectedRapport(null);
        navigate('/acceuil/rapports', { state: location.state })
      }}
    >
      Ajouter un rapport
    </button>
  </li>
  <li>
    <button
      className={`px-4 py-2 border-2 font-mono uppercase tracking-wide ${
        affichage === 'rapports' 
          ? 'bg-zinc-800 text-amber-500 border-amber-600 border-b-0' 
          : 'bg-zinc-900 text-gray-400 border-zinc-700 hover:bg-zinc-800 hover:text-amber-500'
      } rounded-t-md`}
      onClick={() => {
        setAffichage('rapports');
        setNomMedecins('');
        setListeMedecins([]);
        setSelectedRapport(null);
        navigate('/acceuil/rapports', { state: location.state });
      }}
    >
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
  className="w-full h-12 bg-zinc-800 text-gray-300 placeholder-gray-500 border border-zinc-700 rounded px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
  placeholder="Rechercher un médecin"
/>
              {loading && <p className="text-sm text-gray-500 mt-3">Chargement...</p>}
              {listeMedecins.length > 0 && (
                <ul className="mt-4">
                  {listeMedecins.map((medecin) => (
                    <li
                    key={medecin.id}
                    className="p-4 mb-2 bg-zinc-800 border border-zinc-700 rounded cursor-pointer hover:bg-zinc-700 hover:border-amber-600 transition-all duration-200"
                    onClick={() => selectMedecin(medecin)}
                  >
                      <span className="text-amber-500">{medecin.nom}</span> <span className="text-gray-400">{medecin.prenom}</span>
                    
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
            <div className="flex space-x-2">
              <div className="flex-grow relative">
              <input
  type="date"
  value={dateRapport}
  onChange={handleDateChange}
  className="w-full h-12 bg-zinc-800 text-gray-300 border border-zinc-700 rounded px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
  placeholder="AAAA-MM-JJ"
/>
                {isSearching && (
                  <div className="absolute right-3 top-3">
                    <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {message && (
              <div className={`mt-4 p-4 ${message.includes('Erreur') ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'} rounded-md`}>{message}</div>
            )}

            {listeRapports && listeRapports.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-lg  text-gray-700 font-semibold mb-4">Rapports trouvés ({listeRapports.length}):</h3>
                <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-700 border border-zinc-700">
  <thead className="bg-zinc-800">
    <tr>
      <th scope="col" className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-amber-500">ID Rapport</th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-amber-500">Médecin</th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-amber-500">Motif</th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-amber-500">Bilan</th>
      <th scope="col" className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-amber-500">Actions</th>
    </tr>
                    </thead>
                    <tbody className="bg-zinc-900 divide-y divide-zinc-800">
    {listeRapports.map((rapport, index) => (
      <tr key={index} className={`hover:bg-zinc-800 ${selectedRapport?.idRapport === rapport.idRapport ? 'bg-zinc-800 border-l-4 border-amber-600' : ''}`}>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-300">{rapport.idRapport}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{`${rapport.nomMedecin || "Non spécifié"} ${rapport.prenomMedecin || ""}`}</td>
        <td className="px-6 py-4 text-sm text-gray-400">{rapport.motif || "Non spécifié"}</td>
        <td className="px-6 py-4 text-sm text-gray-400">{rapport.bilan || "Non spécifié"}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <button 
            className="text-amber-500 hover:text-amber-400 mr-3 border border-zinc-700 px-2 py-1 rounded hover:bg-zinc-800" 
            onClick={() => handleSelectRapport(rapport)}
          >
            Modifier
          </button>
          <button className="text-red-500 hover:text-red-400 border border-zinc-700 px-2 py-1 rounded hover:bg-zinc-800">Supprimer</button>
        </td>
      </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {/* Afficher le formulaire de modification si un rapport est sélectionné */}
            {selectedRapport && (
              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg  text-gray-700 font-semibold">Modification du rapport #{selectedRapport.idRapport}</h3>
                  <button
                    onClick={handleResetSelectedRapport}
                    className="px-3 py-1 bg-gray-200 text-w-700 rounded hover:bg-gray-300"
                  >
                    ✕ Fermer
                  </button>
                </div>
                <RapportsModification 
                  rapportId={selectedRapport.idRapport} 
                  idVisiteur={id}
                  isInline={true}
                  onRapportUpdated={handleRapportUpdated}
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-6">
          {/* CHANGEMENT ICI: Outlet ne s'affiche que lorsqu'on est en mode "fiche" */}
          {affichage === 'fiche' && <Outlet context={{ setMedecinSelectionne }} />}
        </div>
      </div>
    </div>
  );
};

export default Rapports;