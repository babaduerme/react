import { createContext, useState } from "react";
/* Ici ma variable d'état visiteur va servir de contexte : elle va permettre 
de récupérer le visiteur conencté, afin de pouvoir la transmettre sur les enfants

la question state ? : représente l'opérateur dit "ternaire", qui équivaut a faire un : 
if (state) {
    state.user
} else{
    null
}

*/
const ThemeContext = createContext("visiteur");
const location = useState();

export default ThemeContext;