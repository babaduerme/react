import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Acceuil from './pages/acceuil/acceuil.jsx';
import Rapports from './pages/rapport/Rapports.jsx';
import Medecins from './pages/medecin/Medecins.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/acceuil",
    element: <Acceuil />,
    /*ici, c'est le tableau d'objets children qui va contenir
    les routes des enfants spécifiquesau parent Acceuil */
     children: [
      {
        path: "rapports", 
        element: <Rapports />,
      },
      {
        path: "medecins",
        element: <Medecins />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);