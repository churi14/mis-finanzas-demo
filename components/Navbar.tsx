import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle'; // <--- Importamos el botón nuevo

export default function Navbar() {
  return (
    // Agregamos dark:bg-slate-900/80 y dark:border-slate-800 para que la barra se oscurezca
    <nav className="border-b border-gray-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight hover:opacity-80 transition-opacity text-slate-900 dark:text-white">
          <div className="bg-black dark:bg-white text-white dark:text-black p-1.5 rounded-lg transition-colors">
            <Wallet size={20} />
          </div> 
          EnQuéGasto
        </Link>

        {/* LINKS (Escritorio) */}
        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Inicio</Link>
          <Link href="/faq" className="hover:text-black dark:hover:text-white transition-colors">FAQ</Link>
          <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">Nosotros</Link>
        </div>

        {/* BOTONES (Acá va el Toggle) */}
        <div className="flex gap-3 items-center">
          <ThemeToggle /> {/* <--- EL BOTÓN DE SOL/LUNA */}
          
          <Link href="/dashboard" className="bg-black text-white dark:bg-white dark:text-black text-sm font-bold py-2.5 px-6 rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-lg shadow-gray-200 dark:shadow-none">
            Dashboard
          </Link>
        </div>

      </div>
    </nav>
  );
}