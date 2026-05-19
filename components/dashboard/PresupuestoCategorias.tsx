"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Transaction, CATEGORIES } from "@/types/dashboard";

interface Budget {
  id: number;
  category_id: string;
  amount: number;
}

interface Props {
  transactions: Transaction[]; // del mes actual
  privacyMode: boolean;
}

const formatMoney = (val: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(val);

export default function PresupuestoCategorias({ transactions, privacyMode }: Props) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0].id);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    const { data } = await supabase
      .from("category_budgets")
      .select("*")
      .order("id", { ascending: true });
    if (data) setBudgets(data);
  };

  const handleAdd = async () => {
    if (!amount || Number(amount) <= 0) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // Upsert: si ya existe esa categoría la actualiza
    const { error } = await supabase.from("category_budgets").upsert(
      {
        user_id: session.user.id,
        category_id: selectedCat,
        amount: Number(amount),
      },
      { onConflict: "user_id,category_id" }
    );

    if (!error) {
      setAmount("");
      fetchBudgets();
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    await supabase.from("category_budgets").delete().eq("id", id);
    setBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  // Gastos del mes actual por categoría
  const gastosPorCategoria: Record<string, number> = {};
  transactions.forEach((tx) => {
    if (tx.source === "mes") {
      gastosPorCategoria[tx.categoryId] =
        (gastosPorCategoria[tx.categoryId] || 0) + tx.amount;
    }
  });

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl">💸</span>
        <h2 className="text-base font-black text-slate-800 uppercase tracking-wider">
          Presupuesto por Categoría
        </h2>
      </div>

      {/* Barras de progreso */}
      {budgets.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4 font-medium">
          Asigná un límite mensual a tus categorías y te avisamos cuando te estés pasando.
        </p>
      ) : (
        <div className="space-y-3 mb-5">
          {budgets.map((budget) => {
            const cat = CATEGORIES.find((c) => c.id === budget.category_id);
            const gastado = gastosPorCategoria[budget.category_id] || 0;
            const porcentaje = Math.min((gastado / budget.amount) * 100, 100);
            const superado = gastado > budget.amount;

            return (
              <div key={budget.id} className="group">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{cat?.name || budget.category_id}</span>
                    {superado && (
                      <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                        <AlertTriangle size={10} />
                        {Math.round((gastado / budget.amount) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">
                      {privacyMode
                        ? "***"
                        : `${formatMoney(gastado)} de ${formatMoney(budget.amount)}`}
                    </span>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      superado
                        ? "bg-red-500"
                        : porcentaje > 70
                        ? "bg-orange-400"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Formulario para agregar */}
      <div className="flex gap-2 pt-4 border-t border-slate-50">
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none font-medium"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Límite $"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          className="w-32 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none font-bold"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors flex items-center gap-1"
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}