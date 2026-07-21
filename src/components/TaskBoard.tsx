import React, { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Briefcase, 
  Calendar, 
  TrendingUp, 
  Sliders, 
  Award, 
  Printer, 
  ListTodo,
  Sparkles,
  ChevronRight,
  PlusCircle,
  FileCheck2,
  ListFilter
} from "lucide-react";
import { FormData } from "../utils/prompts";

interface Task {
  id: string;
  title: string;
  phase: "Preparación (Día 1-7)" | "Lanzamiento (Semana 2-4)" | "Optimización (Mes 2)";
  priority: "Alta" | "Media" | "Baja";
  status: "Pendiente" | "En Progreso" | "Completado";
  description: string;
  isCustom?: boolean;
}

interface TaskBoardProps {
  formData: FormData;
  strategyType: string;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ formData, strategyType }) => {
  const getInitialTasks = (): Task[] => {
    const businessName = formData.nombreNegocio || "tu empresa";
    const starProduct = formData.productoEstrella || "tu producto estrella";
    const targetAudience = formData.publicoObjetivo || "tu cliente ideal";

    switch (strategyType) {
      case "contenido":
        return [
          {
            id: "org-1",
            title: `Definir pilares de contenido alineados a los dolores de ${targetAudience}`,
            phase: "Preparación (Día 1-7)",
            priority: "Alta",
            status: "Pendiente",
            description: `Documentar las 5 objeciones más frecuentes del cliente sobre ${starProduct} y estructurarlas como temas educativos.`
          },
          {
            id: "org-2",
            title: "Configurar un calendario editorial de 30 días",
            phase: "Preparación (Día 1-7)",
            priority: "Media",
            status: "Pendiente",
            description: "Calendarizar 3 piezas de contenido semanal (Reels/TikToks e Inbound de valor en LinkedIn/Instagram)."
          },
          {
            id: "org-3",
            title: `Crear e implementar un Lead Magnet para ${starProduct}`,
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Alta",
            status: "Pendiente",
            description: "Diseñar un recurso gratuito de alto valor (Ebook, guía corta, plantilla o calculadora) para captar emails a cambio del recurso."
          },
          {
            id: "org-4",
            title: "Producción ágil de contenido (Grabación de 6 videos piloto)",
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Alta",
            status: "Pendiente",
            description: "Grabar en lote usando los ganchos de venta generados, centrándose exclusivamente en resolver la objeción principal."
          },
          {
            id: "org-5",
            title: "Establecer flujo de conversión vía Mensajería Directa (DM/WA)",
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Alta",
            status: "Pendiente",
            description: "Configurar gatillos automáticos para responder comentarios con el enlace del Lead Magnet y abrir conversaciones manuales."
          },
          {
            id: "org-6",
            title: "Análisis mensual de métricas de alcance e Inbound",
            phase: "Optimización (Mes 2)",
            priority: "Media",
            status: "Pendiente",
            description: "Analizar qué contenido generó más comentarios y mensajes directos para replicar ese gancho visual."
          },
          {
            id: "org-7",
            title: "Automatización de newsletter y retención",
            phase: "Optimización (Mes 2)",
            priority: "Baja",
            status: "Pendiente",
            description: "Lanzar secuencia automatizada de correos semanales para nutrir a los nuevos prospectos del lead magnet."
          }
        ];
      case "pago":
        return [
          {
            id: "ads-1",
            title: "Instalar y testear Píxeles de Conversión y API de Conversiones",
            phase: "Preparación (Día 1-7)",
            priority: "Alta",
            status: "Pendiente",
            description: "Asegurar que Meta Ads, Google Ads o las plataformas elegidas midan perfectamente las compras o registros de leads."
          },
          {
            id: "ads-2",
            title: "Diseñar los primeros 3 creativos de prueba",
            phase: "Preparación (Día 1-7)",
            priority: "Alta",
            status: "Pendiente",
            description: `Crear 3 variaciones visuales utilizando los ganchos persuasivos diseñados para ${starProduct}.`
          },
          {
            id: "ads-3",
            title: `Lanzar campaña de testeo de públicos con presupuesto diario asignado`,
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Alta",
            status: "Pendiente",
            description: `Configurar la campaña con segmentación amplia o intereses refinados apuntando a ${targetAudience}.`
          },
          {
            id: "ads-4",
            title: "Implementar campaña complementaria de retargeting",
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Media",
            status: "Pendiente",
            description: "Configurar un público personalizado con quienes visitaron el sitio o interactuaron, ofreciendo un testimonio."
          },
          {
            id: "ads-5",
            title: "Auditoría de CTR y costo por conversión (CPA)",
            phase: "Optimización (Mes 2)",
            priority: "Alta",
            status: "Pendiente",
            description: "Pausar de inmediato los anuncios con CTR menor al 1% y redistribuir ese presupuesto a las combinaciones ganadoras."
          },
          {
            id: "ads-6",
            title: "Escalado modular y vertical del presupuesto",
            phase: "Optimización (Mes 2)",
            priority: "Alta",
            status: "Pendiente",
            description: "Aumentar un 20% semanal el presupuesto de las campañas exitosas para cuidar la estabilidad del algoritmo y evitar fatiga."
          }
        ];
      case "escalabilidad":
        return [
          {
            id: "esc-1",
            title: "Desglose financiero real y cálculo del margen neto de contribución",
            phase: "Preparación (Día 1-7)",
            priority: "Alta",
            status: "Pendiente",
            description: `Ingresar todos los costos fijos y variables de producir ${starProduct} para determinar el retorno mínimo requerido.`
          },
          {
            id: "esc-2",
            title: "Empaquetamiento Premium (Estructuración High-Ticket o Bundle)",
            phase: "Preparación (Día 1-7)",
            priority: "Alta",
            status: "Pendiente",
            description: "Crear una oferta con complementos de alto valor percibido pero bajo costo marginal para incrementar el ticket promedio."
          },
          {
            id: "esc-3",
            title: "Optimización de la cadena de valor o coste operativo",
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Media",
            status: "Pendiente",
            description: "Automatizar un paso crítico o renegociar con proveedores para aumentar un 10% el margen de ganancia."
          },
          {
            id: "esc-4",
            title: "Implementar estrategia de ventas recurrentes (Up-sell / Cross-sell)",
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Alta",
            status: "Pendiente",
            description: "Diseñar una secuencia de oferta secundaria justo después de la compra inicial para subir el valor del tiempo de vida del cliente (LTV)."
          },
          {
            id: "esc-5",
            title: "Monitoreo semanal del ratio LTV:CAC",
            phase: "Optimización (Mes 2)",
            priority: "Alta",
            status: "Pendiente",
            description: "Asegurarse de que el valor del cliente sea por lo menos 3 veces mayor que el costo de captarlo mediante publicidad."
          },
          {
            id: "esc-6",
            title: "Delegación y estructuración de manuales operativos (SOP)",
            phase: "Optimización (Mes 2)",
            priority: "Media",
            status: "Pendiente",
            description: "Redactar guías simples de procesos para que un nuevo colaborador pueda operar las entregas sin depender al 100% de ti."
          }
        ];
      case "comercial":
        return [
          {
            id: "com-1",
            title: "Crear un guion estratégico para manejo de objeciones",
            phase: "Preparación (Día 1-7)",
            priority: "Alta",
            status: "Pendiente",
            description: `Documentar respuestas persuasivas para las 3 principales objeciones de ${starProduct} (precio, urgencia, confianza).`
          },
          {
            id: "com-2",
            title: "Estructurar pipeline de ventas en el CRM",
            phase: "Preparación (Día 1-7)",
            priority: "Alta",
            status: "Pendiente",
            description: "Establecer las etapas visuales claras: Nuevo Lead, Contactado, Propuesta Presentada, En Negociación, Ganado/Perdido."
          },
          {
            id: "com-3",
            title: "Implementar agendamiento automático (ej. Calendly o WA link directo)",
            phase: "Preparación (Día 1-7)",
            priority: "Media",
            status: "Pendiente",
            description: "Quitar fricción al proceso de reservas automatizando la selección de horarios para llamadas calificadas."
          },
          {
            id: "com-4",
            title: "Lanzar protocolo de respuesta ultra-veloz (<15 minutos)",
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Alta",
            status: "Pendiente",
            description: "Garantizar contacto inmediato a prospectos calificados que entren para capturar la máxima intención caliente."
          },
          {
            id: "com-5",
            title: "Automatización de seguimiento a prospectos 'En espera'",
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Media",
            status: "Pendiente",
            description: "Programar recordatorios automáticos a los 2, 5 y 10 días para reactivar leads que solicitaron cotización."
          },
          {
            id: "com-6",
            title: "Revisión semanal de conversión por etapa",
            phase: "Optimización (Mes 2)",
            priority: "Alta",
            status: "Pendiente",
            description: "Identificar si los prospectos se estancan en la cotización o en la llamada inicial para pulir la propuesta comercial."
          }
        ];
      case "copywriting":
        return [
          {
            id: "cop-1",
            title: "Diseñar la Gran Promesa Persuasiva (Propuesta de una Frase)",
            phase: "Preparación (Día 1-7)",
            priority: "Alta",
            status: "Pendiente",
            description: `Fórmula: [Resultado Deseado] sin sufrir [Mayor Dolor] en [Tiempo Estimado] para ${starProduct}.`
          },
          {
            id: "cop-2",
            title: "Redactar landing page utilizando la estructura PAS (Problema, Agitación, Solución)",
            phase: "Preparación (Día 1-7)",
            priority: "Alta",
            status: "Pendiente",
            description: "Escribir textos enfocados en hacer visible el dolor antes de presentar las características técnicas del producto."
          },
          {
            id: "cop-3",
            title: "Escribir secuencia de 3 correos de bienvenida automatizados",
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Alta",
            status: "Pendiente",
            description: "Email 1: Entrega de recurso. Email 2: Tu historia/Autoridad. Email 3: Presentación de la oferta estrella."
          },
          {
            id: "cop-4",
            title: "Desarrollar copys publicitarios con 3 ángulos narrativos diferentes",
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Media",
            status: "Pendiente",
            description: "Crear un anuncio centrado en datos, otro en historia de superación, y otro en testimonios reales directos."
          },
          {
            id: "cop-5",
            title: "Prueba A/B de encabezados principales en la Landing",
            phase: "Optimización (Mes 2)",
            priority: "Alta",
            status: "Pendiente",
            description: "Testear dos títulos por 2 semanas para ver cuál genera un mayor porcentaje de registros o compras."
          },
          {
            id: "cop-6",
            title: "Revisión de correos abandonados o secuencias frías",
            phase: "Optimización (Mes 2)",
            priority: "Baja",
            status: "Pendiente",
            description: "Optimizar el asunto del correo con peor tasa de apertura utilizando ganchos de curiosidad extrema."
          }
        ];
      case "completa":
      default:
        return [
          {
            id: "360-1",
            title: "Auditoría técnica de canales digitales actuales",
            phase: "Preparación (Día 1-7)",
            priority: "Alta",
            status: "Pendiente",
            description: `Analizar métricas base en ${formData.canalesActuales || "canales actuales"} para establecer la línea de partida comercial.`
          },
          {
            id: "360-2",
            title: "Montar embudo mínimo viable con Landing Page calificada",
            phase: "Preparación (Día 1-7)",
            priority: "Alta",
            status: "Pendiente",
            description: `Crear una página sencilla enfocada al 100% en promover ${starProduct} con testimonios y llamado a la acción claro.`
          },
          {
            id: "360-3",
            title: "Preparar infraestructura de CRM o de captura de datos",
            phase: "Preparación (Día 1-7)",
            priority: "Media",
            status: "Pendiente",
            description: `Configurar la base para registrar leads de ${formData.nombreNegocio} y no perder oportunidades.`
          },
          {
            id: "360-4",
            title: "Lanzamiento de campaña piloto en redes y ads",
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Alta",
            status: "Pendiente",
            description: `Iniciar pruebas de creativos publicitarios distribuyendo el presupuesto de ${formData.presupuesto}.`
          },
          {
            id: "360-5",
            title: "Implementar secuencias de seguimiento y nutrición automática",
            phase: "Lanzamiento (Semana 2-4)",
            priority: "Media",
            status: "Pendiente",
            description: "Lanzar correos electrónicos o mensajes automáticos para fidelizar a los prospectos que aún no deciden comprar."
          },
          {
            id: "360-6",
            title: "Medición exhaustiva de unit economics y optimización de pauta",
            phase: "Optimización (Mes 2)",
            priority: "Alta",
            status: "Pendiente",
            description: "Revisar costos por lead y tasa de conversión final para duplicar pauta en los canales que rinden el mejor retorno."
          },
          {
            id: "360-7",
            title: "Sistematización y manualización de flujos comerciales exitosos",
            phase: "Optimización (Mes 2)",
            priority: "Baja",
            status: "Pendiente",
            description: "Documentar el guion de ventas y las ofertas ganadoras para escalar el equipo de cara al crecimiento continuo."
          }
        ];
    }
  };

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterPhase, setFilterPhase] = useState<string>("Todas");
  const [filterPriority, setFilterPriority] = useState<string>("Todas");
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskPhase, setNewTaskPhase] = useState<Task["phase"]>("Preparación (Día 1-7)");
  const [newTaskPriority, setNewTaskPriority] = useState<Task["priority"]>("Media");
  const [newTaskDesc, setNewTaskDesc] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Load from local storage or defaults on start
  useEffect(() => {
    const key = `scaling-tasks-${strategyType}-${formData.nombreNegocio}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        setTasks(getInitialTasks());
      }
    } else {
      setTasks(getInitialTasks());
    }
  }, [strategyType, formData.nombreNegocio]);

  // Sync to local storage
  const saveToStorage = (updatedTasks: Task[]) => {
    const key = `scaling-tasks-${strategyType}-${formData.nombreNegocio}`;
    localStorage.setItem(key, JSON.stringify(updatedTasks));
  };

  const toggleTaskStatus = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        let nextStatus: Task["status"] = "Pendiente";
        if (t.status === "Pendiente") nextStatus = "En Progreso";
        else if (t.status === "En Progreso") nextStatus = "Completado";
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setTasks(updated);
    saveToStorage(updated);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const added: Task = {
      id: `custom-${Date.now()}`,
      title: newTaskTitle.trim(),
      phase: newTaskPhase,
      priority: newTaskPriority,
      status: "Pendiente",
      description: newTaskDesc.trim() || "Tarea agregada de manera personalizada por el estratega.",
      isCustom: true
    };

    const updated = [...tasks, added];
    setTasks(updated);
    saveToStorage(updated);

    setNewTaskTitle("");
    setNewTaskDesc("");
    setShowAddForm(false);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    saveToStorage(updated);
  };

  const resetToDefault = () => {
    if (window.confirm("¿Seguro que desea reiniciar el tablero de tareas con las tareas sugeridas predeterminadas? Se perderán las tareas personalizadas creadas.")) {
      const defaults = getInitialTasks();
      setTasks(defaults);
      saveToStorage(defaults);
    }
  };

  const completedCount = tasks.filter(t => t.status === "Completado").length;
  const inProgressCount = tasks.filter(t => t.status === "En Progreso").length;
  const completionPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter(t => {
    const matchPhase = filterPhase === "Todas" || t.phase === filterPhase;
    const matchPriority = filterPriority === "Todas" || t.priority === filterPriority;
    return matchPhase && matchPriority;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8 space-y-6 text-left animate-fade-in print:bg-white print:border-none print:shadow-none print:p-0">
      
      {/* Header and overview */}
      <div className="border-b border-slate-100 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-mono font-bold uppercase mb-2">
            <ListTodo className="w-3.5 h-3.5 text-emerald-600" />
            Plan de Acción Interactivo
          </div>
          <h2 className="font-display text-base md:text-lg font-bold text-slate-900 tracking-tight">
            Tablero de Ejecución Táctica
          </h2>
          <p className="text-xs text-slate-500 font-light max-w-xl">
            Hoja de ruta interactiva con tareas ordenadas para operar la estrategia de {formData.nombreNegocio}. Filtra, marca tu avance o añade tareas propias.
          </p>
        </div>

        {/* Progress Bar Circle/Pill */}
        <div className="flex items-center gap-3 bg-slate-50/80 border border-slate-100 p-3 rounded-2xl shrink-0">
          <div className="relative w-12 h-12 flex items-center justify-center bg-white rounded-full border border-slate-200/50 shadow-sm shrink-0">
            <svg className="w-10 h-10 transform -rotate-90">
              <circle
                cx="20"
                cy="20"
                r="16"
                className="stroke-slate-100 fill-none"
                strokeWidth="3.5"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                className="stroke-emerald-500 fill-none transition-all duration-500"
                strokeWidth="3.5"
                strokeDasharray={`${2 * Math.PI * 16}`}
                strokeDashoffset={`${2 * Math.PI * 16 * (1 - completionPercent / 100)}`}
              />
            </svg>
            <span className="absolute font-mono text-[10px] font-bold text-slate-800">
              {completionPercent}%
            </span>
          </div>
          <div className="text-left">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">AVANCE TOTAL</span>
            <span className="text-xs font-bold text-slate-800 font-mono">
              {completedCount} de {tasks.length} completadas
            </span>
          </div>
        </div>
      </div>

      {/* Control panel and filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap items-center gap-2">
          {/* Phase Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-1.5">
            <ListFilter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
              className="text-[11px] bg-transparent outline-none text-slate-700 font-medium cursor-pointer"
            >
              <option value="Todas">Todas las Fases</option>
              <option value="Preparación (Día 1-7)">Preparación (Día 1-7)</option>
              <option value="Lanzamiento (Semana 2-4)">Lanzamiento (Semana 2-4)</option>
              <option value="Optimización (Mes 2)">Optimización (Mes 2)</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 rounded-xl px-2.5 py-1.5">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-[11px] bg-transparent outline-none text-slate-700 font-medium cursor-pointer"
            >
              <option value="Todas">Todas las Prioridades</option>
              <option value="Alta">Prioridad Alta</option>
              <option value="Media">Prioridad Media</option>
              <option value="Baja">Prioridad Baja</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 border border-indigo-150 rounded-xl text-[11px] text-indigo-700 font-bold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Crear Tarea
          </button>
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1 py-1.5 px-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-[10px] text-slate-500 font-medium transition cursor-pointer"
          >
            Restaurar Sugeridas
          </button>
        </div>
      </div>

      {/* Add Custom Task Form Panel */}
      {showAddForm && (
        <form onSubmit={addTask} className="p-4 rounded-2xl bg-indigo-50/30 border border-indigo-100/50 space-y-3 animate-fade-in print:hidden">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold text-slate-800">Añadir Tarea de Ejecución Táctica</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Título de la Tarea *</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Ej. Redactar el guión piloto para reels orgánicos"
                className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 outline-none"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Fase de la Estrategia *</label>
              <select
                value={newTaskPhase}
                onChange={(e) => setNewTaskPhase(e.target.value as Task["phase"])}
                className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 outline-none cursor-pointer"
              >
                <option value="Preparación (Día 1-7)">Preparación (Día 1-7)</option>
                <option value="Lanzamiento (Semana 2-4)">Lanzamiento (Semana 2-4)</option>
                <option value="Optimización (Mes 2)">Optimización (Mes 2)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Nivel de Prioridad *</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Task["priority"])}
                className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 outline-none cursor-pointer"
              >
                <option value="Alta">Prioridad Alta</option>
                <option value="Media">Prioridad Media</option>
                <option value="Baja">Prioridad Baja</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-1">
              <label className="block text-[9px] font-bold text-slate-500 uppercase tracking-wider">Descripción o Detalles de Acción</label>
              <input
                type="text"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                placeholder="Ej. Grabar con smartphone en plano medio con luz de frente y aplicar subtítulos..."
                className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1.5">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-500 text-[11px] font-bold hover:bg-slate-50 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[11px] font-bold hover:bg-indigo-700 cursor-pointer"
            >
              Agregar Tarea
            </button>
          </div>
        </form>
      )}

      {/* Task List Canvas */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-100 rounded-2xl">
            <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No hay tareas pendientes en este filtro.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === "Completado";
            const isInProgress = task.status === "En Progreso";

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 relative overflow-hidden group ${
                  isCompleted 
                    ? "bg-emerald-50/15 border-emerald-100/70 opacity-75 hover:opacity-100" 
                    : isInProgress 
                    ? "bg-blue-50/10 border-blue-150/60" 
                    : "bg-white border-slate-150 shadow-sm hover:border-slate-300"
                }`}
              >
                {/* Left vertical visual priority strip */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    task.priority === "Alta" 
                      ? "bg-red-400" 
                      : task.priority === "Media" 
                      ? "bg-amber-400" 
                      : "bg-slate-300"
                  }`} 
                />

                {/* Status Interactive Icon Trigger */}
                <button
                  type="button"
                  onClick={() => toggleTaskStatus(task.id)}
                  title="Cambiar estado: Pendiente -> En Progreso -> Completado"
                  className="mt-0.5 shrink-0 focus:outline-none transition-transform hover:scale-115 cursor-pointer relative"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isInProgress ? (
                    <div className="w-5 h-5 rounded-full border-2 border-dashed border-blue-500 animate-spin flex items-center justify-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-500" />
                  )}
                </button>

                {/* Task Details Info Block */}
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span 
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`text-xs font-bold cursor-pointer transition ${
                        isCompleted ? "line-through text-slate-400 font-normal" : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </span>
                    
                    {/* Badge priority */}
                    <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                      task.priority === "Alta" 
                        ? "bg-red-50 text-red-600 border border-red-100" 
                        : task.priority === "Media" 
                        ? "bg-amber-50 text-amber-700 border border-amber-100" 
                        : "bg-slate-50 text-slate-500 border border-slate-150"
                    }`}>
                      {task.priority}
                    </span>

                    {/* Badge Phase */}
                    <span className="text-[8px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.5 rounded">
                      {task.phase}
                    </span>

                    {/* State text badge */}
                    <span className={`text-[8px] font-mono font-semibold px-1.5 py-0.5 rounded ${
                      isCompleted 
                        ? "bg-emerald-50 text-emerald-700" 
                        : isInProgress 
                        ? "bg-blue-50 text-blue-700" 
                        : "bg-slate-50 text-slate-600"
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  <p className={`text-[11px] leading-relaxed font-light ${
                    isCompleted ? "text-slate-400 line-through" : "text-slate-500"
                  }`}>
                    {task.description}
                  </p>
                </div>

                {/* Action buttons (Delete) */}
                <div className="shrink-0 flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {task.isCustom && (
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-slate-300 hover:text-red-500 transition rounded-md hover:bg-red-50"
                      title="Eliminar tarea"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Interactive Legend and Tip Footer */}
      <div className="pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center gap-3 text-[10px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-400" /> Prioridad Alta
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Prioridad Media
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-300" /> Prioridad Baja
          </span>
        </div>
        <span className="italic">
          * Consejo: Haz clic en el círculo de estado para rotar entre Pendiente, En Progreso y Completado.
        </span>
      </div>
    </div>
  );
};
