// src/components/dashboard/StatsCards.tsx
"use client";
import { DollarSign, ArrowRight, AlertCircle, Wallet, Plus } from 'lucide-react';
import { IncomeSource } from '@/types/dashboard';

const formatMoney = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

interface Props {
  totalIncome: number;
  gastosDelMes: number;
  gastosDeAhorros: number;
  saldoDelMes: number;
  incomes: IncomeSource[];
  onOpenIncomeModal: () => void;
}

export default function StatsCards({ 
  totalIncome, gastosDelMes, gastosDeAhorros, saldoDelMes, 
  incomes, onOpenIncomeModal 
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      
      {/* 1. INGRESOS */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px]">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><DollarSign size={28} /></div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wide">BOLSILLO 1</p>
              <p className="text-sm font-bold text-gray-800 leading-none">INGRESOS DEL MES</p>
            </div>
          </div>
        </div>
        <div className="relative pl-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{formatMoney(totalIncome)}</p>
            <button onClick={onOpenIncomeModal} className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-md">
              <Plus size={16} /> Sumar
            </button>
          </div>
          {/* ETIQUETAS AZULES */}
          <div className="flex flex-wrap gap-2 mt-3">
            {incomes.map(inc => (
              <span key={inc.id} className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 uppercase truncate max-w-[100px]">
                {inc.desc}
              </span>
            ))}
            {incomes.length === 0 && <span className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-1 rounded">Sin ingresos</span>}
          </div>
        </div>
      </div>

      {/* 2. GASTOS (CON ALERTA NARANJA) */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px]">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-2xl text-red-600"><ArrowRight size={28} className="rotate-[-45deg]" /></div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-wide">SALIDAS</p>
              <p className="text-sm font-bold text-gray-800 leading-none">YA GASTASTE</p>
            </div>
          </div>
        </div>
        <div className="pl-1">
          <p className="text-4xl font-extrabold text-gray-900 tracking-tight">{formatMoney(gastosDelMes + gastosDeAhorros)}</p>
          
          {/* ALERTA VISUAL */}
          {gastosDeAhorros > 0 && (
            <p className="text-xs text-orange-600 mt-3 font-bold flex items-center gap-1 bg-orange-50 inline-block px-3 py-1.5 rounded-lg border border-orange-100">
              <AlertCircle size={14}/> Ojo: {formatMoney(gastosDeAhorros)} salieron de ahorros
            </p>
          )}
        </div>
      </div>

      {/* 3. RESULTADO */}
      <div className="bg-white p-6 rounded-3xl shadow-xl border border-green-100 flex flex-col justify-between relative overflow-hidden min-h-[160px]">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-50 rounded-2xl text-green-600"><Wallet size={28} /></div>
              <div>
                <p className="text-xs font-black text-green-300 uppercase tracking-wide">RESULTADO</p>
                <p className="text-sm font-bold text-gray-800 leading-none">TE SOBRAN HOY</p>
              </div>
            </div>
          </div>
          <div className="pl-1">
            <p className={`text-4xl font-extrabold tracking-tight ${saldoDelMes >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {formatMoney(saldoDelMes)}
            </p>
            <p className="text-xs text-gray-400 mt-2 font-medium">De tus ingresos de este mes</p>
          </div>
        </div>
        <div className="absolute inset-0 bg-green-50/50 -z-10"></div>
      </div>
    </div>
  );
}