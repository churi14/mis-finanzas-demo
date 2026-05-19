"use client";

interface MascotaProps {
  totalIncome: number;
  totalGastos: number;
}

function getMascotaState(totalIncome: number, totalGastos: number) {
  if (totalIncome === 0) {
    return {
      emoji: "😴",
      cara: "( ˘ ˘ )",
      estado: "Sin datos aún",
      mensaje: "¡Registrá tus ingresos para empezar!",
      color: "from-slate-100 to-slate-200",
      textColor: "text-slate-500",
      ring: "ring-slate-300",
    };
  }

  const porcentajeGasto = (totalGastos / totalIncome) * 100;

  if (porcentajeGasto >= 100) {
    return {
      emoji: "😱",
      cara: "( ˚ ᗜ ˚ )",
      estado: "¡Gastaste todo!",
      mensaje: "Cuidado, los gastos superaron los ingresos.",
      color: "from-red-100 to-red-200",
      textColor: "text-red-500",
      ring: "ring-red-300",
    };
  }

  if (porcentajeGasto >= 80) {
    return {
      emoji: "😰",
      cara: "( ≧ ロ ≦ )",
      estado: "Muy ajustado",
      mensaje: "Poco margen. Cuidá los gastos que quedan.",
      color: "from-orange-100 to-orange-200",
      textColor: "text-orange-500",
      ring: "ring-orange-300",
    };
  }

  if (porcentajeGasto >= 50) {
    return {
      emoji: "🙂",
      cara: "( ᵕ ᵕ )",
      estado: "Vas encaminado",
      mensaje: "¡Cada peso cuenta! Seguí registrando.",
      color: "from-yellow-100 to-yellow-200",
      textColor: "text-yellow-600",
      ring: "ring-yellow-300",
    };
  }

  if (porcentajeGasto >= 20) {
    return {
      emoji: "😄",
      cara: "( ＾ ᵕ ＾ )",
      estado: "¡Buen mes!",
      mensaje: "Vas muy bien. ¡Un empujón más!",
      color: "from-green-100 to-green-200",
      textColor: "text-green-600",
      ring: "ring-green-300",
    };
  }

  return {
    emoji: "🤩",
    cara: "( ★ ᗜ ★ )",
    estado: "¡Sos una máquina!",
    mensaje: "Ahorro excelente este mes. ¡Orgullo total!",
    color: "from-blue-100 to-violet-200",
    textColor: "text-violet-600",
    ring: "ring-violet-300",
  };
}

export default function Mascota({ totalIncome, totalGastos }: MascotaProps) {
  const state = getMascotaState(totalIncome, totalGastos);

  return (
    <div
      className={`bg-gradient-to-br ${state.color} rounded-3xl p-5 flex items-center gap-5 border ring-2 ${state.ring} shadow-sm`}
    >
      {/* Moneda animada */}
      <div className="relative flex-shrink-0">
        <div
          className="text-6xl animate-bounce select-none"
          style={{ animationDuration: "2s" }}
        >
          🪙
        </div>
        <div
          className={`absolute -bottom-1 -right-1 text-xl animate-pulse select-none`}
        >
          {state.emoji}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs font-black uppercase tracking-widest ${state.textColor} mb-0.5`}>
          Monedita dice:
        </p>
        <p className={`text-base font-extrabold text-slate-800 leading-tight`}>
          {state.estado}
        </p>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          "{state.mensaje}"
        </p>
      </div>
    </div>
  );
}