import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  User, 
  Copy, 
  Check, 
  RotateCcw, 
  ArrowRight,
  BotMessageSquare
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface StrategyChatProps {
  isOpen: boolean;
  onClose: () => void;
  planContext: string;
  businessName: string;
  invokeEdgeFunction: (payload: any) => Promise<any>;
}

export const StrategyChat: React.FC<StrategyChatProps> = ({
  isOpen,
  onClose,
  planContext,
  businessName,
  invokeEdgeFunction,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    `🎯 ¿Cuáles son los 3 pasos prioritarios para arrancar este mes?`,
    `📊 Explícame el ROI y LTV en palabras sencillas.`,
    `📲 ¿Qué contenido publicar en redes esta semana?`,
    `💡 ¿Cómo diferenciarme de mis competidores?`,
    `🔥 Dame un gancho persuasivo para mis anuncios.`
  ];

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (customQuestion?: string) => {
    const question = (customQuestion || input).trim();
    if (!question || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    if (!customQuestion) setInput("");
    setLoading(true);

    try {
      const recentHistory = newMessages.slice(-12);
      const name = businessName || "tu negocio";

      const systemPrompt = planContext?.trim()
        ? [
            {
              type: "text",
              text: `Eres el Consultor Principal IA de Scaling Strategy para "${name}". Responde las preguntas del usuario basándote en el plan de crecimiento estructurado que se te proporciona a continuación. Sé ultra práctico, claro, directo y estratégico. Usa viñetas o listas numeradas cuando sea apropiado. Si la respuesta no está especificada en el plan, usa tu conocimiento experto en marketing y crecimiento de negocios para responder de manera alineada al contexto del negocio. Máximo 3-5 párrafos concisos por respuesta.`,
            },
            {
              type: "text",
              text: `PLAN COMPLETO DEL NEGOCIO:\n\n${planContext}`,
              cache_control: { type: "ephemeral" },
            },
          ]
        : [
            {
              type: "text",
              text: `Eres el Consultor Principal IA de Scaling Strategy. El usuario aún no ha generado su estrategia completa para "${name}", pero necesita asesoría estratégica rápida de marketing, unit economics, ventas y crecimiento comercial. Sé amable, experto y responde de forma concisa y práctica.`,
            },
          ];

      const response = await invokeEdgeFunction({
        action: "generate",
        model: "claude-haiku-4-5-20251001",
        max_tokens: 600,
        system: systemPrompt,
        messages: recentHistory,
      });

      const block = response?.content?.find((b: any) => b.type === "text");
      const answer = block?.text?.trim() || "No se pudo generar la respuesta en este momento. Por favor reintente.";
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ocurrió un inconveniente al conectar con el asistente. Intenta de nuevo en un momento." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const renderFormattedContent = (content: string) => {
    const paragraphs = content.split("\n\n");
    return paragraphs.map((paragraph, pIdx) => {
      const lines = paragraph.split("\n");
      return (
        <div key={pIdx} className="space-y-1 my-1">
          {lines.map((line, lIdx) => {
            const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("• ");
            const lineText = isBullet ? line.trim().substring(2) : line;

            const parts = lineText.split(/(\*\*.*?\*\*)/g);
            const formattedParts = parts.map((part, partIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={partIdx} className="font-semibold text-slate-900">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            });

            if (isBullet) {
              return (
                <div key={lIdx} className="flex items-start gap-1.5 pl-1 my-0.5">
                  <span className="text-blue-600 font-bold shrink-0">•</span>
                  <span>{formattedParts}</span>
                </div>
              );
            }

            return <p key={lIdx}>{formattedParts}</p>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 transition-opacity animate-fade-in">
      
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sleek Compact Card Modal */}
      <div className="w-full max-w-md sm:max-w-lg h-[520px] max-h-[85vh] bg-white rounded-2xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* PREMIUM LIGHT HEADER */}
        <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-sm font-bold text-slate-900">
                  Consultor IA Estratégico
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  En línea
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate max-w-[210px]">
                {businessName ? `Contexto: ${businessName}` : "Asesoría de Crecimiento"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                title="Reiniciar chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              title="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SUBTLE MEMORY BAR */}
        <div className={`px-4 py-1.5 text-[11px] font-medium flex items-center justify-between shrink-0 border-b ${
          planContext?.trim()
            ? "bg-blue-50/50 border-blue-100/60 text-blue-900"
            : "bg-amber-50/50 border-amber-100/60 text-amber-900"
        }`}>
          <span className="truncate flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${planContext?.trim() ? "bg-blue-500" : "bg-amber-500"}`} />
            {planContext?.trim()
              ? "Pregunta sobre tu plan generado"
              : "Asesoría libre (genera tu estrategia para respuestas exactas)"}
          </span>
          {messages.length > 0 && (
            <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-2">
              {messages.length} msg
            </span>
          )}
        </div>

        {/* MESSAGES / INITIAL CONTENT FEED */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 custom-scrollbar bg-slate-50/40">
          
          {/* WELCOME / QUICK PROMPTS WHEN NO MESSAGES */}
          {messages.length === 0 && (
            <div className="space-y-4 py-2 animate-fade-in">
              <div className="text-center space-y-1.5 max-w-xs mx-auto">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-sm">
                  <BotMessageSquare className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-slate-900 text-xs sm:text-sm">
                  ¿En qué puedo ayudarte hoy?
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Resuelvo dudas de tu estrategia, sugerencias de pauta, contenido y ventas.
                </p>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block text-center">
                  Sugerencias Rápidas
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-left px-3 py-2 rounded-xl bg-white hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-200 text-xs font-medium text-slate-700 hover:text-blue-900 transition shadow-2xs hover:shadow-xs group cursor-pointer flex items-center justify-between gap-2"
                    >
                      <span className="leading-snug truncate">{prompt}</span>
                      <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHAT MESSAGES */}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col space-y-1 animate-fade-in ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {m.role === "user" ? (
                <div className="flex items-end gap-1.5 max-w-[85%]">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-tr-xs px-3.5 py-2 shadow-2xs text-xs leading-relaxed font-medium">
                    {m.content}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-[9px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
                    <User className="w-3 h-3" />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-1.5 max-w-[95%] w-full">
                  <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-bold flex items-center justify-center shrink-0 shadow-2xs mt-1">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <div className="bg-white border border-slate-200/90 text-slate-800 rounded-2xl rounded-tl-xs p-3 shadow-2xs text-xs leading-relaxed w-full space-y-1.5 relative">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[10px] text-slate-400 font-mono">
                      <span className="font-bold text-blue-600 uppercase tracking-wider">Consultor IA</span>
                      <button
                        onClick={() => handleCopy(m.content, i)}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition cursor-pointer px-1 py-0.5 rounded hover:bg-slate-100"
                        title="Copiar respuesta"
                      >
                        {copiedIndex === i ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-slate-800">
                      {renderFormattedContent(m.content)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* LOADING STATE */}
          {loading && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-xs font-medium text-slate-600 max-w-[85%] animate-pulse">
              <div className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Loader2 className="w-3 h-3 animate-spin" />
              </div>
              <span>Analizando y redactando respuesta...</span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* COMPACT INPUT DOCK */}
        <div className="p-2.5 bg-white border-t border-slate-100 shrink-0 space-y-1">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10 rounded-xl p-1 transition-all">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder={
                planContext?.trim()
                  ? `Pregunta sobre ${businessName || "tu negocio"}...`
                  : "Escribe tu pregunta sobre marketing o ventas..."
              }
              className="flex-1 text-xs px-2.5 py-1.5 bg-transparent outline-none text-slate-800 placeholder-slate-400"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-1.5 font-semibold text-xs flex items-center gap-1 transition shadow-2xs active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shrink-0"
            >
              <span>Enviar</span>
              <Send className="w-3 h-3" />
            </button>
          </div>

          <div className="flex justify-between items-center px-1 text-[10px] text-slate-400 font-mono">
            <span>Enter para enviar</span>
            <span>Asistente IA</span>
          </div>
        </div>

      </div>
    </div>
  );
};
