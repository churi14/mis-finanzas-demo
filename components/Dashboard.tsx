"use client";

import { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, Wallet, TrendingUp, 
  Settings, Plus, Calendar, Edit2, X, Trash2, ArrowRight,
  AlertCircle, DollarSign, Briefcase, Clock, PieChart as PieIcon, BarChart3
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

// --- TIPOS DE DATOS ---
interface Transaction {
  id: number;
  date: string;
  desc: string;
  amount: number;
  source: string; // 'mes' o 'ahorro'
  categoryId: string; // NUEVO
}

interface IncomeSource {
  id: number;
  date: string; 
  desc: string;
  amount: number;
}

interface Category {
  id: string;
  name: string;
  type: 'necesidad' | 'deseo' | 'ahorro';
  color: string;
}

// --- CONFIGURACIÓN DE CATEGORÍAS (PREDEFINIDAS) ---
const CATEGORIES: Category[] = [
  { id: 'super', name: '🛒 Supermercado', type: 'necesidad', color: '#3b82f6' },
  { id: 'vivienda', name: '🏠 Vivienda/Servicios', type: 'necesidad', color: '#0ea5e9' },
  { id: 'transporte', name: '🚗 Transporte', type: 'necesidad', color: '#6366f1' },
  { id: 'salud', name: '💊 Salud', type: 'necesidad', color: '#ec4899' },
  { id: 'comida', name: '🍕 Delivery/Salidas', type: 'deseo', color: '#8b5cf6' },
  { id: 'ocio', name: '🍿 Ocio/Streaming', type: 'deseo', color: '#a855f7' },
  { id: 'compras', name: '🛍️ Ropa/Varios', type: 'deseo', color: '#d946ef' },
  { id: 'educacion', name: '🎓 Educación', type: 'necesidad', color: '#14b8a6' },
  { id: 'otros', name: '📦 Otros', type: 'deseo', color: '#94a3b8' },
];

// --- UTILIDAD: FORMATO MONEDA ---
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
};

// --- MOCKS ---
const MOCK_INCOMES_LIST: IncomeSource[] = [
  { id: 1, date: '2025-01-05T10:00:00', desc: 'Sueldo Principal', amount: 850000 },
];

const ALL_TRANSACTIONS: Transaction[] = [
  { id: 1, date: '2025-01-10', desc: 'Coto Semanal', amount: 45000, source: 'mes', categoryId: 'super' },
  { id: 2, date: '2025-01-12', desc: 'Netflix', amount: 8500, source: 'mes', categoryId: 'ocio' },
  { id: 3, date: '2025-01-15', desc: 'Cambio Cubiertas', amount: 120000, source: 'ahorro', categoryId: 'transporte' },
  { id: 4, date: '2025-01-18', desc: 'Cena con amigos', amount: 25000, source: 'mes', categoryId: 'comida' },
];

export default function Dashboard() {
  const [config, setConfig] = useState({ frequency: 'mensual', startDay: 1 });
  const [viewDate, setViewDate] = useState(new Date(2025, 0, 1)); 
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false); 
  
  const [incomes, setIncomes] = useState<IncomeSource[]>(MOCK_INCOMES_LIST);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [previousBalance, setPreviousBalance] = useState(320000); 

  // FORMULARIO GASTO (Ahora incluye categoryId)
  const [newTx, setNewTx] = useState({ desc: '', amount: '', source: 'mes', categoryId: 'super' });
  const [newIncome, setNewIncome] = useState({ desc: '', amount: '' });

  // --- LÓGICA PERÍODOS ---
  const period = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    let start, end, label;

    if (config.frequency === 'mensual') {
      start = new Date(year, month, config.startDay);
      end = new Date(year, month + 1, config.startDay - 1);
      end.setHours(23, 59, 59);
      const startStr = start.toLocaleString('es-ES', { day: 'numeric', month: 'short' });
      const endStr = end.toLocaleString('es-ES', { day: 'numeric', month: 'short' });
      label = `${startStr} - ${endStr}`;
    } else {
      const day = viewDate.getDate();
      const firstFortnightEnd = config.startDay + 14; 
      if (day <= 15) {
        start = new Date(year, month, config.startDay);
        end = new Date(year, month, firstFortnightEnd);
        end.setHours(23, 59, 59);
        label = `1ª Quincena ${start.toLocaleString('es-ES', { month: 'long' })}`;
      } else {
        start = new Date(year, month, firstFortnightEnd + 1);
        end = new Date(year, month + 1, config.startDay - 1);
        end.setHours(23, 59, 59);
        label = `2ª Quincena ${start.toLocaleString('es-ES', { month: 'long' })}`;
      }
    }
    return { label, start, end };
  }, [viewDate, config]);

  useEffect(() => {
    const txs = ALL_TRANSACTIONS.filter(tx => {
      const txDate = new Date(tx.date);
      txDate.setHours(12,0,0); 
      return txDate >= period.start && txDate <= period.end;
    });
    setFilteredTransactions(txs);
  }, [viewDate, period]);

  const changePeriod = (increment: number) => {
    const newDate = new Date(viewDate);
    if (config.frequency === 'mensual') {
      newDate.setMonth(newDate.getMonth() + increment);
    } else {
      newDate.setDate(newDate.getDate() + (increment * 15));
    }
    setViewDate(newDate);
  };

  const jumpToDate = (monthIndex: number, year: number) => {
    setViewDate(new Date(year, monthIndex, 1));
  };

  const addIncome = () => {
    if (!newIncome.desc || !newIncome.amount) return;
    const newEntry: IncomeSource = { 
        id: Date.now(), 
        date: new Date().toISOString(),
        desc: newIncome.desc, 
        amount: Number(newIncome.amount) 
    };
    setIncomes([...incomes, newEntry]);
    setNewIncome({ desc: '', amount: '' });
  };

  const removeIncome = (id: number) => {
    setIncomes(incomes.filter(inc => inc.id !== id));
  };

  // CÁLCULOS GENERALES
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0); 
  const gastosDelMes = filteredTransactions.filter(t => t.source === 'mes').reduce((acc, t) => acc + t.amount, 0);
  const gastosDeAhorros = filteredTransactions.filter(t => t.source === 'ahorro').reduce((acc, t) => acc + t.amount, 0);
  const saldoDelMes = totalIncome - gastosDelMes;
  const saldoAcumuladoFinal = previousBalance - gastosDeAhorros;

  // --- DATOS PARA GRÁFICOS ---
  // 1. Agrupar gastos por categoría
  const expensesByCategory = useMemo(() => {
    const grouped: Record<string, number> = {};
    filteredTransactions.forEach(tx => {
      grouped[tx.categoryId] = (grouped[tx.categoryId] || 0) + tx.amount;
    });
    
    // Transformar a array para Recharts
    return Object.entries(grouped).map(([catId, amount]) => {
      const category = CATEGORIES.find(c => c.id === catId);
      return {
        name: category?.name || 'Otros',
        amount: amount,
        color: category?.color || '#94a3b8'
      };
    }).sort((a, b) => b.amount - a.amount); // Ordenar de mayor a menor gasto
  }, [filteredTransactions]);

  // 2. Datos para Torta (Necesidad vs Deseo)
  const pieDataTypes = useMemo(() => {
    let nec = 0;
    let des = 0;
    filteredTransactions.forEach(tx => {
        const cat = CATEGORIES.find(c => c.id === tx.categoryId);
        if (cat?.type === 'necesidad') nec += tx.amount;
        else des += tx.amount;
    });
    return [
        { name: 'Necesidades (50%)', value: nec, color: '#3b82f6' },
        { name: 'Deseos (30%)', value: des, color: '#a855f7' }
    ].filter(d => d.value > 0);
  }, [filteredTransactions]);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 text-gray-800 flex flex-col md:flex-row font-sans relative">
      
      {/* MODAL CONFIG */}
      {showConfigModal && ( /* ... (Mismo modal de antes) ... */ 
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <h3 className="font-bold text-lg mb-4">Configurar Ciclo</h3>
                <div className="space-y-4">
                    <button onClick={() => setConfig({...config, frequency: 'mensual'})} className={`w-full p-3 rounded border ${config.frequency === 'mensual' ? 'bg-black text-white' : ''}`}>Mensual</button>
                    <button onClick={() => setConfig({...config, frequency: 'quincenal'})} className={`w-full p-3 rounded border ${config.frequency === 'quincenal' ? 'bg-black text-white' : ''}`}>Quincenal</button>
                    <button onClick={() => setShowConfigModal(false)} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4">Guardar</button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL INGRESOS */}
      {showIncomeModal && ( /* ... (Mismo modal de antes) ... */ 
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            {/* Copia aquí el contenido del modal de ingresos de la respuesta anterior */}
             <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in">
                <div className="bg-black text-white p-5 flex justify-between items-center">
                <div><h3 className="font-bold text-xl flex items-center gap-2">Mis Ingresos</h3><p className="text-xs text-gray-400">Historial de entradas</p></div>
                <button onClick={() => setShowIncomeModal(false)} className="hover:text-gray-300 bg-white/10 p-2 rounded-full"><X size={20}/></button>
                </div>
                <div className="p-6">
                    <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6">
                        <p className="text-xs font-bold text-blue-800 uppercase mb-3 flex items-center gap-1"><Plus size={14}/> Nuevo Ingreso</p>
                        <div className="flex gap-2 mb-2">
                            <input className="flex-1 p-3 rounded-xl border border-blue-200 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Bono, Venta..." value={newIncome.desc} onChange={(e) => setNewIncome({...newIncome, desc: e.target.value})}/>
                            <input className="w-32 p-3 rounded-xl border border-blue-200 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-bold" type="number" placeholder="$" value={newIncome.amount} onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}/>
                        </div>
                        <button onClick={addIncome} className="w-full bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg">Confirmar</button>
                    </div>
                    <div className="flex justify-between items-end border-b border-gray-100 pb-2 mb-4"><span className="text-gray-500 font-medium text-sm">Historial</span><div className="text-right"><span className="text-xs text-gray-400 uppercase font-bold">Total</span><p className="text-xl font-black text-gray-900 leading-none">{formatMoney(totalIncome)}</p></div></div>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                        {incomes.map(inc => (
                            <div key={inc.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100"><div className="flex items-center gap-3"><div className="bg-green-50 text-green-600 p-2.5 rounded-xl"><DollarSign size={18} /></div><div><p className="font-bold text-gray-800 text-sm">{inc.desc}</p><p className="text-[11px] text-gray-400 flex items-center gap-1"><Clock size={10}/> {formatDate(inc.date)}</p></div></div><div className="flex items-center gap-3"><span className="font-bold text-gray-900">{formatMoney(inc.amount)}</span><button onClick={() => removeIncome(inc.id)} className="text-gray-300 hover:text-red-500 p-1 hover:bg-red-50 rounded"><Trash2 size={16}/></button></div></div>
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
        
        {/* TARJETA CAJA DE AHORROS */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-3xl mb-6 shadow-xl relative overflow-hidden border border-slate-700">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
                <div className="bg-white/20 p-2 rounded-full"><TrendingUp size={16} className="text-yellow-400" /></div>
                <p className="text-sm font-bold text-slate-200 uppercase tracking-wider">CAJA DE AHORRO</p>
            </div>
            <p className="text-3xl font-extrabold mb-1">{formatMoney(saldoAcumuladoFinal)}</p>
            <p className="text-xs text-slate-400 font-medium bg-slate-800/50 inline-block px-2 py-1 rounded">
                Plata acumulada histórica
            </p>
          </div>
          <div className="absolute right-0 top-0 w-32 h-32 bg-yellow-500 opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
        </div>

        <div className="bg-gray-50 p-5 rounded-2xl mt-auto border border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">TU CICLO</p>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-gray-500"/>
            <span className="text-base font-bold capitalize text-gray-700">{config.frequency}</span>
          </div>
          <button onClick={() => setShowConfigModal(true)} className="text-xs text-blue-600 font-bold mt-3 hover:underline flex items-center gap-1 bg-blue-50 px-4 py-2 rounded-full w-fit"><Settings size={14} /> Modificar</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tu Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Tu historia financiera empieza hoy.</p>
          </div>

          <div className="flex items-center gap-2 self-center md:self-auto">
            <button onClick={() => changePeriod(-1)} className="p-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-600 shadow-sm"><ChevronLeft size={22} /></button>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-2 min-w-[240px] flex flex-col items-center relative">
               <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">ESTAS VIENDO</span>
               <div className="flex items-center gap-2">
                 <span className="text-xl font-bold text-gray-900 leading-none capitalize">
                    {period.label.includes('-') ? viewDate.toLocaleString('es-ES', { month: 'long' }) : period.label}
                 </span>
               </div>
               <select 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  value={viewDate.getMonth()}
                  onChange={(e) => jumpToDate(Number(e.target.value), viewDate.getFullYear())}
               >
                 {Array.from({length: 12}).map((_, i) => (
                   <option key={i} value={i}>{new Date(2025, i, 1).toLocaleString('es-ES', { month: 'long' })}</option>
                 ))}
               </select>
            </div>
            <button onClick={() => changePeriod(1)} className="p-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-600 shadow-sm"><ChevronRight size={22} /></button>
          </div>
        </header>

        {/* TARJETAS PRINCIPALES (Sueldo, Gastado, Sobrante) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* ... (Las 3 tarjetas de siempre, sin cambios lógicos grandes) ... */}
          {/* Tarjeta 1: INGRESOS DEL MES */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group relative min-h-[160px]">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3"><div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><DollarSign size={28} /></div><div><p className="text-xs font-black text-gray-400 uppercase tracking-wide">BOLSILLO 1</p><p className="text-sm font-bold text-gray-800 leading-none">INGRESOS DEL MES</p></div></div>
            </div>
            <div className="relative pl-1">
              <div className="flex items-center justify-between gap-3"><p className="text-4xl font-extrabold text-gray-900 tracking-tight">{formatMoney(totalIncome)}</p><button onClick={() => setShowIncomeModal(true)} className="flex items-center gap-1 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all"><Plus size={16} /> Sumar</button></div>
              <div className="flex flex-wrap gap-2 mt-3">{incomes.map(inc => (<span key={inc.id} className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100 uppercase truncate max-w-[100px]">{inc.desc}</span>))}{incomes.length === 0 && <span className="text-[10px] text-red-400 font-bold bg-red-50 px-2 py-1 rounded">Sin ingresos</span>}</div>
            </div>
          </div>
          {/* Tarjeta 2: GASTADO */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[160px]">
             <div className="flex justify-between items-start mb-4"><div className="flex items-center gap-3"><div className="p-3 bg-red-50 rounded-2xl text-red-600"><ArrowRight size={28} className="rotate-[-45deg]" /></div><div><p className="text-xs font-black text-gray-400 uppercase tracking-wide">SALIDAS</p><p className="text-sm font-bold text-gray-800 leading-none">YA GASTASTE</p></div></div></div>
            <div className="pl-1"><p className="text-4xl font-extrabold text-gray-900 tracking-tight">{formatMoney(gastosDelMes + gastosDeAhorros)}</p>{gastosDeAhorros > 0 && (<p className="text-xs text-orange-600 mt-3 font-bold flex items-center gap-1 bg-orange-50 inline-block px-3 py-1.5 rounded-lg border border-orange-100"><AlertCircle size={14}/> Ojo: {formatMoney(gastosDeAhorros)} salieron de ahorros</p>)}</div>
          </div>
          {/* Tarjeta 3: SOBRANTE */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-green-100 flex flex-col justify-between relative overflow-hidden min-h-[160px]">
            <div className="relative z-10"><div className="flex justify-between items-start mb-4"><div className="flex items-center gap-3"><div className="p-3 bg-green-50 rounded-2xl text-green-600"><Wallet size={28} /></div><div><p className="text-xs font-black text-green-300 uppercase tracking-wide">RESULTADO</p><p className="text-sm font-bold text-gray-800 leading-none">TE SOBRAN HOY</p></div></div></div><div className="pl-1"><p className={`text-4xl font-extrabold tracking-tight ${saldoDelMes >= 0 ? 'text-green-600' : 'text-red-500'}`}>{formatMoney(saldoDelMes)}</p><p className="text-xs text-gray-400 mt-2 font-medium">De tus ingresos de este mes</p></div></div><div className="absolute inset-0 bg-green-50/50 -z-10"></div>
          </div>
        </div>

        {/* INPUT DE CARGA (CON CATEGORÍAS AHORA) */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 border-l-8 border-l-black mb-10">
            <h3 className="font-bold text-xl text-gray-800 mb-6">Registrar Nuevo Gasto</h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Descripción */}
                <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">¿Qué compraste?</label>
                    <input value={newTx.desc} onChange={(e) => setNewTx({...newTx, desc: e.target.value})} className="w-full border border-gray-200 bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all text-lg font-medium" placeholder="Ej: Supermercado" />
                </div>
                {/* Monto */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">¿Cuánto?</label>
                    <input type="number" value={newTx.amount} onChange={(e) => setNewTx({...newTx, amount: e.target.value})} className="w-full border border-gray-200 bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all text-lg font-bold" placeholder="$ 0" />
                </div>
                {/* CATEGORÍA (NUEVO) */}
                <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Categoría</label>
                    <select value={newTx.categoryId} onChange={(e) => setNewTx({...newTx, categoryId: e.target.value})} className="w-full p-4 rounded-xl outline-none border-2 border-gray-200 cursor-pointer text-gray-700 bg-white">
                        {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                {/* Origen */}
                <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">¿Origen?</label>
                    <select value={newTx.source} onChange={(e) => setNewTx({...newTx, source: e.target.value})} className={`w-full p-4 rounded-xl outline-none border-2 font-bold cursor-pointer ${newTx.source === 'mes' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
                        <option value="mes">Sueldo</option>
                        <option value="ahorro">Ahorros</option>
                    </select>
                </div>
                {/* Botón */}
                <div className="md:col-span-1 flex items-end">
                    <button className="w-full h-[64px] bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center">
                        <Plus size={28} />
                    </button>
                </div>
            </div>
        </div>

        {/* --- SECCIÓN DE ANÁLISIS (EL DASHBOARD VISUAL) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            
            {/* GRÁFICO 1: TORTA DE NECESIDAD VS DESEO */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                    <PieIcon size={20} className="text-gray-400"/>
                    <h3 className="font-bold text-xl text-gray-800">Calidad del Gasto</h3>
                </div>
                <div className="h-64 relative">
                    {pieDataTypes.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={pieDataTypes} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {pieDataTypes.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => formatMoney(Number(value))} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">Sin datos aún</div>
                    )}
                    {/* Texto central */}
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-3xl font-bold text-gray-800">{pieDataTypes.length > 0 ? '50/30' : '-'}</span>
                        <span className="text-xs text-gray-400 uppercase font-bold">Regla</span>
                    </div>
                </div>
                {/* Leyenda */}
                <div className="flex justify-center gap-4 mt-4">
                    {pieDataTypes.map(d => (
                        <div key={d.name} className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></div>
                            {d.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* GRÁFICO 2: BARRAS POR CATEGORÍA (TOP GASTOS) */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart3 size={20} className="text-gray-400"/>
                    <h3 className="font-bold text-xl text-gray-800">¿En qué se fue la plata?</h3>
                </div>
                <div className="h-64">
                    {expensesByCategory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={expensesByCategory} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9"/>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11}} />
                                <Tooltip formatter={(value: any) => formatMoney(Number(value))} cursor={{fill: '#f8fafc'}} />
                                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                                    {expensesByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">Carga gastos para ver el ranking</div>
                    )}
                </div>
            </div>
        </div>

        {/* LISTA DE TRANSACCIONES */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="font-bold text-lg text-gray-800">Detalle de Movimientos</h3>
            </div>
            <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
                <tr>
                    <th className="px-8 py-5 tracking-wider">Fecha</th>
                    <th className="px-8 py-5 tracking-wider">Descripción</th>
                    <th className="px-8 py-5 tracking-wider">Categoría</th>
                    <th className="px-8 py-5 tracking-wider">Origen</th>
                    <th className="px-8 py-5 tracking-wider text-right">Monto</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {filteredTransactions.map((tx) => {
                    const cat = CATEGORIES.find(c => c.id === tx.categoryId);
                    return (
                        <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-8 py-5 text-gray-500 font-medium">{formatDate(tx.date)}</td>
                            <td className="px-8 py-5 font-bold text-gray-800 text-lg">{tx.desc}</td>
                            <td className="px-8 py-5">
                                <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 border border-gray-200">
                                    {cat?.name}
                                </span>
                            </td>
                            <td className="px-8 py-5">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 w-fit ${tx.source === 'mes' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                                {tx.source === 'mes' ? <DollarSign size={12}/> : <TrendingUp size={12}/>}
                                {tx.source === 'mes' ? 'Sueldo' : 'Ahorros'}
                                </span>
                            </td>
                            <td className="px-8 py-5 text-right font-bold text-gray-900 text-lg">{formatMoney(tx.amount)}</td>
                        </tr>
                    );
                })}
                {filteredTransactions.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-8 py-10 text-center text-gray-400 text-lg">
                            No hay gastos registrados en este periodo.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>

      </main>
    </div>
  );
}