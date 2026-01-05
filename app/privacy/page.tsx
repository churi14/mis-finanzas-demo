import Footer from '@/components/Footer';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <main className="flex-grow py-20 px-6">
        <div className="max-w-3xl mx-auto">
            
            {/* Botón Volver */}
            <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-black font-bold text-sm mb-8 transition-colors">
                <ArrowLeft size={16} /> Volver al inicio
            </Link>

            <h1 className="text-4xl font-black mb-2 tracking-tight">Política de Privacidad</h1>
            <p className="text-slate-500 mb-12">Última actualización: Enero 2026</p>

            <div className="space-y-12 text-lg text-slate-700 leading-relaxed">
                
                <section>
                    <div className="flex items-center gap-3 mb-4 text-blue-600 font-bold">
                        <Lock size={24} /> 1. Qué datos recolectamos
                    </div>
                    <p className="mb-4">
                        En <strong>EnQuéGasto</strong>, minimizamos la recolección de datos. Solo guardamos lo estrictamente necesario para que la aplicación funcione:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-blue-500">
                        <li><strong>Información de Cuenta:</strong> Tu email y nombre (provistos por Google) para crear tu perfil.</li>
                        <li><strong>Datos Financieros:</strong> Los ingresos, gastos y ahorros que cargás manualmente.</li>
                        <li><strong>Metadatos:</strong> Fecha y hora de las transacciones para ordenarlas cronológicamente.</li>
                    </ul>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4 text-blue-600 font-bold">
                        <Shield size={24} /> 2. Seguridad de tus datos
                    </div>
                    <p>
                        Tus datos no están guardados en servidores caseros. Utilizamos <strong>Supabase</strong>, una plataforma de infraestructura segura que cumple con estándares internacionales.
                    </p>
                    <p className="mt-4">
                        Además, implementamos reglas de seguridad a nivel base de datos (Row Level Security) que garantizan que <strong>solo vos podés leer o editar tus propios registros</strong>. Ningún otro usuario tiene acceso a tu información.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4 text-blue-600 font-bold">
                        <Eye size={24} /> 3. Uso de la información
                    </div>
                    <p>
                        No vendemos, alquilamos ni compartimos tus datos con terceros ni anunciantes. La información que cargás se usa exclusivamente para:
                    </p>
                    <ul className="list-disc pl-6 mt-4 space-y-2 marker:text-blue-500">
                        <li>Generar tu dashboard y gráficos de gastos.</li>
                        <li>Calcular tus proyecciones de cuotas futuras.</li>
                        <li>Mantener tu sesión iniciada de forma segura.</li>
                    </ul>
                </section>

            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}