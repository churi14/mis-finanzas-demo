"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  onAdd: (transaction: any) => void;
  onClose: () => void;
}

interface Message {
  role: "user" | "monedita";
  text: string;
  parsed?: ParsedTx;
}

interface ParsedTx {
  desc: string;
  amount: number;
  categoryId: string;
  categoryEmoji: string;
  source: string;
}

const CATEGORY_MAP: Record<string, { id: string; emoji: string }> = {
  comida:        { id: "comida",       emoji: "🍕" },
  delivery:      { id: "comida",       emoji: "🛵" },
  restaurante:   { id: "comida",       emoji: "🍽️" },
  supermercado:  { id: "supermercado", emoji: "🛒" },
  mercado:       { id: "supermercado", emoji: "🛒" },
  almacen:       { id: "supermercado", emoji: "🛒" },
  servicios:     { id: "servicios",    emoji: "💡" },
  luz:           { id: "servicios",    emoji: "💡" },
  gas:           { id: "servicios",    emoji: "🔥" },
  internet:      { id: "servicios",    emoji: "📡" },
  transporte:    { id: "transporte",   emoji: "🚌" },
  nafta:         { id: "transporte",   emoji: "⛽" },
  sube:          { id: "transporte",   emoji: "🚌" },
  uber:          { id: "transporte",   emoji: "🚗" },
  salud:         { id: "salud",        emoji: "💊" },
  farmacia:      { id: "salud",        emoji: "💊" },
  medico:        { id: "salud",        emoji: "🏥" },
  educacion:     { id: "educacion",    emoji: "📚" },
  curso:         { id: "educacion",    emoji: "🎓" },
  ocio:          { id: "ocio",         emoji: "🎉" },
  netflix:       { id: "ocio",         emoji: "🍿" },
  spotify:       { id: "ocio",         emoji: "🎵" },
  cine:          { id: "ocio",         emoji: "🎬" },
  ropa:          { id: "ropa",         emoji: "👕" },
  zapatillas:    { id: "ropa",         emoji: "👟" },
  tecnologia:    { id: "tecnologia",   emoji: "💻" },
  celular:       { id: "tecnologia",   emoji: "📱" },
  casa:          { id: "casa",         emoji: "🏠" },
  alquiler:      { id: "casa",         emoji: "🏠" },
};

export default function MonaditaChat({ onAdd, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "monedita", text: "¡Hola! Contame en qué gastaste y yo me encargo del resto 😄" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingTx, setPendingTx] = useState<ParsedTx | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const callClaude = async (userText: string): Promise<ParsedTx> => {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 200,
        messages: [{
          role: "user",
          content: `Sos un asistente financiero argentino. El usuario escribió: "${userText}"
          
Extraé la información del gasto y respondé SOLO con JSON válido, sin texto extra:
{
  "desc": "descripción corta del gasto",
  "amount": número positivo en pesos argentinos,
  "categoryId": una de estas categorías exactas: comida, supermercado, servicios, transporte, salud, educacion, ocio, ropa, tecnologia, casa, varios,
  "categoryEmoji": emoji que represente la categoría,
  "source": "mes"
}

Si no podés interpretar el gasto, devolvé: {"error": "no entendí"}
Importante: el monto siempre es positivo. Si dice "gasté 35000" el amount es 35000.`
        }],
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const parsed = await callClaude(userMsg);

      if ((parsed as any).error) {
        setMessages(prev => [...prev, {
          role: "monedita",
          text: "No pude entender el gasto 😅 ¿Lo podés escribir de otra forma? Ej: 'gasté 5000 en nafta'"
        }]);
      } else {
        setPendingTx(parsed);
        setMessages(prev => [...prev, {
          role: "monedita",
          text: `Entendido ${parsed.categoryEmoji} ¿Lo anoto como:`,
          parsed
        }]);
      }
    } catch {
      setMessages(prev => [...prev, {
        role: "monedita",
        text: "Tuve un problema procesando eso. Intentá de nuevo 🙏"
      }]);
    }

    setLoading(false);
  };

  const handleConfirm = () => {
    if (!pendingTx) return;
    onAdd({
      desc: pendingTx.desc,
      amount: String(pendingTx.amount),
      categoryId: pendingTx.categoryId,
      source: "mes",
      isCredit: false,
      installments: "1",
      refund: 0,
      bank: "Efectivo",
      brand: "-",
    });
    setPendingTx(null);
    setMessages(prev => [...prev, {
      role: "monedita",
      text: `✅ ¡Listo! Gasto registrado en ${pendingTx.categoryId}. ¿Querés anotar otro?`
    }]);
  };

  const handleCancel = () => {
    setPendingTx(null);
    setMessages(prev => [...prev, {
      role: "monedita",
      text: "Cancelado. ¿Lo querés anotar diferente?"
    }]);
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 mb-6 shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🪙</span>
          <div>
            <p className="font-black text-white text-sm">Decile a Monedita</p>
            <p className="text-slate-400 text-xs">Escribí en lenguaje natural</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white text-xl font-bold transition-colors">✕</button>
      </div>

      {/* Mensajes */}
      <div className="h-64 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {msg.role === "monedita" && <span className="text-xl flex-shrink-0 mt-1">🪙</span>}
            <div className={`max-w-[80%] space-y-2`}>
              <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${
                msg.role === "user"
                  ? "bg-white text-slate-900 rounded-tr-sm"
                  : "bg-slate-700 text-white rounded-tl-sm"
              }`}>
                {msg.text}
              </div>

              {/* Card de confirmación */}
              {msg.parsed && pendingTx && (
                <div className="bg-slate-800 border border-slate-600 rounded-2xl p-3 space-y-2">
                  <p className="text-white font-black text-base">
                    -{new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(msg.parsed.amount)}
                  </p>
                  <p className="text-slate-400 text-xs font-medium">
                    {msg.parsed.categoryEmoji} {msg.parsed.desc} · {msg.parsed.categoryId}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleConfirm}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm py-2 rounded-xl transition-colors"
                    >
                      Sí, anotalo
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold text-sm py-2 rounded-xl transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <div className="bg-slate-700 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-slate-700 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ej: gasté 35000 en delivery..."
          className="flex-1 bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-colors font-medium"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white font-black px-4 py-3 rounded-xl transition-colors"
        >
          ↵
        </button>
      </div>
    </div>
  );
}