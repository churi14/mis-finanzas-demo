// src/app/actions/budgetLogic.ts
'use server'

// ESTE ARCHIVO SE EJECUTA SOLO EN EL SERVIDOR.
// EL USUARIO NUNCA VE ESTE CÓDIGO NI LAS FÓRMULAS.

interface BudgetInput {
  income: number;
  expenses: {
    necesidades: number;
    deseos: number;
    ahorros: number;
  };
}

export async function calculateMonthlyBudget(data: BudgetInput) {
  // Simulo un pequeño delay para que parezca que "piensa" (opcional)
  // await new Promise(resolve => setTimeout(resolve, 500));

  const { income, expenses } = data;

  // --- FÓRMULAS PRIVADAS (Tus ecuaciones de Excel) ---
  
  // 1. Regla 50/30/20 (Metas ideales)
  const idealNecesidades = income * 0.50;
  const idealDeseos = income * 0.30;
  const idealAhorros = income * 0.20;

  // 2. Cálculo de Realidad (Gastado vs Ideal)
  const totalGastado = expenses.necesidades + expenses.deseos + expenses.ahorros;
  
  // 3. Cashflow
  const saldoFinal = income - totalGastado;

  // 4. Diagnóstico (Lógica de negocio privada)
  let diagnostico = "";
  if (saldoFinal < 0) {
    diagnostico = "DÉFICIT CRÍTICO: Estás gastando más de lo que generas.";
  } else if (expenses.necesidades > idealNecesidades) {
    diagnostico = "ALERTA: Tus gastos fijos superan el 50% recomendado.";
  } else if (expenses.ahorros < idealAhorros) {
    diagnostico = "MEJORABLE: Tienes capacidad de ahorro, pero no llegas al 20%.";
  } else {
    diagnostico = "SALUDABLE: Tus finanzas están equilibradas.";
  }

  // Solo devolvemos los resultados procesados, no la lógica.
  return {
    success: true,
    data: {
      metas: {
        necesidades: idealNecesidades,
        deseos: idealDeseos,
        ahorros: idealAhorros
      },
      estadoActual: {
        totalGastado,
        saldoFinal,
        porcentajeGastado: (totalGastado / income) * 100
      },
      mensajeSistema: diagnostico
    }
  };
}