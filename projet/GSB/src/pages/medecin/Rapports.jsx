import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const Rapports = ({ medecinId }) => {
  const [allRapports, setAllRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRapports = async () => {
      if (!medecinId) return;

      setLoading(true);
      setError(null);

      try {
        console.log(`Fetching reports for medecinId: ${medecinId}`);
        const response = await api.get(`/rapports/${medecinId}`);
        const allRapports = response.data || [];
        
        setAllRapports(allRapports);
      } catch (err) {
        console.error("Erreur lors de la récupération des rapports:", err.message);
        setError("Impossible de charger les rapports. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchRapports();
  }, [medecinId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500 border-r-2 border-amber-500 border-b-2 border-transparent"></div>
        <span className="ml-3 text-gray-400 font-mono">Chargement des rapports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900 border border-red-700 rounded-md">
        <p className="text-red-300 font-mono">{error}</p>
      </div>
    );
  }

  if (!allRapports || allRapports.length === 0) {
    return (
      <div className="p-6 bg-zinc-800 border border-zinc-700 rounded-md">
        <p className="text-center text-amber-500 font-mono">Aucun rapport n'a été trouvé.</p>
        <p className="text-center text-sm text-gray-400 mt-2 font-mono">
          ID médecin: {medecinId}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-lg shadow p-4">
      <h2 className="text-xl font-mono uppercase tracking-wide text-amber-500 mb-6">Tous les rapports ({allRapports.length})</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-zinc-700 border border-zinc-700">
          <thead className="bg-zinc-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-amber-500">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-amber-500">Motif</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-amber-500">Bilan</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-mono uppercase tracking-wider text-amber-500">Visiteur</th>
            </tr>
          </thead>
          <tbody className="bg-zinc-900 divide-y divide-zinc-800">
            {allRapports.map((rapport, index) => (
              <tr key={index} className={rapport.idMedecin === parseInt(medecinId) ? "bg-zinc-800 hover:bg-zinc-700 border-l-2 border-amber-600" : "hover:bg-zinc-800"}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-400">{formatDate(rapport.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{rapport.motif}</td>
                <td className="px-6 py-4 text-sm text-gray-400">
                  <div className="max-h-20 overflow-y-auto">{rapport.bilan}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{rapport.nom} {rapport.prenom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rapports;