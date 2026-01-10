import { useState } from 'react';
import { Plus, Wallet, Tag, Layers, Zap, ArrowDownCircle, DollarSign, Percent, AlertCircle, CreditCard } from 'lucide-react'; 

interface TransactionInputProps {
  onAdd: (transaction: any) => void;
}

export default function TransactionInput({ onAdd }: TransactionInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [refundType, setRefundType] = useState<'amount' | 'percentage'>('amount');

  const [newTx, setNewTx] = useState({
    desc: '',
    amount: '',
    source: 'mes',
    categoryId: 'varios', 
    isCredit: false, 
    installments: '1',
    refund: '', 
    refundCap: '', 
    bank: 'Mercado Pago', 
    brand: 'Visa' 
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.desc || !newTx.amount) return;
    
    // CÁLCULO REINTEGRO
    let finalRefundValue = 0;
    const amountVal = Number(newTx.amount);
    const refundInput = Number(newTx.refund);
    const capInput = Number(newTx.refundCap);

    if (refundType === 'amount') {
        finalRefundValue = refundInput;
    } else {
        const calculated = (amountVal * refundInput) / 100;
        if (capInput > 0 && calculated > capInput) {
            finalRefundValue = capInput;
        } else {
            finalRefundValue = calculated;
        }
    }

    const transactionToSave = {
        ...newTx,
        refund: finalRefundValue 
    };

    onAdd(transactionToSave);
    
    // RESET
    setNewTx({ ...newTx, desc: '', amount: '', isCredit: false, installments: '1', refund: '', refundCap: '' });
    setRefundType('amount');
    setIsExpanded(false);
  };

  // Lógica Reintegro Visual
  const monto = Number(newTx.amount) || 0;
  const cuotas = Number(newTx.installments) || 1;
  const refundInputVal = Number(newTx.refund) || 0;
  const capVal = Number(newTx.refundCap) || 0;

  let reintegroEstimado = 0;
  let aplicoTope = false;

  if (refundType === 'amount') {
      reintegroEstimado = refundInputVal;
  } else {
      reintegroEstimado = (monto * refundInputVal) / 100;
      if (capVal > 0 && reintegroEstimado > capVal) {
          reintegroEstimado = capVal;
          aplicoTope = true;
      }
  }

  const valorCuota = monto / cuotas;
  const costoReal = monto - reintegroEstimado;

  // VARIABLE DE CONTROL: ¿Es efectivo?
  const isCash = newTx.bank === 'Efectivo';

  return (
    <div className="mb-8 relative z-20">
      {!isExpanded ? (
        <div className="relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-200 animate-pulse"></div>
            <button 
              onClick={() => setIsExpanded(true)}
              className="relative w-full bg-white text-blue-900 font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3 transition-transform active:scale-[0.99] border border-blue-100"
            >
              <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg shadow-blue-200">
                 <Plus size={24} /> 
              </div>
              <span className="text-lg tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-700">
                Registrar Nuevo Gasto
              </span>
            </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 animate-fade-in-down ring-4 ring-slate-50/50">
            <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                <div className="flex items-center gap-2 text-blue-600">
                    <Zap size={20} fill="currentColor" />
                    <h3 className="font-black text-slate-800 text-lg tracking-tight">Nuevo Movimiento</h3>
                </div>
                <button type="button" onClick={() => setIsExpanded(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-red-500 px-4 py-2 rounded-full text-xs font-bold transition-colors">Cancelar</button>
            </div>

            {/* FILA 1 */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                <div className="md:col-span-6 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">¿En qué gastaste?</label>
                    <input type="text" placeholder="Ej: Supermercado, Cine..." className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-4 outline-none focus:ring-2 focus:ring-black transition-all placeholder:font-normal h-[54px]" value={newTx.desc} onChange={(e) => setNewTx({...newTx, desc: e.target.value})} autoFocus />
                </div>
                <div className="md:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categoría</label>
                    <div className="relative">
                        <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 outline-none focus:ring-2 focus:ring-black appearance-none h-[54px]" value={newTx.categoryId} onChange={(e) => setNewTx({...newTx, categoryId: e.target.value})}>
                            <option value="comida">🍔 Comida</option>
                            <option value="supermercado">🛒 Supermercado</option>
                            <option value="servicios">💡 Servicios</option>
                            <option value="transporte">🚌 Transporte</option>
                            <option value="ocio">🍿 Ocio / Salidas</option>
                            <option value="salud">💊 Salud</option>
                            <option value="educacion">📚 Educación</option>
                            <option value="ropa">👕 Ropa</option>
                            <option value="tecnologia">💻 Tecnología</option>
                            <option value="casa">🏠 Casa</option>
                            <option value="varios">📦 Varios</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Tag size={16} /></div>
                    </div>
                </div>
                <div className="md:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monto Total</label>
                    <div className="relative">
                        <input type="number" placeholder="0" className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-4 pl-8 outline-none focus:ring-2 focus:ring-black transition-all h-[54px]" value={newTx.amount} onChange={(e) => setNewTx({...newTx, amount: e.target.value})} />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
                    </div>
                </div>
            </div>

            {/* FILA 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                
                {/* 1. PLATAFORMA */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plataforma</label>
                    <div className="relative">
                        <select 
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-3 outline-none focus:ring-2 focus:ring-black appearance-none h-[50px]"
                            value={newTx.bank}
                            onChange={(e) => {
                                const val = e.target.value;
                                // Si elige efectivo, reseteamos la marca a "---"
                                setNewTx({
                                    ...newTx, 
                                    bank: val,
                                    brand: val === 'Efectivo' ? '-' : newTx.brand
                                });
                            }}
                        >
                            <option value="Mercado Pago">Mercado Pago</option>
                            <option value="Efectivo">Efectivo</option>
                            <option value="Lemon Cash">Lemon Cash</option>
                            <option value="Brubank">Brubank</option>
                            <option value="Naranja X">Naranja X</option>
                            <option value="Galicia">Galicia</option>
                            <option value="Santander">Santander</option>
                            <option value="BBVA">BBVA</option>
                            <option value="Otro">Otro</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Wallet size={16} /></div>
                    </div>
                </div>

                {/* 2. TARJETA (Se deshabilita si es Efectivo) */}
                <div className="space-y-1">
                    <label className={`text-[10px] font-bold uppercase tracking-wider ${isCash ? 'text-gray-300' : 'text-slate-400'}`}>Tarjeta</label>
                    <div className="relative">
                        <select 
                            className={`w-full border text-sm font-bold rounded-xl px-3 outline-none appearance-none h-[50px] transition-all
                                ${isCash 
                                    ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' 
                                    : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-black'
                                }
                            `}
                            value={newTx.brand}
                            onChange={(e) => setNewTx({...newTx, brand: e.target.value})}
                            disabled={isCash}
                        >
                            <option value="-">---</option>
                            <option value="Visa">Visa</option>
                            <option value="Mastercard">Mastercard</option>
                            <option value="Amex">Amex</option>
                            <option value="Cabal">Cabal</option>
                        </select>
                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isCash ? 'text-gray-300' : 'text-slate-400'}`}>
                            <CreditCard size={16} />
                        </div>
                    </div>
                </div>

                {/* 3. ORIGEN */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Origen</label>
                    <div className="relative">
                        <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-3 outline-none focus:ring-2 focus:ring-black appearance-none h-[50px]" value={newTx.source} onChange={(e) => setNewTx({...newTx, source: e.target.value})}>
                            <option value="mes">Sueldo / Mes</option>
                            <option value="ahorro">Ahorros</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Layers size={16} /></div>
                    </div>
                </div>

                {/* 4. FINANCIACIÓN */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Financiación</label>
                    <div className={`flex items-center justify-between px-3 border rounded-xl h-[50px] cursor-pointer transition-all ${newTx.isCredit ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`} onClick={() => setNewTx({...newTx, isCredit: !newTx.isCredit})}>
                        <span className={`text-sm font-bold select-none ${newTx.isCredit ? 'text-blue-700' : 'text-slate-600'}`}>¿Es en cuotas?</span>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${newTx.isCredit ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>{newTx.isCredit && <Plus size={14} className="text-white rotate-45" />}</div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN CUOTAS Y REINTEGROS */}
            {newTx.isCredit && (
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 mb-6 animate-fade-in">
                    
                    <div className="flex items-center gap-2 mb-4 text-blue-700">
                        <ArrowDownCircle size={18} />
                        <h4 className="font-black text-sm uppercase tracking-wider">Configurar Descuentos</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        
                        {/* 1. Cuotas */}
                        <div className="md:col-span-3 space-y-1">
                            <label className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Cuotas</label>
                            <input type="number" min="2" max="24" className="w-full bg-white border border-blue-200 text-blue-900 font-bold rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-200 h-[50px] text-center text-lg" value={newTx.installments} onChange={(e) => setNewTx({...newTx, installments: e.target.value})} />
                        </div>

                        {/* 2. Selector de Tipo + Input Reintegro */}
                        <div className="md:col-span-9 space-y-2">
                            {/* SELECTOR GRANDE TIPO BOTÓN */}
                            <div className="bg-blue-100/50 p-1 rounded-xl flex gap-1">
                                <button 
                                    type="button" 
                                    onClick={()=>setRefundType('amount')} 
                                    className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${refundType === 'amount' ? 'bg-white text-green-700 shadow-sm ring-1 ring-green-100' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                                >
                                    <DollarSign size={16} /> Monto Fijo
                                </button>
                                <button 
                                    type="button" 
                                    onClick={()=>setRefundType('percentage')} 
                                    className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-2 ${refundType === 'percentage' ? 'bg-white text-green-700 shadow-sm ring-1 ring-green-100' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                                >
                                    <Percent size={16} /> Porcentaje
                                </button>
                            </div>

                            {/* INPUT PRINCIPAL */}
                            <div className="relative">
                                <input 
                                    type="number" 
                                    placeholder={refundType === 'amount' ? "Ej: 2000" : "Ej: 30"}
                                    className="w-full bg-green-50/50 border border-green-200 text-green-700 font-bold rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-green-200 h-[50px] text-lg"
                                    value={newTx.refund}
                                    onChange={(e) => setNewTx({...newTx, refund: e.target.value})}
                                />
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600">
                                    {refundType === 'amount' ? <DollarSign size={20}/> : <Percent size={20}/>}
                                </div>
                            </div>

                            {/* INPUT TOPE */}
                            {refundType === 'percentage' && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-300 mt-2">
                                    <div className="relative flex items-center gap-2">
                                        <div className="text-slate-400"><AlertCircle size={16}/></div>
                                        <input 
                                            type="number" 
                                            placeholder="Tope máx de reintegro (Opcional)"
                                            className="w-full bg-white border border-slate-200 text-slate-600 font-bold rounded-lg p-2 text-sm outline-none focus:border-slate-400 placeholder:text-slate-300"
                                            value={newTx.refundCap}
                                            onChange={(e) => setNewTx({...newTx, refundCap: e.target.value})}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* RESUMEN FINAL */}
                    <div className="mt-6 bg-white rounded-xl p-4 border border-blue-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
                         <div className="text-center md:text-left">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Vas a pagar</p>
                            <p className="text-lg text-blue-900 font-black">
                                ${valorCuota.toFixed(0)} <span className="text-xs font-bold text-slate-400">/mes</span>
                            </p>
                        </div>

                        {reintegroEstimado > 0 ? (
                            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100 text-right">
                                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Costo Real Final</p>
                                <p className="text-xl text-green-700 font-black">
                                    ${(costoReal).toLocaleString('es-AR')}
                                </p>
                                {aplicoTope && <p className="text-[10px] text-orange-500 font-bold mt-0.5">* Tope de ${capVal} aplicado</p>}
                            </div>
                        ) : (
                            <div className="text-xs text-slate-400 font-medium">Sin reintegros aplicados</div>
                        )}
                    </div>
                </div>
            )}

            <button type="submit" className="w-full bg-black text-white font-black py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg transform active:scale-[0.99] flex justify-center items-center gap-2 text-lg">
                GUARDAR GASTO <Plus size={24}/>
            </button>
        </form>
      )}
    </div>
  );
}