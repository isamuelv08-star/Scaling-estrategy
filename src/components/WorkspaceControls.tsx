import React from "react";
import { 
  CheckCircle2, 
  Copy, 
  Printer, 
  Save, 
  Loader2, 
  RotateCcw, 
  PlusCircle, 
  Download, 
  FileText, 
  Globe, 
  ClipboardCheck,
  ChevronRight
} from "lucide-react";
import { FormData } from "../utils/prompts";

interface WorkspaceControlsProps {
  formData: FormData;
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
}

export const WorkspaceControls: React.FC<WorkspaceControlsProps> = ({
  formData,
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
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 md:p-8 space-y-6 animate-fade-in text-left">
      {/* Success Brand Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="text-left">
          <h4 className="text-sm font-bold text-slate-950 uppercase tracking-wide">
            Plan Estratégico Completo
          </h4>
          <p className="text-xs text-slate-500">
            Generado con éxito para {formData.nombreNegocio}
          </p>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/70">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Horizonte</span>
          <span className="text-xs font-bold text-slate-800 mt-0.5 block">{formData.plazoMeta}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/70">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Presupuesto</span>
          <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">{formData.presupuesto}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/70">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Facturación</span>
          <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">{formData.facturacion}</span>
        </div>
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/70">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Prod. Estrella</span>
          <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate" title={formData.productoEstrella}>
            {formData.productoEstrella}
          </span>
        </div>
      </div>

      {/* CATEGORY: PREMIUM EXPORTS (Clean, Professional, Non-AI look) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-1.5 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
          <h5 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            ENTREGABLES PROFESIONALES (TEXTO LIMPIO)
          </h5>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {/* Download Premium HTML Report */}
          <button
            onClick={downloadPremiumHtml}
            className="w-full flex items-center justify-between gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-display text-xs font-bold transition shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/15 cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-100" />
              Descargar Informe HTML de Lujo
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
          </button>

          {/* Download Clean Text file */}
          <button
            onClick={downloadCleanTxt}
            className="w-full flex items-center gap-2 py-2.5 px-4 border border-slate-200 bg-white rounded-xl hover:border-blue-500 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-display text-xs font-bold transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            Descargar Texto Plano (.txt Limpio)
          </button>

          {/* Copy Clean Text to Clipboard */}
          <button
            onClick={copyToClipboardClean}
            className="w-full flex items-center gap-2 py-2.5 px-4 border border-slate-200 bg-white rounded-xl hover:border-blue-500 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-display text-xs font-bold transition cursor-pointer"
          >
            <ClipboardCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            Copiar Texto Limpio (Sin Símbolos)
          </button>

          {/* Print Clean Corporate PDF Report */}
          <button
            onClick={handlePrint}
            className="w-full flex items-center gap-2 py-2.5 px-4 border border-slate-200 bg-white rounded-xl hover:border-blue-500 hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-display text-xs font-bold transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            Imprimir Reporte Corporativo (PDF)
          </button>
        </div>
      </div>

      {/* CATEGORY: ORIGINAL DEVELOPMENT FORMATS */}
      <div className="space-y-3 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-1.5 px-1">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <h5 className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            FORMATOS DE DESARROLLO (MARKDOWN)
          </h5>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-150 bg-slate-50/50 hover:bg-slate-100/70 rounded-xl text-slate-600 hover:text-slate-800 text-[11px] font-bold transition cursor-pointer"
            title="Copiar texto con formato Markdown original"
          >
            <Copy className="w-3.5 h-3.5" />
            Copiar .md
          </button>

          <button
            onClick={downloadStrategy}
            className="flex items-center justify-center gap-1.5 py-2 px-3 border border-slate-150 bg-slate-50/50 hover:bg-slate-100/70 rounded-xl text-slate-600 hover:text-slate-800 text-[11px] font-bold transition cursor-pointer"
            title="Descargar archivo en formato .md original"
          >
            <Download className="w-3.5 h-3.5" />
            Descargar .md
          </button>
        </div>
      </div>

      {/* Save to History Button */}
      <div className="pt-2">
        <button
          onClick={saveStrategyToDB}
          disabled={isSaving || saveSuccess}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-display text-xs font-bold transition ${
            saveSuccess
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-indigo-650 hover:bg-indigo-720 text-white cursor-pointer shadow-sm"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Guardando en Historial...
            </>
          ) : saveSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 animate-bounce" />
              Guardado con Éxito
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Guardar en Historial Permanente
            </>
          )}
        </button>
      </div>

      {/* Form editing and new buttons */}
      <div className="border-t border-slate-100 pt-4 space-y-2">
        <button
          onClick={onSelectOtherStrategy}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-50/50 hover:bg-indigo-100/50 text-indigo-750 rounded-xl font-display text-xs font-bold transition cursor-pointer border border-indigo-100 shadow-sm"
        >
          <RotateCcw className="w-4 h-4 text-indigo-500 animate-spin-slow" />
          Elegir otra estrategia
        </button>
        <div className="flex gap-3 pt-1">
          <button
            onClick={onEditOnboarding}
            className="flex-1 flex items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100/80 text-slate-600 py-2.5 px-3 rounded-xl text-[11px] font-bold transition cursor-pointer border border-slate-150"
          >
            Editar Onboarding
          </button>

          <button
            onClick={startNewStrategy}
            className="flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100/80 text-blue-600 py-2.5 px-3 rounded-xl text-[11px] font-bold transition cursor-pointer border border-blue-150"
          >
            <PlusCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            Nueva Estrategia
          </button>
        </div>
      </div>
    </div>
  );
};
