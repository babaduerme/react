import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';

// Configuração da instância Axios
const api = axios.create({
  baseURL: 'http://172.16.61.61/restGSB',
});

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

  /**
   * Tentativa de conexão com a API via GET usando os parâmetros "login" e "mdp".
   * Em caso de sucesso, navega para a página de "acceuil" com os dados do usuário.
   * Em caso de erro, exibe uma mensagem de erro.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.get('/connexion', {
        params: {
          login: formData.login,
          mdp: formData.password,
        },
      });

      console.log("API Response:", response);

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
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <img src="../src/images/image-GSB-1.png" alt="Logo" className="mx-auto mb-5 object-cover h-15 w-15" />

        <h1 className="text-2xl font-bold mb-6">Connexion</h1>
        {erreurLogin && (
          <div className="bg-red-500 text-white p-5 rounded-lg mb-4">
            Le login ou le mot de passe est incorrect
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
            className="bg-white border-solid border-2 border-black hover:bg-black text-black font-bold py-2 px-4 rounded-lg w-full hover:text-white"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;