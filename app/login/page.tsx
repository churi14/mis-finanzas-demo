"use client";

import Link from 'next/link';
import { Wallet, ArrowLeft, Mail, Lock, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para alternar entre "Iniciar Sesión" y "Registrarse"
  const [isSignUp, setIsSignUp] = useState(false);

  // 1. LÓGICA GOOGLE
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    });
    if (error) alert(error.message);
    setLoading(false);
  };

  // 2. LÓGICA EMAIL (LOGIN Y REGISTRO)
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      // REGISTRO
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        alert('Error al registrarse: ' + error.message);
      } else {
        alert('¡Registro exitoso! Ya podés iniciar sesión.');
        setIsSignUp(false); // Lo mandamos al login
      }
    } else {
      // LOGIN
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert('Error al ingresar: ' + error.message);
      } else {
        router.push('/dashboard'); // Si sale bien, lo mandamos al dashboard
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Lado Izquierdo */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
        <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-black flex items-center gap-2 text-sm font-bold transition-colors">
          <ArrowLeft size={16}/> Volver
        </Link>

        <div className="max-w-sm mx-auto w-full">
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xl font-black tracking-tight mb-6">
              <div className="bg-black text-white p-1.5 rounded-lg"><Wallet size={20} /></div> 
              EnQuéGasto
            </div>
            <h1 className="text-3xl font-black mb-2">
              {isSignUp ? 'Crear cuenta' : 'Bienvenido de nuevo'}
            </h1>
            <p className="text-slate-500">
              {isSignUp ? 'Empezá a controlar tus finanzas hoy.' : 'Ingresá para ver tus gastos.'}
            </p>
          </div>

          <div className="space-y-4">
            {/* BOTÓN GOOGLE */}
            <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border-2 border-slate-100 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                <span>Continuar con Google</span>
            </button>
            
            <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink-0 mx-4 text-slate-300 text-xs uppercase font-bold">O con tu email</span>
                <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* FORMULARIO EMAIL */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
                <div className="relative">
                    <input 
                      type="email" 
                      placeholder="tu@email.com" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 outline-none focus:ring-2 focus:ring-black transition-all font-medium text-sm"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18}/></div>
                </div>
                <div className="relative">
                    <input 
                      type="password" 
                      placeholder="Contraseña" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pl-12 outline-none focus:ring-2 focus:ring-black transition-all font-medium text-sm"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18}/></div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="animate-spin" size={20} />}
                  {isSignUp ? 'Registrarme' : 'Ingresar'}
                </button>
            </form>

            {/* TOGGLE REGISTRO/LOGIN */}
            <div className="text-center pt-2">
                <button 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-sm text-slate-500 hover:text-black transition-colors"
                >
                  {isSignUp ? '¿Ya tenés cuenta? ' : '¿No tenés cuenta? '}
                  <span className="font-bold underline">{isSignUp ? 'Iniciá Sesión' : 'Registrate gratis'}</span>
                </button>
            </div>

          </div>
        </div>
      </div>

      {/* Lado Derecho (Imagen) */}
      <div className="hidden md:block w-1/2 bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-gradient-to-tr from-blue-600 to-violet-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center p-16">
            <h2 className="text-4xl font-black text-slate-900 mb-6">Tu economía,<br/>bajo control.</h2>
            <p className="text-lg text-slate-500 max-w-md">La plataforma más simple para organizar tus gastos en Argentina.</p>
        </div>
      </div>
    </div>
  );
}