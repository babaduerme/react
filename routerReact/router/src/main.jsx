import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Accueil from './pages/acceuil/acceuil.jsx';
import './index.css';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/', 
    element: <App />
  },
  {
    path: '/acceuil', 
    element: <Accueil />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
