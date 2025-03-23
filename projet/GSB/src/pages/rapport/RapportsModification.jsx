import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../../api/api';

const RapportsModification = ({ rapportId, idVisiteur, isInline = false, onRapportUpdated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  
  // Utiliser les props si elles sont fournies, sinon utiliser l'état de location
  const idRapport = rapportId || location.state?.idRapport;
  const visiteurId = idVisiteur || location.state?.id;
  
  const [rapportData, setRapportData] = useState({
    motif: '',
    bilan: '',
    date: '',
    idMedecin: '',
    nomMedecin: '',
    prenomMedecin: ''
  });
  
  const [notification, setNotification] = useState({ 
    show: false, 
    type: '', 
    message: '' 
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Fonction pour charger les données du rapport
  useEffect(() => {
    const fetchRapportDetails = async () => {
      if (!idRapport) {
        setNotification({ 
          show: true, 
          type: 'error', 
          message: 'Aucun rapport sélectionné.' 
        });
        setIsLoading(false);
        return;
      }

      try {
        // Appel API pour récupérer les détails du rapport
        const response = await api.get(`/rapport/${idRapport}`);
        const rapportDetails = response.data;
        console.log('Données brutes du rapport:', rapportDetails);

        // Vérifier si les données sont valides
        if (!rapportDetails) {
          throw new Error('Données de rapport invalides');
        }
        
        // Normaliser les données selon leur structure
        const normalizedData = {
          motif: rapportDetails.motif || rapportDetails[3] || '',
          bilan: rapportDetails.bilan || rapportDetails[4] || '',
          date: rapportDetails.date || '',
          idMedecin: rapportDetails.idMedecin || ''
        };

        // Puis faire une requête pour obtenir les informations du médecin
        if (normalizedData.idMedecin) {
          try {
            const medecinResponse = await api.get(`/medecin/${normalizedData.idMedecin}`);
            normalizedData.nomMedecin = medecinResponse.data.nom || '';
            normalizedData.prenomMedecin = medecinResponse.data.prenom || '';
          } catch (error) {
            console.error('Erreur lors de la récupération des infos médecin', error);
            normalizedData.nomMedecin = 'Non disponible';
            normalizedData.prenomMedecin = '';
          }
        }
        
        setRapportData(normalizedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération du rapport :', error);
        setNotification({ 
          show: true, 
          type: 'error', 
          message: `Erreur lors de la récupération du rapport: ${error.message}` 
        });
        setIsLoading(false);
      }
    };

    if (idRapport) {
      fetchRapportDetails();
    }
  }, [idRapport]);

  // Gérer les changements dans le formulaire
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRapportData(prevData => ({ ...prevData, [name]: value }));
  };

  // Fonction pour modifier le rapport dans la base de données
  const modifierRapportBase = async (params) => {
    try {
      const response = await api.put('/majRapports', params);
      return response;
    } catch (error) {
      console.error('Erreur lors de la modification du rapport :', error);
      throw error;
    }
  };

  // Fonction principale pour soumettre les modifications
  const ModifierRapport = async () => {
    if (!rapportData.motif || !rapportData.bilan) {
      setNotification({ 
        show: true, 
        type: 'error', 
        message: 'Veuillez remplir tous les champs obligatoires.' 
      });
      return;
    }

    try {
      // Préparer les données à envoyer
      const paramsToSend = {
        idRapport: idRapport,
        motif: rapportData.motif,
        bilan: rapportData.bilan
      };

      // Appeler la fonction pour modifier dans la base de données
      const response = await modifierRapportBase(paramsToSend);
      
      // Afficher notification de succès
      setNotification({ 
        show: true, 
        type: 'success', 
        message: 'Rapport modifié avec succès !' 
      });

      // Si le composant est utilisé en mode intégré et qu'il y a un callback
      if (isInline && typeof onRapportUpdated === 'function') {
        setTimeout(() => {
          onRapportUpdated();
        }, 2000);
      } else {
        // Sinon, rediriger vers la liste des rapports après 2 secondes
        setTimeout(() => {
          navigate('/acceuil/rapports', { 
            state: { id: visiteurId } 
          });
        }, 2000);
      }
      
    } catch (error) {
      setNotification({ 
        show: true, 
        type: 'error', 
        message: `Erreur lors de la modification: ${error.message}` 
      });
    }
  };

  // Si en cours de chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Si pas d'ID de rapport
  if (!idRapport) {
    return (
      <div className={`${isInline ? '' : 'max-w-3xl mx-auto mt-10'} p-6 bg-zinc-900 border-2 border-zinc-700 rounded-md shadow-lg`}>
        <div className="bg-red-900 text-red-300 p-4 rounded-md text-center border border-red-700 font-mono">
          Aucun rapport sélectionné. Veuillez choisir un rapport à modifier.
        </div>
        <button
          onClick={() => isInline ? onRapportUpdated() : navigate('/acceuil/rapports', { state: { id: visiteurId } })}
          className="mt-6 w-full bg-amber-600 text-zinc-900 py-3 rounded-md text-lg font-mono uppercase tracking-wide shadow-md hover:bg-amber-500 transition-colors border border-amber-700"
        >
          {isInline ? "Fermer" : "Retour à la liste des rapports"}
        </button>
      </div>
    );
  }

  // Adapter le style en fonction du mode (intégré ou autonome)
  const containerClass = isInline 
    ? "p-6 bg-zinc-900 border-2 border-zinc-700 rounded-md shadow-lg" 
    : "max-w-3xl mx-auto mt-10 p-6 bg-zinc-900 border-2 border-zinc-700 rounded-md shadow-lg";

  return (
    <div className={containerClass}>
      {!isInline && (
        <h2 className="text-2xl font-mono uppercase tracking-wide text-amber-500 mb-8 text-center border-b border-zinc-700 pb-4">
          Modifier le rapport
        </h2>
      )}
      
      <div className="mb-6">
        <p className="text-gray-400">
          <span className="font-medium text-amber-500 font-mono">Médecin:</span> {rapportData.nomMedecin ? `Dr. ${rapportData.nomMedecin} ${rapportData.prenomMedecin}` : 'Information non disponible'}
        </p>
        <p className="text-gray-400"><span className="font-medium text-amber-500 font-mono">Date du rapport:</span> {rapportData.date}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-gray-400 text-sm font-mono uppercase tracking-wider mb-2">Motif</label>
          <input
            type="text"
            name="motif"
            value={rapportData.motif}
            onChange={handleInputChange}
            placeholder="Saisir le motif du rapport"
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-300 font-mono"
          />
        </div>

        <div>
          <label className="block text-gray-400 text-sm font-mono uppercase tracking-wider mb-2">Bilan</label>
          <textarea
            name="bilan"
            value={rapportData.bilan}
            onChange={handleInputChange}
            placeholder="Saisir le bilan détaillé"
            className="w-full p-3 h-32 bg-zinc-800 border border-zinc-700 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-300 font-mono"
          />
        </div>
      </div>

      {notification.show && (
        <div className={`mt-6 p-4 rounded-md text-center font-mono ${
          notification.type === 'success' 
            ? 'bg-green-900 text-green-300 border border-green-700' 
            : 'bg-red-900 text-red-300 border border-red-700'
        }`}>
          {notification.message}
        </div>
      )}

      <div className="mt-8">
        <button
          onClick={ModifierRapport}
          className="w-full bg-amber-600 text-zinc-900 py-3 rounded-md text-lg font-mono uppercase tracking-wide shadow-md hover:bg-amber-500 transition-colors border border-amber-700"
        >
          Enregistrer les modifications
        </button>
      </div>
    </div>
  );
};

export default RapportsModification;