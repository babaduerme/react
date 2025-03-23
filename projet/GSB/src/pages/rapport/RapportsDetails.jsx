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
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-zinc-900 border-2 border-zinc-700 rounded shadow-lg">
  <h2 className="text-2xl font-mono uppercase tracking-wide text-amber-500 mb-8 text-center border-b border-zinc-700 pb-4">
    Ajouter un rapport pour Dr. {medecin.nom} {medecin.prenom}
  </h2>
  <div className="grid grid-cols-1 gap-6">
    <div>
      <label className="block text-gray-400 text-sm font-mono uppercase tracking-wider mb-2">Date</label>
      <input
        type="date"
        name="date"
        value={rapportData.date}
        onChange={handleRapportChange}
        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-300 font-mono"
      />
    </div>

    <div>
      <label className="block text-gray-400 text-sm font-mono uppercase tracking-wider mb-2">Motif</label>
      <input
        type="text"
        name="motif"
        value={rapportData.motif}
        onChange={handleRapportChange}
        placeholder="Saisir le motif du rapport"
        className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-300 font-mono"
      />
    </div>

    <div>
      <label className="block text-gray-400 text-sm font-mono uppercase tracking-wider mb-2">Bilan</label>
      <textarea
        name="bilan"
        value={rapportData.bilan}
        onChange={handleRapportChange}
        placeholder="Saisir le bilan détaillé"
        className="w-full p-3 h-32 bg-zinc-800 border border-zinc-700 rounded shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-300 font-mono"
      />
    </div>
  </div>

  {notification.show && (
    <div className={`mt-6 p-4 rounded text-center font-mono ${
      notification.type === 'success' ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-red-900 text-red-300 border border-red-700'
    }`}>
      {notification.message}
    </div>
  )}

<button
    onClick={handleAddRapport}
    className="mt-8 w-full bg-amber-600 text-zinc-900 py-3 rounded text-lg font-mono uppercase tracking-wide shadow-md hover:bg-amber-500 transition-colors border border-amber-700"
  >
    Ajouter le rapport
  </button>
</div>

  );
};

export default RapportsDetails;
