import { ArrowUpRight, ArrowDownRight, Wallet, Plus } from 'lucide-react';
import { IncomeSource } from '@/types/dashboard';

interface StatsCardsProps {
  totalIncome: number;
  gastosDelMes: number;
  gastosDeAhorros: number;
  saldoDelMes: number;
  incomes: IncomeSource[];
  onOpenIncomeModal: () => void;
  privacyMode: boolean; // <--- NUEVO PROP
}

const formatMoney = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

export default function StatsCards({ totalIncome, gastosDelMes, gastosDeAhorros, saldoDelMes, incomes, onOpenIncomeModal, privacyMode }: StatsCardsProps) {
  
  // Helper para ocultar valores
  const displayValue = (val: number) => privacyMode ? '****' : formatMoney(val);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      
      {/* 1. INGRESOS (AZUL) */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full group hover:border-blue-200 transition-all">
        <div>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl">
                    <ArrowDownRight size={18} />
                    <p className="text-xs font-black uppercase tracking-wider">INGRESOS</p>
                </div>
                <button onClick={onOpenIncomeModal} className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1 hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200">
                    <Plus size={14} strokeWidth={3}/> <span className="hidden sm:inline">Sumar</span>
                </button>
            </div>
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{displayValue(totalIncome)}</p>
        </div>
        
        <div className="flex-1"></div>

        <div className="pt-4 border-t border-slate-50 min-h-[74px] flex flex-col justify-center">
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {incomes.length > 0 ? incomes.map(inc => (
                    <span key={inc.id} className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 whitespace-nowrap capitalize">
                        {inc.desc}
                    </span>
                )) : (
                    <span className="text-[11px] text-slate-400 font-bold">Sin ingresos registrados</span>
                )}
            </div>
        </div>
      </div>

      {/* 2. GASTOS (ROJO/NARANJA) */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full group hover:border-red-200 transition-all">
        <div>
            <div className="flex items-center gap-2 text-red-500 bg-red-50 px-3 py-1.5 rounded-xl w-fit mb-4">
                <ArrowUpRight size={18} />
                <p className="text-xs font-black uppercase tracking-wider">GASTASTE</p>
            </div>   
            <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                {displayValue(gastosDelMes + gastosDeAhorros)}
            </p>
        </div>

        <div className="flex-1 flex flex-col justify-end mb-4">
             {gastosDeAhorros > 0 && (
                 <div className="mt-4 w-fit bg-orange-50 border border-orange-100 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold animate-in fade-in slide-in-from-bottom-2">
                    Ojo: {displayValue(gastosDeAhorros)} de ahorros
                 </div>
             )}
        </div>

        <div className="pt-4 border-t border-slate-50 min-h-[74px]">
             <p className="text-xs font-bold text-slate-500">
                Salieron de tu sueldo
             </p>
             <p className="text-lg font-black text-slate-700 mt-0.5">
                {displayValue(gastosDelMes)}
             </p>
        </div>
      </div>

      {/* 3. RESULTADO / SALDO (VERDE) */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full group hover:border-green-200 transition-all relative overflow-hidden">
        <div className="relative z-10 flex flex-col h-full">
            <div>
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-xl w-fit mb-4">
                    <Wallet size={18} />
                    <p className="text-xs font-black uppercase tracking-wider">TE QUEDAN</p>
                </div>
                <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                    {displayValue(saldoDelMes)}
                </p>
            </div>
            
            <div className="flex-1"></div>
            
            <div className="pt-4 border-t border-slate-50 min-h-[74px]">
                <p className="text-xs font-bold text-green-600">
                    Disponible del mes
                </p>
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                    (Sin tocar tus ahorros guardados)
                </p>
            </div>
        </div>
        
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-green-50 rounded-full opacity-50 blur-2xl group-hover:bg-green-100 transition-colors pointer-events-none"></div>
      </div>

    </div>
  );
}