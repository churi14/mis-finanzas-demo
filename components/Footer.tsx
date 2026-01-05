import { Facebook, Instagram, Twitter, Youtube, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* 1. Logo y Marca */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-2xl font-black tracking-tight">
              <div className="bg-white text-[#0f172a] p-1.5 rounded-lg">
                <Wallet size={24} />
              </div> 
              EnQuéGasto
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tomá el control de tus finanzas personales. Registrá, analizá y proyectá tus gastos de forma simple y gratuita.
            </p>
          </div>

          {/* 2. Explorar */}
          <div>
            <h4 className="font-bold text-lg mb-6">Explorar</h4>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Funcionalidades</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Preguntas frecuentes</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Sobre nosotros</Link></li>
            </ul>
          </div>

          {/* 3. Legal */}
          <div>
            <h4 className="font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li><Link href="#" className="hover:text-white transition-colors">Términos de uso</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Política de privacidad</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
            </ul>
          </div>

          {/* 4. Síguenos */}
          <div>
            <h4 className="font-bold text-lg mb-6">Síguenos</h4>
            <ul className="space-y-4 text-slate-300 text-sm">
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Facebook size={18}/> Facebook</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Instagram size={18}/> Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Twitter size={18}/> Twitter / X</a></li>
              <li><a href="#" className="hover:text-white transition-colors flex items-center gap-2"><Youtube size={18}/> Youtube</a></li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior Copyright */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            Hecho por <span className="font-bold text-white">En Red Consultora</span> · Todos los derechos reservados © 2026.
          </p>
          <div className="flex gap-6">
             {/* Iconos extra si querés, o vacio */}
          </div>
        </div>

      </div>
    </footer>
  );
}