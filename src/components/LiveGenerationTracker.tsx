import React from "react";
import { Sparkles, Loader2, Bookmark, CheckCircle2, Heart } from "lucide-react";
import { getSectionsForStrategy } from "../utils/prompts";

interface LiveGenerationTrackerProps {
  formData: { nombreNegocio: string; presupuesto: string; ticketPromedio: string };
  selectedStrategyType: string;
  loadingMessageIndex: number;
  loadingStatuses: string[];
  currentSectionIndex: number;
  resumen: string;
  retryInfo: { attempt: number; delay: number; errorMsg?: string } | null;
}

export const LiveGenerationTracker: React.FC<LiveGenerationTrackerProps> = ({
  formData,
  selectedStrategyType,
  loadingMessageIndex,
  loadingStatuses,
  currentSectionIndex,
  resumen,
  retryInfo,
}) => {
  const activeSections = getSectionsForStrategy(selectedStrategyType, formData as any);

  // Customized, highly warm, empathetic human messages for each strategy
  const humanSupportMessages: Record<string, string> = {
    completa: `¡Perfecto, vamos a ello! Esta estrategia integral de escalamiento le servirá para alinear todos los frentes de su marca (finanzas, pauta digital, matriz de contenido y conversión comercial), dándole a su equipo hitos claros mes a mes para crecer con total predictibilidad.`,
    contenido: `¡Excelente elección, vamos a ello! Esta estrategia orgánica le servirá para construir autoridad insuperable en su rubro y atraer clientes altamente calificados sin gastar un centavo en publicidad, guiándolos desde el primer contacto hasta el botón de compra.`,
    pago: `¡Magnífico, vamos a configurar su embudo de pauta! Esta estrategia de ads optimizará cada dólar de su presupuesto para captar leads fríos y convertirlos rápidamente, minimizando su costo de adquisición y maximizando el retorno de inversión.`,
    escalabilidad: `¡Excelente, auditemos los números! Esta estrategia le servirá para blindar sus Unit Economics, proyectar retornos viables basados en su ticket de venta e identificar con precisión quirúrgica el cuello de botella que está frenando el despegue comercial.`,
    comercial: `¡Entendido, vamos a agilizar sus ventas! Esta estrategia comercial le servirá para que nunca más se enfríe un lead calificado, acelerando la velocidad de respuesta en su CRM e implementando guiones altamente persuasivos para elevar el cierre de contratos.`,
    copywriting: `¡Perfecto, preparemos sus palabras de poder! Esta estrategia de copywriting le servirá para conectar de forma profunda y psicológica con su cliente ideal, destruyendo objeciones de compra automáticamente a través de correos, anuncios y landing pages.`
  };

  const selectedStrategyName: Record<string, string> = {
    completa: "Estrategia de Escalado Completa",
    contenido: "Estrategia de Contenido Orgánico",
    pago: "Estrategia de Contenido Pago / Ads",
    escalabilidad: "Estrategia de Escalabilidad",
    comercial: "Estrategia Comercial y de Ventas",
    copywriting: "Copywriting y Embudos de Conversión"
  };

  const humanGreeting = humanSupportMessages[selectedStrategyType] || humanSupportMessages.completa;
  const strategyName = selectedStrategyName[selectedStrategyType] || "Plan de Scaling";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8 space-y-6 text-center animate-fade-in text-slate-800 text-left">
      {/* Empathetic human note from the advisor */}
      <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100/40 text-left space-y-2.5 animate-fade-in shadow-inner">
        <div className="flex items-center gap-2 text-blue-700">
          <Heart className="w-4 h-4 text-blue-600 fill-blue-600" />
          <span className="text-[10px] font-mono font-bold tracking-wider uppercase">NOTA DE TU CONSULTOR SCALING</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-light italic">
          "{humanGreeting}"
        </p>
      </div>

      {/* Radar Spin */}
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-blue-100 animate-ping" />
        <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-t-blue-600 border-r-blue-600 animate-spin" style={{ animationDuration: "1s" }} />
        <div className="absolute inset-4 rounded-full border border-dashed border-blue-200 animate-spin-slow" />
        <div className="absolute inset-5 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
        </div>
      </div>

      {/* Titles */}
      <div className="space-y-2 text-center">
        <span className="text-[9px] font-mono tracking-[0.2em] text-blue-600 font-bold uppercase block">
          INTELIGENCIA ESTRATÉGICA • REDACTANDO EN VIVO
        </span>
        <h4 className="text-base font-bold text-slate-900 leading-snug">
          {strategyName}
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto font-light">
          Redactando pautas estratégicas avanzadas para <b>{formData.nombreNegocio}</b>. Por favor, mantenga abierta esta pestaña.
        </p>
        <div className="mt-3">
          <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-100 animate-pulse inline-block max-w-[280px] truncate">
            {loadingStatuses[loadingMessageIndex]}
          </span>
        </div>
      </div>

      {/* Live pipeline checklist (Dynamic based on selected strategy) */}
      <div className="bg-slate-50 rounded-2xl p-4.5 space-y-3 border border-slate-200 text-left max-w-sm mx-auto text-[10px]">
        <div className="flex justify-between items-center text-[8px] text-slate-400 font-bold tracking-widest uppercase border-b border-slate-200 pb-2.5">
          <span>PIPELINE DE LA ESTRATEGIA</span>
          <span>ESTADO</span>
        </div>

        <div className="space-y-2.5">
          {activeSections.map((sec, index) => {
            const isCurrent = currentSectionIndex === index;
            const isDone = index < currentSectionIndex;
            return (
              <div key={sec.id} className="flex justify-between items-center gap-2">
                <span className={`font-semibold tracking-wide ${isDone ? "text-slate-900 font-medium" : isCurrent ? "text-blue-600 font-bold" : "text-slate-400"}`}>
                  {sec.name}
                </span>
                <span className="font-mono text-[9px] font-bold shrink-0">
                  {isDone ? (
                    <span className="text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-150">
                      COMPLETADO
                    </span>
                  ) : isCurrent ? (
                    <span className="text-blue-600 animate-pulse bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      CREANDO...
                    </span>
                  ) : (
                    <span className="text-slate-300 bg-slate-100/50 px-2 py-0.5 rounded border border-slate-200/50">EN COLA</span>
                  )}
                </span>
              </div>
            );
          })}

          <div className="flex justify-between items-center gap-2 pt-2 border-t border-slate-200">
            <span className={`font-semibold tracking-wide ${resumen ? "text-slate-900 font-medium" : currentSectionIndex === activeSections.length ? "text-blue-600 font-bold" : "text-slate-400"}`}>
              ★ Síntesis Resumen Ejecutivo
            </span>
            <span className="font-mono text-[9px] font-bold">
              {resumen ? (
                <span className="text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-150">
                  COMPLETADO
                </span>
              ) : currentSectionIndex === activeSections.length ? (
                <span className="text-blue-600 animate-pulse bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  SINTETIZANDO...
                </span>
              ) : (
                <span className="text-slate-300 bg-slate-100/50 px-2 py-0.5 rounded border border-slate-200/50">EN COLA</span>
              )}
            </span>
          </div>
        </div>

        {/* Retry exponentially status block */}
        {retryInfo && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[10px] space-y-1 text-amber-800 animate-pulse mt-2">
            <div className="flex items-center gap-1.5 font-bold">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Cuota saturada (Intento {retryInfo.attempt}/5)</span>
            </div>
            <p className="text-slate-600 leading-relaxed font-normal">
              Reintentando en {retryInfo.delay / 1000}s de manera segura sin interrumpir el proceso...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
