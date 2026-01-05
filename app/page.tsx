import Link from 'next/link';
import { Wallet, ArrowRight, CreditCard, PieChart, Lock } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-black tracking-tight">
            <div className="bg-black text-white p-1.5 rounded-lg"><Wallet size={20} /></div> 
            EnQuéGasto
          </div>
          <div className="flex gap-4">
            {/* ANTES DECÍA href="/dashboard" -> CAMBIAR A "/login" */}
            <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-black py-2.5 px-4 transition-colors">
              Iniciar Sesión
            </Link>
            
            <Link href="/dashboard" className="bg-black text-white text-sm font-bold py-2.5 px-6 rounded-full hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
              Empezar sin registro
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Texto Hero */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full border border-blue-100">
              🚀 Nueva versión 2.0 disponible
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
              ¿Sabés realmente <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                en qué gastas?
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
              La herramienta definitiva para argentinos. Controlá tus gastos, gestioná tus cuotas con tarjeta y proyectá tus ahorros sin complicaciones.
            </p>
            
            {/* BOTONES (CORREGIDO: Sin duplicados) */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard" className="bg-black text-white text-lg font-bold py-4 px-8 rounded-2xl hover:bg-gray-800 transition-all shadow-xl flex items-center justify-center gap-2">
                Empezar ahora sin registro <ArrowRight size={20}/>
              </Link>
              {/* BOTÓN 2: Registrarse (AHORA ES UN LINK) */}
              <Link href="/login" className="bg-white text-slate-700 text-lg font-bold py-4 px-8 rounded-2xl hover:bg-gray-50 transition-all border-2 border-gray-100 flex items-center justify-center gap-2">
                Registrarse *
              </Link>
            </div>
            
            {/* TEXTO DE CONFIANZA */}
            <p className="text-xs text-slate-500 font-bold flex items-center gap-1">
              * No te vamos a cobrar nunca, el servicio es gratuito.
            </p>
          </div>

          {/* Imagen Hero (CORREGIDO: Limpio) */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-violet-100 rounded-[3rem] transform rotate-3 scale-105 -z-10"></div>
            <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-200 p-2 overflow-hidden transform -rotate-2 hover:rotate-0 transition-all duration-500">
               <img 
                 src="/dashboard-screenshot.png" 
                 alt="Vista previa del Dashboard" 
                 className="w-full h-auto rounded-[1.5rem] object-cover shadow-inner" 
               />
            </div>
          </div>

        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Todo lo que necesitás</h2>
            <p className="text-slate-500 text-lg">Diseñado pensando en la economía argentina. Simple, rápido y directo al grano.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Control de Tarjetas</h3>
              <p className="text-slate-500">Olvidate de las sorpresas en el resumen. Cargá tus compras en cuotas y sabé exactamente cuánto vas a pagar el mes que viene.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center text-violet-600 mb-6">
                <PieChart size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Regla 50/30/20</h3>
              <p className="text-slate-500">Visualizá automáticamente la calidad de tus gastos. Cuánto va a necesidades, cuánto a gustos y cuánto lograste ahorrar.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                <Lock size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Privado</h3>
              <p className="text-slate-500">Tus datos son tuyos. Creamos un entorno seguro para que lleves tus cuentas con total tranquilidad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <Footer />
      
    </div>
  );
}