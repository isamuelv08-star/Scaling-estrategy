import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface StrategyChatProps {
  planContext: string; // el texto completo de todas las secciones ya generadas
  businessName: string;
  invokeEdgeFunction: (payload: any) => Promise<any>;
}

export const StrategyChat: React.FC<StrategyChatProps> = ({
  planContext,
  businessName,
  invokeEdgeFunction,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Solo mandamos las últimas 6 interacciones (12 mensajes) como historial —
      // el plan completo va aparte, cacheado, no como parte del historial que crece.
      const recentHistory = newMessages.slice(-12);

      const response = await invokeEdgeFunction({
        action: "generate",
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: [
          {
            type: "text",
            text: `Eres un asistente que responde preguntas sobre la estrategia de marketing ya generada para el negocio "${businessName}". Responde SOLO con base en el plan que se te da a continuación — si la pregunta no se puede responder con ese plan, dilo claramente en vez de inventar. Sé breve, directo, en lenguaje simple sin jerga sin explicar. Máximo 4-5 líneas por respuesta.`,
          },
          {
            type: "text",
            text: `PLAN COMPLETO DE ESTE NEGOCIO:\n\n${planContext}`,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: recentHistory,
      });

      const block = response?.content?.find((b: any) => b.type === "text");
      const answer = block?.text?.trim() || "No pude generar una respuesta. Intenta de nuevo.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Hubo un error respondiendo. Intenta de nuevo en un momento." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón en la barra lateral */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all duration-200 cursor-pointer"
      >
        <MessageCircle size={16} className="text-blue-600 shrink-0" />
        <span className="truncate">Preguntar sobre tu estrategia</span>
      </button>

      {/* Ventana flotante */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-900 text-white">
            <span className="font-semibold text-sm truncate">Preguntas sobre {businessName || "tu negocio"}</span>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white cursor-pointer">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <p className="text-xs text-slate-400 text-center mt-8 px-4">
                Pregunta cualquier cosa sobre el plan que se generó — ej. "¿qué significa CAC aquí?" o "¿cuál es mi prioridad para el mes 1?"
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm rounded-xl px-3 py-2 max-w-[85%] ${
                  m.role === "user"
                    ? "bg-blue-600 text-white ml-auto text-right"
                    : "bg-slate-100 text-slate-800 text-left"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <Loader2 size={14} className="animate-spin text-blue-600" /> Pensando...
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <div className="p-3 border-t border-slate-100 flex gap-2 bg-slate-50">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe tu pregunta..."
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-slate-200 outline-none focus:border-blue-400 bg-white"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
