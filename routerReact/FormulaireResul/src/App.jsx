// App.js
import { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    class: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/resultat', { state: { formData } });
  };

  return (
    <div className="container">
      <h1>Mon super formulaire !</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nom">Nom :</label>
          <input 
            id="nom"
            name="nom" 
            type="text" 
            value={formData.nom} 
            onChange={handleChange} 
            required
          />
        </div> 

        <div className="form-group">
          <label htmlFor="prenom">Prénom :</label>
          <input 
            id="prenom"
            name="prenom" 
            type="text" 
            value={formData.prenom} 
            onChange={handleChange} 
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="class">Classe :</label>
          <input 
            id="class"
            name="class" 
            type="text" 
            value={formData.class} 
            onChange={handleChange} 
            required
          />
        </div>

        <button type="submit" className="button">
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default App;