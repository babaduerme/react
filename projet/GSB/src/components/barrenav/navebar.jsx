import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/acceuil', current: true },
  { name: 'Rapports', href: '/acceuil/rapports', current: false },
  { name: 'Médecins', href: '/acceuil/medecins', current: false },
];

export default function Navbar() {
  const location = useLocation(); 
  const { nom, prenom, adresse, cp, id, ville } = location.state || {};

  return (
    <Disclosure as="nav" className="bg-cyan-900">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Menu Mobile */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              {/* Logo et Menu principal */}
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <Link to="/" className="flex-shrink-0">
                  <img src="../src/images/image-GSB-1-removebg-preview.png" className="h-12 w-13" alt="Logo" />
                </Link>

                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        state={{ nom, prenom, adresse, cp, id, ville }} 
                        className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Affichage des informations utilisateur */}
              <div className="flex items-center">
                <span className="text-white">Bonjour, {nom} {prenom}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
