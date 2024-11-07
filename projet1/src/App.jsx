import React, { useState } from 'react';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pouvez ajouter la logique pour envoyer les données du formulaire à l'API
    console.log(formData);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <img src="./src/pages/images/image-GSB-1.png" alt="Logo" className="mx-auto mb-6" />
        <h1 className="text-2xl font-bold mb-6">Connexion</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="login" className="block font-medium mb-2">
              Login
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
          <div className="mb-6">
            <label htmlFor="password" className="block font-medium mb-2">
              Mot de passe
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
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg w-full"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;