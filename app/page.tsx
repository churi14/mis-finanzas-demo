import Link from 'next/link';
import { ArrowRight, CreditCard, PieChart, Cloud, TrendingDown, Target, Heart } from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">

      {/* HERO */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Texto */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-xs font-black px-4 py-2 rounded-full border border-green-100">
              ✅ 100% gratis — sin letra chica
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1]">
              ¿A dónde se fue<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">
                tu sueldo este mes?
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
              La app argentina para controlar gastos, cuotas y ahorros. Tus datos guardados en la nube — nunca los perdés, desde cualquier dispositivo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="bg-black text-white text-lg font-bold py-4 px-8 rounded-2xl hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2">
                Empezar gratis <ArrowRight size={20}/>
              </Link>
              <Link href="/faq" className="text-slate-600 text-lg font-bold py-4 px-8 rounded-2xl hover:bg-slate-50 transition-all border-2 border-slate-100 flex items-center justify-center">
                ¿Cómo funciona?
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">$0</p>
                <p className="text-xs text-slate-400 font-medium">Costo mensual</p>
              </div>
              <div className="w-px h-10 bg-slate-100"/>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">∞</p>
                <p className="text-xs text-slate-400 font-medium">Transacciones</p>
              </div>
              <div className="w-px h-10 bg-slate-100"/>
              <div className="text-center">
                <p className="text-2xl font-black text-slate-900">☁️</p>
                <p className="text-xs text-slate-400 font-medium">Datos en la nube</p>
              </div>
            </div>
          </div>

          {/* Mockup dashboard — sin imagen externa */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-violet-100 rounded-[3rem] blur-2xl opacity-60 scale-110"/>
            <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">

              {/* Header mockup */}
              <div className="flex justify-between items-center">
                <p className="font-black text-slate-800 text-lg">Tu Dashboard</p>
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">
                  <span className="text-xs font-black text-emerald-700">💵 Dólar Blue $1.435</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'INGRESOS', val: '$350.000', color: 'text-slate-800' },
                  { label: 'GASTASTE', val: '$180.000', color: 'text-red-500' },
                  { label: 'TE QUEDAN', val: '$170.000', color: 'text-emerald-600' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className={`text-base font-black ${s.color}`}>{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Barra progreso */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-black text-slate-600">🎯 Meta: Zapatillas</span>
                  <span className="text-xs font-bold text-emerald-600">72%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="h-2 bg-emerald-500 rounded-full" style={{width:'72%'}}/>
                </div>
              </div>

              {/* Transacciones */}
              <div className="space-y-2">
                {[
                  { desc: 'Supermercado', cat: '🛒', monto: '-$45.000', color: 'text-red-500' },
                  { desc: 'Sueldo Mayo', cat: '💰', monto: '+$350.000', color: 'text-emerald-600' },
                  { desc: 'Netflix • 6 cuotas', cat: '🍿', monto: '-$4.500', color: 'text-red-500' },
                ].map(tx => (
                  <div key={tx.desc} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{tx.cat}</span>
                      <p className="text-xs font-bold text-slate-700">{tx.desc}</p>
                    </div>
                    <span className={`text-xs font-black ${tx.color}`}>{tx.monto}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIAL vs competencia */}
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-4">¿Por qué EnQueGasto?</p>
          <h2 className="text-3xl md:text-4xl font-black mb-12">Otras apps cobran. Nosotros no.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '☁️', title: 'Datos en la nube', desc: 'Tu historial guardado seguro. Cambiá de celular, de navegador o de PC — todo sigue ahí.' },
              { icon: '🔒', title: 'Nunca perdés nada', desc: 'Otras apps guardan en el navegador. Si borrás el caché, perdiste todo. Con nosotros, imposible.' },
              { icon: '🇦🇷', title: 'Hecho para Argentina', desc: 'Dólar blue en tiempo real, cuotas con tarjeta, IPC para calcular si conviene financiar.' },
            ].map(f => (
              <div key={f.title} className="bg-slate-800 rounded-3xl p-6 border border-slate-700 text-left">
                <span className="text-3xl mb-4 block">{f.icon}</span>
                <h3 className="font-black text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Todo lo que necesitás</h2>
            <p className="text-slate-500 text-lg">Diseñado para la economía argentina. Simple y directo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <CreditCard size={22}/>, color: 'bg-blue-100 text-blue-600', title: 'Control de cuotas', desc: 'Cargá una compra en cuotas y la app te muestra cuánto te descuenta cada mes automáticamente.' },
              { icon: <PieChart size={22}/>, color: 'bg-violet-100 text-violet-600', title: 'Regla 50/30/20', desc: 'Visualizá si tus gastos van a necesidades, deseos o ahorro. El balance perfecto en un vistazo.' },
              { icon: <TrendingDown size={22}/>, color: 'bg-orange-100 text-orange-600', title: '¿Conviene financiar?', desc: 'Calculadora de inflación integrada: te dice si te conviene pagar en cuotas o al contado.' },
              { icon: <Target size={22}/>, color: 'bg-emerald-100 text-emerald-600', title: 'Metas de ahorro', desc: 'Creá metas con submetas (zapatillas, viaje, celu) y seguí tu progreso mes a mes.' },
              { icon: <Cloud size={22}/>, color: 'bg-cyan-100 text-cyan-600', title: 'Multi-dispositivo', desc: 'Entrá desde el celu, la compu o cualquier browser. Tus datos siempre sincronizados.' },
              { icon: <Heart size={22}/>, color: 'bg-pink-100 text-pink-600', title: '100% gratuito', desc: 'Sin planes, sin límites, sin tarjeta. Si te ayuda y querés apoyar, hay un botón de donación.' },
            ].map(f => (
              <div key={f.title} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <div className={`w-11 h-11 ${f.color} rounded-2xl flex items-center justify-center mb-5`}>{f.icon}</div>
                <h3 className="text-lg font-black mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DONACIÓN */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-4xl block mb-4">☕</span>
          <h2 className="text-3xl font-black mb-4">¿Te está siendo útil?</h2>
          <p className="text-slate-500 text-lg mb-8 leading-relaxed">
            EnQueGasto es y va a seguir siendo gratis. Si querés bancarnos para que sigamos mejorándola, podés invitarnos un café. No es obligatorio, pero se agradece mucho.
          </p>
          <a href="https://cafecito.app" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#09f] text-white font-black text-lg py-4 px-10 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-sky-200">
            ☕ Invitarnos un cafecito
          </a>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-black text-white py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Empezá hoy.<br/>Es gratis.</h2>
          <p className="text-slate-400 text-lg mb-10">Sin tarjeta. Sin prueba gratis de 14 días. Sin trampa. Gratis para siempre.</p>
          <Link href="/login" className="inline-flex items-center gap-3 bg-white text-black font-black text-xl py-5 px-12 rounded-2xl hover:bg-slate-100 transition-all shadow-2xl">
            Crear mi cuenta gratis <ArrowRight size={24}/>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}