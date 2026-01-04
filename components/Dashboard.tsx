"use client";

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Wallet, Settings, Calendar, X, Plus, DollarSign, Clock, Trash2, TrendingUp } from 'lucide-react';
import { Transaction, IncomeSource } from '@/types/dashboard';

// Importamos los componentes (Incluido el NUEVO AddSavingsModal)
import StatsCards from './dashboard/StatsCards';
import TransactionInput from './dashboard/TransactionInput';
import TransactionList from './dashboard/TransactionList';
import ChartsSection from './dashboard/ChartsSection';
import EditTransactionModal from './dashboard/EditTransactionModal';
import AddSavingsModal from './dashboard/AddSavingsModal'; // <--- IMPORTANTE

// UTILS
const formatMoney = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);
const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
};

// DATOS INICIALES
const MOCK_INCOMES_LIST: IncomeSource[] = [
  { id: 1, date: new Date().toISOString(), desc: 'Sueldo Principal', amount: 850000 },
];
const MOCK_DB_TRANSACTIONS: Transaction[] = [
  { id: 1, date: new Date().toISOString(), desc: 'Coto Semanal', amount: 45000, source: 'mes', categoryId: 'super' },
];

export default function Dashboard() {
  const [config, setConfig] = useState({ frequency: 'mensual', startDay: 1 });
  const [viewDate, setViewDate] = useState(new Date()); 
  
  // MODALES
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showSavingsModal, setShowSavingsModal] = useState(false); // <--- NUEVO ESTADO
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // DATOS
  const [incomes, setIncomes] = useState<IncomeSource[]>(MOCK_INCOMES_LIST);
  const [dbTransactions, setDbTransactions] = useState<Transaction[]>(MOCK_DB_TRANSACTIONS); 
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]); 
  const [newIncome, setNewIncome] = useState({ desc: '', amount: '' });

  // AHORROS
  const [savingsBalance, setSavingsBalance] = useState(320000); 

  // LOGICA PERIODOS
  const period = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const day = viewDate.getDate();
    let start, end, label;

    if (config.frequency === 'mensual') {
        start = new Date(year, month, config.startDay);
        end = new Date(year, month + 1, config.startDay - 1);
        const startStr = start.toLocaleString('es-ES', { day: 'numeric', month: 'short' });
        const endStr = end.toLocaleString('es-ES', { day: 'numeric', month: 'short' });
        label = `${startStr} - ${endStr}`;
    } else {
        const firstLimit = config.startDay + 14; 
        if (day >= config.startDay && day <= firstLimit) {
            start = new Date(year, month, config.startDay);
            end = new Date(year, month, firstLimit);
            label = `1ª Quincena ${start.toLocaleString('es-ES', { month: 'long' })}`;
        } else {
            start = new Date(year, month, firstLimit + 1);
            end = new Date(year, month + 1, config.startDay - 1);
            label = `2ª Quincena ${start.toLocaleString('es-ES', { month: 'long' })}`;
        }
    }
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    return { label, start, end };
  }, [viewDate, config]);

  // FILTRO
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

  // CALCULOS
  const totalSavingsSpentHistory = useMemo(() => {
    return dbTransactions
      .filter(t => t.source === 'ahorro')
      .reduce((acc, t) => {
        const multiplier = t.installmentData ? t.installmentData.count : 1;
        return acc + (t.amount * multiplier);
      }, 0);
  }, [dbTransactions]);

  const saldoAcumuladoFinal = savingsBalance - totalSavingsSpentHistory;

  // HANDLERS
  const changePeriod = (inc: number) => { 
      const d = new Date(viewDate);
      if (config.frequency === 'mensual') d.setMonth(d.getMonth() + inc); 
      else d.setDate(d.getDate() + (inc * 16)); 
      setViewDate(d); 
  };
  const jumpToDate = (m: number, y: number) => setViewDate(new Date(y, m, config.startDay));

  const handleUpdateTransaction = (updatedTx: Transaction) => {
    const newDb = dbTransactions.map(tx => (tx.id === updatedTx.id ? updatedTx : tx));
    setDbTransactions(newDb);
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: number) => {
      setDbTransactions(dbTransactions.filter(tx => tx.id !== id));
  };

  const handleAddTransaction = (newTxData: any) => {
      const txDate = new Date(viewDate);
      const now = new Date();
      if (txDate.getMonth() === now.getMonth()) {
          txDate.setDate(now.getDate());
      } else {
          txDate.setDate(period.start.getDate());
      }

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

  // NUEVA FUNCIÓN AHORROS (Usa el Modal)
  const handleAddSavings = (amount: number) => {
      setSavingsBalance(prev => prev + amount);
  };

  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0); 
  const gastosDelMes = filteredTransactions.filter(t => t.source === 'mes').reduce((acc, t) => acc + t.amount, 0);
  const gastosDeAhorros = filteredTransactions.filter(t => t.source === 'ahorro').reduce((acc, t) => acc + t.amount, 0);
  const saldoDelMes = totalIncome - gastosDelMes;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 text-gray-800 flex flex-col md:flex-row font-sans relative">
      
      {/* MODAL NUEVO AHORROS */}
      {showSavingsModal && (
        <AddSavingsModal 
            onClose={() => setShowSavingsModal(false)}
            onAdd={handleAddSavings}
        />
      )}

      {/* MODAL CONFIG */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-md transition-all">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                <div className="bg-gray-50 p-6 border-b border-gray-100">
                    <h3 className="font-black text-xl text-gray-900 tracking-tight">Configurar Ciclo</h3>
                    <p className="text-xs text-gray-500 mt-1 font-medium">Define cómo se agrupan tus finanzas</p>
                </div>
                <div className="p-6 space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Frecuencia</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setConfig({...config, frequency: 'mensual'})} className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${config.frequency === 'mensual' ? 'border-black bg-gray-900 text-white shadow-lg scale-105' : 'border-gray-100 text-gray-400 hover:border-gray-300 hover:bg-gray-50'}`}>
                                <Calendar size={20} /><span className="text-sm font-bold">Mensual</span>
                            </button>
                            <button onClick={() => setConfig({...config, frequency: 'quincenal'})} className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${config.frequency === 'quincenal' ? 'border-black bg-gray-900 text-white shadow-lg scale-105' : 'border-gray-100 text-gray-400 hover:border-gray-300 hover:bg-gray-50'}`}>
                                <div className="flex gap-0.5"><div className="w-1 h-3 bg-current rounded-full"></div><div className="w-1 h-3 bg-current rounded-full opacity-50"></div></div><span className="text-sm font-bold">Quincenal</span>
                            </button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Día de Inicio</label>
                        <div className="relative">
                            <input type="number" min="1" max="31" value={config.startDay} onChange={(e) => setConfig({...config, startDay: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-lg font-bold rounded-xl p-4 outline-none focus:ring-2 focus:ring-black transition-all pl-12" />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Calendar size={18} /></div>
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">del mes</span>
                        </div>
                    </div>
                </div>
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                    <button onClick={() => setShowConfigModal(false)} className="flex-1 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-white hover:text-gray-800 transition-colors">Cancelar</button>
                    <button onClick={() => setShowConfigModal(false)} className="flex-1 py-3.5 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all transform hover:-translate-y-0.5">Guardar</button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL EDICIÓN */}
      {editingTransaction && (
        <EditTransactionModal 
            transaction={editingTransaction} 
            onClose={() => setEditingTransaction(null)}
            onSave={handleUpdateTransaction}
        />
      )}

      {/* MODAL INGRESOS */}
      {showIncomeModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
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

      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 flex flex-col p-6 hidden md:flex">
        <div className="flex items-center gap-2 mb-10 text-gray-900 font-black text-2xl tracking-tight">
          <div className="bg-black text-white p-1.5 rounded-lg"><Wallet size={20} /></div> 
          FINANZAS<span className="text-blue-600">PRO</span>
        </div>

        {/* TARJETA MIS AHORROS */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-3xl mb-6 shadow-xl relative overflow-hidden border border-slate-700">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-2 rounded-full"><TrendingUp size={16} className="text-yellow-400" /></div>
                    <p className="text-sm font-bold text-slate-200 uppercase tracking-wider">MIS AHORROS</p>
                </div>
                
                {/* BOTON DE AGREGAR AHORROS (ACTIVA EL NUEVO MODAL) */}
                <button 
                    onClick={() => setShowSavingsModal(true)} 
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-xl text-white transition-all flex items-center justify-center backdrop-blur-sm" 
                    title="Ingresar Dinero"
                >
                    <Plus size={18} />
                </button>
            </div>
            <p className="text-3xl font-extrabold mb-1 tracking-tight">{formatMoney(saldoAcumuladoFinal)}</p>
            <p className="text-[10px] text-slate-400 font-medium mb-6">Plata acumulada histórica</p>
            <div className="pt-4 border-t border-slate-700/50">
                <button className="w-full py-2.5 rounded-xl bg-slate-800 border border-slate-600 text-slate-300 text-xs font-bold uppercase tracking-wider hover:bg-slate-700 transition-colors mb-2 cursor-not-allowed opacity-80">Próximamente</button>
                <p className="text-[10px] text-center text-slate-500 font-medium">¿En qué invierto mis ahorros?</p>
            </div>
          </div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-500 opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
        </div>

        {/* CONFIGURACIÓN CICLO */}
        <div className="bg-gray-50 p-5 rounded-2xl mt-auto border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">TU CICLO</p>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-gray-500"/>
            <span className="text-base font-bold capitalize text-gray-700">{config.frequency}</span>
          </div>
          <button onClick={() => setShowConfigModal(true)} className="text-xs text-blue-600 font-bold mt-3 hover:underline flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-full w-fit"><Settings size={14} /> Modificar</button>
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

        {/* 4. LISTA */}
        <TransactionList 
            transactions={filteredTransactions} 
            onEdit={(tx) => setEditingTransaction(tx)} 
            onDelete={handleDeleteTransaction}
        />

      </main>
    </div>
  );
}