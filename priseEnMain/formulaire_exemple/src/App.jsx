import React, { useState } from 'react';

function MyApp() {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [classe, setClasse] = useState('');
  const [message, setMessage] = useState('');

  const handleValidate = () => {
    setMessage(`Bonjour ${nom} ${prenom}, étudiant en classe de ${classe}.`);
  };

  return (
    <div>
      <h1>Formulaire :</h1>
      <Nom textra={nom} setTextra={setNom} />
      <Prenom textra={prenom} setTextra={setPrenom} />
      <Classe textra={classe} setTextra={setClasse} />
      <Valider onValidate={handleValidate} />
      {message && <p>{message}</p>}
    </div>
  );
}

function Nom({ textra, setTextra }) {
  const handleChange = (event) => {
    setTextra(event.target.value);
  };

  return (
    <div>
      Votre Nom :
      <input
        name="nomtextra"
        type="text"
        value={textra}
        onChange={handleChange}
      />
    </div>
  );
}

function Prenom({ textra, setTextra }) {
  const handleChange = (event) => {
    setTextra(event.target.value);
  };

  return (
    <div>
      Votre Prenom :
      <input
        name="prenomtextra"
        type="text"
        value={textra}
        onChange={handleChange}
      />
    </div>
  );
}

function Classe({ textra, setTextra }) {
  const handleChange = (event) => {
    setTextra(event.target.value);
  };

  return (
    <div>
      Votre Classe :
      <input
        name="classtextra"
        type="text"
        value={textra}
        onChange={handleChange}
        
      />
    </div>
  );
}

function Valider({ onValidate }) {
  return (
    <button onClick={onValidate}>
      Validé
    </button>
  );
}

export default MyApp;
