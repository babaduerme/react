import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import MedecinDetails from './MedecinDetails';
import api from '../../api/api';

const Medecins = () => {
  const [nomMedecins, setNomMedecins] = useState('');
  const [listeMedecins, setListeMedecins] = useState([]);
  const [medecinSelectionne, setMedecinSelectionne] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const RESULTS_PER_PAGE = 10; // Modifié de 7 à 10
  
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleInputChange = (event) => {
    const value = event.target.value;
    setNomMedecins(value);
    setPage(1); // Réinitialiser la pagination lors d'une nouvelle recherche
    
    if (value.trim() === '') {
      setListeMedecins([]);
    } else {
      rechercherMedecins(value, 1);
    }
  };

  const rechercherMedecins = async (nom, pageNum) => {
    setLoading(true);
    try {
      // Ajout des paramètres de pagination à la requête API
      const response = await api.get(`/medecins?nom=${nom}&page=${pageNum}&limit=${RESULTS_PER_PAGE}`);
      
      // Si c'est la première page, remplacer les résultats
      // Sinon, ajouter aux résultats existants
      if (pageNum === 1) {
        setListeMedecins(response.data.medecins || response.data);
      } else {
        setListeMedecins(prev => [...prev, ...(response.data.medecins || response.data)]);
      }
      
      // Vérifier s'il y a plus de résultats disponibles
      // Cette logique dépend de votre API et de son format de réponse
      setHasMore(response.data.hasMore || response.data.length === RESULTS_PER_PAGE);
      
    } catch (error) {
      console.error('Erreur lors de la recherche des médecins :', error);
    } finally {
      setLoading(false);
    }
  };

  const chargerPlusDeMedecins = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    rechercherMedecins(nomMedecins, nextPage);
  };

  const selectMedecin = (medecin) => {
    setMedecinSelectionne(medecin);
    setNomMedecins(`${medecin.nom} ${medecin.prenom}`);
    setListeMedecins([]);
    
    navigate(`/acceuil/medecins/${medecin.id}`, { 
      state: location.state || {} 
    });
  };

  const handleMedecinChange = (event) => {
    const { name, value } = event.target;
    setMedecinSelectionne(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="mt-6 p-6 bg-zinc-900 border-2 border-zinc-700 rounded shadow-lg">
      <div className="flex flex-col">
        <div className="max-w-2xl mx-auto w-full">
          <h1 className="text-lg font-medium mb-4 text-gray-400">Chercher un médecin :</h1>
          <input
            type="text"
            value={nomMedecins}
            onChange={handleInputChange}
            className="w-full h-12 bg-zinc-800 text-gray-300 placeholder-gray-500 border border-zinc-700 rounded px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
            placeholder="Rechercher un médecin"
          />
          
          {/* Liste des médecins avec défilement */}
          {listeMedecins.length > 0 && (
            <div className="mt-4">
              <ul style={{ maxHeight: "550px" }} className="overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500 scrollbar-track-zinc-800">
                {listeMedecins.map((medecin) => (
                  <li
                    key={medecin.id}
                    className="p-3 mb-2 bg-zinc-800 border border-zinc-700 rounded cursor-pointer hover:bg-zinc-700 hover:border-amber-600 transition-all duration-200"
                    onClick={() => selectMedecin(medecin)}
                  >
                    <span className="text-amber-500">{medecin.nom}</span> <span className="text-gray-400">{medecin.prenom}</span>
                  </li>
                ))}
              </ul>
              
              {/* Bouton "Voir plus" pour charger plus de résultats */}
              {hasMore && (
                <button
                  onClick={chargerPlusDeMedecins}
                  className="w-full mt-2 py-2 bg-zinc-800 text-amber-500 hover:bg-zinc-700 rounded border border-zinc-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <span className="w-4 h-4 mr-2 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
                      Chargement...
                    </span>
                  ) : (
                    "Voir plus de résultats"
                  )}
                </button>
              )}
            </div>
          )}
          
          {/* Message si aucun résultat */}
          {listeMedecins.length === 0 && !loading && nomMedecins.trim() !== '' && (
            <p className="text-red-500 mt-2">Aucun médecin trouvé.</p>
          )}
          
          {/* Indicateur de chargement initial */}
          {loading && listeMedecins.length === 0 && (
            <div className="flex justify-center mt-4">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {/* Affichage des détails du médecin ou Outlet */}
        {medecinSelectionne ? (
          <div className="mt-4">
            <MedecinDetails 
              medecin={medecinSelectionne} 
              handleMedecinChange={handleMedecinChange}
              setMedecinSelectionne={setMedecinSelectionne}
              userInfo={location.state}
            />
          </div>
        ) : (
          <div className="mt-4">
            <Outlet context={[medecinSelectionne, setMedecinSelectionne]} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Medecins;