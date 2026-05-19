"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Target, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Subgoal {
  id: number;
  goal_id: number;
  name: string;
  target_amount: number;
  current_amount: number;
}

interface Goal {
  id: number;
  name: string;
  emoji: string;
  target_amount: number;
  subgoals: Subgoal[];
}

const formatMoney = (val: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(val);

const EMOJIS = ["🎯", "✈️", "🏠", "📱", "🚗", "👟", "💻", "🎓", "💍", "🏖️", "🎸", "🐶"];

export default function MetasAhorro({ privacyMode }: { privacyMode: boolean }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [expandedGoal, setExpandedGoal] = useState<number | null>(null);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalEmoji, setNewGoalEmoji] = useState("🎯");
  const [newGoalAmount, setNewGoalAmount] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newSubAmount, setNewSubAmount] = useState("");
  const [addingSubTo, setAddingSubTo] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    const { data: goalsData } = await supabase
      .from("savings_goals")
      .select("*")
      .order("created_at", { ascending: true });

    const { data: subData } = await supabase
      .from("savings_subgoals")
      .select("*")
      .order("created_at", { ascending: true });

    if (goalsData) {
      const enriched: Goal[] = goalsData.map((g) => ({
        ...g,
        subgoals: subData?.filter((s) => s.goal_id === g.id) || [],
      }));
      setGoals(enriched);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoalName.trim() || !newGoalAmount) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { error } = await supabase.from("savings_goals").insert({
      user_id: session.user.id,
      name: newGoalName.trim(),
      emoji: newGoalEmoji,
      target_amount: Number(newGoalAmount),
    });

    if (!error) {
      setNewGoalName("");
      setNewGoalAmount("");
      setNewGoalEmoji("🎯");
      setShowNewGoal(false);
      fetchGoals();
    }
    setLoading(false);
  };

  const handleAddSubgoal = async (goalId: number) => {
    if (!newSubName.trim() || !newSubAmount) return;
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    await supabase.from("savings_subgoals").insert({
      goal_id: goalId,
      user_id: session.user.id,
      name: newSubName.trim(),
      target_amount: Number(newSubAmount),
      current_amount: 0,
    });

    setNewSubName("");
    setNewSubAmount("");
    setAddingSubTo(null);
    fetchGoals();
    setLoading(false);
  };

  const handleDeleteGoal = async (id: number) => {
    await supabase.from("savings_goals").delete().eq("id", id);
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleDeleteSubgoal = async (id: number) => {
    await supabase.from("savings_subgoals").delete().eq("id", id);
    fetchGoals();
  };

  const handleUpdateSubAmount = async (subgoal: Subgoal, delta: number) => {
    const newAmount = Math.max(0, subgoal.current_amount + delta);
    await supabase
      .from("savings_subgoals")
      .update({ current_amount: newAmount })
      .eq("id", subgoal.id);
    fetchGoals();
  };

  const totalMeta = goals.reduce((acc, g) => acc + g.target_amount, 0);
  const totalAcumulado = goals.reduce(
    (acc, g) => acc + g.subgoals.reduce((a, s) => a + s.current_amount, 0),
    0
  );
  const porcentajeTotal = totalMeta > 0 ? Math.min((totalAcumulado / totalMeta) * 100, 100) : 0;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-xl">🎯</span>
          <h2 className="text-base font-black text-slate-800 uppercase tracking-wider">
            Mis Metas
          </h2>
        </div>
        <button
          onClick={() => setShowNewGoal(!showNewGoal)}
          className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-bold hover:bg-slate-700 transition-colors flex items-center gap-1"
        >
          <Plus size={14} strokeWidth={3} /> Nueva meta
        </button>
      </div>

      {/* Progreso global */}
      {goals.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-4 mb-5 border border-slate-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Meta total del mes
            </span>
            <span className="text-sm font-black text-slate-800">
              {privacyMode ? "***" : formatMoney(totalAcumulado)}{" "}
              <span className="text-slate-400 font-medium">
                / {privacyMode ? "***" : formatMoney(totalMeta)}
              </span>
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-emerald-500 transition-all duration-700"
              style={{ width: `${porcentajeTotal}%` }}
            />
          </div>
          <p className="text-right text-[10px] text-emerald-600 font-bold mt-1">
            {Math.round(porcentajeTotal)}% de tu meta
          </p>
        </div>
      )}

      {/* Formulario nueva meta */}
      {showNewGoal && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4 animate-in fade-in slide-in-from-top-2">
          <p className="text-xs font-black text-blue-600 uppercase tracking-wider mb-3">
            Nueva meta
          </p>
          <div className="flex gap-2 mb-3 flex-wrap">
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setNewGoalEmoji(e)}
                className={`text-xl p-1.5 rounded-lg transition-all ${
                  newGoalEmoji === e
                    ? "bg-blue-200 ring-2 ring-blue-400 scale-110"
                    : "hover:bg-blue-100"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ej: Zapatillas..."
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              className="flex-1 bg-white border border-blue-200 rounded-xl px-3 py-2.5 text-sm outline-none font-medium"
            />
            <input
              type="number"
              placeholder="$"
              value={newGoalAmount}
              onChange={(e) => setNewGoalAmount(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddGoal()}
              className="w-28 bg-white border border-blue-200 rounded-xl px-3 py-2.5 text-sm outline-none font-bold"
            />
            <button
              onClick={handleAddGoal}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              + Agregar
            </button>
          </div>
        </div>
      )}

      {/* Lista de metas */}
      {goals.length === 0 ? (
        <p className="text-sm text-slate-400 text-center py-4 font-medium">
          Creá tu primera meta y hacé que la plata trabaje para vos.
        </p>
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const subTotal = goal.subgoals.reduce((a, s) => a + s.target_amount, 0);
            const subAcumulado = goal.subgoals.reduce((a, s) => a + s.current_amount, 0);
            const pct = goal.target_amount > 0
              ? Math.min((subAcumulado / goal.target_amount) * 100, 100)
              : 0;
            const isComplete = subAcumulado >= goal.target_amount && goal.target_amount > 0;
            const isExpanded = expandedGoal === goal.id;

            return (
              <div
                key={goal.id}
                className={`border rounded-2xl overflow-hidden transition-all ${
                  isComplete
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-100 bg-white"
                }`}
              >
                {/* Cabecera de la meta */}
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{goal.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800 text-sm">{goal.name}</p>
                        {isComplete && (
                          <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                            ✅ Meta alcanzada
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1.5">
                        <div
                          className="h-1.5 rounded-full bg-emerald-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    <span className="text-sm font-black text-slate-700 whitespace-nowrap">
                      {privacyMode ? "***" : formatMoney(goal.target_amount)}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteGoal(goal.id); }}
                      className="text-slate-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                {/* Submetas expandidas */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-2">
                    {goal.subgoals.map((sub) => {
                      const subPct = sub.target_amount > 0
                        ? Math.min((sub.current_amount / sub.target_amount) * 100, 100)
                        : 0;
                      return (
                        <div key={sub.id} className="flex items-center gap-3 group">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-slate-700">{sub.name}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500">
                                  {privacyMode ? "***" : `${formatMoney(sub.current_amount)} / ${formatMoney(sub.target_amount)}`}
                                </span>
                                <button
                                  onClick={() => handleDeleteSubgoal(sub.id)}
                                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-all ${subPct >= 100 ? "bg-emerald-500" : "bg-blue-400"}`}
                                style={{ width: `${subPct}%` }}
                              />
                            </div>
                          </div>
                          {/* Botones +/- para trackear progreso */}
                          <div className="flex gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleUpdateSubAmount(sub, -1000)}
                              className="text-xs bg-slate-100 hover:bg-slate-200 w-6 h-6 rounded-lg font-bold transition-colors"
                            >
                              -
                            </button>
                            <button
                              onClick={() => handleUpdateSubAmount(sub, 1000)}
                              className="text-xs bg-emerald-100 hover:bg-emerald-200 w-6 h-6 rounded-lg font-bold text-emerald-700 transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* Agregar submeta */}
                    {addingSubTo === goal.id ? (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Concepto"
                          value={newSubName}
                          onChange={(e) => setNewSubName(e.target.value)}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none font-medium"
                        />
                        <input
                          type="number"
                          placeholder="$"
                          value={newSubAmount}
                          onChange={(e) => setNewSubAmount(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddSubgoal(goal.id)}
                          className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs outline-none font-bold"
                        />
                        <button
                          onClick={() => handleAddSubgoal(goal.id)}
                          disabled={loading}
                          className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-bold"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => setAddingSubTo(null)}
                          className="text-slate-400 px-2 text-xs hover:text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingSubTo(goal.id)}
                        className="text-xs text-blue-500 font-bold hover:underline flex items-center gap-1 mt-1"
                      >
                        <Plus size={12} /> Agregar submeta
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}