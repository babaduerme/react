import React, { useState } from 'react';
import api from './api/api';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

const App = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  const [erreurLogin, setErreurLogin] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.get('/connexion', {
        params: {
          login: formData.login,
          mdp: formData.password,
        },
      });

      if (response.data) {
        navigate('/acceuil', {
          state: {
            nom: response.data.nom,
            prenom: response.data.prenom,
            adresse: response.data.adresse,
            cp: response.data.cp,
            id: response.data.id,
            ville: response.data.ville,
          },
        });
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
    <div className="flex justify-center items-center h-screen bg-zinc-900">
      <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-8 shadow-lg w-full max-w-md">
        <img src="../src/images/image-GSB-1-removebg-preview.png" alt="Logo" className="mx-auto mb-15 object-contain h-60 w-auto" />
        <br />

        <h1 className="text-2xl font-bold text-gray-300 mb-6 text-center">Connexion</h1>
        {erreurLogin && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-4 text-center">
            Le login ou le mot de passe est incorrect
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="login" className="block font-medium text-gray-400 mb-2">
              Login :
            </label>
            <input
              id="login"
              name="login"
              type="text"
              value={formData.login}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-gray-300 border border-zinc-700 rounded-lg py-2 px-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block font-medium text-gray-400 mb-2">
              Mot de passe :
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-zinc-900 text-gray-300 border border-zinc-700 rounded-lg py-2 px-3 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-amber-500 text-zinc-900 font-bold rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Connexion
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
