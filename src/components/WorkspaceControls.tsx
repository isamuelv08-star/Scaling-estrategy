import React from "react";
import { 
  CheckCircle2, 
  Copy, 
  Printer, 
  Save, 
  Loader2, 
  PlusCircle, 
  Download, 
  FileText, 
  Globe, 
  ClipboardCheck,
  ChevronRight,
  Sparkles,
  Sliders
} from "lucide-react";
import { FormData } from "../utils/prompts";

interface WorkspaceControlsProps {
  formData: FormData;
  consultorNombre?: string;
  selectedStrategyType?: string;
  copyToClipboard: () => void;
  copyToClipboardClean: () => void;
  downloadStrategy: () => void;
  downloadCleanTxt: () => void;
  downloadPremiumHtml: () => void;
  handlePrint: () => void;
  saveStrategyToDB: () => void;
  isSaving: boolean;
  saveSuccess: boolean;
  onEditOnboarding: () => void;
  startNewStrategy: () => void;
  onSelectOtherStrategy: () => void;
  onSelectStrategy?: (strategyId: string) => void;
}

export const WorkspaceControls: React.FC<WorkspaceControlsProps> = ({
  formData,
  consultorNombre = "Consultor",
  selectedStrategyType = "completa",
  copyToClipboard,
  copyToClipboardClean,
  downloadStrategy,
  downloadCleanTxt,
  downloadPremiumHtml,
  handlePrint,
  saveStrategyToDB,
  isSaving,
  saveSuccess,
  onEditOnboarding,
  startNewStrategy,
  onSelectOtherStrategy,
  onSelectStrategy,
}) => {
  // Determine suggested strategy based on current strategy
  const getRecommendation = (current: string) => {
    switch (current) {
      case "completa":
        return {
          id: "contenido",
          name: "Estrategia de Contenido Orgánico",
          badge: "Inbound Marketing",
          reason: `Potencia la marca de ${formData.nombreNegocio || "tu negocio"} con un embudo orgánico TOFU/MOFU/BOFU y calendario de contenidos.`
        };
      case "contenido":
        return {
          id: "pago",
          name: "Estrategia de Contenido Pago / Ads",
          badge: "Aceleración Paid",
          reason: `Multiplica el alcance del contenido orgánico con campañas de pauta digital optimizadas para Meta y Google Ads.`
        };
      case "pago":
        return {
          id: "copywriting",
          name: "Maquinaria de Copywriting y Persuasión",
          badge: "Conversión Directa",
          reason: `Estructura mensajes de alto impacto y ofertas irresistibles para disparar la tasa de conversión en tus campañas.`
        };
      case "escalabilidad":
        return {
          id: "comercial",
          name: "Estrategia Comercial y Sistema de Ventas",
          badge: "Ventas y CRM",
          reason: `Combina la optimización de márgenes con un protocolo comercial ágil para cerrar prospectos más rápido.`
        };
      case "comercial":
        return {
          id: "contenido",
          name: "Estrategia de Contenido Orgánico",
          badge: "Nutrición de Prospectos",
          reason: `Alimenta tu embudo comercial con prospectos altamente educados y calificados de forma constante.`
        };
      default:
        return {
          id: "completa",
          name: "Estrategia Completa 360°",
          badge: "Visión Integral",
          reason: `Construye una hoja de ruta integral de 7 secciones que abarca diagnóstico, competidores, pauta y ventas.`
        };
    }
  };

  const recommended = getRecommendation(selectedStrategyType);

  // Extract clean first name from consultorNombre
  const firstName = consultorNombre ? consultorNombre.trim().split(" ")[0] : "Hola";

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden flex flex-col animate-fade-in text-left relative">
      {/* FIXED STICKY HEADER WITH USER NAME */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 p-5 md:p-6 pb-4 z-10">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-left min-w-0 flex-1">
            <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-600 uppercase block">
              PLAN ESTRATÉGICO COMPLETO
            </span>
            <h3 className="text-base md:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              {firstName}, ¡tu estrategia está lista!
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              Generado para {formData.nombreNegocio || "tu empresa"}
            </p>
          </div>
        </div>
      </div>

      {/* SCROLLABLE PANEL CONTENT */}
      <div className="p-5 md:p-6 space-y-6">
        {/* AI RECOMMENDED STRATEGY SUGGESTION BOX */}
        <div className="bg-gradient-to-br from-indigo-500/10 via-blue-500/5 to-slate-50 border border-indigo-200/80 rounded-2xl p-4 md:p-5 space-y-3.5 shadow-2xs relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <span className="text-[10px] font-mono tracking-wider font-bold text-indigo-700 uppercase">
                SUGERENCIA DE LA IA
              </span>
            </div>
            <span className="text-[9px] font-mono bg-indigo-100/80 text-indigo-800 px-2 py-0.5 rounded-full font-bold">
              {recommended.badge}
            </span>
          </div>

          <div className="space-y-1">
            <h5 className="text-xs md:text-sm font-bold text-slate-900">
              Te recomendamos continuar con: <span className="text-indigo-600">{recommended.name}</span>
            </h5>
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              {recommended.reason}
            </p>
          </div>

          {/* TWO ACTION BUTTONS FOR STRATEGY SELECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              onClick={onSelectOtherStrategy}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold transition border border-slate-200 shadow-2xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Menú de estrategias</span>
            </button>

            <button
              onClick={() => {
                if (onSelectStrategy) {
                  onSelectStrategy(recommended.id);
                } else {
                  onSelectOtherStrategy();
                }
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm hover:shadow cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-200 shrink-0" />
              <span>Hacer estrategia sugerida</span>
            </button>
          </div>
        </div>

        {/* DELIVERABLES & DOWNLOADS (SLEEK & COMPACT) */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 px-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <h5 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              DESCARGAS Y ENTREGABLES
            </h5>
          </div>

          {/* Main Deliverable: HTML Report */}
          <button
            onClick={downloadPremiumHtml}
            className="w-full flex items-center justify-between gap-2 py-2.5 px-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-display text-xs font-bold transition shadow-sm hover:shadow cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-100 shrink-0" />
              <span>Descargar Informe HTML de Lujo</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
          </button>

          {/* Compact 3-Button Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
            <button
              onClick={downloadCleanTxt}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold transition cursor-pointer text-center truncate"
              title="Descargar Texto Plano (.txt Limpio)"
            >
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Texto (.txt)</span>
            </button>

            <button
              onClick={copyToClipboardClean}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold transition cursor-pointer text-center truncate"
              title="Copiar Texto Limpio"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">Copiar Limpio</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1.5 py-2 px-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-[11px] font-bold transition cursor-pointer text-center truncate"
              title="Imprimir Reporte PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">PDF / Imprimir</span>
            </button>
          </div>

          {/* Compact Save & Development formats */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={saveStrategyToDB}
              disabled={isSaving || saveSuccess}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
                saveSuccess
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-slate-900 hover:bg-slate-800 text-white cursor-pointer shadow-2xs"
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Guardado</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-blue-400" />
                  <span>Guardar Historial</span>
                </>
              )}
            </button>

            <button
              onClick={downloadStrategy}
              className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition cursor-pointer"
              title="Descargar .md Markdown original"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={copyToClipboard}
              className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl transition cursor-pointer"
              title="Copiar .md Markdown original"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* FOOTER BUTTON: Editar Onboarding */}
        <div className="border-t border-slate-100 pt-4 flex items-center justify-between gap-2">
          <button
            onClick={onEditOnboarding}
            className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-200 text-center"
          >
            Editar Onboarding
          </button>

          <button
            onClick={startNewStrategy}
            className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold transition cursor-pointer border border-blue-150 flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Nueva Estrategia</span>
          </button>
        </div>
      </div>
    </div>
  );
};

