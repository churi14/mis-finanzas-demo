"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  // Estado para saber cuál pregunta está abierta
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿Es gratis de verdad? ¿O después me cobran?",
      answer: "Es 100% gratis. No hay versiones 'Premium' ocultas, ni límites en la cantidad de gastos que podés cargar, ni letra chica. Nuestro objetivo es ayudarte a ordenar tus números sin que te cueste un peso."
    },
    {
      question: "¿Tengo que poner las claves de mi banco o tarjeta?",
      answer: "¡No, nunca! EnQuéGasto funciona con carga manual. Vos anotás lo que gastaste. Nunca te vamos a pedir datos sensibles como números de tarjeta completos, CBU, ni contraseñas bancarias. Tu seguridad es lo primero."
    },
    {
      question: "¿Cómo funciona el sistema de cuotas?",
      answer: "Es nuestra función estrella. Cuando cargás un gasto (ej: una TV en 12 cuotas), el sistema automáticamente proyecta ese gasto en los meses siguientes. Así, cuando entres en marzo o abril, ya vas a ver impactada la cuota que te corresponde pagar, ayudándote a no pasarte del presupuesto."
    },
    {
      question: "¿Puedo usarlo desde el celular?",
      answer: "¡Sí! Aunque no estamos en el App Store, nuestra web está diseñada como una App Progresiva (PWA). Podés entrar desde Chrome o Safari en tu celu y funciona perfecto. Tip: Agregala a tu pantalla de inicio para entrar más rápido."
    },
    {
      question: "¿Quiénes hacen esto y qué ganan?",
      answer: "Somos En Red Consultora, un equipo de desarrolladores de Buenos Aires. Creamos esta herramienta porque nosotros mismos la necesitábamos para ordenar nuestras finanzas en Argentina. Por ahora, el proyecto se mantiene gracias a nuestro otro trabajo de consultoría."
    },
    {
      question: "¿Mis datos están seguros?",
      answer: "Totalmente. Usamos Supabase, una plataforma de nivel mundial que encripta tus datos. Además, configuramos reglas de privacidad estrictas: nadie puede ver tus gastos excepto vos (ni siquiera otros usuarios registrados)."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Encabezado */}
        <section className="bg-slate-50 py-20 px-6 text-center border-b border-gray-100">
            <div className="inline-block bg-blue-100 text-blue-700 p-3 rounded-2xl mb-4">
                <HelpCircle size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Preguntas Frecuentes</h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Todo lo que necesitás saber sobre EnQuéGasto. Si tenés otra duda, siempre podés escribirnos.
            </p>
        </section>

        {/* Lista de Preguntas */}
        <section className="max-w-3xl mx-auto px-6 py-16">
            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        className={`border rounded-2xl transition-all duration-300 overflow-hidden ${openIndex === index ? 'border-blue-200 bg-blue-50/30 shadow-md' : 'border-gray-100 hover:border-gray-200'}`}
                    >
                        <button 
                            onClick={() => toggleFAQ(index)}
                            className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                        >
                            <span className={`font-bold text-lg ${openIndex === index ? 'text-blue-700' : 'text-slate-800'}`}>
                                {faq.question}
                            </span>
                            {openIndex === index ? (
                                <ChevronUp className="text-blue-600 flex-shrink-0" />
                            ) : (
                                <ChevronDown className="text-gray-400 flex-shrink-0" />
                            )}
                        </button>
                        
                        <div 
                            className={`px-6 text-slate-600 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            {faq.answer}
                        </div>
                    </div>
                ))}
            </div>

            {/* Call to Action Final */}
            <div className="mt-16 text-center bg-black text-white rounded-3xl p-10 md:p-16 relative overflow-hidden">
                <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black mb-4">¿Listo para ordenar tus números?</h3>
                    <p className="text-slate-300 mb-8 max-w-md mx-auto">No necesitás tarjeta de crédito ni conocimientos contables. Empezá ahora.</p>
                    <a href="/dashboard" className="inline-block bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-gray-100 transition-colors">
                        Crear mi cuenta gratis
                    </a>
                </div>
                {/* Decoración de fondo */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
            </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}