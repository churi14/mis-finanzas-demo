import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <main className="flex-grow py-20 px-6">
        <div className="max-w-3xl mx-auto">
            
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-black font-bold text-sm mb-8 transition-colors">
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            <h1 className="text-4xl font-black mb-2 tracking-tight">Términos de Uso</h1>
            <p className="text-slate-500 mb-12">Al usar EnQuéGasto, aceptás estas reglas.</p>

            <div className="space-y-8 text-slate-700 leading-relaxed">
                <section>
                    <h3 className="font-bold text-xl text-black mb-3">1. Naturaleza del Servicio</h3>
                    <p>EnQuéGasto es una herramienta de autogestión financiera. No somos un banco, ni asesores financieros, ni contadores. La información que provee la aplicación se basa exclusivamente en los datos que vos cargás.</p>
                </section>

                <section>
                    <h3 className="font-bold text-xl text-black mb-3">2. Responsabilidad del Usuario</h3>
                    <p>Sos responsable de mantener la confidencialidad de tu cuenta de Google y de los datos que ingresás. EnQuéGasto no se hace responsable por errores en la carga de datos que lleven a cálculos incorrectos de tus finanzas.</p>
                </section>

                <section>
                    <h3 className="font-bold text-xl text-black mb-3">3. Disponibilidad</h3>
                    <p>Nos esforzamos por mantener el servicio activo 24/7, pero al ser un proyecto gratuito mantenido por <strong>En Red Consultora</strong>, no garantizamos una disponibilidad del 100% libre de interrupciones o mantenimiento.</p>
                </section>

                <section>
                    <h3 className="font-bold text-xl text-black mb-3">4. Propiedad Intelectual</h3>
                    <p>El diseño, código fuente y la marca "EnQuéGasto" son propiedad de sus desarrolladores. No está permitido copiar, modificar o revender esta plataforma sin autorización escrita.</p>
                </section>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}