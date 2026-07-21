import React from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { SECTIONS_CONFIG } from "../utils/prompts";

interface LiveGenerationTrackerProps {
  formData: { nombreNegocio: string };
  loadingMessageIndex: number;
  loadingStatuses: string[];
  currentSectionIndex: number;
  resumen: string;
  retryInfo: { attempt: number; delay: number; errorMsg?: string } | null;
}

export const LiveGenerationTracker: React.FC<LiveGenerationTrackerProps> = ({
  formData,
  loadingMessageIndex,
  loadingStatuses,
  currentSectionIndex,
  resumen,
  retryInfo,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 md:p-8 space-y-6 text-center animate-fade-in">
      {/* Radar Spin */}
      <div className="relative w-24 h-24 mx-auto">
        <div className="absolute inset-0 rounded-full border-2 border-blue-100 animate-ping" />
        <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-t-blue-600 border-r-blue-600 animate-spin" style={{ animationDuration: "1s" }} />
        <div className="absolute inset-4 rounded-full border border-dashed border-blue-200 animate-spin-slow" />
        <div className="absolute inset-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
      </div>

      {/* Titles */}
      <div className="space-y-2">
        <span className="text-[9px] font-mono tracking-[0.2em] text-blue-600 font-bold uppercase block">
          SCALING STRATEGY ENGINE
        </span>
        <h4 className="text-base font-bold text-slate-900">
          Redactando Plan Estratégico...
        </h4>
        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
          Calculando unit economics, comparando competidores locales y estructurando sus embudos corporativos en vivo.
        </p>
        <div className="mt-2">
          <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-3 py-1 rounded-full border border-blue-100 animate-pulse inline-block">
            {loadingStatuses[loadingMessageIndex]}
          </span>
        </div>
      </div>

      {/* Live pipeline checklist */}
      <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-200/60 text-left max-w-sm mx-auto text-[10px]">
        <div className="flex justify-between items-center text-[8px] text-slate-400 font-bold tracking-widest uppercase border-b border-slate-200 pb-2">
          <span>SECCIÓN DEL PLAN</span>
          <span>ESTADO</span>
        </div>

        <div className="space-y-2">
          {SECTIONS_CONFIG.map((sec, index) => {
            const isCurrent = currentSectionIndex === index;
            const isDone = index < currentSectionIndex;
            return (
              <div key={sec.id} className="flex justify-between items-center gap-2">
                <span className={`font-semibold ${isDone ? "text-slate-900 font-medium" : isCurrent ? "text-blue-600 font-bold" : "text-slate-400"}`}>
                  {sec.name}
                </span>
                <span className="font-mono text-[9px] font-bold shrink-0">
                  {isDone ? (
                    <span className="text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
                      COMPLETADO
                    </span>
                  ) : isCurrent ? (
                    <span className="text-blue-600 animate-pulse bg-blue-50 px-2 py-0.5 rounded border border-blue-300">
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
            <span className={`font-semibold ${resumen ? "text-slate-900 font-medium" : currentSectionIndex === SECTIONS_CONFIG.length ? "text-blue-600 font-bold" : "text-slate-400"}`}>
              ★ Síntesis Resumen Ejecutivo
            </span>
            <span className="font-mono text-[9px] font-bold">
              {resumen ? (
                <span className="text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/50">
                  COMPLETADO
                </span>
              ) : currentSectionIndex === SECTIONS_CONFIG.length ? (
                <span className="text-blue-600 animate-pulse bg-blue-50 px-2 py-0.5 rounded border border-blue-300">
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
