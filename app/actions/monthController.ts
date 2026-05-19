'use server'

import { supabase } from '@/lib/supabase';

// Esta función se ejecuta cuando el usuario dice "Arrancar Febrero"
export async function createNewMonth(userId: string, date: string) {
  
  // 1. Averiguar cuál fue el mes anterior
  const currentDate = new Date(date);
  const prevDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const prevDateString = prevDate.toISOString().split('T')[0]; // "2025-01-01"

  // 2. Buscar si existe el presupuesto del mes anterior en la BD
  const { data: prevMonth } = await supabase
    .from('monthly_budgets')
    .select('id, income_projected, previous_month_rollover')
    .eq('user_id', userId)
    .eq('month_date', prevDateString)
    .single();

  let rollover = 0;

  // 3. Si existe mes anterior, calcular cuánto sobró (ECUACIÓN OCULTA EN EL BACKEND)
  if (prevMonth) {
    // Buscamos cuánto gastó realmente
    const { data: transactions } = await supabase
      .from('transactions')
      .select('amount')
      .eq('budget_month_id', prevMonth.id);

    const totalGastado = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0;
    
    // Ingresos + Sobrante viejo - Gastado
    const totalDisponible = Number(prevMonth.income_projected) + Number(prevMonth.previous_month_rollover);
    
    rollover = totalDisponible - totalGastado;
  }

  // 4. Crear el nuevo mes con el saldo inicial calculado (o 0 si es el primero)
  const { data, error } = await supabase
    .from('monthly_budgets')
    .insert({
      user_id: userId,
      month_date: date,
      previous_month_rollover: rollover, // <--- Aquí guardamos el resto automáticamente
      income_projected: 0 // El usuario deberá poner su sueldo nuevo
    })
    .select()
    .single();

  if (error) {
    console.error('Error creando mes:', error);
    return { success: false, error: error.message };
  }

  return { success: true, newMonth: data, message: `Mes creado. Saldo a favor traído: $${rollover}` };
}