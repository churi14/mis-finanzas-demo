"use client";
import { useState, useEffect } from 'react';
import { X, Save, CreditCard } from 'lucide-react';
import { Transaction, CATEGORIES } from '@/types/dashboard';

interface Props {
  transaction: Transaction;
  onClose: () => void;
  onSave: (updatedTx: Transaction) => void;
}

export default function EditTransactionModal({ transaction, onClose, onSave }: Props) {
  const [desc, setDesc] = useState(transaction.desc);
  const [amountStr, setAmountStr] = useState(''); 
  const [categoryId, setCategoryId] = useState(transaction.categoryId);
  const [source, setSource] = useState(transaction.source);

  useEffect(() => {
    // Formatear precio inicial con puntos
    const formatted = new Intl.NumberFormat('es-AR').format(transaction.amount);
    setAmountStr(formatted);
  }, [transaction]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    if (!rawValue) { setAmountStr(''); return; }
    const formatted = new Intl.NumberFormat('es-AR').format(Number(rawValue));
    setAmountStr(formatted);
  };

  const handleSave = () => {
    const cleanAmount = Number(amountStr.replace(/\./g, ''));
    if (!desc || !cleanAmount) return;

    onSave({
      ...transaction,
      desc,
      amount: cleanAmount,
      categoryId,
      source
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-black text-white p-5 flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2"><Edit2 size={18}/> Editar Movimiento</h3>
          <button onClick={onClose} className="hover:text-gray-300"><X size={20}/></button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
            <input value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black font-medium"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monto (Efectivo/Cuota)</label>
            <input type="text" inputMode="numeric" value={amountStr} onChange={handleAmountChange} className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black font-bold text-lg"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black cursor-pointer">
              {CATEGORIES.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>
          </div>

          {!transaction.isInstallment && (
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Origen</label>
              <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full border border-gray-200 bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-black cursor-pointer">
                <option value="mes">Sueldo del Mes</option>
                <option value="ahorro">Ahorros</option>
              </select>
            </div>
          )}

          {transaction.isInstallment && (
            <div className="bg-blue-50 p-3 rounded-xl flex items-center gap-2 text-xs text-blue-700 font-bold border border-blue-100">
              <CreditCard size={16}/> Editando cuota {transaction.currentInstallment}
            </div>
          )}

          <button onClick={handleSave} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all flex justify-center items-center gap-2 mt-2">
            <Save size={18} /> Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
// Icono Edit2 que faltaba importar arriba
import { Edit2 } from 'lucide-react';