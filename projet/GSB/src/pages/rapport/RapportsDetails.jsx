import React, { useState, useEffect } from 'react';
import { useLocation, useOutletContext } from 'react-router-dom';
import api from '../../api/api';

const RapportsDetails = () => {
  const location = useLocation();
  const medecin = location.state?.medecinSelectionne;
  const idVisiteur = location.state?.id;
  const { setMedecinSelectionne } = useOutletContext() || {};
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const [rapportData, setRapportData] = useState({
    date: '',
    motif: '',
    bilan: '',
    idMedecin: medecin?.id || ''
  });

  useEffect(() => {
    if (medecin) {
      setRapportData(prev => ({ ...prev, idMedecin: medecin.id }));
    }
  }, [medecin]);

  const handleRapportChange = (event) => {
    const { name, value } = event.target;
    setRapportData(prevData => ({ ...prevData, [name]: value }));
  };

  if (!medecin) {
    return <p className="text-red-600 text-center py-4">Aucun médecin sélectionné.</p>;
  }

  const handleAddRapport = async () => {
    if (!rapportData.date || !rapportData.motif || !rapportData.bilan) {
      setNotification({ show: true, type: 'error', message: 'Veuillez remplir tous les champs.' });
      return;
    }

    const rapportPayload = {
      date: rapportData.date,
      motif: rapportData.motif,
      bilan: rapportData.bilan,
      idMedecin: medecin.id,
      idVisiteur: idVisiteur
    };

    try {
      const response = await api.put('/ajouterRapport', rapportPayload);
      console.log('Réponse API:', response);

      setNotification({ show: true, type: 'success', message: 'Rapport ajouté avec succès !' });
      setRapportData({ date: '', motif: '', bilan: '', idMedecin: medecin.id });

      if (typeof setMedecinSelectionne === 'function') {
        await fetchRapportsUpdated();
      }
    } catch (error) {
      console.error('Erreur:', error);
      setNotification({ show: true, type: 'error', message: "Erreur lors de l'ajout du rapport." });
    } finally {
      setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
    }
  };

  const fetchRapportsUpdated = async () => {
    try {
      const response = await api.get(`/rapports/${medecin.id}`);
      if (response.data) setMedecinSelectionne(response.data);
    } catch (error) {
      console.warn('Erreur lors de la récupération des rapports:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white border rounded-md shadow-md">
  <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Ajouter un rapport pour Dr. {medecin.nom} {medecin.prenom}</h2>

  <div className="grid grid-cols-1 gap-6">
    <div>
      <label className="block text-gray-700 text-sm font-medium mb-2">Date</label>
      <input
        type="date"
        name="date"
        value={rapportData.date}
        onChange={handleRapportChange}
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300"
      />
    </div>

    <div>
      <label className="block text-gray-700 text-sm font-medium mb-2">Motif</label>
      <input
        type="text"
        name="motif"
        value={rapportData.motif}
        onChange={handleRapportChange}
        placeholder="Saisir le motif du rapport"
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300"
      />
    </div>

    <div>
      <label className="block text-gray-700 text-sm font-medium mb-2">Bilan</label>
      <textarea
        name="bilan"
        value={rapportData.bilan}
        onChange={handleRapportChange}
        placeholder="Saisir le bilan détaillé"
        className="w-full p-3 h-32 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-300"
      />
    </div>
  </div>

  {notification.show && (
    <div className={`mt-6 p-4 rounded-md text-center ${
      notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {notification.message}
    </div>
  )}

  <button
    onClick={handleAddRapport}
    className="mt-8 w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold shadow-md hover:bg-blue-700 transition"
  >
    Ajouter le rapport
  </button>
</div>

  );
};

export default RapportsDetails;
