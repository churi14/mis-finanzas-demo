import Link from 'next/link';
import { Wallet } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed w-full z-50 top-0 start-0 border-b border-gray-800 bg-slate-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="bg-white text-slate-900 p-1.5 rounded-lg">
                <Wallet size={24} />
            </div>
            <span className="self-center text-xl font-black whitespace-nowrap text-white tracking-tight">EnQuéGasto</span>
        </Link>
        
        {/* BOTÓN MENÚ MÓVIL (Hamburguesa) */}
        <div className="flex md:hidden">
            <button data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-400 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600">
                <span className="sr-only">Abrir menú</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
        </div>

        {/* LINKS DE NAVEGACIÓN */}
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-bold border border-gray-700 rounded-lg bg-slate-800 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent">
            <li>
              <Link href="/" className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:hover:text-blue-400 md:p-0 transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/faq" className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:hover:text-blue-400 md:p-0 transition-colors">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/about" className="block py-2 px-3 text-white rounded hover:bg-gray-700 md:hover:bg-transparent md:hover:text-blue-400 md:p-0 transition-colors">
                Nosotros
              </Link>
            </li>
          </ul>
        </div>

        {/* (ACÁ ESTABA EL DASHBOARD Y LA LUNA, YA LOS BORRÉ) */}

      </div>
    </nav>
  );
}