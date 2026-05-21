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
}

const KEYWORDS: { words: string[]; id: string; emoji: string }[] = [
  { words: ["delivery","pizza","hamburguesa","sushi","empanada","comida","almuerzo","cena","desayuno","medialunas","cafe","restaurant","resto"], id: "comida", emoji: "🍕" },
  { words: ["supermercado","mercado","almacen","verduleria","carniceria","compras","super","dia","coto","jumbo","disco","vea"], id: "supermercado", emoji: "🛒" },
  { words: ["luz","gas","agua","internet","telefono","celular","movistar","personal","claro","servicio","expensa"], id: "servicios", emoji: "💡" },
  { words: ["nafta","sube","colectivo","taxi","uber","cabify","remis","peaje","estacionamiento","tren","subte","combustible"], id: "transporte", emoji: "🚌" },
  { words: ["farmacia","medico","doctor","clinica","hospital","medicamento","remedio","turno","salud","dentista"], id: "salud", emoji: "💊" },
  { words: ["curso","libro","universidad","facultad","colegio","estudio","educacion","capacitacion","ingles"], id: "educacion", emoji: "📚" },
  { words: ["netflix","spotify","hbo","disney","prime","cine","teatro","bar","boliche","salida","trago","cerveza","vino","fiesta","ocio","juego","videojuego"], id: "ocio", emoji: "🎉" },
  { words: ["ropa","zapatilla","camisa","pantalon","remera","vestido","buzo","campera","calzado","indumentaria"], id: "ropa", emoji: "👕" },
  { words: ["celular","notebook","computadora","tablet","auricular","electronico","tecnologia","cargador","cable"], id: "tecnologia", emoji: "💻" },
  { words: ["alquiler","expensas","casa","depto","mueble","ferreteria","plomero","electricista","pintura"], id: "casa", emoji: "🏠" },
];

const AMOUNT_REGEX = /\$?\s?(\d[\d.,]*)/;

function detectCategory(text: string): { id: string; emoji: string } {
  const lower = text.toLowerCase();
  for (const cat of KEYWORDS) {
    if (cat.words.some(w => lower.includes(w))) {
      return { id: cat.id, emoji: cat.emoji };
    }
  }
  return { id: "varios", emoji: "📦" };
}

function extractAmount(text: string): number | null {
  const match = text.match(AMOUNT_REGEX);
  if (!match) return null;
  const clean = match[1].replace(/\./g, "").replace(",", ".");
  const num = parseFloat(clean);
  return isNaN(num) ? null : num;
}

function extractDesc(text: string): string {
  // Sacar palabras de cantidad para quedarnos con la descripción
  const cleaned = text
    .replace(/gasté|gaste|pague|pagué|compré|compre|me costó|me costo/gi, "")
    .replace(/\$?\s?\d[\d.,]*/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1) || "Gasto";
}

function parse(text: string): ParsedTx | null {
  const amount = extractAmount(text);
  if (!amount) return null;
  const cat = detectCategory(text);
  const desc = extractDesc(text);
  return { desc, amount, categoryId: cat.id, categoryEmoji: cat.emoji };
}

const fmt = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 0 }).format(n);

export default function MonaditaChat({ onAdd, onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "monedita", text: "¡Hola! Contame en qué gastaste y yo me encargo del resto 😄" }
  ]);
  const [input, setInput] = useState("");
  const [pendingTx, setPendingTx] = useState<ParsedTx | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);

    const parsed = parse(userMsg);
    if (!parsed) {
      setMessages(prev => [...prev, {
        role: "monedita",
        text: "No encontré el monto 😅 Escribí algo como: 'gasté 5000 en delivery'"
      }]);
      return;
    }

    setPendingTx(parsed);
    setMessages(prev => [...prev, {
      role: "monedita",
      text: `Entendido ${parsed.categoryEmoji} ¿Lo anoto como:`,
      parsed
    }]);
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
      text: `✅ ¡Listo! Registrado en ${pendingTx.categoryId}. ¿Querés anotar otro?`
    }]);
  };

  const handleCancel = () => {
    setPendingTx(null);
    setMessages(prev => [...prev, {
      role: "monedita",
      text: "Cancelado. ¿Lo querés escribir de otra forma?"
    }]);
  };

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 mb-6 shadow-2xl">
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

      <div className="h-56 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
            {msg.role === "monedita" && <span className="text-xl flex-shrink-0 mt-1">🪙</span>}
            <div className="max-w-[80%] space-y-2">
              <div className={`px-4 py-3 rounded-2xl text-sm font-medium ${msg.role === "user" ? "bg-white text-slate-900 rounded-tr-sm" : "bg-slate-700 text-white rounded-tl-sm"}`}>
                {msg.text}
              </div>
              {msg.parsed && pendingTx && (
                <div className="bg-slate-800 border border-slate-600 rounded-2xl p-3 space-y-2">
                  <p className="text-white font-black text-base">-{fmt(msg.parsed.amount)}</p>
                  <p className="text-slate-400 text-xs font-medium">{msg.parsed.categoryEmoji} {msg.parsed.desc} · {msg.parsed.categoryId}</p>
                  <div className="flex gap-2 pt-1">
                    <button onClick={handleConfirm} className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-sm py-2 rounded-xl transition-colors">Sí, anotalo</button>
                    <button onClick={handleCancel} className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-bold text-sm py-2 rounded-xl transition-colors">Cancelar</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-4 border-t border-slate-700 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Ej: gasté 35000 en delivery..."
          className="flex-1 bg-slate-800 border border-slate-600 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 transition-colors font-medium"
        />
        <button onClick={handleSend} disabled={!input.trim()} className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-white font-black px-4 py-3 rounded-xl transition-colors">↵</button>
      </div>
    </div>
  );
}