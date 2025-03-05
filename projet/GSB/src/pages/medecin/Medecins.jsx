import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Medecins = () => {
  const navigate = useNavigate(); // Pour naviguer vers une autre route
  const [nomMedecins, setNomMedecins] = useState(''); // État pour stocker la saisie du nom du médecin
  const [listeMedecins, setListeMedecins] = useState([]); // État pour stocker la liste des médecins trouvés
  const [loading, setLoading] = useState(false); // État pour indiquer si une requête est en cours

  // Gestion de la saisie de l'utilisateur
  const handleInputChange = (event) => {
    setNomMedecins(event.target.value);
    if (event.target.value.trim() === '') {
      setListeMedecins([]); // Effacer la liste si le champ est vide
    } else {
      rechercherMedecins(event.target.value); // Lancer la recherche si un nom est saisi
    }
  };

  // Fonction pour appeler l'API et récupérer les données des médecins
  const rechercherMedecins = async (nom) => {
    setLoading(true); // Définir loading sur true pendant que la requête est en cours
    try {
      const response = await fetch(`http://172.16.61.61/restGSB/medecins?nom=${nom}`);
      const data = await response.json();
      setListeMedecins(data); // Mettre à jour la liste des médecins
    } catch (error) {
      console.error('Erreur lors de la recherche des médecins :', error);
    } finally {
      setLoading(false); // Arrêter le chargement après la requête
    }
  };

  // Fonction pour gérer la sélection d'un médecin dans la liste
  const selectMedecin = (medecin) => {
    navigate('/medecin-details', { state: medecin }); // Naviguer vers la page de détails avec les données du médecin sélectionné
  };

  return (
    <div className="min-h-screen w-full px-8">
      <div className="max-w-3xl mx-auto mt-32">
        <h1 className="text-lg font-medium mb-4">Chercher un médecin :</h1>
        <input
          type="text"
          value={nomMedecins}
          onChange={handleInputChange}
          className="w-full h-12 bg-white 
                   placeholder:text-slate-400 text-slate-700 
                   text-lg border border-slate-200 rounded-md px-4
                   transition duration-300 ease-in-out
                   focus:outline-none focus:border-slate-400 
                   hover:border-slate-300 
                   shadow-sm focus:shadow"
          placeholder="Rechercher un médecin"
        />
        {listeMedecins.length > 0 && (
          <ul className="mt-4">
            {listeMedecins.map((medecin) => (
              <li
                key={medecin.id}
                className="p-4 mb-2 bg-slate-100 rounded-md cursor-pointer"
                onClick={() => selectMedecin(medecin)} // Appeler selectMedecin lorsque le médecin est cliqué
              >
                {medecin.nom} {medecin.prenom}
              </li>
            ))}
          </ul>
        )}
        {listeMedecins.length === 0 && !loading && nomMedecins.trim() !== '' && (
          <p>Aucun médecin trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default Medecins;