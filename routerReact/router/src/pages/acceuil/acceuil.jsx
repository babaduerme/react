import React, { useState } from 'react';
import './index.css';  
import Navbar from '../navbar/navbar'; // Vérifiez le nom et le chemin
import { useLocation } from 'react-router-dom';

function Accueil() {
    const {state} = useLocation()
    const nom = state.nom
    //création de ma variable nom 
    //var nom = "Mr Dabadie"
 
    const [text, setText] = useState('')
    const [phrase, setPhrase] = useState([  //création d'un tableau 
      { id: 1, mot: 'Slam' },
      { id: 2, mot: 'SISR' },
      { id: 3, mot: 'GPME' },
      ]);
  
    //création d'une variable qui permet de gérer l'afficchage de mon tableaux sous forme d'une liste 
    /*const listItems = phrase.map(item =>
    <li key={item.id}>{item.mot} </li>
    ); */

    function ListePhrases({ phrase }) {
      return (
        <ul>
          {phrase.map(phrase => (
            <li key={phrase.id}> {phrase.mot} </li>
          ))}
        </ul>
      );
    }

  function cliquer(){
    setPhrase([...phrase, {id: phrase.length + 1, mot: text}])
    setText('')
    {/*alert("phrase mis dans la liste")*/}

  }

    return (
      <>
        <div>
                         {/* grâce au {} j'ai peut injecter ma variable  */}
          <banner><h1>Bonjour le monde {nom}</h1></banner>

          <categorie>
            <input name='valeurPhrase' value={text} onChange={e => setText(e.target.value)}></input>
            <button onClick={cliquer}>création de phrase</button>
          </categorie>

          <div>
        <Navbar />
        <p>bonjour</p>
      </div>

          
          {/*<ul style={{ listStyleType: 'none' }} >{/* injection de ma variable listItems pour l'affichage
            {listItems}
          </ul>*/}
          <ListePhrases phrase={phrase} />
        </div>
      </>
    )
  }
  
export default Accueil;
