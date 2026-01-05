import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <main className="flex-grow py-20 px-6">
        <div className="max-w-3xl mx-auto">
            
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-black font-bold text-sm mb-8 transition-colors">
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            <h1 className="text-4xl font-black mb-2 tracking-tight flex items-center gap-3">
                Política de Cookies <Cookie className="text-amber-600" size={32}/>
            </h1>
            
            <div className="mt-12 space-y-8 text-slate-700 leading-relaxed">
                <p className="text-xl">
                    En EnQuéGasto nos gustan las galletitas, pero las digitales las usamos poco.
                </p>

                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-black mb-2">🍪 ¿Qué cookies usamos?</h3>
                    <p>Únicamente utilizamos <strong>cookies técnicas y esenciales</strong> proveídas por Supabase. Estas son pequeños archivos necesarios para saber que sos vos cuando iniciás sesión y mantener tu cuenta abierta de forma segura mientras navegás.</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-black mb-2">🚫 Lo que NO hacemos</h3>
                    <p>No usamos cookies de rastreo publicitario, ni píxeles de Facebook, ni vendemos tu historial de navegación a terceros. Tu privacidad es nuestra prioridad.</p>
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}