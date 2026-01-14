import Footer from '@/components/Footer';
import Link from 'next/link';
import { Target, Rocket, Heart, ArrowLeft, Monitor, Megaphone, Lightbulb, TrendingUp } from 'lucide-react'; 

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      
      {/* El Navbar ya está en el layout */}

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
            
            {/* BOTÓN VOLVER */}
            <div className="absolute top-8 left-6 md:left-12 z-30">
                <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm bg-white/10 backdrop-blur-md py-2 px-4 rounded-full">
                    <ArrowLeft size={16} /> Volver al inicio
                </Link>
            </div>

            <div className="max-w-5xl mx-auto text-center relative z-10 mt-8">
                <span className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-4 block">Nuestra Identidad</span>
                
                {/* TÍTULO ACTUALIZADO (SIN 'ACENTO ARGENTINO') */}
                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                    Unimos Tecnología y Comunicación.
                </h1>
                
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Somos <strong>En Red Consultora</strong>. No solo escribimos código; creamos estrategias, campañas y soluciones integrales para que tu negocio crezca en todas las direcciones.
                </p>
            </div>
            
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        </section>

        {/* VALORES / CARDS */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 -mt-32 relative z-20">
                
                {/* Card 1 */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-start hover:transform hover:-translate-y-2 transition-all duration-300">
                    <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl mb-6"><Target size={32}/></div>
                    <h3 className="text-xl font-black mb-3">Visión 360°</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Entendemos que una buena App no sirve de nada si nadie la conoce. Por eso integramos el desarrollo técnico con la estrategia de publicidad y comunicación.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-start hover:transform hover:-translate-y-2 transition-all duration-300">
                    <div className="bg-purple-50 text-purple-600 p-4 rounded-2xl mb-6"><Lightbulb size={32}/></div>
                    <h3 className="text-xl font-black mb-3">Soluciones Reales</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Desde automatizar procesos internos hasta campañas creativas. Asesoramos a empresas para que usen la tecnología a su favor, sin complicaciones.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-start hover:transform hover:-translate-y-2 transition-all duration-300">
                    <div className="bg-green-50 text-green-600 p-4 rounded-2xl mb-6"><Heart size={32}/></div>
                    <h3 className="text-xl font-black mb-3">Trato Cercano</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Detrás de cada proyecto hay personas. Hablamos tu idioma, entendemos tus problemas y buscamos la vuelta para que tu inversión rinda frutos.
                    </p>
                </div>

            </div>
        </section>

        {/* EL EQUIPO / ORÍGENES */}
        <section className="bg-slate-50 py-20 px-6">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
                <div className="w-full md:w-1/2 relative">
                    <div className="aspect-square bg-slate-200 rounded-[3rem] overflow-hidden relative shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                         {/* IMAGEN DECORATIVA ABSTRACTA */}
                         <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black flex items-center justify-center">
                            <Rocket size={80} className="text-white opacity-20" />
                         </div>
                    </div>
                </div>
                <div className="w-full md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">Más que una empresa de software.</h2>
                    <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                        EnQuéGasto es solo una muestra de lo que hacemos en <strong>En Red Consultora</strong>. Nacimos programando, pero rápidamente entendemos que la tecnología necesita ir de la mano de una buena estrategia.
                    </p>
                    <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                        Hoy ayudamos a empresas a digitalizarse, comunicar mejor y optimizar sus recursos. Todo en un solo lugar.
                    </p>
                    
                    {/* ETIQUETAS DE SERVICIOS */}
                    <div className="flex flex-wrap gap-3">
                         <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-xs font-bold text-slate-700 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-default">
                            <Monitor size={16}/> Desarrollo IT
                         </div>
                         <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-xs font-bold text-slate-700 hover:border-purple-300 hover:text-purple-600 transition-colors cursor-default">
                            <Megaphone size={16}/> Comunicación
                         </div>
                         <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-xs font-bold text-slate-700 hover:border-pink-300 hover:text-pink-600 transition-colors cursor-default">
                            <Rocket size={16}/> Publicidad
                         </div>
                         <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm text-xs font-bold text-slate-700 hover:border-green-300 hover:text-green-600 transition-colors cursor-default">
                            <TrendingUp size={16}/> Asesoramiento
                         </div>
                    </div>
                    
                </div>
            </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 px-6 text-center">
            <h2 className="text-3xl font-black mb-6">¿Tenés un proyecto en mente?</h2>
            <p className="text-slate-500 max-w-lg mx-auto mb-10 text-lg">
                Ya sea para mejorar tu comunicación, desarrollar un sistema o recibir asesoramiento estratégico.
            </p>
            <a href="mailto:hola@enredconsultora.com" className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold py-4 px-10 rounded-full hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Contactar a En Red
            </a>
        </section>

      </main>

      <Footer />
    </div>
  );
}