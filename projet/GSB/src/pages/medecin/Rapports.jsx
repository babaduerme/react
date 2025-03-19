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
        //console.log('API response:', response.data);
        const allRapports = response.data || [];
        
        // Loguer chaque rapport pour voir leur structure
        allRapports.forEach(rapport => {
         //console.log('Rapport:', rapport);
        });
        
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
    return <div className="text-center py-4">Chargement des rapports...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-4">{error}</div>;
  }

  if (!allRapports || allRapports.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-center text-yellow-700">Aucun rapport n'a été trouvé.</p>
        <p className="text-center text-sm text-yellow-600 mt-2">
          ID médecin: {medecinId}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Tous les rapports ({allRapports.length})</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Motif
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bilan
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Visiteur
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allRapports.map((rapport, index) => {
              // Afficher les données complètes dans la console pour débogage
              //console.log(`Rapport ${index}:`, rapport);
              
              return (
                <tr key={index} className={rapport.idMedecin === parseInt(medecinId) ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(rapport.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rapport.motif}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="max-h-20 overflow-y-auto">
                      {rapport.bilan}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rapport.nom} {rapport.prenom}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Affichage du debug pour vérifier les données**/}
      {/*<div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Debug - Données brutes :</h3>
        <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto text-xs">
          {JSON.stringify(allRapports, null, 2)}
        </pre>
      </div>
      */}
    </div>
  );
};

export default Rapports;