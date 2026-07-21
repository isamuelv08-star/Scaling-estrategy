import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  TrendingUp,
  Target,
  FileText,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  History,
  Save,
  Copy,
  PlusCircle,
  Search,
  Briefcase,
  DollarSign,
  Globe,
  ChevronRight,
  Printer,
  Loader2,
  Building2,
  Coins,
  ArrowRight,
  ArrowLeft,
  Award,
  X,
  MapPin,
  Users,
  Database,
  ArrowDownToLine,
  ExternalLink
} from "lucide-react";
import { SECTIONS_CONFIG, SUMMARY_PROMPT, FormData } from "./utils/prompts.ts";
import { parseMarkdownToReact } from "./utils/parser.tsx";
import { WelcomeScreen } from "./components/WelcomeScreen.tsx";
import { OnboardingWizard } from "./components/OnboardingWizard.tsx";
import { LiveGenerationTracker } from "./components/LiveGenerationTracker.tsx";
import { WorkspaceControls } from "./components/WorkspaceControls.tsx";

const LOADING_STATUSES = [
  "Iniciando auditoría de modelo de negocio y viabilidad de unit economics...",
  "Analizando métricas financieras y optimización de márgenes de utilidad...",
  "Estableciendo cuellos de botella en la conversión del embudo comercial...",
  "Buscando competidores de la industria en la región geográfica...",
  "Realizando benchmarking competitivo en tiempo real con inteligencia de mercado...",
  "Estructurando objetivos SMART adaptados al ticket promedio de venta...",
  "Calculando distribución óptima de presupuesto de adquisición...",
  "Diseñando campañas de adquisición avanzadas (Captación, Conversión, Reactivación)...",
  "Modelando embudo orgánico TOFU/MOFU/BOFU para redes sociales...",
  "Escribiendo calendario de contenido táctico con copys de alta conversión...",
  "Diseñando protocolo de ventas, velocidad de respuesta y automatización CRM...",
  "Definiendo cuadro de mando de KPIs (LTV, CAC, ROAS proyectado)...",
  "Evaluando riesgos del mercado y formulando planes de mitigación de contingencia..."
];

export default function App() {
  // Enhanced Form State - Onboarding questionnaire
  const [formData, setFormData] = useState<FormData>({
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
    herramientasActuales: ""
  });

  // Wizard Step State
  const [wizardStep, setWizardStep] = useState<number>(1);

  // Console Workspace State - Active layout toggler
  const [isWorkspaceActive, setIsWorkspaceActive] = useState<boolean>(false);

  // Floating Onboarding Modal open state (Legacy compatibility)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  // History Drawer open state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Generation State
  const [sections, setSections] = useState<Record<string, string>>({});
  const [resumen, setResumen] = useState<string>("");
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(-1);
  const [generationStatus, setGenerationStatus] = useState<"idle" | "generating" | "paused" | "error" | "finished">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Dynamic loading message index
  const [loadingMessageIndex, setLoadingMessageIndex] = useState<number>(0);

  // Retry and backoff state
  const [retryInfo, setRetryInfo] = useState<{ attempt: number; delay: number; errorMsg: string } | null>(null);

  // History List State
  const [historyList, setHistoryList] = useState<Array<{ id: string; nombre_negocio: string; rubro: string | null; created_at: string }>>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Platform API Mode State
  const [apiMode] = useState<"local" | "supabase">(() => {
    if ((import.meta as any).env.VITE_SUPABASE_URL) return "supabase";
    return "local";
  });
  const [supabaseUrl] = useState<string>(() => {
    return (import.meta as any).env.VITE_SUPABASE_URL || "";
  });
  const [supabaseAnonKey] = useState<string>(() => {
    return (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";
  });

  const getApiConfig = () => {
    if (apiMode === "supabase" && supabaseUrl) {
      const baseUrl = supabaseUrl.replace(/\/$/, "");
      const url = `${baseUrl}/functions/v1/estrategias-api`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (supabaseAnonKey) {
        headers["Authorization"] = `Bearer ${supabaseAnonKey}`;
        headers["apikey"] = supabaseAnonKey;
      }
      return { url, headers };
    } else {
      return {
        url: "/api/estrategias",
        headers: {
          "Content-Type": "application/json"
        }
      };
    }
  };

  // UI Control
  const [showToast, setShowToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const documentEndRef = useRef<HTMLDivElement>(null);

  // Load history list on startup
  useEffect(() => {
    fetchHistory();
  }, [apiMode, supabaseUrl, supabaseAnonKey]);

  // Auto scroll to active generating section
  useEffect(() => {
    if (generationStatus === "generating" && documentEndRef.current) {
      documentEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [sections, currentSectionIndex, generationStatus]);

  // Rotate loading status message when generating
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (generationStatus === "generating") {
      interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % LOADING_STATUSES.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [generationStatus]);

  // Toast auto-clear
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setShowToast({ message, type });
  };

  const fetchHistory = async () => {
    try {
      const { url, headers } = getApiConfig();
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ action: "list" })
      });
      const data = await response.json();
      if (response.ok && data.estrategias) {
        setHistoryList(data.estrategias);
      }
    } catch (err) {
      console.error("Error loading history:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validation rules per wizard step
  const isStepValid = (step: number) => {
    if (step === 1) {
      return formData.nombreNegocio.trim() !== "" && formData.rubro.trim() !== "";
    }
    if (step === 2) {
      return formData.descripcion.trim() !== "" && formData.productoEstrella.trim() !== "";
    }
    if (step === 3) {
      return formData.facturacion.trim() !== "" && formData.ticketPromedio.trim() !== "" && formData.presupuesto.trim() !== "";
    }
    if (step === 4) {
      return formData.metaPrincipal.trim() !== "" && formData.publicoObjetivo.trim() !== "" && formData.obstaculo.trim() !== "";
    }
    return true;
  };

  // Full form check
  const isFormValid = () => {
    return (
      formData.nombreNegocio.trim() !== "" &&
      formData.rubro.trim() !== "" &&
      formData.descripcion.trim() !== "" &&
      formData.productoEstrella.trim() !== "" &&
      formData.facturacion.trim() !== "" &&
      formData.ticketPromedio.trim() !== "" &&
      formData.presupuesto.trim() !== "" &&
      formData.metaPrincipal.trim() !== "" &&
      formData.publicoObjetivo.trim() !== "" &&
      formData.obstaculo.trim() !== ""
    );
  };

  // Helper fetch with automatic retry & exponential backoff on 429/503/529
  const fetchWithRetry = async (
    url: string,
    options: RequestInit,
    onRetry: (attempt: number, delay: number, errorMsg: string) => void,
    maxAttempts = 5
  ): Promise<Response> => {
    let attempt = 1;
    let delay = 3000; // start with 3s wait

    while (true) {
      try {
        const response = await fetch(url, options);

        if (response.status === 429 || response.status === 503 || response.status === 529) {
          if (attempt >= maxAttempts) {
            return response;
          }
          const errorMsg = `HTTP ${response.status}: Límite de cuota o servicio congestionado.`;
          onRetry(attempt, delay, errorMsg);
          await new Promise(resolve => setTimeout(resolve, delay));
          attempt++;
          delay *= 2; // exponential backoff
          continue;
        }

        return response;
      } catch (error: any) {
        if (attempt >= maxAttempts) {
          throw error;
        }
        const errorMsg = error?.message || String(error);
        onRetry(attempt, delay, `Fallo de conexión: ${errorMsg}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
        delay *= 2;
      }
    }
  };

  // Main generation loop
  const generateStrategy = async (startIndex = 0) => {
    if (!isFormValid()) {
      triggerToast("Por favor complete toda la información del onboarding para un análisis de alta precisión.", "error");
      return;
    }

    setIsWorkspaceActive(true);
    setIsFormOpen(false);
    setGenerationStatus("generating");
    setErrorMessage("");
    setRetryInfo(null);
    setSelectedHistoryId(null);
    setSaveSuccess(false);

    // If starting fresh, reset document state
    if (startIndex === 0) {
      setSections({});
      setResumen("");
    }

    let currentSectionsState = startIndex === 0 ? {} : { ...sections };

    try {
      // 1. Generate the 7 sections sequentially
      for (let i = startIndex; i < SECTIONS_CONFIG.length; i++) {
        const currentSection = SECTIONS_CONFIG[i];
        setCurrentSectionIndex(i);

        // Gather previous text as context to keep consistency
        const previousContextText = SECTIONS_CONFIG
          .slice(0, i)
          .map(sec => currentSectionsState[sec.id] || "")
          .filter(text => text !== "")
          .join("\n\n");

        const promptText = currentSection.prompt(formData, previousContextText);

        const payload: any = {
          action: "generate",
          system: "Eres el Consultor Principal de Scaling Strategy, una firma premium de consultoría de crecimiento y aceleración empresarial para PyMEs. Responde con altísimo nivel estratégico, de manera asertiva, denso en valor práctico, usando un vocabulario corporativo sofisticado de negocios y estructurando tu respuesta estrictamente en un español elegante y profesional.",
          messages: [{ role: "user", content: promptText }],
          max_tokens: 3000
        };

        // Inject Anthropic native web search tool for Section 2 (Comparativa de Mercado)
        if (currentSection.id === "comparativa") {
          payload.tools = [{ type: "web_search_20250305", name: "web_search" }];
        }

        const { url: apiSectionUrl, headers: apiSectionHeaders } = getApiConfig();
        const response = await fetchWithRetry(
          apiSectionUrl,
          {
            method: "POST",
            headers: apiSectionHeaders,
            body: JSON.stringify(payload)
          },
          (attempt, delay, errorMsg) => {
            setRetryInfo({ attempt, delay, errorMsg });
          }
        );

        setRetryInfo(null);

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData?.error || `Error en sección: ${currentSection.name}`);
        }

        const data = await response.json();

        // Extract text from Anthropic content blocks
        if (!data.content || !Array.isArray(data.content)) {
          throw new Error("Respuesta inválida recibida de la API");
        }

        const textBlocks = data.content
          .filter((block: any) => block.type === "text")
          .map((block: any) => block.text)
          .join("\n\n");

        if (!textBlocks.trim()) {
          throw new Error("El modelo retornó una respuesta vacía para esta sección.");
        }

        // Save generated section in state
        currentSectionsState = {
          ...currentSectionsState,
          [currentSection.id]: textBlocks
        };
        setSections(currentSectionsState);

        // Pause for ~1.5 seconds between requests to mitigate rate limits
        if (i < SECTIONS_CONFIG.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      // 2. Generate Executive Summary based on the entire generated content
      setCurrentSectionIndex(SECTIONS_CONFIG.length); // loading summary state
      const fullContentText = SECTIONS_CONFIG
        .map(sec => currentSectionsState[sec.id] || "")
        .join("\n\n");

      const summaryPromptText = SUMMARY_PROMPT(formData, fullContentText);

      const { url: apiSumUrl, headers: apiSumHeaders } = getApiConfig();
      const summaryResponse = await fetchWithRetry(
        apiSumUrl,
        {
          method: "POST",
          headers: apiSumHeaders,
          body: JSON.stringify({
            action: "generate",
            system: "Eres el Socio Director de Scaling Strategy. Tu especialidad es sintetizar reportes densos en resúmenes sumamente persuasivos, profesionales y precisos.",
            messages: [{ role: "user", content: summaryPromptText }],
            max_tokens: 1000
          })
        },
        (attempt, delay, errorMsg) => {
          setRetryInfo({ attempt, delay, errorMsg });
        }
      );

      setRetryInfo(null);

      if (!summaryResponse.ok) {
        const errData = await summaryResponse.json();
        throw new Error(errData?.error || "Error generando el Resumen Ejecutivo.");
      }

      const summaryData = await summaryResponse.json();
      const summaryText = summaryData.content
        .filter((block: any) => block.type === "text")
        .map((block: any) => block.text)
        .join("\n\n");

      setResumen(summaryText);
      setGenerationStatus("finished");
      triggerToast("¡Estrategia de Escalado generada con éxito!", "success");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Ocurrió un error inesperado.");
      setGenerationStatus("error");
      triggerToast("Fallo en la generación de la estrategia.", "error");
    }
  };

  // Resume generation from failed section index
  const resumeGeneration = () => {
    generateStrategy(currentSectionIndex);
  };

  // Save full strategy to DB
  const saveStrategyToDB = async () => {
    if (generationStatus !== "finished" && !selectedHistoryId) {
      triggerToast("Debe esperar a que termine de generarse la estrategia.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const { url, headers } = getApiConfig();
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          action: "save",
          nombreNegocio: formData.nombreNegocio,
          rubro: formData.rubro,
          formData: formData,
          secciones: sections,
          resumen: resumen
        })
      });

      const data = await response.json();
      if (response.ok && data.id) {
        setSaveSuccess(true);
        triggerToast("Estrategia guardada en el historial corporativo", "success");
        fetchHistory(); // refresh history list
        setSelectedHistoryId(data.id);
      } else {
        throw new Error(data?.error || "Error al guardar");
      }
    } catch (err: any) {
      triggerToast(err?.message || "No se pudo guardar la estrategia.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // Load selected strategy from history
  const loadHistoryItem = async (id: string) => {
    setGenerationStatus("idle");
    setErrorMessage("");
    setRetryInfo(null);
    setSelectedHistoryId(id);
    setSaveSuccess(false);
    setIsHistoryOpen(false); // Close history sidebar drawer

    try {
      const { url, headers } = getApiConfig();
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ action: "get", id })
      });
      const data = await response.json();
      if (response.ok && data.estrategia) {
        const est = data.estrategia;
        // set form data
        if (est.form_data) {
          setFormData(est.form_data);
          setWizardStep(4);
        } else {
          setFormData({
            nombreNegocio: est.nombre_negocio,
            rubro: est.rubro || "",
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
            herramientasActuales: ""
          });
          setWizardStep(1);
        }
        setSections(est.secciones || {});
        setResumen(est.resumen || "");
        setGenerationStatus("finished"); // Mark as finished so edit controls render
        setIsWorkspaceActive(true);
        setIsFormOpen(false);
        triggerToast(`Cargada estrategia de ${est.nombre_negocio}`, "info");
      } else {
        throw new Error(data?.error || "Error cargando ítem del historial");
      }
    } catch (err: any) {
      triggerToast(err?.message || "No se pudo cargar la estrategia.", "error");
    }
  };

  // Clipboard copies strategy markdown
  const copyToClipboard = () => {
    let fullText = `# ESTRATEGIA DE ESCALADO: ${formData.nombreNegocio.toUpperCase()}\n`;
    fullText += `Modelo de Negocio: ${formData.tipoModelo} | Rubro: ${formData.rubro} | Plazo: ${formData.plazoMeta}\n\n`;
    fullText += `## RESUMEN EJECUTIVO\n${resumen}\n\n`;

    SECTIONS_CONFIG.forEach(sec => {
      if (sections[sec.id]) {
        fullText += `${sections[sec.id]}\n\n`;
      }
    });

    navigator.clipboard.writeText(fullText)
      .then(() => triggerToast("Estrategia copiada al portapapeles en formato Markdown", "success"))
      .catch(() => triggerToast("Fallo al copiar", "error"));
  };

  // Handle printing
  const handlePrint = () => {
    window.print();
  };

  // Triggered when initiating a completely fresh, empty workspace
  const startNewStrategy = () => {
    setFormData({
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
      herramientasActuales: ""
    });
    setSections({});
    setResumen("");
    setGenerationStatus("idle");
    setErrorMessage("");
    setSelectedHistoryId(null);
    setSaveSuccess(false);
    setWizardStep(1);
    setIsWorkspaceActive(true);
    setIsFormOpen(false);
    triggerToast("Iniciado nuevo espacio de trabajo independiente", "info");
  };

  const hasStrategyData = resumen || Object.keys(sections).length > 0;

  return (
    <div className="min-h-screen bg-white text-slate-800 selection:bg-blue-600 selection:text-white relative font-sans">
      
      {/* Decorative premium radial glows (Pure light elegant palette) */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-50/70 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-slate-50/80 rounded-full blur-[140px] pointer-events-none" />

      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border animate-fade-in transition-all duration-300 max-w-sm backdrop-blur-md ${
            showToast.type === "success"
              ? "bg-slate-900 text-white border-blue-500/20"
              : showToast.type === "error"
              ? "bg-red-50 text-red-900 border-red-200"
              : "bg-white text-slate-800 border-slate-200"
          }`}
        >
          {showToast.type === "success" && <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />}
          {showToast.type === "error" && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />}
          {showToast.type === "info" && <Sparkles className="w-5 h-5 text-blue-500 shrink-0" />}
          <span className="text-xs font-semibold">{showToast.message}</span>
        </div>
      )}

      {/* CONDITIONAL RENDER: WELCOME PAGE OR INTEGRATED CONSOLE */}
      {!isWorkspaceActive && !hasStrategyData ? (
        <WelcomeScreen
          onStart={(initialData) => {
            setFormData(initialData);
            setWizardStep(1);
            setIsWorkspaceActive(true);
          }}
          onOpenHistory={() => {
            setIsWorkspaceActive(true);
            setIsHistoryOpen(true);
            fetchHistory();
          }}
          historyCount={historyList.length}
        />
      ) : (
        <div className="animate-fade-in">
          {/* HEADER (Active Workspace Console) */}
          <header className="bg-white/80 backdrop-blur border-b border-slate-100 py-4 px-6 md:px-8 flex items-center justify-between sticky top-0 z-40 print:hidden">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsWorkspaceActive(false)}
                className="bg-slate-100 hover:bg-slate-200 p-2 rounded-xl transition text-slate-600 cursor-pointer"
                title="Volver al inicio"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="bg-blue-600 p-2 rounded-xl shadow-md shadow-blue-600/10">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h1 className="font-display text-xs md:text-sm font-bold tracking-tight text-slate-900 leading-none">
                  Scaling Strategy
                </h1>
                <span className="text-[8px] font-mono tracking-widest uppercase text-slate-400 font-bold block mt-0.5">
                  WORKSPACE CONSOLE
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={startNewStrategy}
                className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold py-2 px-3 rounded-xl border border-blue-100 transition cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nueva Estrategia</span>
              </button>

              <button
                onClick={() => {
                  setIsHistoryOpen(true);
                  fetchHistory();
                }}
                className="flex items-center gap-1.5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 text-xs font-bold py-2 px-3 rounded-xl transition cursor-pointer"
              >
                <History className="w-3.5 h-3.5 text-slate-400" />
                Historial ({historyList.length})
              </button>
            </div>
          </header>

          {/* DUAL WORKSPACE LAYOUT */}
          <main className="max-w-[1550px] mx-auto px-4 py-8 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT PANEL: ACTIVE CONSOLE WIDGET */}
            <div className="lg:col-span-5 space-y-6">
              {generationStatus === "idle" && (
                <OnboardingWizard
                  formData={formData}
                  onChange={handleInputChange}
                  wizardStep={wizardStep}
                  setWizardStep={setWizardStep}
                  onGenerate={() => generateStrategy(0)}
                  isGenerating={generationStatus === "generating"}
                  triggerToast={triggerToast}
                />
              )}

              {generationStatus === "generating" && (
                <LiveGenerationTracker
                  formData={formData}
                  loadingMessageIndex={loadingMessageIndex}
                  loadingStatuses={LOADING_STATUSES}
                  currentSectionIndex={currentSectionIndex}
                  resumen={resumen}
                  retryInfo={retryInfo}
                />
              )}

              {generationStatus === "finished" && (
                <WorkspaceControls
                  formData={formData}
                  copyToClipboard={copyToClipboard}
                  handlePrint={handlePrint}
                  saveStrategyToDB={saveStrategyToDB}
                  isSaving={isSaving}
                  saveSuccess={saveSuccess}
                  onEditOnboarding={() => {
                    setGenerationStatus("idle");
                    setWizardStep(1);
                  }}
                  startNewStrategy={startNewStrategy}
                />
              )}
            </div>

            {/* RIGHT PANEL: DYNAMIC STRATEGY CANVAS SHEET */}
            <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-1 text-left">
              {generationStatus === "idle" && (
                <div className="bg-amber-50/70 border border-amber-200/50 rounded-2xl p-4 flex items-center gap-3 text-amber-800 animate-fade-in print:hidden">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
                  <p className="text-[11px] font-medium leading-normal">
                    <b>Borrador en tiempo real:</b> Complete el onboarding de la izquierda y observe cómo se actualizan dinámicamente el perfil corporativo y las metas en esta hoja estratégica.
                  </p>
                </div>
              )}

              {/* Document Sheet Layout */}
              <article
                id="printed-document-canvas"
                className="bg-white text-slate-800 rounded-3xl shadow-xl border border-slate-200 p-6 md:p-10 relative overflow-hidden flex flex-col gap-8 print:p-0 print:shadow-none print:rounded-none print:border-none"
              >
                {/* Letterhead header block */}
                <div className="border-b border-slate-200/80 pb-6 flex flex-wrap items-start justify-between gap-6 print:border-b print:border-zinc-300">
                  <div className="space-y-2">
                    <span className="text-[8px] font-mono tracking-[0.25em] text-blue-600 font-bold uppercase block">
                      PLAN ESTRATÉGICO DE CRECIMIENTO CORPORATIVO
                    </span>
                    <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight text-slate-900 print:text-black leading-tight">
                      {formData.nombreNegocio || "Nueva Estrategia"}
                    </h1>
                    
                    {/* Real-Time updating metadata chips */}
                    <div className="flex flex-wrap items-center gap-y-1.5 gap-x-2.5 text-[10px] text-slate-500 pt-1 font-medium">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Modelo: <b>{formData.tipoModelo}</b></span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Rubro: <b>{formData.rubro || "General"}</b></span>
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Horizonte: <b>{formData.plazoMeta}</b></span>
                      {formData.ubicacion && (
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded flex items-center gap-1">
                          <MapPin className="w-2.5 h-2.5 text-slate-400" />
                          {formData.ubicacion}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-display text-xs font-bold tracking-widest text-slate-900 block print:text-black">SCALING STRATEGY</span>
                    <span className="text-[8px] font-mono tracking-wider text-blue-600 block uppercase font-bold">GROWTH PLATFORM</span>
                    <span className="text-[9px] text-slate-400 font-mono mt-2 block">
                      {new Date().toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric"
                      })}
                    </span>
                  </div>
                </div>

                {/* Content Section Sheet */}
                <div className="space-y-8">
                  {resumen ? (
                    <div className="p-5 bg-blue-50/60 border-l-4 border-blue-600 rounded-r-2xl shadow-sm italic text-xs md:text-sm text-slate-900 leading-relaxed">
                      "{resumen}"
                    </div>
                  ) : (
                    generationStatus === "idle" && formData.nombreNegocio && (
                      <div className="p-4 bg-slate-50 border border-slate-200/60 border-dashed rounded-2xl text-xs text-slate-600 italic">
                        "Plan táctico estructurado para escalar el producto estrella <b>{formData.productoEstrella || "[Su Producto Estrella]"}</b> en <b>{formData.ubicacion || "[Ubicación de Operación]"}</b>, con una meta prioritaria a <b>{formData.plazoMeta}</b> de: <b>{formData.metaPrincipal || "[Meta Principal]"}</b>."
                      </div>
                    )
                  )}

                  {/* Rendering Content Sections */}
                  <div className="space-y-10">
                    {SECTIONS_CONFIG.map((sec, index) => {
                      const completedContent = sections[sec.id];
                      const isCurrent = currentSectionIndex === index;

                      if (completedContent) {
                        return (
                          <div key={sec.id} className="animate-fade-in border-t border-slate-100 pt-6 first:border-0 first:pt-0">
                            <div className="prose max-w-none text-xs md:text-sm">
                              {parseMarkdownToReact(completedContent)}
                            </div>
                          </div>
                        );
                      }

                      if (generationStatus === "idle") {
                        return (
                          <div key={sec.id} className="border border-dashed border-slate-200/80 rounded-2xl p-5 bg-slate-50/30 space-y-2 text-xs">
                            <div className="flex items-center gap-2 text-slate-400">
                              <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                                {index + 1}
                              </div>
                              <h4 className="font-bold text-slate-700">{sec.name}</h4>
                              <span className="text-[9px] font-mono bg-slate-100 px-2 py-0.5 rounded ml-auto">Borrador en Cola</span>
                            </div>
                            <p className="text-[11px] text-slate-400 pl-7 leading-relaxed font-light">
                              {sec.id === "diagnostico" && `Análisis crítico para ${formData.nombreNegocio || "su empresa"} enfocado en resolver el cuello de botella: ${formData.obstaculo || "[Obstáculo Principal]"}.`}
                              {sec.id === "comparativa" && `Benchmarking en tiempo real contra competidores en ${formData.ubicacion || "su región"} de la industria ${formData.rubro || "General"}.`}
                              {sec.id === "objetivos" && `3 metas SMART estructuradas para escalar ${formData.productoEstrella || "[Producto Estrella]"} en un plazo de ${formData.plazoMeta}.`}
                              {sec.id === "plan" && `Hojas de ruta de 3 fases personalizadas según el tamaño del equipo (${formData.tamanoEquipo}) y herramientas (${formData.herramientasActuales}).`}
                              {sec.id === "campanas" && `Campañas tácticas optimizadas distribuyendo el presupuesto de marketing de ${formData.presupuesto}.`}
                              {sec.id === "calendario" && "Plan táctico de contenido orgánico TOFU, MOFU and BOFU con matriz de distribución."}
                              {sec.id === "sistema" && "Protocolo comercial, velocidad de respuesta en CRM y mitigación de contingencias."}
                            </p>
                          </div>
                        );
                      }

                      if (isCurrent) {
                        return (
                          <div key={sec.id} className="border border-blue-200/80 rounded-2xl p-5 bg-blue-50/20 space-y-3 animate-pulse text-xs">
                            <div className="flex items-center gap-2 text-blue-600">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <h4 className="font-bold text-blue-800">{sec.name}</h4>
                              <span className="text-[9px] font-mono bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full ml-auto font-bold">Redactando Sección...</span>
                            </div>
                            <p className="text-[11px] text-blue-600 pl-6 leading-relaxed font-medium">
                              {LOADING_STATUSES[loadingMessageIndex]}
                            </p>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>

                {/* Footer metadata */}
                <div className="border-t border-slate-150 pt-5 mt-8 text-center text-[9px] text-slate-400 flex flex-wrap justify-between gap-4 font-mono">
                  <span>ID-PLAN: {selectedHistoryId ? selectedHistoryId.slice(0, 8).toUpperCase() : "PROTOTIPO-SCALING"}</span>
                  <span>CONFIDENCIAL • {formData.nombreNegocio.toUpperCase() || "NEGOCIO"}.</span>
                  <span>PÁGINA 1 DE 1</span>
                </div>
              </article>

              {/* Error recovery block */}
              {generationStatus === "error" && errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-900 space-y-3 animate-fade-in text-left">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wide">Error en Redacción</h4>
                      <p className="text-xs text-slate-600">
                        La conexión se ha pausado debido a límites de tasa de Claude. Las secciones completadas se encuentran preservadas. Puede reintentar reanudar para terminar la redacción.
                      </p>
                      <p className="text-[10px] font-mono text-red-700 bg-red-100/50 p-2 rounded border border-red-200/60 overflow-x-auto mt-2">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={resumeGeneration}
                      className="flex items-center gap-1.5 py-2 px-4 bg-red-600 text-white font-semibold text-xs rounded-xl hover:bg-red-700 transition cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reanudar Generación
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Footer info line inside workspace */}
          <footer className="max-w-[1550px] mx-auto px-4 py-8 md:px-8 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>PLATFORM MODE: {apiMode.toUpperCase()}</span>
            <span>© SCALING STRATEGY IA. TODOS LOS DERECHOS RESERVADOS.</span>
          </footer>
        </div>
      )}

      {/* FLYOUT HISTORY SIDEBAR DRAWER (Right sliding drawer) */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          {/* Backdrop shadow overlay */}
          <div
            onClick={() => setIsHistoryOpen(false)}
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
          />

          {/* Drawer Canvas: Fully elegant white */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200/80 flex flex-col p-6 space-y-6 z-10 animate-fade-in">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-600" />
                <h3 className="font-display text-sm font-bold tracking-tight text-slate-900">
                  Historial de Estrategias
                </h3>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-50 rounded-lg transition"
                aria-label="Cerrar historial"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List container: scrollable */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-left">
              {historyList.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <History className="w-7 h-7 text-slate-300 mb-2" />
                  <p className="text-xs text-slate-400 font-medium">No se encontraron planes guardados</p>
                  <p className="text-[10px] text-slate-400 font-light mt-0.5">Las estrategias que guarde aparecerán aquí.</p>
                </div>
              ) : (
                historyList.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      loadHistoryItem(item);
                      setIsHistoryOpen(false);
                    }}
                    className={`group w-full p-4 rounded-2xl border text-left transition flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 hover:border-slate-300 ${
                      selectedHistoryId === item.id
                        ? "bg-blue-50/50 border-blue-300 ring-1 ring-blue-300"
                        : "bg-white border-slate-200/80"
                    }`}
                  >
                    <div className="space-y-1 overflow-hidden flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {item.nombre_negocio}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {item.rubro || "Sin sector definido"}
                      </p>
                    </div>
                    
                    <div className="text-right shrink-0 flex items-center gap-1">
                      <span className="text-[9px] font-mono text-slate-400 block mr-1">
                        {new Date(item.created_at).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short"
                        })}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-600" />
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-400 font-mono flex items-center justify-between">
              <span>TOTAL REGISTROS: {historyList.length}</span>
              <span>SCALING STRATEGY</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
