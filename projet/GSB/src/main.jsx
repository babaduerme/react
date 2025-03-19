import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import Acceuil from './pages/acceuil/acceuil.jsx';
import Rapports from './pages/rapport/Rapports.jsx';
import Medecins from './pages/medecin/Medecins.jsx';
import MedecinDetails from './pages/medecin/MedecinDetails.jsx'; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/acceuil",
    element: <Acceuil />,
    children: [
      {
        path: "rapports", 
        element: <Rapports />,
      },
      {
        path: "medecins",
        element: <Medecins />,
              children: [
          {
            path: ":id", 
            element: <MedecinDetails />,
          }
        ]
      },
      ,
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);