"use client";
import { useState, useMemo, useEffect, useRef } from 'react';
import { CreditCard, DollarSign, TrendingUp, Edit2, Trash2, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Transaction, CATEGORIES } from '@/types/dashboard';

const formatMoney = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);
const formatDate = (dateString: string) => { if (!dateString) return ''; return new Date(dateString).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }); };

// --- HELPER: Nombres de meses y días ---
const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DAY_NAMES = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: number) => void;
}

export default function TransactionList({ transactions, onEdit, onDelete }: Props) {
  // --- ESTADOS DE FILTRO ---
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  
  // viewDate: Controla qué mes estamos mirando en el calendario
  const [viewDate, setViewDate] = useState(new Date()); 
  
  // filterMode: 'month' (todo el mes de viewDate) o 'day' (un día específico selectedDay)
  const [filterMode, setFilterMode] = useState<'month' | 'day'>('month');
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  // Estado para abrir/cerrar el dropdown
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Cerrar calendario si clickeo afuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGICA DEL CALENDARIO ---
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const selectDay = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    setSelectedDay(newDate);
    setFilterMode('day');
    setIsCalendarOpen(false); // Cerramos al elegir día
  };

  const selectWholeMonth = () => {
    setFilterMode('month');
    setSelectedDay(null);
    setIsCalendarOpen(false); // Cerramos al elegir mes
  };

  // --- FILTRADO DE DATOS ---
  const filteredTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    
    // 1. Filtro Categoría
    const matchCategory = selectedCategory === 'Todas' || tx.categoryId.toString() === selectedCategory;

    // 2. Filtro Fecha
    let matchDate = true;
    if (filterMode === 'month') {
      // Coincide Mes y Año
      matchDate = txDate.getMonth() === viewDate.getMonth() && txDate.getFullYear() === viewDate.getFullYear();
    } else if (filterMode === 'day' && selectedDay) {
      // Coincide Día exacto
      matchDate = txDate.toDateString() === selectedDay.toDateString();
    }

    return matchCategory && matchDate;
  });

  // --- RENDERIZADO DEL HEADER DEL BOTÓN ---
  const getButtonLabel = () => {
    if (filterMode === 'day' && selectedDay) {
      return selectedDay.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    return `${MONTH_NAMES[viewDate.getMonth()]} de ${viewDate.getFullYear()}`;
  };

  // Generamos los días para pintar la grilla
  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const startDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  const blanks = Array(startDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-10 overflow-visible relative">
      
      {/* HEADER */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
            <h3 className="font-bold text-lg text-gray-800">Detalle de Movimientos</h3>
            <span className="text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                {filteredTransactions.length} registros
            </span>
        </div>

        <div className="flex gap-2 relative z-20"> {/* z-20 para que el calendario flote por encima */}
            
            {/* --- COMPONENTE CALENDARIO DESPLEGABLE --- */}
            <div className="relative" ref={calendarRef}>
                <button 
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold transition-all ${isCalendarOpen || filterMode === 'day' ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                    <CalendarIcon size={14} />
                    <span className="capitalize">{getButtonLabel()}</span>
                </button>

                {/* --- EL POPUP DEL CALENDARIO --- */}
                {isCalendarOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50">
                        {/* Navegación Mes */}
                        <div className="flex justify-between items-center mb-4">
                            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft size={16}/></button>
                            <span className="font-bold text-gray-800 capitalize">{MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
                            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight size={16}/></button>
                        </div>

                        {/* Grilla Días */}
                        <div className="grid grid-cols-7 gap-1 mb-4 text-center">
                            {DAY_NAMES.map(d => <span key={d} className="text-[10px] font-bold text-gray-400 uppercase">{d}</span>)}
                            
                            {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                            
                            {days.map(d => {
                                // Chequear si es el día seleccionado
                                const isSelected = filterMode === 'day' && selectedDay?.getDate() === d && selectedDay?.getMonth() === viewDate.getMonth();
                                return (
                                    <button 
                                        key={d} 
                                        onClick={() => selectDay(d)}
                                        className={`h-8 w-8 text-xs rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 text-white font-bold' : 'hover:bg-blue-50 text-gray-700'}`}
                                    >
                                        {d}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Botón Ver Todo el Mes */}
                        <button 
                            onClick={selectWholeMonth}
                            className={`w-full py-2 text-xs font-bold rounded-lg transition-colors ${filterMode === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                            Ver todo {MONTH_NAMES[viewDate.getMonth()]}
                        </button>
                    </div>
                )}
            </div>

            {/* SELECTOR CATEGORIA (Sin cambios) */}
            <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
                <option value="Todas">Todas las categorías</option>
                {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
            </select>
        </div>
      </div>

      {/* TABLA (Sin cambios de diseño, solo usa filteredTransactions) */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs">
            <tr>
              <th className="px-6 py-4 tracking-wider">Fecha</th>
              <th className="px-6 py-4 tracking-wider">Descripción</th>
              <th className="px-6 py-4 tracking-wider">Categoría</th>
              <th className="px-6 py-4 tracking-wider">Origen</th>
              <th className="px-6 py-4 tracking-wider text-right">Monto</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.map((tx) => {
              const cat = CATEGORIES.find(c => c.id === tx.categoryId);
              return (
                <tr key={tx.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-gray-500 font-medium whitespace-nowrap text-sm">{formatDate(tx.date)}</td>
                  <td className="px-6 py-4 font-bold text-gray-800">{tx.desc}</td>
                  <td className="px-6 py-4">
                    {tx.isInstallment ? (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-blue-600 flex items-center gap-1"><CreditCard size={12}/> {tx.installmentData?.bank}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Cuota {tx.currentInstallment}/{tx.installmentData?.count}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100 text-gray-600 border border-gray-200 whitespace-nowrap">{cat?.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 w-fit whitespace-nowrap ${tx.source === 'mes' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                      {tx.source === 'mes' ? <DollarSign size={10}/> : <TrendingUp size={10}/>}
                      {tx.source === 'mes' ? 'Sueldo' : 'Ahorros'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">{formatMoney(tx.amount)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEdit(tx)} className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"><Edit2 size={14}/></button>
                      <button onClick={() => onDelete(tx.id)} className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-600 transition-all shadow-sm"><Trash2 size={14}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredTransactions.length === 0 && (
              <tr><td colSpan={6} className="px-8 py-10 text-center text-gray-400">No hay movimientos para esta fecha.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}