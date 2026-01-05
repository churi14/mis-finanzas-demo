import Link from 'next/link';
import { Wallet } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-black tracking-tight hover:opacity-80 transition-opacity">
          <div className="bg-black text-white p-1.5 rounded-lg"><Wallet size={20} /></div> 
          EnQuéGasto
        </Link>

        {/* Links de Navegación (Desktop) */}
        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-500">
          <Link href="/" className="hover:text-black transition-colors">Inicio</Link>
          <Link href="/faq" className="hover:text-black transition-colors">Preguntas Frecuentes</Link>
          <Link href="/about" className="hover:text-black transition-colors">Sobre Nosotros</Link>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-4">
          <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-black py-2.5 px-4 transition-colors hidden sm:block">
            Ingresar
          </Link>
          <Link href="/dashboard" className="bg-black text-white text-sm font-bold py-2.5 px-6 rounded-full hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
            Ir al Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}