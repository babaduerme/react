// src/components/barrenav/navebar.jsx
// Mechanical style navbar with Tailwind

import React from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../images/image-GSB-1-removebg-preview.png';

const navigation = [
  { name: 'Dashboard', href: '/acceuil', current: true },
  { name: 'Rapports', href: '/acceuil/rapports', current: false },
  { name: 'Médecins', href: '/acceuil/medecins', current: false },
];

export default function Navbar() {
  const location = useLocation(); 
  const { nom, prenom, adresse, cp, id, ville } = location.state || {};

  return (
    <Disclosure as="nav" className="bg-zinc-900 border-b-2 border-amber-600 shadow-lg">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-20 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-amber-500 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 rounded">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </DisclosureButton>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <Link to="/" className="flex items-center flex-shrink-0 bg-zinc-800 p-2 rounded border border-zinc-700">
                  <img src={logo} className="h-12 w-auto" alt="Logo" />
                </Link>

                <div className="hidden sm:block sm:ml-6 self-center">
                  <div className="flex space-x-1">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        state={{ nom, prenom, adresse, cp, id, ville }}
                        className="text-gray-300 hover:bg-zinc-800 hover:text-amber-500 px-5 py-3 rounded font-mono text-sm uppercase tracking-wider border border-transparent hover:border-zinc-700 transition-all duration-200 flex items-center shadow-sm"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center bg-zinc-800 px-4 py-2 rounded border border-zinc-700">
                <span className="text-amber-500 font-mono tracking-wide">
                  <span className="text-gray-500 mr-2">[</span>
                  {nom} {prenom}
                  <span className="text-gray-500 ml-2">]</span>
                </span>
              </div>
            </div>
          </div>

          <DisclosurePanel className="sm:hidden border-t border-zinc-800 bg-zinc-900">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  state={{ nom, prenom, adresse, cp, id, ville }}
                  className="text-gray-300 hover:bg-zinc-800 hover:text-amber-500 block px-3 py-2 rounded font-mono text-sm uppercase tracking-wider border border-transparent hover:border-zinc-700"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}