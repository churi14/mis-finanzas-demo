"use client";
import { useMemo } from 'react';
import { PieChart as PieIcon, BarChart3, TrendingUp, ShoppingBag, Home } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Transaction, CATEGORIES } from '@/types/dashboard';

const formatMoney = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }).format(val);

interface Props {
  transactions: Transaction[];
}

export default function ChartsSection({ transactions }: Props) {
  
  // 1. Datos para Barras (Top Gastos)
  const expensesByCategory = useMemo(() => {
    const grouped: Record<string, number> = {};
    transactions.forEach(tx => { grouped[tx.categoryId] = (grouped[tx.categoryId] || 0) + tx.amount; });
    
    return Object.entries(grouped).map(([catId, amount]) => {
      const category = CATEGORIES.find(c => c.id === catId);
      return { 
        name: category?.name || 'Otros', 
        amount: amount, 
        color: category?.color || '#94a3b8' 
      };
    }).sort((a, b) => b.amount - a.amount).slice(0, 5); // Solo mostramos el Top 5
  }, [transactions]);

  // 2. Datos para Torta (Regla 50/30/20)
  const qualityData = useMemo(() => {
    let nec = 0, des = 0, aho = 0;
    let total = 0;

    transactions.forEach(tx => {
        const cat = CATEGORIES.find(c => c.id === tx.categoryId);
        total += tx.amount;
        
        if (cat?.type === 'necesidad') nec += tx.amount;
        else if (cat?.type === 'ahorro') aho += tx.amount;
        else des += tx.amount; // Por defecto es deseo
    });

    // Calculamos porcentajes reales
    const necPerc = total > 0 ? Math.round((nec / total) * 100) : 0;
    const desPerc = total > 0 ? Math.round((des / total) * 100) : 0;
    const ahoPerc = total > 0 ? Math.round((aho / total) * 100) : 0;

    return {
        chartData: [
            { name: 'Necesidades', value: nec, color: '#3b82f6', percent: necPerc }, // Azul
            { name: 'Deseos', value: des, color: '#a855f7', percent: desPerc },      // Violeta
            { name: 'Ahorro/Inv.', value: aho, color: '#10b981', percent: ahoPerc }   // Verde
        ].filter(d => d.value > 0),
        total,
        necPerc // Usamos este para el número central
    };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      
      {/* --- GRÁFICO 1: CALIDAD DEL GASTO (TORTA INTELIGENTE) --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
            <PieIcon size={20} className="text-gray-400"/>
            <h3 className="font-bold text-xl text-gray-800">Calidad del Gasto</h3>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-8 h-full">
            {/* El Gráfico */}
            <div className="h-48 w-48 relative flex-shrink-0">
                {qualityData.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie 
                                data={qualityData.chartData} 
                                cx="50%" cy="50%" 
                                innerRadius={60} 
                                outerRadius={80} 
                                paddingAngle={5} 
                                dataKey="value"
                            >
                                {qualityData.chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value: any) => formatMoney(Number(value))} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-gray-100 border-dashed">
                        <span className="text-xs text-gray-300 font-bold">Sin datos</span>
                    </div>
                )}
                
                {/* Texto Central Dinámico */}
                <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                    <span className="text-3xl font-black text-blue-600">
                        {qualityData.chartData.length > 0 ? `${qualityData.necPerc}%` : '0%'}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Necesidades</span>
                </div>
            </div>

            {/* La Leyenda Detallada (Lo que pedías) */}
            <div className="flex-1 w-full space-y-3">
                {qualityData.chartData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-500 uppercase">{item.name}</span>
                                <span className="text-sm font-black text-gray-800">{item.percent}%</span>
                            </div>
                        </div>
                        <span className="font-medium text-gray-600">{formatMoney(item.value)}</span>
                    </div>
                ))}
                
                {qualityData.chartData.length === 0 && (
                    <p className="text-sm text-gray-400 text-center italic">Carga gastos para ver tu balance 50/30/20.</p>
                )}
            </div>
        </div>
      </div>

      {/* --- GRÁFICO 2: BARRAS (TOP GASTOS) --- */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-gray-400"/>
            <h3 className="font-bold text-xl text-gray-800">Top Gastos</h3>
        </div>
        <div className="h-64 w-full">
          {expensesByCategory.length > 0 ? (
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={expensesByCategory} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9"/>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 11, fill: '#64748b'}} />
                <Tooltip 
                    formatter={(value: any) => formatMoney(Number(value))} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f8fafc'}} 
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={30}>
                  {expensesByCategory.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-300">
                <BarChart3 size={40} className="mb-2 opacity-20"/>
                <span className="text-sm">Tu ranking de gastos aparecerá aquí</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}