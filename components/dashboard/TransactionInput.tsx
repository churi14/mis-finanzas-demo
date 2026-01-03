"use client";
import { useState } from 'react';
import { CreditCard, Plus } from 'lucide-react';
import { CATEGORIES, CardBrand } from '@/types/dashboard';

interface Props {
  onAdd: (tx: any) => void;
}

export default function TransactionInput({ onAdd }: Props) {
  // Estado local
  const [newTx, setNewTx] = useState({ 
    desc: '', 
    amount: '', 
    displayAmount: '',
    source: 'mes', 
    categoryId: 'super',
    isCredit: false, 
    installments: '1', 
    bank: '',
    brand: 'visa' as CardBrand // Default Visa
  });

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) {
      setNewTx({ ...newTx, amount: '', displayAmount: '' });
      return;
    }
    const formatted = new Intl.NumberFormat('es-AR').format(Number(rawValue));
    setNewTx({ ...newTx, amount: rawValue, displayAmount: formatted });
  };

  const handleAdd = () => {
    if (!newTx.desc || !newTx.amount) return;
    
    onAdd({
        desc: newTx.desc,
        amount: Number(newTx.amount),
        source: newTx.source,
        categoryId: newTx.categoryId,
        isCredit: newTx.isCredit,
        installments: newTx.installments,
        bank: newTx.bank,
        brand: newTx.brand
    });
    
    // Resetear manteniendo defaults útiles
    setNewTx({ 
        ...newTx, 
        desc: '', amount: '', displayAmount: '', 
        isCredit: false, installments: '1', bank: '' 
    });
  };

  const cuotaAmount = newTx.amount ? Number(newTx.amount) / Number(newTx.installments) : 0;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 border-l-8 border-l-black mb-10 transition-all">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl text-gray-800">Registrar Nuevo Gasto</h3>
        
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-200 cursor-pointer select-none" onClick={() => setNewTx({...newTx, isCredit: !newTx.isCredit})}>
          <CreditCard size={18} className={newTx.isCredit ? "text-blue-600" : "text-gray-400"} />
          <span className="text-sm font-bold text-gray-600">¿Pagas con Tarjeta?</span>
          <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${newTx.isCredit ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'}`}>
            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Descripción */}
        <div className="md:col-span-4">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">¿Qué compraste?</label>
          <input value={newTx.desc} onChange={(e) => setNewTx({...newTx, desc: e.target.value})} className="w-full border border-gray-200 bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all text-lg font-medium" placeholder="Ej: Heladera" />
        </div>
        
        {/* Monto */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">{newTx.isCredit ? 'Precio Total' : 'Monto'}</label>
          <div className="relative">
            <span className="absolute left-4 top-4 text-gray-400 font-bold">$</span>
            <input type="text" inputMode="numeric" value={newTx.displayAmount} onChange={handleAmountChange} className="w-full pl-8 border border-gray-200 bg-gray-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-black transition-all text-lg font-bold" placeholder="0" />
          </div>
        </div>

        {/* Categoría (FUNDAMENTAL PARA EL GRÁFICO) */}
        <div className="md:col-span-3">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Categoría</label>
          <select value={newTx.categoryId} onChange={(e) => setNewTx({...newTx, categoryId: e.target.value})} className="w-full p-4 rounded-xl outline-none border-2 border-gray-200 cursor-pointer text-gray-700 bg-white">
            {CATEGORIES.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
          </select>
        </div>

        {/* CONDICIONALES TARJETA */}
        {newTx.isCredit ? (
          <>
            {/* Banco Manual */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Banco Emisor</label>
              <input value={newTx.bank} onChange={(e) => setNewTx({...newTx, bank: e.target.value})} className="w-full border border-gray-200 bg-blue-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold text-blue-800" placeholder="Ej: Galicia" />
            </div>
            
            {/* Marca Selector */}
            <div className="md:col-span-1">
               <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Tarjeta</label>
               <select value={newTx.brand} onChange={(e) => setNewTx({...newTx, brand: e.target.value as CardBrand})} className="w-full border border-gray-200 bg-blue-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-bold text-blue-800">
                  <option value="visa">Visa</option>
                  <option value="mastercard">Master</option>
                  <option value="amex">Amex</option>
                  <option value="other">Otra</option>
               </select>
            </div>

            {/* Cuotas */}
            <div className="md:col-span-12 lg:col-span-2"> 
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Cuotas</label>
              <select value={newTx.installments} onChange={(e) => setNewTx({...newTx, installments: e.target.value})} className="w-full border border-gray-200 bg-blue-50 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-sm font-bold text-blue-800">
                {[1, 3, 6, 9, 12, 18, 24].map(n => <option key={n} value={n}>{n}x</option>)}
              </select>
            </div>
            
            {/* Aviso Cuota */}
            {newTx.amount && (
               <div className="md:col-span-12 text-right text-xs text-blue-600 font-bold bg-blue-50 p-2 rounded-lg">
                 Cuota: {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(cuotaAmount)}
               </div>
            )}
          </>
        ) : (
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">¿Origen?</label>
            <select value={newTx.source} onChange={(e) => setNewTx({...newTx, source: e.target.value})} className={`w-full p-4 rounded-xl outline-none border-2 font-bold cursor-pointer ${newTx.source === 'mes' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
              <option value="mes">Sueldo</option>
              <option value="ahorro">Ahorros</option>
            </select>
          </div>
        )}

        <div className="md:col-span-1 flex items-end">
          <button onClick={handleAdd} className="w-full h-[64px] bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg flex items-center justify-center">
            <Plus size={28} />
          </button>
        </div>
      </div>
    </div>
  );
}