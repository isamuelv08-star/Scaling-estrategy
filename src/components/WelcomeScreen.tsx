import React from "react";
import { Sparkles, ArrowRight, Coins, Search, Target, Award } from "lucide-react";
import { FormData } from "../utils/prompts";

interface WelcomeScreenProps {
  onStart: (initialData: FormData) => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onOpenHistory,
  historyCount,
}) => {
  const handleGenerate = () => {
    onStart({
      nombreNegocio: "",
      rubro: "",
      tipoModelo: "Servicios B2B",
      descripcion: "",
      productoEstrella: "",
      ubicacion: "",
      publicoObjetivo: "",
      sitioWeb: "",
      facturacion: "",
      ticketPromedio: "",
      margenUtilidad: "",
      presupuesto: "",
      canalesActuales: "",
      metaPrincipal: "",
      plazoMeta: "6 meses",
      competidores: "",
      obstaculo: "",
      tamanoEquipo: "Solo yo (Autoempleado)",
      herramientasActuales: "",
    });
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-10 px-4 relative overflow-hidden">
      {/* Premium center ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-100/30 via-indigo-50/10 to-transparent rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-3xl w-full text-center space-y-10 relative z-10">
        {/* elegant system badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100/70 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span className="text-[9px] font-mono tracking-[0.18em] text-blue-700 font-bold uppercase">
            SCALING STRATEGY • SISTEMA DE ACELERACIÓN IA
          </span>
        </div>

        {/* Headlines */}
        <div className="space-y-4">
          <h1 className="font-display text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none bg-gradient-to-r from-slate-950 via-blue-900 to-slate-950 bg-clip-text text-transparent">
            Acelere el Crecimiento de su Negocio
          </h1>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-xl mx-auto font-medium">
            Alinee sus unit economics, audite su competencia local y cree embudos comerciales automáticos de alta conversión en minutos.
          </p>
        </div>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleGenerate}
            className="group relative inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-display text-xs font-bold px-8 py-4.5 rounded-2xl shadow-lg shadow-blue-600/15 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            Generar una Estrategia
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Value Proposition Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-6 text-left">
          <div className="p-5 rounded-2xl bg-white border border-slate-100 space-y-1.5 transition-all duration-200 hover:border-slate-200 hover:shadow-md">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
              <Coins className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-[11px] font-bold text-slate-950 uppercase tracking-wider">Unit Economics Perfectos</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Cálculo preciso de CAC, LTV y márgenes adaptado a su ticket de venta para asegurar proyecciones de rentabilidad viables.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 space-y-1.5 transition-all duration-200 hover:border-slate-200 hover:shadow-md">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
              <Search className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-[11px] font-bold text-slate-950 uppercase tracking-wider">Auditoría Competitiva Activa</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Rastreo web en tiempo real de competidores en su región para contrastar posicionamiento y capturar vacíos de mercado.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 space-y-1.5 transition-all duration-200 hover:border-slate-200 hover:shadow-md">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
              <Target className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-[11px] font-bold text-slate-950 uppercase tracking-wider">Embudo Comercial Táctico</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Campañas estructuradas de captación de prospectos, ofertas irresistibles y distribución de presupuesto.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-100 space-y-1.5 transition-all duration-200 hover:border-slate-200 hover:shadow-md">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-1">
              <Award className="w-4.5 h-4.5" />
            </div>
            <h4 className="text-[11px] font-bold text-slate-950 uppercase tracking-wider">Planificación CRM y Cierre</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Automatizaciones de velocidad de respuesta, nutrición de contactos y mitigación de cuellos de botella operativos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
