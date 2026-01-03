// src/components/Dashboard.tsx
"use client";

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Wallet, Settings, Calendar, X, Plus, DollarSign, Clock, Trash2 } from 'lucide-react';
import { Transaction, IncomeSource } from '@/types/dashboard';

import StatsCards from './dashboard/StatsCards';
import TransactionInput from './dashboard/TransactionInput';
import TransactionList from './dashboard/TransactionList';
import ChartsSection from './dashboard/ChartsSection';
import EditTransactionModal from './dashboard/EditTransactionModal'; // <--- NUEVO

const formatMoney = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });

const MOCK_INCOMES_LIST: IncomeSource[] = [
  { id: 1, date: '2025-01-05T10:00:00', desc: 'Sueldo Principal', amount: 850000 },
];
const MOCK_DB_TRANSACTIONS: Transaction[] = [
  { id: 1, date: '2025-01-10', desc: 'Coto Semanal', amount: 45000, source: 'mes', categoryId: 'super' },
];

export default function Dashboard() {
  const [config, setConfig] = useState({ frequency: 'mensual', startDay: 1 });
  const [viewDate, setViewDate] = useState(new Date()); 
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  
  // Estado para la edición
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const [incomes, setIncomes] = useState<IncomeSource[]>(MOCK_INCOMES_LIST);
  const [dbTransactions, setDbTransactions] = useState<Transaction[]>(MOCK_DB_TRANSACTIONS); 
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]); 
  const [previousBalance, setPreviousBalance] = useState(320000); 
  const [newIncome, setNewIncome] = useState({ desc: '', amount: '' });

  // ... (El resto de la lógica de fechas period y useEffects se mantiene igual que antes)
  const period = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    let start, end, label;
    start = new Date(year, month, config.startDay);
    end = new Date(year, month + 1, config.startDay - 1);
    end.setHours(23, 59, 59);
    if (config.startDay > 1) end.setMonth(end.getMonth() + 1);
    label = `${start.getDate()} ${start.toLocaleString('es-ES', { month: 'short' })} - ${end.getDate()} ${end.toLocaleString('es-ES', { month: 'short' })}`;
    return { label, start, end };
  }, [viewDate, config]);

  useEffect(() => {
    const viewTxList: Transaction[] = [];
    dbTransactions.forEach(tx => {
        const txDate = new Date(tx.date);
        txDate.setHours(12,0,0);
        if (!tx.isInstallment) {
            if (txDate >= period.start && txDate <= period.end) viewTxList.push(tx);
        } else {
            const count = tx.installmentData?.count || 1;
            for (let i = 0; i < count; i++) {
                const installmentDate = new Date(txDate);
                installmentDate.setMonth(installmentDate.getMonth() + i);
                if (installmentDate >= period.start && installmentDate <= period.end) {
                    viewTxList.push({ ...tx, id: Number(`${tx.id}${i}`), currentInstallment: i + 1, date: installmentDate.toISOString() });
                }
            }
        }
    });
    setFilteredTransactions(viewTxList);
  }, [viewDate, period, dbTransactions]);

  const changePeriod = (inc: number) => { const d = new Date(viewDate); d.setMonth(d.getMonth() + inc); setViewDate(d); };
  const jumpToDate = (m: number, y: number) => setViewDate(new Date(y, m, 1));

  // --- LOGICA DE ACTUALIZACION ---
  const handleUpdateTransaction = (updatedTx: Transaction) => {
    // Si editamos un gasto, actualizamos la "Base de Datos" en memoria
    const newDb = dbTransactions.map(tx => {
        // En este ejemplo simple, si el ID coincide, actualizamos
        // Nota: Esto funciona perfecto para gastos normales.
        // Para cuotas, como son virtuales, se necesita lógica más compleja de backend.
        // Aquí asumimos edición simple visual.
        if (tx.id === updatedTx.id) return updatedTx;
        return tx;
    });
    setDbTransactions(newDb);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: number) => {
      setDbTransactions(dbTransactions.filter(tx => tx.id !== id));
  };

  const handleAddTransaction = (newTxData: any) => {
      const txDate = new Date(viewDate);
      txDate.setDate(new Date().getDate());
      const amount = Number(newTxData.amount);
      const isCredit = newTxData.isCredit;
      const installments = Number(newTxData.installments);
      const newTransaction: Transaction = {
          id: Date.now(), date: txDate.toISOString(), desc: newTxData.desc,
          amount: isCredit ? (amount / installments) : amount, 
          source: isCredit ? 'mes' : newTxData.source, 
          categoryId: newTxData.categoryId,
          isInstallment: isCredit && installments > 1,
          installmentData: isCredit && installments > 1 ? { totalAmount: amount, count: installments, bank: newTxData.bank || 'Banco', brand: newTxData.brand } : undefined
      };
      setDbTransactions([...dbTransactions, newTransaction]);
  };

  const addIncome = () => {
    if(!newIncome.desc || !newIncome.amount) return;
    setIncomes([...incomes, { id: Date.now(), date: new Date().toISOString(), desc: newIncome.desc, amount: Number(newIncome.amount)}]);
    setNewIncome({desc:'', amount:''});
  };
  const removeIncome = (id: number) => setIncomes(incomes.filter(i => i.id !== id));

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0); 
  const gastosDelMes = filteredTransactions.filter(t => t.source === 'mes').reduce((acc, t) => acc + t.amount, 0);
  const gastosDeAhorros = filteredTransactions.filter(t => t.source === 'ahorro').reduce((acc, t) => acc + t.amount, 0);
  const saldoDelMes = totalIncome - gastosDelMes;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 text-gray-800 flex flex-col md:flex-row font-sans relative">
      
      {/* MODAL EDICIÓN */}
      {editingTransaction && (
        <EditTransactionModal 
            transaction={editingTransaction} 
            onClose={() => setEditingTransaction(null)}
            onSave={handleUpdateTransaction}
        />
      )}

      {/* MODAL INGRESOS (Mismo código de antes...) */}
      {showIncomeModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                {/* ... Contenido del modal ... */}
                <div className="bg-black text-white p-5 flex justify-between items-center">
                  <div><h3 className="font-bold text-xl flex items-center gap-2">Mis Ingresos</h3></div>
                  <button onClick={() => setShowIncomeModal(false)} className="hover:text-gray-300"><X size={20}/></button>
                </div>
                <div className="p-6">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6">
                        <div className="flex gap-2 mb-2">
                            <input className="flex-1 p-3 rounded-xl border border-blue-200 text-sm outline-none" placeholder="Descripción" value={newIncome.desc} onChange={(e)=>setNewIncome({...newIncome, desc:e.target.value})}/>
                            <input className="w-32 p-3 rounded-xl border border-blue-200 text-sm outline-none font-bold" type="number" placeholder="$" value={newIncome.amount} onChange={(e)=>setNewIncome({...newIncome, amount:e.target.value})}/>
                        </div>
                        <button onClick={addIncome} className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold">Confirmar</button>
                    </div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {incomes.map(inc => (
                            <div key={inc.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100"><div className="flex items-center gap-3"><div className="bg-green-50 text-green-600 p-2.5 rounded-xl"><DollarSign size={18} /></div><div><p className="font-bold text-gray-800 text-sm">{inc.desc}</p><p className="text-[11px] text-gray-400 flex items-center gap-1"><Clock size={10}/> {formatDate(inc.date)}</p></div></div><div className="flex items-center gap-3"><span className="font-bold text-gray-900">{formatMoney(inc.amount)}</span><button onClick={() => removeIncome(inc.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16}/></button></div></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* SIDEBAR ... */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 flex flex-col p-6 hidden md:flex">
        <div className="flex items-center gap-2 mb-10 text-gray-900 font-black text-2xl tracking-tight">
          <div className="bg-black text-white p-1.5 rounded-lg"><Wallet size={20} /></div> FINANZAS<span className="text-blue-600">PRO</span>
        </div>
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-3xl mb-6 shadow-xl relative overflow-hidden border border-slate-700">
          <div className="relative z-10"><p className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-2">CAJA DE AHORRO</p><p className="text-3xl font-extrabold mb-1">{formatMoney(previousBalance - gastosDeAhorros)}</p></div>
        </div>
        <div className="bg-gray-50 p-5 rounded-2xl mt-auto border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">TU CICLO</p>
          <div className="flex items-center gap-2 mb-2"><Calendar size={16} className="text-gray-500"/><span className="text-base font-bold capitalize text-gray-700">{config.frequency}</span></div>
          <button className="text-xs text-blue-600 font-bold mt-3 hover:underline flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-full w-fit"><Settings size={14} /> Modificar</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div><h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tu Dashboard</h1></div>
          <div className="flex items-center gap-2 self-center md:self-auto">
            <button onClick={() => changePeriod(-1)} className="p-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-600 shadow-sm"><ChevronLeft size={22} /></button>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-2 min-w-[240px] flex flex-col items-center relative">
               <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">ESTAS VIENDO</span>
               <div className="flex items-center gap-2"><span className="text-xl font-bold text-gray-900 leading-none capitalize">{period.label}</span></div>
               <select className="absolute inset-0 opacity-0 cursor-pointer" value={viewDate.getMonth()} onChange={(e) => jumpToDate(Number(e.target.value), viewDate.getFullYear())}>
                 {Array.from({length: 12}).map((_, i) => (<option key={i} value={i}>{new Date(2025, i, 1).toLocaleString('es-ES', { month: 'long' })}</option>))}
               </select>
            </div>
            <button onClick={() => changePeriod(1)} className="p-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-600 shadow-sm"><ChevronRight size={22} /></button>
          </div>
        </header>

        {/* 1. TARJETAS */}
        <StatsCards 
          totalIncome={totalIncome} 
          gastosDelMes={gastosDelMes} 
          gastosDeAhorros={gastosDeAhorros} 
          saldoDelMes={saldoDelMes}
          incomes={incomes}
          onOpenIncomeModal={() => setShowIncomeModal(true)}
        />

        {/* 2. INPUT DE CARGA */}
        <TransactionInput onAdd={handleAddTransaction} />

        {/* 3. GRÁFICOS */}
        <ChartsSection transactions={filteredTransactions} />

        {/* 4. LISTA (Con Edición) */}
        <TransactionList 
            transactions={filteredTransactions} 
            onEdit={(tx) => setEditingTransaction(tx)} // Pasamos la transacción al estado de edición
            onDelete={handleDeleteTransaction}
        />

      </main>
    </div>
  );
}