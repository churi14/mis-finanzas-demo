import { useState } from 'react';
import { Plus, Wallet, Tag, Layers, Zap, DollarSign, Percent, AlertCircle, CreditCard, TrendingDown, ChevronDown } from 'lucide-react';

interface TransactionInputProps {
  onAdd: (transaction: any) => void;
}

const IPC_MENSUAL = 0.034;

export default function TransactionInput({ onAdd }: TransactionInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [refundType, setRefundType] = useState<'amount' | 'percentage'>('amount');
  const [showRefund, setShowRefund] = useState(false);

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
    brand: 'Visa',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.desc || !newTx.amount) return;

    let finalRefundValue = 0;
    const amountVal = Number(newTx.amount);
    const refundInput = Number(newTx.refund);
    const capInput = Number(newTx.refundCap);

    if (showRefund) {
      if (refundType === 'amount') {
        finalRefundValue = refundInput;
      } else {
        const calculated = (amountVal * refundInput) / 100;
        finalRefundValue = capInput > 0 && calculated > capInput ? capInput : calculated;
      }
    }

    onAdd({ ...newTx, refund: finalRefundValue });

    setNewTx({ ...newTx, desc: '', amount: '', isCredit: false, installments: '1', refund: '', refundCap: '' });
    setRefundType('amount');
    setShowRefund(false);
    setIsExpanded(false);
  };

  const monto = Number(newTx.amount) || 0;
  // FIX: cuotas mínimo es 1, no 2
  const cuotas = Math.max(1, Number(newTx.installments) || 1);
  const refundInputVal = Number(newTx.refund) || 0;
  const capVal = Number(newTx.refundCap) || 0;
  const isCash = newTx.bank === 'Efectivo';

  let reintegroEstimado = 0;
  let aplicoTope = false;
  if (showRefund) {
    if (refundType === 'amount') {
      reintegroEstimado = refundInputVal;
    } else {
      reintegroEstimado = (monto * refundInputVal) / 100;
      if (capVal > 0 && reintegroEstimado > capVal) {
        reintegroEstimado = capVal;
        aplicoTope = true;
      }
    }
  }

  const valorCuota = cuotas > 0 ? monto / cuotas : monto;
  const costoReal = monto - reintegroEstimado;

  const calcularValorRealCuotas = () => {
    let totalReal = 0;
    for (let i = 1; i <= cuotas; i++) {
      totalReal += valorCuota / Math.pow(1 + IPC_MENSUAL, i);
    }
    return totalReal;
  };

  const valorRealCuotas = cuotas > 1 ? calcularValorRealCuotas() : monto;
  const ahorroPorInflacion = monto - valorRealCuotas;
  const convieneTarjetear = ahorroPorInflacion > 0 && cuotas > 1;

  return (
    <div className="mb-8 relative z-20">
      {!isExpanded ? (
        <div className="relative group w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-200 animate-pulse" />
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
            <button type="button" onClick={() => setIsExpanded(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-red-500 px-4 py-2 rounded-full text-xs font-bold transition-colors">
              Cancelar
            </button>
          </div>

          {/* FILA 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            <div className="md:col-span-6 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">¿En qué gastaste?</label>
              <input type="text" placeholder="Ej: Supermercado, Cine..." className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-4 outline-none focus:ring-2 focus:ring-black transition-all placeholder:font-normal h-[54px]" value={newTx.desc} onChange={(e) => setNewTx({ ...newTx, desc: e.target.value })} autoFocus />
            </div>
            <div className="md:col-span-3 space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categoría</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 outline-none focus:ring-2 focus:ring-black appearance-none h-[54px]" value={newTx.categoryId} onChange={(e) => setNewTx({ ...newTx, categoryId: e.target.value })}>
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
                <input type="number" placeholder="0" className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl px-4 pl-8 outline-none focus:ring-2 focus:ring-black transition-all h-[54px]" value={newTx.amount} onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })} />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</div>
              </div>
            </div>
          </div>

          {/* FILA 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plataforma</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-3 outline-none focus:ring-2 focus:ring-black appearance-none h-[50px]" value={newTx.bank} onChange={(e) => { const val = e.target.value; setNewTx({ ...newTx, bank: val, brand: val === 'Efectivo' ? '-' : newTx.brand }); }}>
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

            <div className="space-y-1">
              <label className={`text-[10px] font-bold uppercase tracking-wider ${isCash ? 'text-gray-300' : 'text-slate-400'}`}>Tarjeta</label>
              <div className="relative">
                <select className={`w-full border text-sm font-bold rounded-xl px-3 outline-none appearance-none h-[50px] transition-all ${isCash ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' : 'bg-slate-50 border-slate-200 text-slate-700 focus:ring-2 focus:ring-black'}`} value={newTx.brand} onChange={(e) => setNewTx({ ...newTx, brand: e.target.value })} disabled={isCash}>
                  <option value="-">---</option>
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex">Amex</option>
                  <option value="Cabal">Cabal</option>
                </select>
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isCash ? 'text-gray-300' : 'text-slate-400'}`}><CreditCard size={16} /></div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Origen</label>
              <div className="relative">
                <select className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-3 outline-none focus:ring-2 focus:ring-black appearance-none h-[50px]" value={newTx.source} onChange={(e) => setNewTx({ ...newTx, source: e.target.value })}>
                  <option value="mes">Sueldo / Mes</option>
                  <option value="tarjeta">Tarjeta de crédito</option>
                  <option value="ahorro">Ahorros</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><Layers size={16} /></div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Financiación</label>
              <div className={`flex items-center justify-between px-3 border rounded-xl h-[50px] cursor-pointer transition-all ${newTx.isCredit ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`} onClick={() => setNewTx({ ...newTx, isCredit: !newTx.isCredit, installments: '1' })}>
                <span className={`text-sm font-bold select-none ${newTx.isCredit ? 'text-blue-700' : 'text-slate-600'}`}>¿Es en cuotas?</span>
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${newTx.isCredit ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}`}>
                  {newTx.isCredit && <Plus size={14} className="text-white rotate-45" />}
                </div>
              </div>
            </div>
          </div>

          {/* ══ CUOTAS ══ — solo si isCredit */}
          {newTx.isCredit && (
            <div className="mb-4">
              <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">Cantidad de cuotas</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {/* FIX: arranca desde 1 cuota */}
                  {[1, 2, 3, 6, 9, 12, 18, 24].map((n) => (
                    <button key={n} type="button" onClick={() => setNewTx({ ...newTx, installments: String(n) })}
                      className={`px-4 py-2 rounded-xl text-sm font-black border transition-all ${Number(newTx.installments) === n ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                      {n}x
                    </button>
                  ))}
                  {/* FIX: min="1" en lugar de min="2" */}
                  <input type="number" min="1" max="60" placeholder="Otro"
                    className="w-20 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200 text-center"
                    value={![1,2,3,6,9,12,18,24].includes(Number(newTx.installments)) ? newTx.installments : ''}
                    onChange={(e) => setNewTx({ ...newTx, installments: e.target.value })} />
                </div>

                {monto > 0 && cuotas > 1 && (
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3 border border-blue-100 text-center">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cuota mensual</p>
                      <p className="text-xl font-black text-blue-900">${valorCuota.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
                      <p className="text-[10px] text-slate-400">x {cuotas} meses</p>
                    </div>
                    <div className={`rounded-xl p-3 border text-center ${convieneTarjetear ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingDown size={11} className={convieneTarjetear ? 'text-emerald-600' : 'text-slate-400'} />
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Valor real ({(IPC_MENSUAL*100).toFixed(1)}%/mes)</p>
                      </div>
                      <p className={`text-xl font-black ${convieneTarjetear ? 'text-emerald-700' : 'text-slate-500'}`}>
                        ${valorRealCuotas.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                      </p>
                      {convieneTarjetear
                        ? <p className="text-[10px] text-emerald-600 font-bold">💡 Te ahorrás ~${ahorroPorInflacion.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
                        : <p className="text-[10px] text-slate-400">Inflación incluida en el cálculo</p>
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ══ DESCUENTO / REINTEGRO ══ — siempre visible, colapsable */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden mb-6">
            <button type="button" onClick={() => setShowRefund(!showRefund)}
              className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-600">¿Tenés descuento, reintegro o cashback?</span>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Opcional</span>
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${showRefund ? 'rotate-180' : ''}`} />
            </button>

            {showRefund && (
              <div className="p-5 bg-white border-t border-slate-100">

                {/* Header "Configurar descuento" arriba del toggle */}
                <div className="mb-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Configurar descuento</p>
                  <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                    <button type="button" onClick={() => setRefundType('amount')} className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${refundType === 'amount' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                      <DollarSign size={14} /> Monto Fijo
                    </button>
                    <button type="button" onClick={() => setRefundType('percentage')} className={`flex-1 py-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${refundType === 'percentage' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                      <Percent size={14} /> Porcentaje
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className={refundType === 'percentage' ? 'md:col-span-6' : 'md:col-span-12'}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">{refundType === 'amount' ? 'Monto del descuento' : 'Porcentaje (%)'}</label>
                    <div className="relative">
                      <input type="number" placeholder={refundType === 'amount' ? 'Ej: 2000' : 'Ej: 30'}
                        className="w-full bg-green-50 border border-green-200 text-green-700 font-bold rounded-xl px-4 pl-9 outline-none focus:ring-2 focus:ring-green-200 h-[44px]"
                        value={newTx.refund} onChange={(e) => setNewTx({ ...newTx, refund: e.target.value })} />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">{refundType === 'amount' ? <DollarSign size={16} /> : <Percent size={16} />}</div>
                    </div>
                  </div>
                  {refundType === 'percentage' && (
                    <div className="md:col-span-6">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tope máximo (opcional)</label>
                        {monto > 0 && refundInputVal > 0 && (
                          <span className="text-[10px] text-slate-400 font-bold">
                            sin tope: <span className="text-green-600">-${((monto * refundInputVal) / 100).toLocaleString('es-AR', { maximumFractionDigits: 0 })}</span>
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input type="number" placeholder="Ej: 5000"
                          className="w-full bg-white border border-slate-200 text-slate-600 font-bold rounded-xl px-4 pl-9 outline-none focus:ring-2 focus:ring-slate-200 h-[44px]"
                          value={newTx.refundCap} onChange={(e) => setNewTx({ ...newTx, refundCap: e.target.value })} />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><AlertCircle size={16} /></div>
                      </div>
                    </div>
                  )}
                </div>

                {reintegroEstimado > 0 && (
                  <div className="mt-4 bg-green-50 border border-green-100 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Descuento estimado</p>
                      <p className="text-lg font-black text-green-700">-${reintegroEstimado.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
                      {aplicoTope && <p className="text-[10px] text-orange-500 font-bold">* Tope de ${capVal} aplicado</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Costo real final</p>
                      <p className="text-2xl font-black text-slate-800">${costoReal.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-black text-white font-black py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg transform active:scale-[0.99] flex justify-center items-center gap-2 text-lg">
            GUARDAR GASTO <Plus size={24} />
          </button>
        </form>
      )}
    </div>
  );
}