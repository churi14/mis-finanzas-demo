import Footer from '@/components/Footer';
import Link from 'next/link'; // <--- IMPORTANTE: Agregamos Link
import { Users, Target, Rocket, Heart, Code2, Coffee, ArrowLeft } from 'lucide-react'; // <--- Agregamos ArrowLeft

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      
      {/* El Navbar ya está en el layout, pero agregamos un botón extra por comodidad */}

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
            
            {/* BOTÓN VOLVER (NUEVO) */}
            <div className="absolute top-8 left-6 md:left-12 z-30">
                <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm bg-white/10 backdrop-blur-md py-2 px-4 rounded-full">
                    <ArrowLeft size={16} /> Volver al inicio
                </Link>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10 mt-8">
                <span className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-4 block">Nuestra Historia</span>
                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
                    Hacemos tecnología con <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">acento argentino.</span>
                </h1>
                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Somos <strong>En Red Consultora</strong>. Nacimos programando soluciones para empresas y terminamos creando la herramienta que nosotros mismos necesitábamos.
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
                    <h3 className="text-xl font-black mb-3">Misión Clara</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Democratizar la educación financiera. Creemos que controlar tus gastos no debería requerir un título de contador ni una planilla de Excel aburrida.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-start hover:transform hover:-translate-y-2 transition-all duration-300">
                    <div className="bg-purple-50 text-purple-600 p-4 rounded-2xl mb-6"><Code2 size={32}/></div>
                    <h3 className="text-xl font-black mb-3">ADN Tecnológico</h3>
                    <p className="text-slate-500 leading-relaxed">
                        No somos un banco. Somos desarrolladores apasionados por el código limpio, la velocidad y la seguridad de datos. Lo hacemos porque nos gusta.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-start hover:transform hover:-translate-y-2 transition-all duration-300">
                    <div className="bg-green-50 text-green-600 p-4 rounded-2xl mb-6"><Heart size={32}/></div>
                    <h3 className="text-xl font-black mb-3">100% Humano</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Detrás de cada línea de código hay personas que también pagan el alquiler y van al súper. Entendemos la inflación porque la vivimos igual que vos.
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
                    <h2 className="text-3xl md:text-4xl font-black mb-6">De la consultoría al producto propio.</h2>
                    <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                        EnQuéGasto nació como un proyecto interno de <strong>En Red Consultora</strong>. Estábamos cansados de anotar gastos en notas del celular o apps extranjeras que no entendían lo que es una cuota con interés.
                    </p>
                    <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                        Decidimos usar nuestra experiencia construyendo software para grandes empresas y aplicarla en una herramienta gratuita para la comunidad.
                    </p>
                    
                    <div className="flex gap-4">
                         <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm font-bold text-slate-700">
                            <Users size={16} className="text-blue-500"/> Equipo IT
                         </div>
                         <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm font-bold text-slate-700">
                            <Coffee size={16} className="text-amber-700"/> Mucho Café
                         </div>
                    </div>
                </div>
            </div>
        </section>

        {/* CTA FINAL */}
        <section className="py-24 px-6 text-center">
            <h2 className="text-3xl font-black mb-6">¿Querés charlar con nosotros?</h2>
            <p className="text-slate-500 max-w-lg mx-auto mb-10 text-lg">
                Ya sea por feedback de la app o para consultar por servicios de desarrollo de software para tu empresa.
            </p>
            <a href="mailto:hola@enredconsultora.com" className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold py-4 px-10 rounded-full hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                Contactar al equipo
            </a>
        </section>

      </main>

      <Footer />
    </div>
  );
}