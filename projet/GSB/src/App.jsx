import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import api from './api/api';


const App = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    
  });

  const [erreurLogin, setErreurLogin] = useState(false);
  const navigate = useNavigate(); // Permet de naviguer vers d'autres pages
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
/**
 * Tentative de connexion à l'API via la méthode GET avec les paramètres "login" et "mdp".
 * En cas de succès, les données utilisateur sont affichées et l'état d'erreur est réinitialisé.
 * En cas d'échec (connexion impossible ou erreur API), un message d'erreur est affiché.
 */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    try {
       /**
       * On attend que la prommesse se réalise, et renvoie sont résultat
       * dans la variable response ("await")
       * 
       * On appel l'api pour obtenir les données utilisateur 
       */
      const response = await api.get('/connexion', {
        params: {
          login: formData.login,
          mdp: formData.password,
        },
        
      });

      console.log("API Responce:", response);

      if (response.data) {
        navigate('/acceuil', {state: {
          nom: response.data.nom,
           prenom: response.data.prenom,  
           adresse: response.data.adresse, 
           cp: response.data.cp, 
           id: response.data.id, 
           ville: response.data.ville}});
        console.log(response.data);
        setErreurLogin(false); 
        
      } else {
        setErreurLogin(true); 
      }
    } catch (error) {
      console.error('Erreur lors de la connexion à l’API', error);
      setErreurLogin(true); 
    }
  };

  return (

    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">

        <img src="../src/images/image-GSB-1.png" alt="Logo" className="mx-auto mb-5 object-cover h-15 w-15"/>
        
        <h1 className="text-2xl font-bold mb-6">Connexion</h1>
        {erreurLogin && (
          <div className="bg-red-500 text-white p-5 rounded-lg mb-4">
            Le login ou le mot de passe et incorrect
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">

            <label htmlFor="login" className="block font-medium mb-2">
              Login :
            </label>

            <input
              id="login"
              name="login"
              type="text"
              value={formData.login}
              onChange={handleChange}
              className="border rounded-lg py-2 px-3 w-full"
              required
            />
          </div>

          <div className="mb-7">

            <label htmlFor="password" className="block font-medium mb-2">
              Mot de passe :
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="border rounded-lg py-2 px-3 w-full"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-white border-solid border-2 border-black  hover:bg-black text-black font-bold py-2 px-4 rounded-lg w-full hover:text-white">
            Envoyer
          </button>

        </form>
      </div>
    </div>

  );
};

export default App;