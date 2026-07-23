import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  FileText, 
  MessageSquare, 
  CheckSquare, 
  Flame, 
  Compass, 
  Zap, 
  ExternalLink 
} from "lucide-react";
import { FormData } from "../utils/prompts";
import { CustomSelect } from "./CustomSelect";

interface HookGeneratorProps {
  formData: FormData;
}

interface HookVariation {
  id: string;
  framework: string;
  formula: string;
  title: string;
  hook: string;
  cta: string;
  description: string;
  icon: React.ReactNode;
}

export const HookGenerator: React.FC<HookGeneratorProps> = ({ formData }) => {
  const [topic, setTopic] = useState<string>("");
  const [tone, setTone] = useState<string>("Persuasivo");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hooks, setHooks] = useState<HookVariation[]>([]);

  // Prepopulate topic with Star Product or Business Name on load
  useEffect(() => {
    if (formData.productoEstrella) {
      setTopic(formData.productoEstrella);
    } else if (formData.nombreNegocio) {
      setTopic(`Servicios de ${formData.nombreNegocio}`);
    } else {
      topic || setTopic("Consultoría Estratégica");
    }
  }, [formData]);

  const generateHooksList = (currentTopic: string, currentTone: string) => {
    const term = currentTopic || "nuestros servicios";
    
    // Tones adjustment maps
    const prefixMap: Record<string, string> = {
      Persuasivo: "Atención: ",
      Educativo: "Tip del día: ",
      Misterioso: "Secreto Revelado: ",
      Urgente: "Solo por hoy: ",
      "Contra-intuitivo": "Dato incómodo: "
    };

    const prefix = prefixMap[currentTone] || "";

    const templates: HookVariation[] = [
      {
        id: "pas",
        framework: "PAS (Problema, Agitación, Solución)",
        formula: "Identifica el dolor principal, agítalo haciéndolo vívido, e introduce la solución.",
        title: `¿Frustrado de perder clientes ante alternativas más baratas con ${term}?`,
        hook: `Competir por precio está destruyendo silenciosamente tus márgenes de ganancia. Cada descuento que das debilita el valor percibido de ${term}. La única solución real no es cobrar menos, sino blindar tu diferenciación corporativa.`,
        cta: "Haz clic aquí para implementar nuestro plan de posicionamiento sin regalar tu margen.",
        description: "Ideal para captar atención en LinkedIn, newsletters corporativos o anuncios directos.",
        icon: <Flame className="w-5 h-5 text-orange-500" />
      },
      {
        id: "curiosity",
        framework: "Bucle de Curiosidad (Curiosity Loop)",
        formula: "Abre una brecha de información que el cerebro del lector necesite cerrar inmediatamente.",
        title: `La razón oculta por la que el 90% de los lanzamientos de ${term} fallan este año.`,
        hook: `No es por falta de presupuesto publicitario, ni por la economía. El verdadero culpable es que la mayoría comete el mismo error invisible en su gancho de conversión inicial... y no se enteran hasta que ya quemaron su inversión.`,
        cta: "Descubre exactamente cuál es este error y cómo puedes blindar tu marca en 3 pasos simples.",
        description: "Perfecto para asuntos de email marketing, títulos de webinars o posts virales.",
        icon: <Compass className="w-5 h-5 text-blue-500" />
      },
      {
        id: "aida",
        framework: "AIDA (Atención, Interés, Deseo, Acción)",
        formula: "Llama la atención, despierta un interés real, genera un deseo irrefrenable, y llama a la acción.",
        title: `${prefix}Duplica el valor de cada transacción usando ${term}.`,
        hook: `Si tienes una PyME, tu mayor activo no es tu inventario, sino el valor de vida útil de tus clientes (LTV). Al optimizar la entrega de valor de tu producto estrella ${term}, logras que tus clientes ideales te recompren 3 veces más seguido de forma orgánica.`,
        cta: "Agenda una sesión rápida para auditar tus canales de retención comercial hoy mismo.",
        description: "Clásico infalible para landing pages, folletos ejecutivos y cartas de ventas.",
        icon: <Zap className="w-5 h-5 text-yellow-500" />
      },
      {
        id: "bab",
        framework: "BAB (Antes, Después, Puente)",
        formula: "Muestra la cruda realidad actual, contrástala con un futuro brillante, y presenta tu oferta como el único puente.",
        title: `De trabajar 14 horas diarias sin rumbo a facturar con predictibilidad usando ${term}.`,
        hook: `¿Te acuerdas de cuando fundaste tu negocio para ser libre, pero terminaste siendo el esclavo de tu propia operación? Imagina despertar mañana sabiendo con precisión exacta cuántos leads de alto valor cerrará tu equipo esta semana usando ${term} de manera estructurada.`,
        cta: "Conoce el puente definitivo para delegar tu marketing de forma segura.",
        description: "El formato rey para videos cortos (Reels, TikTok) y casos de éxito corporativos.",
        icon: <FileText className="w-5 h-5 text-emerald-500" />
      },
      {
        id: "contrarian",
        framework: "Declaración Contra-intuitiva",
        formula: "Desafía un mito de la industria o una creencia popular para polarizar amigablemente y ganar autoridad.",
        title: `Por qué regalar contenido gratuito es la peor estrategia para vender ${term}.`,
        hook: `Nos han enseñado a inundar las redes de tutoriales gratis, pero eso solo atrae a cazadores de ofertas sin presupuesto. Si quieres atraer a PyMEs y clientes corporativos de alto nivel, debes vender la transformación completa de ${term} desde el primer contacto, no retazos de información.`,
        cta: "Mira este breve video donde rompemos 3 mitos de marketing tradicionales.",
        description: "Especial para construir posicionamiento de marca premium y posturas de líder de opinión.",
        icon: <MessageSquare className="w-5 h-5 text-purple-500" />
      }
    ];

    setHooks(templates);
  };

  // Generate on load or parameter change
  useEffect(() => {
    generateHooksList(topic, tone);
  }, [topic, tone]);

  const copyToClipboard = (id: string, textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in text-slate-800">
      
      {/* Cabecera */}
      <div className="bg-slate-50/90 border-b border-slate-100 p-5 md:p-6 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-display text-sm md:text-base font-bold text-slate-900 tracking-tight">
              Generador de Ganchos Persuasivos
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Fórmulas de Copywriting probadas para acelerar tus conversiones en redes y correos.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6 text-left">
        
        {/* Parámetros de Personalización */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Producto o Tema Central
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ej. Software CRM, Consultoría, etc."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Tono de Comunicación
            </label>
            <CustomSelect
              name="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              options={[
                { value: "Persuasivo", label: "Persuasivo (Profesional y Convincente)" },
                { value: "Educativo", label: "Educativo (Aporta valor práctico inmediato)" },
                { value: "Misterioso", label: "Misterioso (Genera intriga comercial)" },
                { value: "Urgente", label: "Urgente (Activa el miedo a perder la oportunidad)" },
                { value: "Contra-intuitivo", label: "Contra-intuitivo (Desafía la norma común)" }
              ]}
            />
          </div>
        </div>

        {/* Listado de variaciones generadas */}
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Variaciones de Ganchos Listas para Usar
            </h4>
            <button
              onClick={() => generateHooksList(topic, tone)}
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Recargar Fórmulas
            </button>
          </div>

          <div className="space-y-4">
            {hooks.map((item) => {
              const fullClipboardText = `🔥 ${item.framework}\n\nTÍTULO:\n${item.title}\n\nGANCHO:\n${item.hook}\n\nLLAMADO A LA ACCIÓN:\n${item.cta}`;
              const isCopied = copiedId === item.id;

              return (
                <div 
                  key={item.id} 
                  className="p-5 bg-slate-50/50 rounded-2xl border border-slate-150/80 hover:border-slate-300 transition duration-200 space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-white rounded-lg border border-slate-150 shadow-sm">
                        {item.icon}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">
                          {item.framework}
                        </h5>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Fórmula: {item.formula}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => copyToClipboard(item.id, fullClipboardText)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition cursor-pointer border ${
                        isCopied 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          ¡Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          Copiar Todo
                        </>
                      )}
                    </button>
                  </div>

                  {/* Cuerpo del Gancho */}
                  <div className="space-y-2.5 pl-1 border-l-2 border-slate-200">
                    <p className="text-xs font-extrabold text-slate-900 leading-snug">
                      {item.title}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed font-light">
                      {item.hook}
                    </p>
                    <p className="text-xs font-bold text-blue-600">
                      👉 {item.cta}
                    </p>
                  </div>

                  {/* Pie de Nota */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-light">
                    <span>{item.description}</span>
                    <span className="font-mono uppercase text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">Tono: {tone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ayuda o Tip de Copywriting */}
        <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-3 text-xs leading-relaxed text-blue-800">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5 animate-pulse" />
          <div className="text-left">
            <p className="font-bold mb-0.5">Tip de Scaling Copywriting:</p>
            <p className="font-light">
              Usa la variación de <b>AIDA</b> para páginas web de conversión directa, <b>PAS</b> para anuncios pagos y <b>BAB</b> para contar historias cortas y persuasivas en tus redes sociales. ¡Mantén siempre el foco en los dolores reales del cliente!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
