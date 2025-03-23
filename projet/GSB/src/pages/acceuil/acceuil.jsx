import React from 'react';
import Navbar from '../../components/barrenav/navebar';
import { useLocation, Outlet } from 'react-router-dom';


const Acceuil = () => {
  const location = useLocation();
  const { nom, prenom, adresse, cp, id, ville } = location.state || {};

  return (
    <>
      <Navbar />
      <div className="flex flex-col h-screen bg-zinc-900 bg-opacity-95 bg-[radial-gradient(#3a3a3a_1px,transparent_1px)] bg-[size:20px_20px]">
        <div className="px-6 py-4 bg-zinc-800 border-b border-zinc-700 mb-4">
          <div className="container mx-auto flex items-center">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
              <span className="font-mono text-gray-400 uppercase tracking-wider">
                <span className="text-gray-500">UTILISATEUR :</span> 
                <span className="text-amber-500 ml-2">{nom} {prenom}</span>
              </span>
            </div>
            <div className="ml-auto text-gray-500 font-mono text-sm">
              <span id="current-time">SYS.READY</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 flex-grow">
          <Outlet />
        </div>
       
      </div>
    </>
  );
};

// Add this script to your index.html or a separate JS file
// to update the time display in a mechanical style
function updateSystemTime() {
  const timeElement = document.getElementById('current-time');
  if (timeElement) {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeElement.textContent = `Horloge: ${hours}:${minutes}:${seconds}`;
  }
  setTimeout(updateSystemTime, 1000);
}

// Call this in your component's useEffect or when the DOM is loaded
document.addEventListener('DOMContentLoaded', updateSystemTime);

export default Acceuil;
