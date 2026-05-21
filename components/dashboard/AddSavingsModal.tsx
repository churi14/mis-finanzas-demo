"use client";
import { useState, useEffect } from 'react';
import { X, Check, PiggyBank } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Goal {
  id: number;
  name: string;
  emoji: string;
}

interface Props {
  onClose: () => void;
  onAdd: (amount: number, goalId?: number) => void;
}

export default function AddSavingsModal({ onClose, onAdd }: Props) {
  const [amountStr, setAmountStr] = useState('');
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoalId, setSelectedGoalId] = useState<number | undefined>(undefined);

  useEffect(() => {
    supabase.from('savings_goals').select('id, name, emoji').then(({ data }) => {
      if (data) setGoals(data);
    });
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) { setAmountStr(''); return; }
    setAmountStr(new Intl.NumberFormat('es-AR').format(Number(rawValue)));
  };

  const handleSubmit = () => {
    const cleanAmount = Number(amountStr.replace(/\./g, ''));
    if (cleanAmount > 0) {
      onAdd(cleanAmount, selectedGoalId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden">

        <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
          <div className="relative z-10 flex justify-between items-center">
            <h3 className="font-bold text-xl flex items-center gap-2">
              <PiggyBank className="text-yellow-400" size={24} /> Ingresar Ahorros
            </h3>
            <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-600 opacity-20 rounded-full blur-2xl transform translate-x-10 -translate-y-10" />
        </div>

        <div className="p-8 space-y-6">

          {/* Monto */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 text-center">
              ¿Cuánto vas a guardar?
            </label>
            <div className="relative">
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
          </div>

          {/* Meta */}
          {goals.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                ¿Para qué meta es?
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedGoalId(undefined)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold ${selectedGoalId === undefined ? 'border-slate-900 bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}
                >
                  <span>💰</span> Sin meta específica
                </button>
                {goals.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoalId(g.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-sm font-bold ${selectedGoalId === g.id ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-100 hover:border-slate-200'}`}
                  >
                    <span>{g.emoji}</span> {g.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
            <button onClick={handleSubmit} className="flex-1 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex justify-center items-center gap-2">
              <Check size={20} strokeWidth={3} /> Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}