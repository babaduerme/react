import React, { useState } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import MedecinDetails from './MedecinDetails';
import api from '../../api/api';

const Medecins = () => {
  const [nomMedecins, setNomMedecins] = useState('');
  const [listeMedecins, setListeMedecins] = useState([]);
  const [medecinSelectionne, setMedecinSelectionne] = useState(null);
  const [loading, setLoading] = useState(false);
  const [version, setVersion] = useState(0); 
  const navigate = useNavigate();
  const location = useLocation(); 

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
      const data = response.data; // les données sont dans `response.data`
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
    setVersion(version + 1);
    
    
    const currentState = location.state || {};
    

    navigate(`/acceuil/medecins/${medecin.id}`, { 
      state: currentState 
    });
  };

  const handleMedecinChange = (event) => {
    const { name, value } = event.target;
    setMedecinSelectionne((prevMedecin) => ({
      ...prevMedecin,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen w-full px-8">
      <div className="max-w-3xl mx-auto mt-32">
        <h1 className="text-lg font-medium mb-4">Chercher un médecin :</h1>
        <input
          type="text"
          value={nomMedecins}
          onChange={handleInputChange}
          className="w-full h-12 bg-white placeholder:text-slate-400 text-slate-700 
                   text-lg border border-slate-200 rounded-md px-4 transition duration-300 ease-in-out
                   focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
          placeholder="Rechercher un médecin"
        />
        {listeMedecins.length > 0 && (
          <ul className="mt-4">
            {listeMedecins.map((medecin) => (
              <li
                key={medecin.id}
                className="p-4 mb-2 bg-slate-100 rounded-md cursor-pointer"
                onClick={() => selectMedecin(medecin)}
              >
                {medecin.nom} {medecin.prenom}
              </li>
            ))}
          </ul>
        )}
        {listeMedecins.length === 0 && !loading && nomMedecins.trim() !== '' && !medecinSelectionne && (
          <p>Aucun médecin trouvé.</p>
        )}

        {/* Intégration conditionnelle du composant MedecinDetails */}
        {medecinSelectionne && (
          <MedecinDetails 
            medecin={medecinSelectionne} 
            handleMedecinChange={handleMedecinChange}
            setMedecinSelectionne={setMedecinSelectionne}
            userInfo={location.state} // Pass the user info from location state
          />
        )}

        {/* Intégration de la balise Outlet */}
        <Outlet context={[medecinSelectionne, setMedecinSelectionne]} />
      </div>
    </div>
  );
};

export default Medecins;