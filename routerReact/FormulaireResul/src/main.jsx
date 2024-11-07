import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import Resultat from './pages/Resultat/resultat.jsx';
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom';

const router = createBrowserRouter([
{
  path:"/",
  element: <App />
},
{
  path:"/resultat",
  element: <Resultat />
}
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
