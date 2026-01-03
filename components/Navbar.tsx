"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Verificamos si hay sesión al cargar la página
  useEffect(() => {
    // 1. Obtener sesión actual
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    // 2. Escuchar cambios (si se loguea o desloguea)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          FinanzasApp
        </Link>

        {/* MENU DERECHA */}
        <div className="flex items-center gap-4">
          {user ? (
            // SI ESTÁ LOGUEADO
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                <User size={14} />
                <span className="hidden sm:inline">{user.email}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            // SI NO ESTÁ LOGUEADO (MODO GUEST)
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded">
                Modo Demo
              </span>
              <Link 
                href="/login"
                className="px-4 py-2 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all"
              >
                Ingresar
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}