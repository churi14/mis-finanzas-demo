import Link from 'next/link';
import { Wallet, Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Columna 1: Logo y Slogan */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xl font-black text-white tracking-tight">
            <div className="bg-white text-black p-1.5 rounded-lg"><Wallet size={20} /></div> 
            EnQuéGasto
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Tomá el control de tus finanzas personales. Registrá, analizá y proyectá tus gastos de forma simple y gratuita.
          </p>
        </div>

        {/* Columna 2: Explorar */}
        <div>
          <h4 className="text-white font-bold mb-6">Explorar</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
            {/* ESTOS SON LOS LINKS QUE FALTABAN ARREGLAR: */}
            <li><Link href="/faq" className="hover:text-white transition-colors">Preguntas frecuentes</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">Sobre nosotros</Link></li>
          </ul>
        </div>

        {/* Columna 3: Legal (Por ahora no existen, los dejamos con #) */}
        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/terms" className="hover:text-white transition-colors">Términos de uso</Link></li>
            <li><Link href="/privacy" className="hover:text-white transition-colors">Política de privacidad</Link></li>
            <li><Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link></li>
          </ul>
        </div>

        {/* Columna 4: Redes */}
        <div>
          <h4 className="text-white font-bold mb-6">Síguenos</h4>
          <ul className="space-y-3 text-sm">
            <li><a href="#" className="flex items-center gap-2 hover:text-white transition-colors"><Facebook size={18}/> Facebook</a></li>
            <li><a href="#" className="flex items-center gap-2 hover:text-white transition-colors"><Instagram size={18}/> Instagram</a></li>
            <li><a href="#" className="flex items-center gap-2 hover:text-white transition-colors"><Twitter size={18}/> Twitter / X</a></li>
            <li><a href="#" className="flex items-center gap-2 hover:text-white transition-colors"><Youtube size={18}/> Youtube</a></li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-slate-800 text-center md:text-right text-xs text-slate-500">
        <p>Hecho por <strong className="text-white">En Red Consultora</strong> · Todos los derechos reservados © 2026.</p>
      </div>
    </footer>
  );
}