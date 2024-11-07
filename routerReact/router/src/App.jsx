import React, { useState } from 'react';
import './App.css';  
import Navbar from './pages/navbar/navbar';
import { useNavigate } from 'react-router-dom';

function App() {
  const [text, setText] = useState('');
const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <button onClick={()=>navigate('/acceuil', {state:{nom : 'Mr Daadie'}})}>Go acceuil </button>
      <p>Choisissez où vous voulez aller</p>
    </div>
    
  );
}

export default App;
