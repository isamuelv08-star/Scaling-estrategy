import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  FileText, 
  TrendingUp, 
  Flame, 
  Cpu, 
  Users, 
  CheckCircle, 
  PenTool, 
  ChevronRight, 
  Loader2, 
  Terminal,
  Bookmark,
  Activity
} from "lucide-react";
import { FormData } from "../utils/prompts";

interface StrategySelectorProps {
  formData: FormData;
  onSelectStrategy: (strategyId: string) => void;
  onBackToOnboarding: () => void;
}

export interface StrategyOption {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  valueProposition: string; // What they'll achieve
  icon: React.ReactNode;
  color: string;
  badge: string;
}

export const StrategySelector: React.FC<StrategySelectorProps> = ({ 
  formData, 
  onSelectStrategy,
  onBackToOnboarding 
}) => {
  const [isStructuring, setIsStructuring] = useState<boolean>(true);
  const [structuringStep, setStructuringStep] = useState<number>(0);

  const structuringLogs = [
    "Inicializando motor de diagnóstico empresarial...",
    "Validando datos de unit economics (Ticket Promedio: " + formData.ticketPromedio + ")...",
    "Analizando mayor obstáculo percibido: \"" + formData.obstaculo + "\"...",
    "Segmentando nicho comercial y público objetivo...",
    "Generando matriz de datos estratégicos optimizados...",
    "¡Perfil estructurado y listo para el análisis en profundidad!"
  ];

  // Simulates structuring sequence
  useEffect(() => {
    if (isStructuring) {
      const interval = setInterval(() => {
        setStructuringStep(prev => {
          if (prev >= structuringLogs.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setIsStructuring(false);
            }, 800);
            return prev;
          }
          return prev + 1;
        });
      }, 700);
      return () => clearInterval(interval);
    }
  }, [isStructuring]);

  const strategies: StrategyOption[] = [
    {
      id: "completa",
      name: "Estrategia Completa (Scaling Integral)",
      description: "Hoja de ruta integral de 7 secciones que abarca diagnóstico, competidores, metas, pauta y embudo de ventas.",
      longDescription: "Alinea de forma integral tus Unit Economics, audita competidores, define metas SMART, planifica tu contenido orgánico, diseña campañas pagas y estructura tus ventas.",
      valueProposition: "Te servirá para tener un panorama de 360 grados sobre cómo escalar tu negocio de manera predecible, con hitos específicos mes a mes para el crecimiento ordenado de tu equipo.",
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-blue-600 to-indigo-600 bg-blue-50/50 hover:bg-blue-50 border-blue-200 text-blue-900",
      badge: "Sugerido"
    },
    {
      id: "contenido",
      name: "Estrategia de Contenido Orgánico",
      description: "Embudo orgánico TOFU, MOFU, BOFU con calendario de 6 piezas y ganchos altamente persuasivos.",
      longDescription: "Focalizado 100% en captar clientes de forma orgánica, posicionando tu marca como referente del sector y estructurando una parrilla táctica para redes sociales.",
      valueProposition: "Te servirá para posicionar tu marca como líder de opinión sin gastar un solo dólar en publicidad, nutriendo a tus prospectos paso a paso desde el interés hasta la compra.",
      icon: <FileText className="w-5 h-5" />,
      color: "from-emerald-600 to-teal-600 bg-emerald-50/50 hover:bg-emerald-50 border-emerald-200 text-emerald-900",
      badge: "Inbound"
    },
    {
      id: "pago",
      name: "Estrategia de Contenido Pago / Ads",
      description: "Plan de pauta, segmentación precisa de público e ideas creativas para Meta y Google Ads.",
      longDescription: "Diseño táctico de campañas pagas, distribución óptima del presupuesto asignado y guías operativas detalladas para optimizar el retorno (ROAS).",
      valueProposition: "Te servirá para inyectar prospectos calificados con predictibilidad, distribuyendo cada dólar de tu presupuesto en campañas optimizadas que minimicen tu costo de adquisición.",
      icon: <Flame className="w-5 h-5" />,
      color: "from-amber-600 to-orange-600 bg-amber-50/50 hover:bg-amber-50 border-amber-200 text-amber-900",
      badge: "Pauta"
    },
    {
      id: "escalabilidad",
      name: "Estrategia de Escalabilidad de Negocio",
      description: "Análisis profundo de Unit Economics (LTV/CAC), metas SMART de escalamiento y diagnóstico operativo.",
      longDescription: "Auditoría financiera y de operaciones enfocada en maximizar el valor de vida del cliente (LTV) y erradicar cuellos de botella para una base rentable.",
      valueProposition: "Te servirá para auditar tus finanzas comerciales, proyectar tu rentabilidad real y estructurar metas numéricas que tu equipo pueda cumplir de forma medible.",
      icon: <Activity className="w-5 h-5" />,
      color: "from-purple-600 to-pink-600 bg-purple-50/50 hover:bg-purple-50 border-purple-200 text-purple-900",
      badge: "Finanzas"
    },
    {
      id: "comercial",
      name: "Estrategia Comercial y de Ventas",
      description: "Protocolos para CRM, velocidad de respuesta en seguimiento de leads y técnicas de cierre.",
      longDescription: "Mejora la conversión de tu equipo comercial. Scripts de llamadas, seguimiento táctico de presupuestos, manejo de objeciones y automatizaciones de CRM.",
      valueProposition: "Te servirá para que no se enfríe ningún lead, agilizando el flujo desde el primer contacto en el CRM hasta la firma del contrato y el cobro del ticket.",
      icon: <Users className="w-5 h-5" />,
      color: "from-rose-600 to-red-600 bg-rose-50/50 hover:bg-rose-50 border-rose-200 text-rose-900",
      badge: "Ventas"
    },
    {
      id: "copywriting",
      name: "Copywriting y Embudos de Conversión",
      description: "Secuencia de emails (PAS), estructura de landing page de alta conversión y ganchos disruptivos.",
      longDescription: "Saca provecho de la psicología de respuesta directa. Estructura un embudo que convierta visitas frías en clientes leales mediante copies enfocados al dolor y deseo.",
      valueProposition: "Te servirá para conectar emocionalmente con tu cliente ideal, derribar sus objeciones psicológicas y guiarlo sutilmente hacia el llamado a la acción.",
      icon: <PenTool className="w-5 h-5" />,
      color: "from-indigo-600 to-violet-600 bg-indigo-50/50 hover:bg-indigo-50 border-indigo-200 text-indigo-900",
      badge: "Copy"
    }
  ];

  if (isStructuring) {
    return (
      <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl p-6 md:p-8 flex flex-col justify-between h-[550px] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Header */}
        <div className="space-y-3 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-mono tracking-widest text-blue-400 font-bold uppercase">
            <Loader2 className="w-3 h-3 animate-spin text-blue-400" />
            MOTOR ANALÍTICO • PROCESADOR ACTIVO
          </div>
          <h3 className="font-display text-base md:text-lg font-bold text-slate-100">
            Estructurando perfil de {formData.nombreNegocio || "tu empresa"}
          </h3>
          <p className="text-xs text-slate-400 font-light leading-relaxed">
            Analizando los unit economics y el contexto del negocio para estructurar una base de datos limpia.
          </p>
        </div>

        {/* Terminal logs screen */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800/80 p-5 font-mono text-[10px] md:text-xs text-left text-slate-300 space-y-2 h-[260px] overflow-y-auto shadow-inner relative z-10">
          <div className="flex items-center gap-1.5 text-slate-500 pb-1.5 border-b border-slate-800 mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>CONSOLE_LOG // BLUEPRINT_BUILDER</span>
          </div>

          {structuringLogs.slice(0, structuringStep + 1).map((log, index) => {
            const isLast = index === structuringStep;
            return (
              <div key={index} className={`flex items-start gap-2 ${isLast ? "text-blue-400 font-bold" : "text-slate-400"}`}>
                <span className="text-slate-600 shrink-0 select-none">&gt;</span>
                <p className="leading-relaxed">
                  {log}
                  {isLast && index < structuringLogs.length - 1 && <span className="animate-pulse">|</span>}
                </p>
              </div>
            );
          })}
        </div>

        {/* Info footer */}
        <div className="border-t border-slate-900 pt-4 flex items-center justify-between text-[10px] text-slate-500 font-mono relative z-10">
          <span>COMPILADOR: V2.1_CORE</span>
          <span>ESPERANDO RESPUESTA...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full animate-fade-in text-slate-800 text-left">
      {/* Header block */}
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span className="text-[9px] font-mono tracking-widest text-slate-400 font-bold uppercase">
                PERFIL CORPORATIVO COMPILADO
              </span>
            </div>
            <button
              onClick={onBackToOnboarding}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold transition cursor-pointer"
            >
              Editar datos
            </button>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg md:text-xl font-display font-black text-slate-900 leading-tight">
              ¡Hemos recibido la información de su negocio!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-light">
              Se ha estructurado con éxito el modelo de <b>{formData.nombreNegocio}</b>. Para entregarte las tácticas más rentables y accionables, dinos: <b>¿Qué tipo de estrategia quieres que desarrollemos hoy?</b>
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Strategy Options */}
      <div className="p-6 md:p-8 space-y-4 max-h-[58vh] overflow-y-auto">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Seleccione una estrategia para generar tácticas avanzadas
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strat) => (
            <button
              key={strat.id}
              onClick={() => onSelectStrategy(strat.id)}
              className={`flex flex-col text-left p-4.5 rounded-2xl border transition-all duration-200 cursor-pointer ${strat.color} hover:shadow-md hover:-translate-y-0.5 group`}
            >
              <div className="flex justify-between items-start w-full gap-2">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-blue-600 group-hover:scale-105 transition-all">
                  {strat.icon}
                </div>
                <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-100 shadow-sm">
                  {strat.badge}
                </span>
              </div>

              <div className="mt-3.5 space-y-1">
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-800 transition">
                  {strat.name}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-light">
                  {strat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center text-[10px] text-blue-600 font-bold w-full justify-between">
                <span>Elegir esta estrategia</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Small informative Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center font-mono uppercase">
        Procesando datos de manera segura • Sin pérdida de contexto
      </div>
    </div>
  );
};
