import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  X, 
  Send, 
  Loader2, 
  Bot, 
  User, 
  Copy, 
  Check, 
  RotateCcw, 
  MessageSquare, 
  ArrowRight
} from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface StrategyChatProps {
  isOpen: boolean;
  onClose: () => void;
  planContext: string; // el texto completo de todas las secciones ya generadas
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
    `📊 Explícame el cálculo de ROI y LTV en palabras sencillas.`,
    `📲 ¿Qué tipo de contenido publicar en Instagram y TikTok esta semana?`,
    `💡 ¿Cómo puedo posicionarme por encima de mis competidores principales?`,
    `🔥 Escribe un gancho publicitario persuasivo para mis anuncios.`
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
              text: `Eres el Consultor Principal IA de Scaling Strategy para "${name}". Responde las preguntas del usuario basándote en el plan de crecimiento estructurado que se te proporciona a continuación. Sé ultra práctico, claro, directo y estratégico. Usa viñetas o listas numeradas cuando sea apropiado. Si la respuesta no está especificada en el plan, usa tu conocimiento experto en marketing y crecimiento de negocios para responder de manera alineada al contexto del negocio. Máximo 4-6 párrafos concisos por respuesta.`,
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
        <div key={pIdx} className="space-y-1 my-1.5">
          {lines.map((line, lIdx) => {
            const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("• ");
            const lineText = isBullet ? line.trim().substring(2) : line;

            const parts = lineText.split(/(\*\*.*?\*\*)/g);
            const formattedParts = parts.map((part, partIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={partIdx} className="font-bold text-slate-900">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            });

            if (isBullet) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2 my-0.5">
                  <span className="text-blue-500 font-bold shrink-0">•</span>
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
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-end p-2 sm:p-4 md:p-6 transition-all duration-300 animate-fade-in">
      
      {/* Background overlay to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Slide-Over Drawer Card */}
      <div className="w-full max-w-lg sm:max-w-xl h-full sm:h-[720px] max-h-[calc(100vh-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300 relative z-10">
        
        {/* PREMIUM DEEP GRADIENT HEADER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 border-b border-white/10 relative overflow-hidden shrink-0">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest text-blue-200 font-bold uppercase">
                CONSULTOR IA EN LÍNEA
              </span>
            </div>

            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                  title="Nueva conversación"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-1 relative z-10">
            <h3 className="font-display text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Preguntar sobre tu estrategia</span>
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-slate-400">Contexto:</span>
              <span className="bg-white/10 text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-white/10 truncate max-w-[240px]">
                {businessName ? `✨ ${businessName}` : "Tu Negocio"}
              </span>
            </div>
          </div>
        </div>

        {/* CONTEXT MEMORY STATUS SUB-BAR */}
        <div className={`px-4 py-2 border-b text-[11px] font-semibold flex items-center justify-between shrink-0 ${
          planContext?.trim()
            ? "bg-emerald-50/80 border-emerald-100 text-emerald-800"
            : "bg-amber-50/80 border-amber-100 text-amber-900"
        }`}>
          <div className="flex items-center gap-2 truncate">
            <span className={`w-2 h-2 rounded-full shrink-0 ${planContext?.trim() ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span className="truncate">
              {planContext?.trim()
                ? "Estrategia cargada: Respuestas 100% personalizadas"
                : "Modo asesoría general: Genera tu plan para máximo detalle"}
            </span>
          </div>
          {messages.length > 0 && (
            <span className="text-[10px] font-mono text-slate-400 font-normal shrink-0">
              {messages.length} mensaje{messages.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* SCROLLABLE MESSAGES FEED */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-slate-50/50">
          
          {/* WELCOME SCREEN WHEN NO MESSAGES */}
          {messages.length === 0 && (
            <div className="space-y-6 py-4 animate-fade-in">
              <div className="text-center space-y-3 max-w-sm mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-slate-900 text-base">
                    ¿En qué puedo ayudarte hoy?
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-light">
                    Haz preguntas directas sobre tu estrategia de escalado, métricas de pauta, ideas de contenido o ejecución comercial.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block text-center">
                  Preguntas Frecuentes Sugeridas
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-left p-3 rounded-2xl bg-white hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-200 text-xs font-semibold text-slate-700 hover:text-blue-900 transition-all shadow-2xs hover:shadow-xs group cursor-pointer flex items-center justify-between gap-3"
                    >
                      <span className="leading-snug">{prompt}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CHAT MESSAGES FEED */}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col space-y-1 animate-fade-in ${
                m.role === "user" ? "items-end" : "items-start"
              }`}
            >
              {m.role === "user" ? (
                <div className="flex items-end gap-2 max-w-[88%]">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl rounded-tr-xs px-4 py-3 shadow-md text-xs md:text-sm leading-relaxed font-medium">
                    {m.content}
                  </div>
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 max-w-[92%] w-full">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs mt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-slate-200/90 text-slate-800 rounded-2xl rounded-tl-xs p-4 shadow-2xs text-xs md:text-sm leading-relaxed w-full space-y-2 relative group">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[10px] text-slate-400 font-mono">
                      <span className="font-bold text-indigo-600 uppercase tracking-wider">Consultor IA</span>
                      <button
                        onClick={() => handleCopy(m.content, i)}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-700 transition cursor-pointer px-1.5 py-0.5 rounded hover:bg-slate-100"
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
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs text-xs font-semibold text-slate-600 max-w-[80%] animate-pulse">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              </div>
              <span>Analizando estrategia y redactando respuesta...</span>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* BOTTOM INPUT DOCK */}
        <div className="p-3.5 md:p-4 bg-white border-t border-slate-100 shadow-xl shrink-0 space-y-2">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 rounded-2xl p-1.5 transition-all">
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
                  ? `Pregunta sobre la estrategia de ${businessName || "tu negocio"}...`
                  : "Escribe tu pregunta sobre marketing o crecimiento..."
              }
              className="flex-1 text-xs md:text-sm px-3 py-2 bg-transparent outline-none text-slate-800 placeholder-slate-400"
            />

            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2.5 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shrink-0"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex justify-between items-center px-2 text-[10px] text-slate-400 font-mono">
            <span>Presiona Enter para enviar</span>
            <span>Potenciado por Claude IA</span>
          </div>
        </div>

      </div>
    </div>
  );
};
