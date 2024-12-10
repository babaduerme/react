import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Acceuil from './pages/acceuil/acceuil.jsx';
import Navebar from './pages/barrenav/navebar.jsx';

const router = createBrowserRouter([
  {
    path:"/",
    element: <App />
  },
  {
    path:"/acceuil",
    element: <Acceuil />
  },
  {
    path: "/navebar",
    element: <Navbar />
  }
  ])
  
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router}/>
    </StrictMode>,
  );