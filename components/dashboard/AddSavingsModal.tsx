"use client";
import { useState } from 'react';
import { X, Check, PiggyBank } from 'lucide-react';

interface Props {
  onClose: () => void;
  onAdd: (amount: number) => void;
}

export default function AddSavingsModal({ onClose, onAdd }: Props) {
  const [amountStr, setAmountStr] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Solo permitimos números
    const rawValue = e.target.value.replace(/\D/g, '');
    
    if (!rawValue) {
      setAmountStr('');
      return;
    }

    // Agregamos puntos de mil
    const formatted = new Intl.NumberFormat('es-AR').format(Number(rawValue));
    setAmountStr(formatted);
  };

  const handleSubmit = () => {
    const cleanAmount = Number(amountStr.replace(/\./g, ''));
    if (cleanAmount > 0) {
      onAdd(cleanAmount);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
        
        {/* Cabecera Azul Oscura (Estilo Caja de Ahorro) */}
        <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
            <div className="relative z-10 flex justify-between items-center">
                <h3 className="font-bold text-xl flex items-center gap-2">
                    <PiggyBank className="text-yellow-400" size={24}/> 
                    Ingresar Ahorros
                </h3>
                <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                    <X size={20}/>
                </button>
            </div>
            {/* Decoración de fondo */}
            <div className="absolute right-0 top-0 w-24 h-24 bg-blue-600 opacity-20 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
        </div>

        {/* Cuerpo */}
        <div className="p-8">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">
                ¿Cuánto dinero vas a guardar?
            </label>
            
            <div className="relative mb-8">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-2xl">$</span>
                <input 
                    type="text" 
                    inputMode="numeric"
                    autoFocus
                    value={amountStr} 
                    onChange={handleAmountChange}
                    className="w-full bg-gray-50 border-2 border-gray-100 text-gray-900 text-3xl font-black rounded-2xl p-4 pl-10 outline-none focus:border-blue-500 focus:bg-white transition-all text-center"
                    placeholder="0"
                />
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={onClose}
                    className="flex-1 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    onClick={handleSubmit} 
                    className="flex-1 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex justify-center items-center gap-2"
                >
                    <Check size={20} strokeWidth={3} />
                    Confirmar
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}