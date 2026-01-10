import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

// Tipos de datos
interface Transaction {
  amount: number;
  date: string;
  type?: 'income' | 'expense'; // Asumimos que si no tiene type es gasto por defecto en tu lógica actual
}

interface MonthlyComparisonProps {
  transactions: Transaction[];
}

export default function MonthlyComparison({ transactions }: MonthlyComparisonProps) {
  
  // 1. PROCESAMIENTO DE DATOS (Agrupar gastos por mes)
  const processData = () => {
    const today = new Date();
    const data = [];
    
    // Generamos los últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = d.toLocaleDateString('es-AR', { month: 'short' }).toUpperCase(); // ENE, FEB...
      const monthKey = d.getMonth(); // 0-11
      
      // Filtramos gastos de este mes específico
      const totalGasto = transactions
        .filter(t => {
            const tDate = new Date(t.date);
            return tDate.getMonth() === monthKey && tDate.getFullYear() === d.getFullYear();
        })
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // --- TRUCO PARA EL PORTFOLIO ---
      // Si el mes no tiene datos (porque la app es nueva), inventamos un "promedio" 
      // para que el gráfico no se vea vacío. (BORRAR ESTO EN PRODUCCIÓN REAL)
      let displayAmount = totalGasto;
      if (totalGasto === 0 && i > 0) {
         // Genera números aleatorios entre 400k y 700k para meses pasados simulados
         displayAmount = Math.floor(Math.random() * (700000 - 400000 + 1)) + 400000;
      }

      data.push({
        name: monthName,
        gasto: displayAmount,
        real: totalGasto > 0 // Flag para saber si es dato real o simulado
      });
    }
    return data;
  };

  const data = processData();
  const currentMonth = data[data.length - 1];
  const lastMonth = data[data.length - 2];

  // Cálculo de variación
  const difference = currentMonth.gasto - lastMonth.gasto;
  const isBetter = difference < 0; // Es mejor si gastaste menos
  const percentChange = lastMonth.gasto > 0 ? ((difference / lastMonth.gasto) * 100).toFixed(0) : 0;

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mt-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <TrendingUp className="text-blue-600" /> Evolución de Gastos
            </h3>
            <p className="text-slate-400 text-sm font-medium mt-1">Comparativa de los últimos 6 meses</p>
        </div>

        {/* INSIGHT AUTOMÁTICO (LO QUE PIDIÓ TU AMIGO) */}
        <div className={`px-4 py-3 rounded-2xl border flex items-center gap-3 ${isBetter ? 'bg-green-50 border-green-100 text-green-700' : 'bg-orange-50 border-orange-100 text-orange-700'}`}>
            <div className={`p-2 rounded-full ${isBetter ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'}`}>
                {isBetter ? <ArrowDownRight size={20}/> : <ArrowUpRight size={20}/>}
            </div>
            <div>
                <p className="text-xs font-bold opacity-70 uppercase tracking-wider">
                    {isBetter ? 'Vienes Ahorrando' : 'Cuidado, subió'}
                </p>
                <p className="text-lg font-black leading-none">
                    {isBetter ? 'Bajaste un' : 'Subiste un'} {Math.abs(Number(percentChange))}%
                </p>
            </div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 'bold' }} 
                dy={10}
            />
            <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                tickFormatter={(value) => `$${value/1000}k`} // Formato corto: $500k
            />
            <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`$${value.toLocaleString('es-AR')}`, 'Total Gastado']}
            />
            <Bar dataKey="gasto" radius={[6, 6, 0, 0]} barSize={50}>
              {data.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={index === data.length - 1 ? '#2563eb' : '#cbd5e1'} // Azul para el actual, Gris para los pasados
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-center text-xs text-slate-300 mt-4 font-medium">
        * Datos simulados para meses anteriores hasta que completes tu historial.
      </p>
    </div>
  );
}