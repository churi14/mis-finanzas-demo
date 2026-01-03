"use client";
import { CreditCard, DollarSign, TrendingUp, Edit2, Trash2 } from 'lucide-react';
import { Transaction, CATEGORIES } from '@/types/dashboard';

const formatMoney = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);
const formatDate = (dateString: string) => { if (!dateString) return ''; return new Date(dateString).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }); };

interface Props {
  transactions: Transaction[];
  onEdit: (tx: Transaction) => void;   // Nueva función recibida
  onDelete: (id: number) => void;      // Nueva función recibida
}

export default function TransactionList({ transactions, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-800">Detalle de Movimientos</h3>
        <span className="text-xs text-gray-400 font-medium">{transactions.length} registros</span>
      </div>
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
            {transactions.map((tx) => {
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
                  
                  {/* BOTONES DE EDICIÓN */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onEdit(tx)}
                        className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm"
                        title="Editar"
                      >
                        <Edit2 size={14}/>
                      </button>
                      <button 
                        onClick={() => onDelete(tx.id)}
                        className="p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-600 transition-all shadow-sm"
                        title="Borrar"
                      >
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {transactions.length === 0 && (
              <tr><td colSpan={6} className="px-8 py-10 text-center text-gray-400">No hay gastos registrados en este periodo.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}