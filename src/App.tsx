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
  User,
  LogOut,
  Briefcase,
  DollarSign,
  Globe,
  ChevronRight,
  ChevronLeft,
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
  ExternalLink,
  Sliders,
  Settings,
  Server,
  Cloud,
  RefreshCw,
  Cpu,
  Terminal,
  Edit,
  Palette,
  Trash2
} from "lucide-react";
import { SECTIONS_CONFIG, SUMMARY_PROMPT, FormData, getSectionsForStrategy } from "./utils/prompts.ts";
import { parseMarkdownToReact } from "./utils/parser.tsx";
import { stripMarkdown, generatePremiumHTMLReport } from "./utils/cleanText";
import { WelcomeScreen } from "./components/WelcomeScreen.tsx";
import { createClient } from "@supabase/supabase-js";
import { AuthModal } from "./components/AuthModal.tsx";
import { OnboardingWizard } from "./components/OnboardingWizard.tsx";
import { LiveGenerationTracker } from "./components/LiveGenerationTracker.tsx";
import { WorkspaceControls } from "./components/WorkspaceControls.tsx";
import { ROICalculator } from "./components/ROICalculator.tsx";
import { HookGenerator } from "./components/HookGenerator.tsx";
import { StrategySelector } from "./components/StrategySelector.tsx";
import { TaskBoard } from "./components/TaskBoard.tsx";
import { ConfiguracionModal } from "./components/ConfiguracionModal.tsx";
import { ListTodo } from "lucide-react";

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

const getSectionIcon = (id: string) => {
  switch (id) {
    case "diagnostico": return <Search className="w-5 h-5 text-blue-600" />;
    case "comparativa": return <Briefcase className="w-5 h-5 text-indigo-600" />;
    case "objetivos": return <Target className="w-5 h-5 text-emerald-600" />;
    case "plan": return <FileText className="w-5 h-5 text-amber-600" />;
    case "campanas": return <Coins className="w-5 h-5 text-purple-600" />;
    case "calendario": return <Sparkles className="w-5 h-5 text-rose-600" />;
    case "sistema": return <Sliders className="w-5 h-5 text-blue-600" />;
    default: return <CheckCircle2 className="w-5 h-5 text-blue-600" />;
  }
};

const getEndingMessageForStrategy = (strategyType: string, businessName: string) => {
  switch (strategyType) {
    case "completa":
      return `¡Fin! Con esto, ${businessName} va por el camino correcto a tener un sistema de adquisición y crecimiento 360° altamente predecible, rentable y sostenible en el tiempo.`;
    case "contenido":
      return `¡Fin! Con esto, ${businessName} va por el camino correcto a tener un flujo constante, orgánico y sostenible de prospectos calificados mediante Inbound Marketing y contenido de alto impacto.`;
    case "pago":
      return `¡Fin! Con esto, ${businessName} va por el camino correcto a tener un motor predecible y sostenible de captación de clientes a través de campañas de pauta digital optimizadas.`;
    case "escalabilidad":
      return `¡Fin! Con esto, ${businessName} va por el camino correcto a estructurar un modelo de negocio con unit economics sólidos, márgenes saludables y crecimiento financiero sostenible.`;
    case "comercial":
      return `¡Fin! Con esto, ${businessName} va por el camino correcto a tener un protocolo comercial de ventas optimizado, garantizando cierres veloces y un seguimiento CRM sostenible.`;
    case "copywriting":
      return `¡Fin! Con esto, ${businessName} va por el camino correcto a contar con una maquinaria de persuasión y respuesta directa altamente efectiva para embudos sostenibles.`;
    default:
      return `¡Fin! Con esto, ${businessName} va por el camino correcto a tener un modelo comercial ordenado, rentable y sostenible en el tiempo.`;
  }
};

const cleanSectionContent = (text: string) => {
  if (!text) return "";
  const lines = text.split("\n");
  let foundHeadingIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith("## ")) {
      foundHeadingIndex = i;
      break;
    } else if (trimmed !== "") {
      break;
    }
  }
  if (foundHeadingIndex !== -1) {
    lines.splice(foundHeadingIndex, 1);
  }
  return lines.join("\n").trim();
};

const renderCleanSummary = (text: string, accentColor: string = "blue") => {
  if (!text) return null;
  let cleaned = text
    .replace(/#{1,6}\s?/g, "")
    .replace(/\*\*/g, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .trim();
  const theme = COLOR_THEMES[accentColor] || COLOR_THEMES.blue;
  const glowBg = accentColor === "blue" ? "bg-blue-500/10" : accentColor === "indigo" ? "bg-indigo-500/10" : accentColor === "emerald" ? "bg-emerald-500/10" : accentColor === "violet" ? "bg-violet-500/10" : "bg-slate-500/10";
  return (
    <div className="p-6 md:p-8 bg-slate-900 rounded-3xl text-white shadow-lg space-y-3 relative overflow-hidden my-6 border border-slate-800 print:bg-white print:text-slate-900 print:border print:border-slate-300 animate-fade-in">
      <div className={`absolute top-0 right-0 w-32 h-32 ${glowBg} rounded-full blur-2xl pointer-events-none print:hidden`} />
      <span className={`text-[9px] font-mono tracking-widest ${theme.text} font-bold uppercase block print:text-slate-800`}>
        SÍNTESIS ESTRATÉGICA EJECUTIVA
      </span>
      <p className="font-serif text-sm md:text-base leading-relaxed text-slate-100 font-light italic print:text-slate-850">
        "{cleaned}"
      </p>
      <div className="pt-2.5 border-t border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-400 print:border-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse print:bg-emerald-600" />
        <span>Modelo listo para ejecución y monitoreo táctico</span>
      </div>
    </div>
  );
};

export const COLOR_THEMES: Record<string, {
  name: string;
  text: string;
  bgLight: string;
  bg: string;
  border: string;
  ring: string;
  gradient: string;
  hex: string;
  gradientHex: string;
}> = {
  blue: {
    name: "Azul Corporativo",
    text: "text-blue-600",
    bgLight: "bg-blue-50/70",
    bg: "bg-blue-600",
    border: "border-blue-100",
    ring: "ring-blue-500",
    gradient: "from-blue-600 to-indigo-750",
    hex: "#2563eb",
    gradientHex: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
  },
  indigo: {
    name: "Índigo Moderno",
    text: "text-indigo-600",
    bgLight: "bg-indigo-50/70",
    bg: "bg-indigo-600",
    border: "border-indigo-100",
    ring: "ring-indigo-500",
    gradient: "from-indigo-600 to-violet-750",
    hex: "#4f46e5",
    gradientHex: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)"
  },
  emerald: {
    name: "Esmeralda Crecimiento",
    text: "text-emerald-600",
    bgLight: "bg-emerald-50/70",
    bg: "bg-emerald-600",
    border: "border-emerald-100",
    ring: "ring-emerald-500",
    gradient: "from-emerald-600 to-teal-750",
    hex: "#059669",
    gradientHex: "linear-gradient(135deg, #059669 0%, #047857 100%)"
  },
  violet: {
    name: "Violeta Premium",
    text: "text-violet-600",
    bgLight: "bg-violet-50/70",
    bg: "bg-violet-600",
    border: "border-violet-100",
    ring: "ring-violet-500",
    gradient: "from-violet-600 to-purple-750",
    hex: "#7c3aed",
    gradientHex: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)"
  },
  slate: {
    name: "Carbono Sobrio",
    text: "text-slate-800",
    bgLight: "bg-slate-100",
    bg: "bg-slate-800",
    border: "border-slate-200",
    ring: "ring-slate-700",
    gradient: "from-slate-700 to-slate-900",
    hex: "#1e293b",
    gradientHex: "linear-gradient(135deg, #334155 0%, #1e293b 100%)"
  }
};

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
    herramientasActuales: "",
    invertidoEnAds: "No",
    montoInvertidoEnAds: "",
    plataformasAds: ""
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
  const [generationStatus, setGenerationStatus] = useState<"idle" | "selecting" | "generating" | "paused" | "error" | "finished">("idle");
  const [selectedStrategyType, setSelectedStrategyType] = useState<string>("completa");
  const [activeTab, setActiveTab] = useState<"strategy" | "roi" | "hooks" | "tasks">("strategy");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Inline Section Editing States
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  // Sidebar Collapsed State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Consultant / Agency Branding States
  const [consultorNombre, setConsultorNombre] = useState<string>("SCALING STRATEGY");
  const [accentColor, setAccentColor] = useState<string>("blue");
  const [isBrandingOpen, setIsBrandingOpen] = useState<boolean>(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [historySearchQuery, setHistorySearchQuery] = useState<string>("");
  
  // User Auth States
  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  
  // Dynamic loading message index
  const [loadingMessageIndex, setLoadingMessageIndex] = useState<number>(0);

  // Retry and backoff state
  const [retryInfo, setRetryInfo] = useState<{ attempt: number; delay: number; errorMsg: string } | null>(null);

  // History List State
  const [historyList, setHistoryList] = useState<Array<{ id: string; nombre_negocio: string; rubro: string | null; created_at: string }>>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Platform API Mode State (Strictly Supabase, falling back to localStorage, then environment variables)
  const [supabaseUrl, setSupabaseUrlState] = useState<string>(() => {
    return localStorage.getItem("scaling_supabase_url") || (import.meta as any).env.VITE_SUPABASE_URL || "";
  });
  const [supabaseAnonKey, setSupabaseAnonKeyState] = useState<string>(() => {
    return localStorage.getItem("scaling_supabase_anon_key") || (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";
  });

  // Settings overlay state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [tempSupabaseUrl, setTempSupabaseUrl] = useState<string>("");
  const [tempSupabaseAnonKey, setTempSupabaseAnonKey] = useState<string>("");

  useEffect(() => {
    if (isSettingsOpen) {
      setTempSupabaseUrl(supabaseUrl);
      setTempSupabaseAnonKey(supabaseAnonKey);
      setConnectionTestResult(null);
    }
  }, [isSettingsOpen, supabaseUrl, supabaseAnonKey]);

  const updateApiSettings = (url: string, key: string) => {
    localStorage.setItem("scaling_supabase_url", url);
    localStorage.setItem("scaling_supabase_anon_key", key);
    setSupabaseUrlState(url);
    setSupabaseAnonKeyState(key);
  };

  // Auth session subscriber and profile sync
  useEffect(() => {
    const client = getSupabaseClient();
    if (!client) return;

    // Get initial session
    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        loadUserProfile(session.user.id);
      }
    });

    // Listen to changes
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setConsultorNombre("SCALING STRATEGY");
        setAccentColor("blue");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseUrl, supabaseAnonKey]);

  const loadUserProfile = async (userId: string) => {
    const client = getSupabaseClient();
    if (!client) return;
    try {
      const { data, error } = await client
        .from("perfiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle(); // Use maybeSingle to prevent exceptions if first-time user
      if (data) {
        if (data.consultor_nombre) setConsultorNombre(data.consultor_nombre);
        if (data.accent_color) setAccentColor(data.accent_color);
      }
    } catch (err) {
      console.warn("No se pudo cargar el perfil del usuario:", err);
    }
  };

  const saveUserProfile = async (nombre: string, color: string) => {
    const client = getSupabaseClient();
    if (!client || !user) return;
    try {
      const { error } = await client.from("perfiles").upsert({
        user_id: user.id,
        consultor_nombre: nombre,
        accent_color: color,
        updated_at: new Date().toISOString()
      }, { onConflict: "user_id" });
      if (error) throw error;
      triggerToast("Configuración de marca guardada en su cuenta", "success");
    } catch (err: any) {
      console.error("Error saving profile:", err);
      triggerToast("No se pudo guardar la configuración: " + err.message, "error");
    }
  };

  // Helper to initialize and retrieve Supabase Client
  const getSupabaseClient = () => {
    if (!supabaseUrl || !supabaseAnonKey) return null;
    try {
      return createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
      console.error("Error al instanciar el cliente Supabase:", err);
      return null;
    }
  };

  // Generic direct function invocation
  const invokeEdgeFunction = async (body: any) => {
    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Supabase no está configurado. Por favor ingrese la URL y Anon Key válidos.");
    }
    const { data, error } = await client.functions.invoke("estrategias-api", {
      body
    });
    if (error) {
      throw new Error(error.message || String(error));
    }
    return data;
  };

  // Helper fetch with automatic retry & exponential backoff on 429/503/529 using Supabase JS SDK
  const invokeEdgeFunctionWithRetry = async (
    body: any,
    onRetry: (attempt: number, delay: number, errorMsg: string) => void,
    maxAttempts = 5
  ): Promise<any> => {
    let attempt = 1;
    let delay = 3000; // start with 3s wait

    const client = getSupabaseClient();
    if (!client) {
      throw new Error("Supabase no está configurado. Por favor, ingrese la URL y la Anon Key de Supabase en la configuración.");
    }

    while (true) {
      try {
        const response = await client.functions.invoke("estrategias-api", {
          body
        });
        const { data, error } = response;
        const status = (response as any).status;

        if (error) {
          if (status === 429 || status === 503 || status === 529) {
            if (attempt >= maxAttempts) {
              throw new Error(error.message || `Error HTTP ${status}`);
            }
            const errorMsg = `HTTP ${status}: Límite de cuota o servicio congestionado.`;
            onRetry(attempt, delay, errorMsg);
            await new Promise(resolve => setTimeout(resolve, delay));
            attempt++;
            delay *= 2; // exponential backoff
            continue;
          }
          throw new Error(error.message || `Error HTTP ${status}`);
        }

        return data;
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

  // Connection Testing State & Handler
  const [isTestingConnection, setIsTestingConnection] = useState<boolean>(false);
  const [connectionTestResult, setConnectionTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const testConnection = async (testUrl: string, testKey: string) => {
    if (!testUrl) {
      setConnectionTestResult({ success: false, message: "Por favor, ingrese la URL de Supabase para realizar la prueba." });
      return;
    }
    setIsTestingConnection(true);
    setConnectionTestResult(null);

    try {
      const baseUrl = testUrl.trim().replace(/\/$/, "");
      const url = `${baseUrl}/functions/v1/estrategias-api`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${testKey.trim()}`,
          "apikey": testKey.trim()
        },
        body: JSON.stringify({ action: "list" })
      });

      if (response.ok) {
        setConnectionTestResult({
          success: true,
          message: "¡Conexión exitosa! El Edge Function de Supabase está activo, autenticado y respondiendo correctamente."
        });
      } else {
        let errMsg = "Error desconocido";
        try {
          const errData = await response.json();
          errMsg = errData?.error || errMsg;
        } catch {}
        setConnectionTestResult({
          success: false,
          message: `Código HTTP ${response.status}: ${errMsg}. Verifique que el Anon Key sea correcto y que el Edge Function esté habilitado.`
        });
      }
    } catch (err: any) {
      setConnectionTestResult({
        success: false,
        message: `Fallo de conexión: ${err?.message || String(err)}. Verifique que la URL de Supabase sea válida y que el servidor tenga acceso a internet o que no esté bloqueado por CORS.`
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // UI Control
  const [showToast, setShowToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const documentEndRef = useRef<HTMLDivElement>(null);

  // Load history list on startup
  useEffect(() => {
    fetchHistory();
  }, [supabaseUrl, supabaseAnonKey, user]);

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
    if (!supabaseUrl || !supabaseAnonKey) return;
    try {
      const client = getSupabaseClient();
      if (user && client) {
        // Direct secure fetch for authenticated user (respects RLS)
        const { data, error } = await client
          .from("estrategias")
          .select("id, nombre_negocio, rubro, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setHistoryList(data || []);
      } else {
        // Fallback to anonymous list
        const data = await invokeEdgeFunction({ action: "list" });
        if (data && data.estrategias) {
          setHistoryList(data.estrategias);
        }
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

  // Lee el formulario crudo, corrige detalles sueltos y lo estructura en un
  // briefing limpio. Usa Haiku porque es tarea de organización, no de
  // estrategia — no debe inventar datos que el usuario no dio.
  async function generateBriefing(formData: FormData, invokeFn: Function): Promise<string> {
    const system = "Eres un asistente de organización de datos. Tu única tarea es tomar la información que un dueño de negocio llenó en un formulario y convertirla en un briefing limpio, bien estructurado y fácil de leer para un consultor senior. NO agregues opiniones, NO inventes datos que no te dieron, NO analices ni recomiendes nada — solo organiza, corrige errores de tipeo obvios, y si un campo quedó vacío u ambiguo, indícalo como '(no especificado)' en vez de inventarlo. Responde solo con el briefing, en formato de lista con '- Campo: valor'.";

    const userPrompt = `Organiza estos datos de negocio en un briefing limpio:\n\n${JSON.stringify(formData, null, 2)}`;

    const response = await invokeFn({
      action: "generate",
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system,
      messages: [{ role: "user", content: userPrompt }],
    });

    const block = response?.content?.find((b: any) => b.type === "text");
    return block?.text?.trim() || JSON.stringify(formData); // si falla, usa el formData crudo como respaldo
  }

  // Continuation helper to handle max_tokens truncation seamlessly
  async function generateSectionComplete(
    basePayload: any,
    invokeFn: (payload: any) => Promise<any>,
    maxContinuations = 2
  ): Promise<string> {
    let fullText = "";
    let currentMessages = [...basePayload.messages];
    let continuations = 0;

    while (continuations <= maxContinuations) {
      const response = await invokeFn({ ...basePayload, messages: currentMessages });

      if (!response?.content || !Array.isArray(response.content)) {
        throw new Error("Respuesta inválida recibida de la API");
      }

      const textPiece = response.content
        .filter((block: any) => block.type === "text")
        .map((block: any) => block.text)
        .join("\n\n");

      fullText += (fullText ? "\n\n" : "") + textPiece;

      if (response?.stop_reason !== "max_tokens") {
        break; // terminó normal, no hace falta continuar
      }

      continuations++;
      if (continuations > maxContinuations) break;

      // Le pedimos a Claude que continúe exactamente donde se quedó
      currentMessages = [
        ...currentMessages,
        { role: "assistant", content: textPiece },
        {
          role: "user",
          content: "Continúa exactamente donde te quedaste, sin repetir nada de lo ya escrito y sin reintroducir el tema."
        }
      ];
    }

    if (!fullText.trim()) {
      throw new Error("El modelo retornó una respuesta vacía para esta sección.");
    }

    return fullText;
  }

  // Main generation loop
  const generateStrategy = async (startIndex = 0, strategyType = selectedStrategyType) => {
    if (!isFormValid()) {
      triggerToast("Por favor complete toda la información del onboarding para un análisis de alta precisión.", "error");
      return;
    }

    setIsWorkspaceActive(true);
    setIsFormOpen(false);
    setGenerationStatus("generating");
    setActiveTab("strategy");
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
    const activeSections = getSectionsForStrategy(strategyType, formData);

    try {
      // 0. Clean briefing generated with Haiku before main strategy generation
      const briefing = await generateBriefing(formData, (p: any) =>
        invokeEdgeFunctionWithRetry(p, (attempt, delay, errorMsg) => {
          setRetryInfo({ attempt, delay, errorMsg });
        })
      );

      // 1. Generate the sections sequentially
      for (let i = startIndex; i < activeSections.length; i++) {
        const currentSection = activeSections[i];
        setCurrentSectionIndex(i);

        // OPTIMIZED TOKEN OVERHEAD: Only pass relevant preceding sections as context
        const contextMap: Record<string, string[]> = {
          diagnostico: [],
          comparativa: ["diagnostico"],
          objetivos: ["diagnostico"],
          plan: ["objetivos"],
          campanas: ["plan"],
          calendario: ["campanas"],
          sistema: ["plan", "campanas"]
        };
        const neededIds = contextMap[currentSection.id] || [];
        const previousContextText = activeSections
          .filter(sec => neededIds.includes(sec.id))
          .map(sec => currentSectionsState[sec.id] || "")
          .filter(text => text !== "")
          .join("\n\n");

        const promptText = currentSection.prompt(formData, previousContextText);

        const payload: any = {
          action: "generate",
          model: "claude-sonnet-4-6",
          system: "Eres el Consultor Principal de Scaling Strategy, una firma de consultoría de crecimiento para PyMEs. Responde con nivel estratégico real, denso en valor práctico, pero en lenguaje CLARO que cualquier dueño de negocio sin formación en marketing pueda entender sin buscar nada en Google. Si usas una sigla o término técnico (CAC, LTV, ROAS, TOFU, etc.), defínela la primera vez que aparece, entre paréntesis, en una frase simple. Evita jerga que no se explica a sí misma. REGLA ANTI-GENÉRICO: Cada afirmación, recomendación o cifra que escribas debe estar amarrada a un dato específico que el usuario proporcionó (nombre del negocio, rubro, ciudad, facturación, competidores, presupuesto, etc.) — nunca escribas una recomendación que serviría igual para cualquier negocio del mismo rubro en cualquier ciudad. Si una idea no usa ningún dato específico de ESTE negocio, no la escribas: profundiza en la que sí lo hace. Prohibido usar frases de relleno tipo 'es importante considerar', 'en el mundo actual', 'las empresas exitosas suelen'. Ve directo a la recomendación concreta.",
          messages: [{ role: "user", content: `BRIEFING LIMPIO DEL NEGOCIO:\n${briefing}\n\n${promptText}` }],
          max_tokens: 4000
        };

        // Inject Anthropic native web search tool for Section 2 (Comparativa de Mercado) only in "completa" strategy
        if (currentSection.id === "comparativa") {
          payload.tools = [{ type: "web_search_20250305", name: "web_search" }];
        }

        const textBlocks = await generateSectionComplete(
          payload,
          (payloadToInvoke) =>
            invokeEdgeFunctionWithRetry(
              payloadToInvoke,
              (attempt, delay, errorMsg) => {
                setRetryInfo({ attempt, delay, errorMsg });
              }
            )
        );

        setRetryInfo(null);

        // Save generated section in state
        currentSectionsState = {
          ...currentSectionsState,
          [currentSection.id]: textBlocks
        };
        setSections(currentSectionsState);

        // Pause briefly between requests to mitigate rate limits
        if (i < activeSections.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // 2. Generate Executive Summary based on the entire generated content
      setCurrentSectionIndex(activeSections.length); // loading summary state
      const fullContentText = activeSections
        .map(sec => currentSectionsState[sec.id] || "")
        .join("\n\n");

      const summaryPromptText = SUMMARY_PROMPT(formData, fullContentText);

      const summaryPayload = {
        action: "generate",
        model: "claude-haiku-4-5-20251001",
        system: "Eres el Socio Director de Scaling Strategy. Tu especialidad es sintetizar reportes densos en resúmenes claros y persuasivos que un dueño de negocio entiende en una sola lectura, sin jerga sin explicar. REGLA ANTI-GENÉRICO: Cada afirmación, recomendación o cifra que escribas debe estar amarrada a un dato específico que el usuario proporcionó (nombre del negocio, rubro, ciudad, facturación, competidores, presupuesto, etc.) — nunca escribas una recomendación que serviría igual para cualquier negocio del mismo rubro en cualquier ciudad.",
        messages: [{ role: "user", content: summaryPromptText }],
        max_tokens: 4000
      };

      const summaryText = await generateSectionComplete(
        summaryPayload,
        (payloadToInvoke) =>
          invokeEdgeFunctionWithRetry(
            payloadToInvoke,
            (attempt, delay, errorMsg) => {
              setRetryInfo({ attempt, delay, errorMsg });
            }
          )
      );

      setRetryInfo(null);
      setResumen(summaryText);
      setGenerationStatus("finished");
      triggerToast("¡Estrategia de Escalado generada con éxito!", "success");
      
      // Auto-save strategy in the background
      setTimeout(() => {
        saveStrategyToDBDirect(formData, currentSectionsState, summaryText);
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || "Ocurrió un error inesperado.");
      setGenerationStatus("error");
      triggerToast("Fallo en la generación de la estrategia.", "error");
    }
  };

  // Helper to save automatically right after generation finishes or is updated
  const saveStrategyToDBDirect = async (currentFormData: any, currentSections: any, currentResumen: string) => {
    const client = getSupabaseClient();
    try {
      if (user && client) {
        const { data, error } = await client
          .from("estrategias")
          .insert({
            nombre_negocio: currentFormData.nombreNegocio,
            rubro: currentFormData.rubro,
            form_data: currentFormData,
            secciones: currentSections,
            resumen: currentResumen,
            user_id: user.id
          })
          .select()
          .single();

        if (error) throw error;
        if (data && data.id) {
          setSaveSuccess(true);
          triggerToast("Estrategia guardada automáticamente en su cuenta", "success");
          fetchHistory();
          setSelectedHistoryId(data.id);
        }
      } else {
        const data = await invokeEdgeFunction({
          action: "save",
          nombreNegocio: currentFormData.nombreNegocio,
          rubro: currentFormData.rubro,
          formData: currentFormData,
          secciones: currentSections,
          resumen: currentResumen
        });
        if (data && data.id) {
          setSaveSuccess(true);
          triggerToast("Estrategia guardada automáticamente en el historial", "success");
          fetchHistory();
          setSelectedHistoryId(data.id);
        }
      }
    } catch (err: any) {
      console.error("Auto-save error:", err);
    }
  };

  // Resume generation from failed section index
  const resumeGeneration = () => {
    generateStrategy(currentSectionIndex, selectedStrategyType);
  };

  // Save full strategy to DB
  const saveStrategyToDB = async () => {
    if (generationStatus !== "finished" && !selectedHistoryId) {
      triggerToast("Debe esperar a que termine de generarse la estrategia.", "error");
      return;
    }

    setIsSaving(true);
    try {
      const client = getSupabaseClient();
      if (user && client) {
        const { data, error } = await client
          .from("estrategias")
          .insert({
            nombre_negocio: formData.nombreNegocio,
            rubro: formData.rubro,
            form_data: formData,
            secciones: sections,
            resumen: resumen,
            user_id: user.id
          })
          .select()
          .single();

        if (error) throw error;
        if (data && data.id) {
          setSaveSuccess(true);
          triggerToast("Estrategia guardada con éxito en su cuenta", "success");
          fetchHistory(); // refresh history list
          setSelectedHistoryId(data.id);
        }
      } else {
        const data = await invokeEdgeFunction({
          action: "save",
          nombreNegocio: formData.nombreNegocio,
          rubro: formData.rubro,
          formData: formData,
          secciones: sections,
          resumen: resumen
        });

        if (data && data.id) {
          setSaveSuccess(true);
          triggerToast("Estrategia guardada en el historial corporativo", "success");
          fetchHistory(); // refresh history list
          setSelectedHistoryId(data.id);
        } else {
          throw new Error("Error al guardar la estrategia");
        }
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
    setActiveTab("strategy");
    setErrorMessage("");
    setRetryInfo(null);
    setSelectedHistoryId(id);
    setSaveSuccess(false);
    setIsHistoryOpen(false); // Close history sidebar drawer

    try {
      const client = getSupabaseClient();
      if (user && client) {
        const { data, error } = await client
          .from("estrategias")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setStrategyStates(data);
        }
      } else {
        const data = await invokeEdgeFunction({ action: "get", id });
        if (data && data.estrategia) {
          setStrategyStates(data.estrategia);
        } else {
          throw new Error(data?.error || "Error cargando ítem del historial");
        }
      }
    } catch (err: any) {
      triggerToast(err?.message || "No se pudo cargar la estrategia.", "error");
    }
  };

  const deleteHistoryItem = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm("¿Está seguro de eliminar esta estrategia de su historial?")) return;

    try {
      const client = getSupabaseClient();
      if (user && client) {
        const { error } = await client.from("estrategias").delete().eq("id", id);
        if (error) throw error;
      }
      setHistoryList((prev) => prev.filter((item) => item.id !== id));
      if (selectedHistoryId === id) {
        setSelectedHistoryId(null);
      }
      triggerToast("Estrategia eliminada con éxito", "info");
    } catch (err: any) {
      console.error("Error deleting history item:", err);
      triggerToast(err?.message || "No se pudo eliminar la estrategia", "error");
    }
  };

  const setStrategyStates = (est: any) => {
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
    const rawSecciones = est.secciones;
    const safeSections: Record<string, string> = {};
    if (rawSecciones && typeof rawSecciones === "object" && !Array.isArray(rawSecciones)) {
      Object.entries(rawSecciones).forEach(([k, v]) => {
        if (typeof v === "string") safeSections[k] = v;
      });
    }
    setSections(safeSections);
    setResumen(est.resumen || "");
    setGenerationStatus("finished"); // Mark as finished so edit controls render
    setIsWorkspaceActive(true);
    setIsFormOpen(false);
    triggerToast(`Cargada estrategia de ${est.nombre_negocio}`, "info");
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

  // Clipboard copies strategy clean text (with no markdown symbols)
  const copyToClipboardClean = () => {
    let rawText = `# ESTRATEGIA DE ESCALADO: ${formData.nombreNegocio.toUpperCase()}\n`;
    rawText += `Modelo de Negocio: ${formData.tipoModelo} | Rubro: ${formData.rubro} | Plazo: ${formData.plazoMeta}\n\n`;
    rawText += `## RESUMEN EJECUTIVO\n${resumen}\n\n`;

    SECTIONS_CONFIG.forEach(sec => {
      if (sections[sec.id]) {
        rawText += `${sections[sec.id]}\n\n`;
      }
    });

    const cleanText = stripMarkdown(rawText);

    navigator.clipboard.writeText(cleanText)
      .then(() => triggerToast("Estrategia limpia copiada al portapapeles sin símbolos de IA", "success"))
      .catch(() => triggerToast("Fallo al copiar", "error"));
  };

  // Download strategy as .md file
  const downloadStrategy = () => {
    let fullText = `# ESTRATEGIA DE ESCALADO: ${formData.nombreNegocio.toUpperCase()}\n`;
    fullText += `Modelo de Negocio: ${formData.tipoModelo} | Rubro: ${formData.rubro} | Plazo: ${formData.plazoMeta}\n\n`;
    fullText += `## RESUMEN EJECUTIVO\n${resumen}\n\n`;

    SECTIONS_CONFIG.forEach(sec => {
      if (sections[sec.id]) {
        fullText += `${sections[sec.id]}\n\n`;
      }
    });

    const element = document.createElement("a");
    const file = new Blob([fullText], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Estrategia_${formData.nombreNegocio.replace(/\s+/g, "_")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast("Estrategia descargada como archivo .md con éxito", "success");
  };

  // Download strategy as clean plain text file (.txt)
  const downloadCleanTxt = () => {
    let rawText = `ESTRATEGIA DE ESCALADO DE ALTA PRECISIÓN: ${formData.nombreNegocio.toUpperCase()}\n`;
    rawText += `==================================================\n`;
    rawText += `Modelo de Negocio: ${formData.tipoModelo}\n`;
    rawText += `Rubro de Mercado: ${formData.rubro || "General"}\n`;
    rawText += `Horizonte de Tiempo: ${formData.plazoMeta}\n`;
    rawText += `==================================================\n\n`;
    rawText += `RESUMEN EJECUTIVO\n`;
    rawText += `------------------\n`;
    rawText += `"${resumen}"\n\n`;

    SECTIONS_CONFIG.forEach(sec => {
      if (sections[sec.id]) {
        rawText += `## ${sec.name.toUpperCase()}\n`;
        rawText += `${sections[sec.id]}\n\n`;
      }
    });

    const cleanText = stripMarkdown(rawText);

    const element = document.createElement("a");
    const file = new Blob([cleanText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Estrategia_Limpia_${formData.nombreNegocio.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast("Estrategia descargada como texto limpio (.txt)", "success");
  };

  // Download strategy as fully-styled premium self-contained HTML report
  const downloadPremiumHtml = () => {
    const metaInfo = {
      tipoModelo: formData.tipoModelo,
      rubro: formData.rubro || "General",
      plazoMeta: formData.plazoMeta,
      ubicacion: formData.ubicacion
    };

    const theme = COLOR_THEMES[accentColor] || COLOR_THEMES.blue;

    const htmlContent = generatePremiumHTMLReport(
      formData.nombreNegocio,
      metaInfo,
      sections,
      resumen,
      consultorNombre,
      theme.hex,
      theme.hex // primaryDark color
    );

    const element = document.createElement("a");
    const file = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Informe_Corporativo_${formData.nombreNegocio.replace(/\s+/g, "_")}.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast("¡Descargado Reporte HTML Corporativo de Lujo!", "success");
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
          user={user}
          onLoginClick={() => setIsAuthModalOpen(true)}
          supabaseClient={getSupabaseClient()}
          triggerToast={triggerToast}
        />
      ) : (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50/70 relative print:block animate-fade-in">
          {/* PANEL 1: LEFT COLLAPSIBLE SIDEBAR */}
          <aside
            className={`bg-white border-r border-slate-200/80 shrink-0 flex flex-col justify-between py-6 transition-all duration-300 z-30 sticky top-0 md:h-screen print:hidden ${
              isSidebarCollapsed ? "w-full md:w-16 px-2" : "w-full md:w-64 px-4"
            }`}
          >
            {/* Top section: Logo & Collapse Toggle */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                {!isSidebarCollapsed && (
                  <div className="flex items-center gap-2.5">
                    <div className="bg-blue-600 p-2 rounded-xl shadow-md shadow-blue-600/10">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <span className="font-display font-black text-xs text-slate-900 uppercase tracking-wider block leading-none">
                        Scaling Strategy
                      </span>
                      <span className="text-[9px] font-medium text-slate-500 block mt-1 leading-tight">
                        Crea las mejores estrategias
                      </span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer mx-auto"
                  title={isSidebarCollapsed ? "Expandir panel" : "Recoger panel"}
                >
                  {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={startNewStrategy}
                  className={`w-full flex items-center gap-3 py-3 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSidebarCollapsed ? "justify-center" : ""
                  } bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-100/80`}
                  title="Nueva Estrategia"
                >
                  <PlusCircle className="w-4 h-4 shrink-0 text-blue-600" />
                  {!isSidebarCollapsed && <span>Nueva Estrategia</span>}
                </button>

                <button
                  onClick={() => {
                    setIsHistoryOpen(true);
                    fetchHistory();
                  }}
                  className={`w-full flex items-center gap-3 py-3 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSidebarCollapsed ? "justify-center" : ""
                  } text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-transparent`}
                  title="Historial de Estrategias"
                >
                  <History className="w-4 h-4 shrink-0 text-slate-400" />
                  {!isSidebarCollapsed && (
                    <div className="flex items-center justify-between w-full">
                      <span>Historial</span>
                      <span className="bg-slate-200/80 text-slate-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                        {historyList.length}
                      </span>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setIsConfigModalOpen(true)}
                  className={`w-full flex items-center gap-3 py-3 px-3.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSidebarCollapsed ? "justify-center" : ""
                  } text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/50`}
                  title="Configurar Cuenta, Accesos e Idioma"
                >
                  <Settings className="w-4 h-4 shrink-0 text-blue-600" />
                  {!isSidebarCollapsed && <span>Configuración</span>}
                </button>
              </div>
            </div>

            {/* Bottom Section: User Info & Logout Button */}
            <div className="pt-4 border-t border-slate-100 space-y-3 mt-6 md:mt-0">
              {user && !isSidebarCollapsed && (
                <div className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Consultor Activo</p>
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {user.user_metadata?.display_name || user.email?.split("@")[0]}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate font-light">{user.email}</p>
                </div>
              )}

              {user ? (
                <button
                  onClick={async () => {
                    try {
                      const client = getSupabaseClient();
                      if (client) {
                        await client.auth.signOut();
                      }
                    } catch (err) {
                      console.error("Logout error:", err);
                    } finally {
                      setUser(null);
                      setIsWorkspaceActive(false);
                      triggerToast("Sesión cerrada correctamente", "info");
                    }
                  }}
                  className={`w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-50 ${
                    isSidebarCollapsed ? "justify-center" : ""
                  }`}
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Salir</span>}
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className={`w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer text-indigo-600 hover:bg-indigo-50 ${
                    isSidebarCollapsed ? "justify-center" : ""
                  }`}
                  title="Iniciar Sesión"
                >
                  <User className="w-4 h-4 shrink-0" />
                  {!isSidebarCollapsed && <span>Ingresar</span>}
                </button>
              )}
            </div>
          </aside>

          {/* MAIN CANVAS CONTENT AREA */}
          <div className="flex-1 min-w-0 p-4 md:p-8 space-y-6 overflow-y-auto">
            
            {/* CANVAS HEADER BRANDING */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-6 print:hidden">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 p-3.5 rounded-2xl shadow-lg shadow-blue-600/20 text-white shrink-0">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div className="text-left space-y-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="font-display text-2xl md:text-3.5xl font-black tracking-tight leading-none text-slate-900">
                      <span>¡Bienvenido, </span>
                      <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        {user?.user_metadata?.display_name || consultorNombre || "Consultor"}
                      </span>
                      <span>!</span>
                    </h1>
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-blue-100 shrink-0">
                      Console
                    </span>
                  </div>
                  <p className="text-xs md:text-sm font-semibold text-slate-600">
                    Crea las mejores estrategias para tu negocio.
                  </p>
                </div>
              </div>
            </div>

            {/* DUAL WORKSPACE LAYOUT PANELS */}
            <main className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* PANEL 2: FORMULARIO Y CONTROLES */}
              <div className="lg:col-span-5 space-y-6">
              {generationStatus === "idle" && (
                <OnboardingWizard
                  formData={formData}
                  onChange={handleInputChange}
                  wizardStep={wizardStep}
                  setWizardStep={setWizardStep}
                  onGenerate={() => setGenerationStatus("selecting")}
                  isGenerating={false}
                  triggerToast={triggerToast}
                />
              )}

              {generationStatus === "selecting" && (
                <StrategySelector
                  formData={formData}
                  onSelectStrategy={(strategyId) => {
                    setSelectedStrategyType(strategyId);
                    generateStrategy(0, strategyId);
                  }}
                  onBackToOnboarding={() => {
                    setGenerationStatus("idle");
                    setWizardStep(4);
                  }}
                />
              )}

              {generationStatus === "generating" && (
                <LiveGenerationTracker
                  formData={formData}
                  selectedStrategyType={selectedStrategyType}
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
                  copyToClipboardClean={copyToClipboardClean}
                  downloadStrategy={downloadStrategy}
                  downloadCleanTxt={downloadCleanTxt}
                  downloadPremiumHtml={downloadPremiumHtml}
                  handlePrint={handlePrint}
                  saveStrategyToDB={saveStrategyToDB}
                  isSaving={isSaving}
                  saveSuccess={saveSuccess}
                  onEditOnboarding={() => {
                    setGenerationStatus("idle");
                    setWizardStep(1);
                  }}
                  startNewStrategy={startNewStrategy}
                  onSelectOtherStrategy={() => {
                    setGenerationStatus("selecting");
                  }}
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

              {/* Tab Selector when finished */}
              {generationStatus === "finished" && (
                <div className="flex flex-wrap md:flex-nowrap bg-slate-100 p-1 rounded-2xl gap-1 print:hidden shadow-sm border border-slate-200 animate-fade-in">
                  <button
                    onClick={() => setActiveTab("strategy")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-w-[120px] ${
                      activeTab === "strategy"
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Plan Estratégico</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("roi")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-w-[120px] ${
                      activeTab === "roi"
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Simulador ROI & LTV</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("hooks")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-w-[120px] ${
                      activeTab === "hooks"
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-500" />
                    <span>Ganchos de Venta</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("tasks")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-w-[120px] ${
                      activeTab === "tasks"
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <ListTodo className="w-4 h-4 text-purple-600" />
                    <span>Plan de Acción</span>
                  </button>
                </div>
              )}

              {/* Render either Strategy canvas sheet, ROI calculator, or Copywriting hooks */}
              {(generationStatus !== "finished" || activeTab === "strategy") ? (
                <>
                  {/* Premium Brand Customization Widget */}
                  {generationStatus === "finished" && activeTab === "strategy" && (
                    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-3 print:hidden animate-fade-in shadow-sm text-left">
                      <button
                        onClick={() => setIsBrandingOpen(!isBrandingOpen)}
                        className="w-full flex items-center justify-between text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-indigo-500" />
                          Personalización del Informe de Marca Blanca (Marca Propia)
                        </span>
                        <span className="text-[10px] bg-slate-200/70 text-slate-600 px-2.5 py-0.5 rounded-md font-mono">
                          {isBrandingOpen ? "OCULTAR" : "PERSONALIZAR"}
                        </span>
                      </button>

                      {isBrandingOpen && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2.5 border-t border-slate-200/50 animate-fade-in text-left">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 block">
                              Nombre del Consultor / Agencia:
                            </label>
                            <input
                              type="text"
                              value={consultorNombre}
                              onChange={(e) => setConsultorNombre(e.target.value)}
                              placeholder="Ej. CONSULTORA ALPHA"
                              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 block">
                              Color de Acento del Informe:
                            </label>
                            <div className="flex flex-wrap gap-1.5">
                              {Object.entries(COLOR_THEMES).map(([key, t]) => (
                                <button
                                  key={key}
                                  onClick={() => setAccentColor(key)}
                                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                                    accentColor === key
                                      ? "bg-slate-950 text-white border-slate-950"
                                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                  }`}
                                >
                                  <span className={`w-2.5 h-2.5 rounded-full ${t.bg}`} />
                                  <span>{t.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {user && (
                            <div className="md:col-span-2 flex justify-end pt-1">
                              <button
                                onClick={() => saveUserProfile(consultorNombre, accentColor)}
                                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition cursor-pointer"
                              >
                                Guardar Configuración en Cuenta
                              </button>
                            </div>
                          )}
                        </div>
                      )}
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
                        <span className={`text-[8px] font-mono tracking-[0.25em] ${COLOR_THEMES[accentColor]?.text || "text-blue-600"} font-bold uppercase block`}>
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
                        <span className="font-display text-xs font-bold tracking-widest text-slate-900 block print:text-black">
                          {consultorNombre.toUpperCase()}
                        </span>
                        <span className={`text-[8px] font-mono tracking-wider ${COLOR_THEMES[accentColor]?.text || "text-blue-600"} block uppercase font-bold`}>
                          GROWTH PLATFORM
                        </span>
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
                        editingSectionId === "resumen" ? (
                          <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 space-y-4 animate-fade-in border border-slate-800">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                              <span className="text-[10px] font-mono tracking-widest text-blue-400 font-bold uppercase">
                                EDITANDO SÍNTESIS EJECUTIVA
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {editingText.length} caracteres
                              </span>
                            </div>
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full min-h-[150px] bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs md:text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-serif leading-relaxed"
                              placeholder="Escriba la síntesis ejecutiva aquí..."
                            />
                            <div className="flex justify-end gap-2.5">
                              <button
                                onClick={() => setEditingSectionId(null)}
                                className="px-3.5 py-1.5 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                Cancelar
                              </button>
                              <button
                                onClick={() => {
                                  setResumen(editingText);
                                  setEditingSectionId(null);
                                  triggerToast("Síntesis ejecutiva actualizada", "success");
                                }}
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                Guardar Cambios
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="relative group">
                            {renderCleanSummary(resumen, accentColor)}
                            {generationStatus === "finished" && (
                              <button
                                onClick={() => {
                                  setEditingSectionId("resumen");
                                  setEditingText(resumen);
                                }}
                                className="absolute top-8 right-8 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white p-2 rounded-xl transition cursor-pointer hidden group-hover:flex items-center gap-1.5 text-[10px] font-bold shadow-sm backdrop-blur border border-white/5 print:hidden"
                                title="Editar Resumen"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Editar</span>
                              </button>
                            )}
                          </div>
                        )
                      ) : (
                      generationStatus === "idle" && formData.nombreNegocio && (
                        <div className="p-4 bg-slate-50 border border-slate-200/60 border-dashed rounded-2xl text-xs text-slate-600 italic">
                          "Plan táctico estructurado para escalar el producto estrella <b>{formData.productoEstrella || "[Su Producto Estrella]"}</b> en <b>{formData.ubicacion || "[Ubicación de Operación]"}</b>, con una meta prioritaria a <b>{formData.plazoMeta}</b> de: <b>{formData.metaPrincipal || "[Meta Principal]"}</b>."
                        </div>
                      )
                    )}

                    {/* Rendering Content Sections */}
                    <div className="space-y-10">
                      {getSectionsForStrategy(selectedStrategyType, formData).map((sec, index) => {
                        const completedContent = sections[sec.id];
                        const isCurrent = currentSectionIndex === index;

                        if (completedContent) {
                           const cleanedText = cleanSectionContent(completedContent);
                           const isEditingThisSection = editingSectionId === sec.id;

                           return (
                             <div key={sec.id} className="animate-fade-in bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 print:border-none print:shadow-none print:p-0 print:border-b print:border-slate-250 print:pb-8 relative group">
                               <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:pb-2">
                                 <div className="flex items-center gap-3">
                                   <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150 print:hidden text-slate-700">
                                     {getSectionIcon(sec.id)}
                                   </div>
                                   <div>
                                     <span className={`text-[9px] font-mono font-bold tracking-widest ${COLOR_THEMES[accentColor]?.text || "text-slate-400"} block uppercase print:hidden`}>
                                       {isEditingThisSection ? "EDITANDO CONTENIDO" : "SECCIÓN COMPLETADA"}
                                     </span>
                                     <h3 className="font-display text-sm md:text-base font-bold text-slate-900 tracking-tight print:text-black">{sec.name}</h3>
                                   </div>
                                 </div>

                                 {/* Edit Button for finished sections */}
                                 {generationStatus === "finished" && !isEditingThisSection && (
                                   <button
                                     onClick={() => {
                                       setEditingSectionId(sec.id);
                                       setEditingText(completedContent);
                                     }}
                                     className="bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 p-2 rounded-xl transition cursor-pointer hidden group-hover:flex items-center gap-1.5 text-[10px] font-bold border border-slate-200 shadow-sm print:hidden"
                                     title="Editar sección"
                                   >
                                     <Edit className="w-3.5 h-3.5" />
                                     <span>Editar</span>
                                   </button>
                                 )}
                               </div>

                               {isEditingThisSection ? (
                                 <div className="space-y-4 pt-2">
                                   <p className="text-[10px] text-slate-500 leading-normal">
                                     Puede editar directamente el texto (admite sintaxis Markdown para tablas, viñetas y negritas). Los cambios se sincronizan al instante en todas las exportaciones, descargas e impresiones.
                                   </p>
                                   <textarea
                                     value={editingText}
                                     onChange={(e) => setEditingText(e.target.value)}
                                     className="w-full min-h-[250px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs md:text-sm text-slate-850 focus:outline-none focus:border-blue-600 font-mono leading-relaxed focus:ring-1 focus:ring-blue-600"
                                     placeholder={`Escriba el contenido para ${sec.name}...`}
                                   />
                                   <div className="flex justify-end gap-2.5">
                                     <button
                                       onClick={() => setEditingSectionId(null)}
                                       className="px-3.5 py-1.5 border border-slate-200 text-slate-600 hover:text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer hover:bg-slate-50"
                                     >
                                       Cancelar
                                     </button>
                                     <button
                                       onClick={() => {
                                         setSections(prev => ({ ...prev, [sec.id]: editingText }));
                                         setEditingSectionId(null);
                                         triggerToast(`Sección ${sec.name} actualizada con éxito`, "success");
                                       }}
                                       className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                                     >
                                       Guardar Cambios
                                     </button>
                                   </div>
                                 </div>
                               ) : (
                                 <div className="prose max-w-none text-xs md:text-sm font-normal text-slate-700 leading-relaxed space-y-4 print:text-black">
                                   {parseMarkdownToReact(cleanedText)}
                                 </div>
                               )}
                             </div>
                           );
                        }

                        if (generationStatus === "idle" || generationStatus === "selecting") {
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
                                 Recomendaciones tácticas hiper-personalizadas para {formData.nombreNegocio || "su empresa"} enfocadas en potenciar {formData.productoEstrella || "su producto estrella"} con la máxima rentabilidad comercial.
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

                    {/* Custom celebratory finish card with custom message per strategy */}
                    {generationStatus === "finished" && (
                      <div className="mt-12 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col md:flex-row items-center gap-6 animate-fade-in print:bg-white print:text-slate-900 print:border print:border-slate-300">
                        <div className="p-3.5 bg-white/10 rounded-2xl shrink-0 print:border print:border-slate-300">
                          <Award className="w-8 h-8 text-white animate-bounce print:text-indigo-600" />
                        </div>
                        <div className="space-y-1.5 text-center md:text-left flex-1">
                          <span className="text-[9px] font-mono tracking-[0.25em] text-blue-200 font-bold uppercase block print:text-slate-500">DIAGNÓSTICO ESTRATÉGICO FINALIZADO</span>
                          <h4 className="text-sm md:text-base font-bold tracking-tight text-white leading-tight print:text-slate-900">
                            ¡Felicitaciones! Plan Táctico Concluido con Éxito
                          </h4>
                          <p className="text-xs md:text-sm text-blue-50/90 leading-relaxed font-light print:text-slate-700">
                            {getEndingMessageForStrategy(selectedStrategyType, formData.nombreNegocio || "su empresa")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer metadata */}
                  <div className="border-t border-slate-150 pt-5 mt-8 text-center text-[9px] text-slate-400 flex flex-wrap justify-between gap-4 font-mono">
                    <span>ID-PLAN: {selectedHistoryId ? selectedHistoryId.slice(0, 8).toUpperCase() : "PROTOTIPO-SCALING"}</span>
                    <span>CONFIDENCIAL • {formData.nombreNegocio.toUpperCase() || "NEGOCIO"}.</span>
                    <span>PÁGINA 1 DE 1</span>
                  </div>
                </article>
              </>
              ) : activeTab === "roi" ? (
                <ROICalculator formData={formData} />
              ) : activeTab === "hooks" ? (
                <HookGenerator formData={formData} />
              ) : (
                <TaskBoard formData={formData} strategyType={selectedStrategyType} />
              )}

              {/* Error recovery block */}
              {generationStatus === "error" && errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-red-900 space-y-3 animate-fade-in text-left">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wide">Error en Redacción / Conexión Pausada</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Se ha pausado la redacción debido a límites de tasa de servicio o a un problema temporal de conexión. Las secciones generadas hasta el momento han sido preservadas intactas en la hoja estratégica. Puede reintentar la reanudación para terminar el análisis.
                      </p>
                      <p className="text-[10px] font-mono text-red-700 bg-red-100/50 p-2 rounded border border-red-200/60 overflow-x-auto mt-2">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={resumeGeneration}
                      className="flex items-center gap-1.5 py-2 px-4 bg-slate-800 text-white font-semibold text-xs rounded-xl hover:bg-slate-900 transition cursor-pointer shadow-md"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reanudar Redacción
                    </button>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Footer info line inside workspace */}
          <footer className="max-w-[1550px] mx-auto px-4 py-8 md:px-8 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono flex items-center justify-between">
            <span>PLATFORM: SUPABASE</span>
            <span>© SCALING STRATEGY IA. TODOS LOS DERECHOS RESERVADOS.</span>
          </footer>
        </div>
      </div>
    )}

      {/* FULL SCREEN HISTORY OVERLAY / MODAL */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col p-4 md:p-8 overflow-hidden animate-fade-in text-left">
          <div className="relative w-full max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200/80 flex flex-col h-full overflow-hidden my-auto animate-fade-in">
            
            {/* Full-screen History Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 md:px-8 py-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md shadow-blue-600/20">
                  <History className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg md:text-xl font-bold tracking-tight text-slate-900">
                      Historial Completo de Estrategias
                    </h2>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                      {historyList.length} REGISTROS
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Explore, cargue, o gestione todas las estrategias generadas y guardadas en la plataforma.
                  </p>
                </div>
              </div>

              {/* Search bar & Close button */}
              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={historySearchQuery}
                    onChange={(e) => setHistorySearchQuery(e.target.value)}
                    placeholder="Buscar por negocio o sector..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition"
                  />
                  {historySearchQuery && (
                    <button
                      onClick={() => setHistorySearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-2xl transition cursor-pointer shrink-0"
                  aria-label="Cerrar historial"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Grid List of Strategies */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/30">
              {(() => {
                const filtered = historyList.filter((item) => {
                  if (!historySearchQuery.trim()) return true;
                  const q = historySearchQuery.toLowerCase();
                  return (
                    item.nombre_negocio?.toLowerCase().includes(q) ||
                    item.rubro?.toLowerCase().includes(q)
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="h-80 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-white max-w-lg mx-auto my-auto space-y-3">
                      <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100">
                        <History className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          {historySearchQuery ? "No se encontraron coincidencias" : "Sin estrategias guardadas"}
                        </h3>
                        <p className="text-xs text-slate-500 font-light mt-1 max-w-xs">
                          {historySearchQuery
                            ? "Intente buscar con otro término de negocio o sector."
                            : "Cree una nueva estrategia desde la consola y se guardará automáticamente aquí."}
                        </p>
                      </div>
                      {!historySearchQuery && (
                        <button
                          onClick={() => {
                            setIsHistoryOpen(false);
                            startNewStrategy();
                          }}
                          className="mt-2 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer shadow-md shadow-blue-600/10"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Crear Nueva Estrategia</span>
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((item) => {
                      const isSelected = selectedHistoryId === item.id;
                      const dateStr = new Date(item.created_at).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      });

                      return (
                        <div
                          key={item.id}
                          className={`group bg-white rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-lg ${
                            isSelected
                              ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                              : "border-slate-200/80 hover:border-slate-300"
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/80 shrink-0">
                                <Building2 className="w-5 h-5" />
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                                {dateStr}
                              </span>
                            </div>

                            <div>
                              <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-1">
                                {item.nombre_negocio}
                              </h3>
                              <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
                                {item.rubro || "Sector no especificado"}
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={(e) => deleteHistoryItem(item.id, e)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                              title="Eliminar del historial"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => loadHistoryItem(item.id)}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold text-xs rounded-xl transition cursor-pointer"
                            >
                              <span>Cargar Estrategia</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Full-screen History Footer */}
            <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium shrink-0">
              <span>Mostrando {historyList.length} estrategias guardadas</span>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS AND API CONFIGURATION MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-6 md:p-8 space-y-6 animate-fade-in text-left">
            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                <h3 className="font-display text-base font-bold tracking-tight text-slate-900">
                  Configuración de Conexión Supabase
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-50 rounded-lg transition cursor-pointer"
                aria-label="Cerrar configuración"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Inputs para Supabase */}
            <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-150 animate-fade-in">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                  Parámetros de Proyecto Supabase
                </span>
                <p className="text-[10px] text-slate-500 leading-normal">
                  La aplicación se conecta exclusivamente a su base de datos Supabase remota y ejecuta las Edge Functions de IA sin depender de servidores locales. Estos valores se guardarán únicamente en el almacenamiento local de su navegador (localStorage).
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Supabase Project URL
                </label>
                <div className="relative">
                  <Database className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="url"
                    value={tempSupabaseUrl}
                    onChange={(e) => setTempSupabaseUrl(e.target.value)}
                    placeholder="https://su-proyecto-id.supabase.co"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Supabase Anon Key / API Key
                </label>
                <div className="relative">
                  <Settings className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={tempSupabaseAnonKey}
                    onChange={(e) => setTempSupabaseAnonKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition font-mono"
                  />
                </div>
              </div>

              {/* Prueba de conexión */}
              <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  type="button"
                  disabled={isTestingConnection}
                  onClick={() => testConnection(tempSupabaseUrl, tempSupabaseAnonKey)}
                  className="inline-flex items-center justify-center gap-1.5 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 text-slate-800 text-[10px] font-bold py-2.5 px-4 rounded-xl transition cursor-pointer"
                >
                  {isTestingConnection ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Probando Conexión...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-3.5 h-3.5" />
                      Probar Conexión
                    </>
                  )}
                </button>

                {connectionTestResult && (
                  <div className="flex items-start gap-1.5 flex-1 text-left">
                    {connectionTestResult.success ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <p className={`text-[10px] leading-tight font-medium ${
                      connectionTestResult.success ? "text-green-700" : "text-red-700"
                    }`}>
                      {connectionTestResult.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Acciones de pie */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  updateApiSettings(tempSupabaseUrl, tempSupabaseAnonKey);
                  setIsSettingsOpen(false);
                  triggerToast("Configuración de Supabase guardada y aplicada", "success");
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-md shadow-blue-600/10"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configuracion Modal Component */}
      <ConfiguracionModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        user={user}
        supabaseClient={getSupabaseClient()}
        consultorNombre={consultorNombre}
        setConsultorNombre={setConsultorNombre}
        triggerToast={triggerToast}
      />

      {/* Auth Modal Component */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        supabaseClient={getSupabaseClient()}
        onAuthSuccess={(u) => {
          setUser(u);
          fetchHistory();
        }}
        triggerToast={triggerToast}
      />
    </div>
  );
}
