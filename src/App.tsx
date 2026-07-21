import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  TrendingUp,
  Target,
  FileText,
  Layers,
  Calendar,
  Users,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  History,
  Save,
  Download,
  Copy,
  PlusCircle,
  Search,
  Briefcase,
  DollarSign,
  Globe,
  ChevronRight,
  Printer,
  Loader2,
  Trash2,
  Database,
  Settings,
  Eye,
  EyeOff,
  Check
} from "lucide-react";
import { SECTIONS_CONFIG, SUMMARY_PROMPT, FormData } from "./utils/prompts.ts";
import { parseMarkdownToReact } from "./utils/parser.tsx";

export default function App() {
  // Form State
  const [formData, setFormData] = useState<FormData>({
    nombreNegocio: "",
    rubro: "",
    descripcion: "",
    ubicacion: "",
    publicoObjetivo: "",
    sitioWeb: "",
    facturacion: "",
    ticketPromedio: "",
    presupuesto: "",
    canalesActuales: "",
    metaPrincipal: "",
    plazoMeta: "6 meses",
    competidores: "",
    obstaculo: ""
  });

  // Generation State
  const [sections, setSections] = useState<Record<string, string>>({});
  const [resumen, setResumen] = useState<string>("");
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(-1);
  const [generationStatus, setGenerationStatus] = useState<"idle" | "generating" | "paused" | "error" | "finished">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  // Retry and backoff state
  const [retryInfo, setRetryInfo] = useState<{ attempt: number; delay: number; errorMsg: string } | null>(null);

  // History & Tabs State
  const [activeTab, setActiveTab] = useState<"form" | "history" | "config">("form");
  const [historyList, setHistoryList] = useState<Array<{ id: string; nombre_negocio: string; rubro: string | null; created_at: string }>>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Supabase Configuration State
  const [apiMode, setApiMode] = useState<"local" | "supabase">(() => {
    const saved = localStorage.getItem("igenius_api_mode");
    if (saved === "local" || saved === "supabase") return saved;
    if ((import.meta as any).env.VITE_SUPABASE_URL) return "supabase";
    return "local";
  });
  const [supabaseUrl, setSupabaseUrl] = useState<string>(() => {
    return localStorage.getItem("igenius_supabase_url") || ((import.meta as any).env.VITE_SUPABASE_URL || "");
  });
  const [supabaseAnonKey, setSupabaseAnonKey] = useState<string>(() => {
    return localStorage.getItem("igenius_supabase_anon_key") || ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || "");
  });
  const [showAnonKey, setShowAnonKey] = useState<boolean>(false);
  const [testingConnection, setTestingConnection] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "success" | "error">("idle");
  const [connectionError, setConnectionError] = useState<string>("");

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

  const handleSaveConfig = (mode: "local" | "supabase", urlVal: string, keyVal: string) => {
    setApiMode(mode);
    setSupabaseUrl(urlVal);
    setSupabaseAnonKey(keyVal);
    localStorage.setItem("igenius_api_mode", mode);
    localStorage.setItem("igenius_supabase_url", urlVal);
    localStorage.setItem("igenius_supabase_anon_key", keyVal);
    triggerToast("Configuración guardada correctamente", "success");
  };

  const testConnection = async (targetUrl: string, targetKey: string) => {
    setTestingConnection(true);
    setConnectionStatus("idle");
    setConnectionError("");
    
    try {
      const baseUrl = targetUrl.replace(/\/$/, "");
      const url = `${baseUrl}/functions/v1/estrategias-api`;
      const headers: Record<string, string> = {
        "Content-Type": "application/json"
      };
      if (targetKey) {
        headers["Authorization"] = `Bearer ${targetKey}`;
        headers["apikey"] = targetKey;
      }
      
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ action: "list" })
      });
      
      if (response.ok) {
        setConnectionStatus("success");
        triggerToast("¡Conexión exitosa con la Edge Function!", "success");
      } else {
        const text = await response.text();
        let errMsg = `HTTP ${response.status}`;
        try {
          const parsed = JSON.parse(text);
          if (parsed.error) errMsg = parsed.error;
        } catch (_) {}
        setConnectionStatus("error");
        setConnectionError(errMsg || `Código de estado: ${response.status}`);
        triggerToast("La Edge Function retornó un error.", "error");
      }
    } catch (err: any) {
      console.error(err);
      setConnectionStatus("error");
      setConnectionError(err?.message || String(err));
      triggerToast("No se pudo contactar con la Edge Function.", "error");
    } finally {
      setTestingConnection(false);
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

  // Check if mandatory fields are filled
  const isFormValid = () => {
    return (
      formData.nombreNegocio.trim() !== "" &&
      formData.rubro.trim() !== "" &&
      formData.metaPrincipal.trim() !== ""
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
            return response; // let caller handle final failure
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
      triggerToast("Por favor complete los campos obligatorios (*)", "error");
      return;
    }

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
          system: "Eres el Consultor Principal de iGenius Growth Partners, una firma premium de consultoría de crecimiento empresarial para PyMEs. Responde con altísimo nivel estratégico, asertivo, denso en valor práctico, usando jerga corporativa de negocios, y estructurando tu respuesta estrictamente en un español elegante y profesional.",
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

        // Extract text from Anthropic content blocks (ignoring tool uses)
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

        // Pause for ~1.5 seconds between requests as required to mitigate rate limits
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
            system: "Eres el Socio Director de iGenius Growth Partners. Tu especialidad es sintetizar reportes densos en resúmenes sumamente persuasivos, profesionales y precisos.",
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
      triggerToast("¡Estrategia iGenius generada con éxito!", "success");
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
        } else {
          setFormData({
            nombreNegocio: est.nombre_negocio,
            rubro: est.rubro || "",
            descripcion: "",
            ubicacion: "",
            publicoObjetivo: "",
            sitioWeb: "",
            facturacion: "",
            ticketPromedio: "",
            presupuesto: "",
            canalesActuales: "",
            metaPrincipal: "",
            plazoMeta: "6 meses",
            competidores: "",
            obstaculo: ""
          });
        }
        setSections(est.secciones || {});
        setResumen(est.resumen || "");
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
    let fullText = `# ESTRATEGIA DE CRECIMIENTO: ${formData.nombreNegocio.toUpperCase()}\n`;
    fullText += `Rubro: ${formData.rubro} | Plazo: ${formData.plazoMeta}\n\n`;
    fullText += `## RESUMEN EJECUTIVO\n${resumen}\n\n`;

    SECTIONS_CONFIG.forEach(sec => {
      if (sections[sec.id]) {
        fullText += `${sections[sec.id]}\n\n`;
      }
    });

    navigator.clipboard.writeText(fullText)
      .then(() => triggerToast("Copiada la estrategia completa al portapapeles", "success"))
      .catch(() => triggerToast("Fallo al copiar", "error"));
  };

  // Handle printing
  const handlePrint = () => {
    window.print();
  };

  const startNewStrategy = () => {
    setFormData({
      nombreNegocio: "",
      rubro: "",
      descripcion: "",
      ubicacion: "",
      publicoObjetivo: "",
      sitioWeb: "",
      facturacion: "",
      ticketPromedio: "",
      presupuesto: "",
      canalesActuales: "",
      metaPrincipal: "",
      plazoMeta: "6 meses",
      competidores: "",
      obstaculo: ""
    });
    setSections({});
    setResumen("");
    setGenerationStatus("idle");
    setErrorMessage("");
    setSelectedHistoryId(null);
    setSaveSuccess(false);
    setActiveTab("form");
  };

  return (
    <div className="min-h-screen bg-brand-cream/30 text-brand-navy selection:bg-brand-gold selection:text-white relative">
      {/* Dynamic Toast System */}
      {showToast && (
        <div
          className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-fade-in border transition-all duration-300 max-w-sm ${
            showToast.type === "success"
              ? "bg-[#132420] text-brand-cream border-brand-green"
              : showToast.type === "error"
              ? "bg-red-950 text-red-100 border-red-800"
              : "bg-amber-950 text-amber-100 border-brand-gold"
          }`}
        >
          {showToast.type === "success" && <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0" />}
          {showToast.type === "error" && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />}
          {showToast.type === "info" && <Sparkles className="w-5 h-5 text-brand-gold shrink-0" />}
          <span className="text-sm font-medium">{showToast.message}</span>
        </div>
      )}

      {/* Header Panel */}
      <header id="app-header" className="border-b border-brand-green/20 bg-white/80 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-brand-navy p-2 rounded">
            <Sparkles className="w-6 h-6 text-brand-gold" />
          </div>
          <div>
            <span className="font-serif text-xl tracking-tight font-extrabold text-brand-navy">iGENIUS</span>
            <span className="text-xs font-mono block tracking-wider uppercase text-brand-green font-semibold">Growth Partners</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={startNewStrategy}
            className="flex items-center gap-2 bg-brand-green hover:bg-brand-green/90 text-white text-xs md:text-sm font-medium px-4 py-2 rounded-md shadow-md transition-all duration-200"
          >
            <PlusCircle className="w-4 h-4" />
            Nueva Estrategia
          </button>
          
          <button
            onClick={() => setActiveTab(activeTab === "form" ? "history" : "form")}
            className="flex items-center gap-2 border border-brand-green/30 hover:border-brand-green/80 text-brand-navy text-xs md:text-sm font-medium px-4 py-2 rounded-md transition-all duration-200"
          >
            <History className="w-4 h-4 text-brand-green" />
            {activeTab === "form" ? "Ver Estrategias Guardadas" : "Volver al Formulario"}
          </button>
        </div>
      </header>

      {/* Main Panel Layout */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[calc(100vh-80px)]">
        
        {/* Left Side: Sidebar Panel (Form & History) */}
        <section id="sidebar-panel" className="lg:col-span-5 flex flex-col gap-6 print:hidden">
          
          {/* Tabs Navigation */}
          <div className="bg-white rounded-lg p-1 shadow-sm border border-brand-green/10 flex">
            <button
              onClick={() => setActiveTab("form")}
              className={`flex-1 text-center py-2 rounded-md text-[11px] md:text-xs font-bold tracking-wide transition-all duration-200 ${
                activeTab === "form"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-brand-navy/70 hover:text-brand-navy hover:bg-brand-cream/20"
              }`}
            >
              <FileText className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
              Nueva
            </button>
            <button
              onClick={() => {
                setActiveTab("history");
                fetchHistory();
              }}
              className={`flex-1 text-center py-2 rounded-md text-[11px] md:text-xs font-bold tracking-wide transition-all duration-200 ${
                activeTab === "history"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-brand-navy/70 hover:text-brand-navy hover:bg-brand-cream/20"
              }`}
            >
              <History className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
              Historial ({historyList.length})
            </button>
            <button
              onClick={() => setActiveTab("config")}
              className={`flex-1 text-center py-2 rounded-md text-[11px] md:text-xs font-bold tracking-wide transition-all duration-200 ${
                activeTab === "config"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "text-brand-navy/70 hover:text-brand-navy hover:bg-brand-cream/20"
              }`}
            >
              <Database className="w-3.5 h-3.5 inline-block mr-1 -mt-0.5" />
              Supabase
            </button>
          </div>

          {/* Tab 1: Form Block */}
          {activeTab === "form" && (
            <div className="bg-white rounded-xl shadow-md border border-brand-green/10 p-6 flex flex-col gap-6">
              
              <div className="border-b border-brand-green/10 pb-4">
                <h2 className="font-serif text-lg font-bold text-brand-navy flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-green" />
                  Configuración de la Estrategia
                </h2>
                <p className="text-xs text-brand-navy/60 mt-1">
                  Ingrese los datos clave de la PyME para que nuestro motor de inteligencia elabore el plan.
                </p>
              </div>

              {/* Block 1: El Negocio */}
              <div className="space-y-4">
                <h3 className="font-serif text-xs uppercase tracking-wider text-brand-gold font-extrabold flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  1. El Negocio
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/80 mb-1">Nombre del Negocio *</label>
                    <input
                      type="text"
                      name="nombreNegocio"
                      value={formData.nombreNegocio}
                      onChange={handleInputChange}
                      placeholder="Ej. Boutique La Petite"
                      className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 px-3 text-brand-navy outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/80 mb-1">Rubro o Industria *</label>
                    <input
                      type="text"
                      name="rubro"
                      value={formData.rubro}
                      onChange={handleInputChange}
                      placeholder="Ej. Moda Femenina, Restaurante"
                      className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 px-3 text-brand-navy outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy/80 mb-1">Descripción y Propuesta de Valor</label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="¿Qué venden, cómo se diferencian y cuál es su valor principal?"
                    className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 px-3 text-brand-navy outline-none transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/80 mb-1">Ubicación / Mercado Objetivo</label>
                    <input
                      type="text"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleInputChange}
                      placeholder="Ej. Santiago de Chile, Online Latam"
                      className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 px-3 text-brand-navy outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/80 mb-1">Público Objetivo</label>
                    <input
                      type="text"
                      name="publicoObjetivo"
                      value={formData.publicoObjetivo}
                      onChange={handleInputChange}
                      placeholder="Ej. Mujeres de 25-40 años clase media"
                      className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 px-3 text-brand-navy outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy/80 mb-1">Sitio Web o Red Social Base (Opcional)</label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-brand-navy/40 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      name="sitioWeb"
                      value={formData.sitioWeb}
                      onChange={handleInputChange}
                      placeholder="Ej. instagram.com/boutique_petite"
                      className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 pl-9 pr-3 text-brand-navy outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Block 2: Los Números */}
              <div className="space-y-4 pt-4 border-t border-brand-green/10">
                <h3 className="font-serif text-xs uppercase tracking-wider text-brand-gold font-extrabold flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  2. Los Números (Unit Economics)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/80 mb-1">Facturación Mensual (Aprox)</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-brand-navy/40 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        name="facturacion"
                        value={formData.facturacion}
                        onChange={handleInputChange}
                        placeholder="Ej. $10,000 USD / mes"
                        className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 pl-8 pr-3 text-brand-navy outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/80 mb-1">Ticket Promedio de Venta</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-brand-navy/40 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        name="ticketPromedio"
                        value={formData.ticketPromedio}
                        onChange={handleInputChange}
                        placeholder="Ej. $75 USD"
                        className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 pl-8 pr-3 text-brand-navy outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/80 mb-1">Presupuesto Mktg Disponible</label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-brand-navy/40 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        name="presupuesto"
                        value={formData.presupuesto}
                        onChange={handleInputChange}
                        placeholder="Ej. $1,200 USD / mes"
                        className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 pl-8 pr-3 text-brand-navy outline-none transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/80 mb-1">Canales Actuales Utilizados</label>
                    <input
                      type="text"
                      name="canalesActuales"
                      value={formData.canalesActuales}
                      onChange={handleInputChange}
                      placeholder="Ej. Meta Ads, Orgánico Instagram"
                      className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 px-3 text-brand-navy outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Block 3: La Meta */}
              <div className="space-y-4 pt-4 border-t border-brand-green/10">
                <h3 className="font-serif text-xs uppercase tracking-wider text-brand-gold font-extrabold flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                  3. La Meta y Desafíos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/80 mb-1">Meta Principal *</label>
                    <input
                      type="text"
                      name="metaPrincipal"
                      value={formData.metaPrincipal}
                      onChange={handleInputChange}
                      placeholder="Ej. Duplicar ventas mensuales"
                      className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 px-3 text-brand-navy outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/80 mb-1">Plazo Estimado</label>
                    <select
                      name="plazoMeta"
                      value={formData.plazoMeta}
                      onChange={handleInputChange}
                      className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 px-3 text-brand-navy outline-none transition"
                    >
                      <option value="3 meses">3 meses</option>
                      <option value="6 meses">6 meses</option>
                      <option value="12 meses">12 meses</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy/80 mb-1">Competidores Conocidos (Opcional)</label>
                  <input
                    type="text"
                    name="competidores"
                    value={formData.competidores}
                    onChange={handleInputChange}
                    placeholder="Separe con comas. Si se vacía, la IA buscará 3."
                    className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 px-3 text-brand-navy outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy/80 mb-1">Mayor Obstáculo Percibido</label>
                  <input
                    type="text"
                    name="obstaculo"
                    value={formData.obstaculo}
                    onChange={handleInputChange}
                    placeholder="Ej. No sabemos hacer anuncios profesionales, poco stock"
                    className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 px-3 text-brand-navy outline-none transition"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-brand-green/10 flex flex-col gap-3">
                {generationStatus === "error" && (
                  <button
                    onClick={resumeGeneration}
                    className="w-full bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold py-3 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                    Reanudar desde donde se quedó
                  </button>
                )}

                <button
                  onClick={() => generateStrategy(0)}
                  disabled={!isFormValid() || generationStatus === "generating"}
                  className={`w-full py-3 px-4 rounded-md font-serif text-base font-bold tracking-wide shadow-md transition-all duration-200 flex items-center justify-center gap-2 ${
                    !isFormValid() || generationStatus === "generating"
                      ? "bg-brand-navy/10 text-brand-navy/40 cursor-not-allowed shadow-none"
                      : "bg-brand-navy text-brand-cream hover:bg-brand-green hover:text-white hover:shadow-lg cursor-pointer"
                  }`}
                >
                  {generationStatus === "generating" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Ejecutando Pipeline iGenius...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-brand-gold" />
                      Diseñar Estrategia iGenius
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* Tab 2: History List */}
          {activeTab === "history" && (
            <div className="bg-white rounded-xl shadow-md border border-brand-green/10 p-6 flex flex-col gap-4">
              <div className="border-b border-brand-green/10 pb-3">
                <h2 className="font-serif text-lg font-bold text-brand-navy flex items-center gap-2">
                  <History className="w-5 h-5 text-brand-green" />
                  Estrategias Guardadas
                </h2>
                <p className="text-xs text-brand-navy/60 mt-1">
                  Listado de las últimas 50 planificaciones estratégicas guardadas en el sistema.
                </p>
              </div>

              {historyList.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed border-brand-green/20 rounded-lg">
                  <FileText className="w-8 h-8 text-brand-green/35 mx-auto mb-2" />
                  <p className="text-sm font-medium text-brand-navy/70">No hay estrategias guardadas aún.</p>
                  <p className="text-xs text-brand-navy/50 mt-1">Regrese a la pestaña anterior y genere una nueva.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                  {historyList.map(item => (
                    <button
                      key={item.id}
                      onClick={() => loadHistoryItem(item.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center justify-between gap-3 ${
                        selectedHistoryId === item.id
                          ? "bg-[#132420] text-brand-cream border-[#132420]"
                          : "bg-brand-cream/10 hover:bg-brand-cream/25 border-brand-green/10 text-brand-navy"
                      }`}
                    >
                      <div className="truncate">
                        <p className={`text-sm font-bold truncate ${selectedHistoryId === item.id ? "text-brand-gold" : "text-brand-navy"}`}>
                          {item.nombre_negocio}
                        </p>
                        <p className={`text-xs truncate ${selectedHistoryId === item.id ? "text-brand-cream/70" : "text-brand-navy/60"} mt-0.5`}>
                          {item.rubro || "Sin rubro"}
                        </p>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-mono block ${selectedHistoryId === item.id ? "text-brand-cream/50" : "text-brand-navy/40"}`}>
                          {new Date(item.created_at).toLocaleDateString("es-ES", {
                            day: "2-digit",
                            month: "short"
                          })}
                        </span>
                        <ChevronRight className={`w-4 h-4 ml-auto mt-1 ${selectedHistoryId === item.id ? "text-brand-gold" : "text-brand-navy/45"}`} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Supabase Config */}
          {activeTab === "config" && (
            <div className="bg-white rounded-xl shadow-md border border-brand-green/10 p-6 flex flex-col gap-6 font-sans">
              <div className="border-b border-brand-green/10 pb-4">
                <h2 className="font-serif text-lg font-bold text-brand-navy flex items-center gap-2">
                  <Database className="w-5 h-5 text-brand-green" />
                  Conexión Supabase
                </h2>
                <p className="text-xs text-brand-navy/60 mt-1 leading-relaxed">
                  Configure la conexión directa a sus Supabase Edge Functions para integrarlo con Vercel y GitHub.
                </p>
              </div>

              {/* API Mode Selector */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-brand-navy/80 uppercase tracking-wider">Modo de Operación API</label>
                <div className="grid grid-cols-2 gap-2 bg-brand-cream/10 p-1 rounded-lg border border-brand-green/10">
                  <button
                    type="button"
                    onClick={() => {
                      setApiMode("local");
                      localStorage.setItem("igenius_api_mode", "local");
                      triggerToast("Cambiado a Simulador Local", "info");
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-md transition-all duration-150 ${
                      apiMode === "local"
                        ? "bg-brand-navy text-white shadow-sm"
                        : "text-brand-navy/70 hover:text-brand-navy hover:bg-brand-cream/20"
                    }`}
                  >
                    Simulador Local
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setApiMode("supabase");
                      localStorage.setItem("igenius_api_mode", "supabase");
                      triggerToast("Cambiado a Supabase Directo", "info");
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-md transition-all duration-150 ${
                      apiMode === "supabase"
                        ? "bg-brand-navy text-white shadow-sm"
                        : "text-brand-navy/70 hover:text-brand-navy hover:bg-brand-cream/20"
                    }`}
                  >
                    Supabase Directo
                  </button>
                </div>
                <p className="text-[11px] text-brand-navy/60 leading-relaxed italic">
                  {apiMode === "local" 
                    ? "Simula todas las operaciones en este entorno de desarrollo guardando en archivos JSON locales." 
                    : "Realiza peticiones reales a la Edge Function de tu proyecto Supabase de forma segura vía HTTPS."}
                </p>
              </div>

              {/* Supabase Settings Form */}
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-brand-navy/80 mb-1">Supabase Project URL</label>
                  <input
                    type="text"
                    value={supabaseUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSupabaseUrl(val);
                      localStorage.setItem("igenius_supabase_url", val);
                    }}
                    placeholder="https://su-proyecto.supabase.co"
                    className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 px-3 text-brand-navy outline-none transition font-mono"
                  />
                  <p className="text-[10px] text-brand-navy/50 mt-1 leading-relaxed">
                    La URL de su proyecto Supabase, que se obtiene en Settings → API.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-navy/80 mb-1">Supabase Anon / Public Key</label>
                  <div className="relative">
                    <input
                      type={showAnonKey ? "text" : "password"}
                      value={supabaseAnonKey}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSupabaseAnonKey(val);
                        localStorage.setItem("igenius_supabase_anon_key", val);
                      }}
                      placeholder="Su public anon key..."
                      className="w-full text-sm border border-brand-green/20 focus:border-brand-green focus:ring-1 focus:ring-brand-green bg-brand-cream/5 rounded-md py-2 pl-3 pr-10 text-brand-navy outline-none transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAnonKey(!showAnonKey)}
                      className="absolute right-3 top-2.5 text-brand-navy/40 hover:text-brand-navy/80"
                    >
                      {showAnonKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-brand-navy/50 mt-1 leading-relaxed">
                    La clave pública anónima de su proyecto, necesaria para invocar la Edge Function y autenticar.
                  </p>
                </div>

                {/* Connection Status Indicator */}
                {connectionStatus !== "idle" && (
                  <div className={`p-3 rounded-md text-xs leading-relaxed border ${
                    connectionStatus === "success" 
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                      : "bg-rose-50 text-rose-800 border-rose-200"
                  }`}>
                    <div className="flex items-center gap-2 font-bold">
                      {connectionStatus === "success" ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-600 font-bold shrink-0" />
                          <span>¡Conexión verificada con éxito!</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-rose-600 font-bold shrink-0" />
                          <span>Error de conexión</span>
                        </>
                      )}
                    </div>
                    {connectionStatus === "error" && (
                      <p className="font-mono text-[10px] mt-1 text-rose-700 max-h-16 overflow-y-auto bg-white/50 p-1.5 rounded">
                        {connectionError}
                      </p>
                    )}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => testConnection(supabaseUrl, supabaseAnonKey)}
                    disabled={testingConnection || !supabaseUrl}
                    className={`w-full py-2.5 px-4 rounded-md font-semibold text-xs shadow-sm transition flex items-center justify-center gap-2 ${
                      !supabaseUrl || testingConnection
                        ? "bg-brand-navy/10 text-brand-navy/40 cursor-not-allowed"
                        : "bg-brand-navy text-brand-cream hover:bg-brand-green hover:text-white cursor-pointer"
                    }`}
                  >
                    {testingConnection ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verificando Edge Function...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-brand-gold" />
                        Probar Conexión Directa
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Deployment Instructions */}
              <div className="bg-[#132420]/5 border border-brand-green/20 rounded-xl p-4 mt-2">
                <h3 className="text-xs font-bold text-[#132420] flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                  🚀 Guía de Despliegue en Vercel
                </h3>
                <p className="text-xs text-brand-navy/80 leading-relaxed">
                  Para que la app funcione en producción al subirla a su repositorio de GitHub y desplegarla en Vercel, añada estas dos variables en su panel de Vercel (Environment Variables):
                </p>
                <div className="mt-2.5 p-2 bg-[#132420] rounded text-[11px] font-mono text-brand-cream/90 space-y-1">
                  <div>VITE_SUPABASE_URL=https://...</div>
                  <div>VITE_SUPABASE_ANON_KEY=eyJ...</div>
                </div>
                <p className="text-[10px] text-brand-navy/50 mt-2 leading-relaxed">
                  Vite las incrustará automáticamente en la compilación y la aplicación usará el modo directo de Supabase de inmediato.
                </p>
              </div>
            </div>
          )}

          {/* Active Generation Steps Tracker */}
          {generationStatus === "generating" && (
            <div className="bg-[#132420] rounded-xl shadow-lg border border-brand-green/30 p-5 text-brand-cream">
              <h3 className="font-serif text-sm font-bold text-brand-gold mb-3 flex items-center gap-2 border-b border-brand-green/20 pb-2">
                <Layers className="w-4 h-4" />
                Pipeline de Generación
              </h3>

              <div className="space-y-3 text-xs">
                {SECTIONS_CONFIG.map((sec, index) => {
                  const isCurrent = currentSectionIndex === index;
                  const isDone = index < currentSectionIndex;
                  const isFailed = generationStatus === "error" && currentSectionIndex === index;

                  return (
                    <div key={sec.id} className="flex items-center justify-between gap-3">
                      <span className={`font-medium ${isDone ? "text-brand-green" : isCurrent ? "text-brand-gold font-bold" : "text-brand-cream/50"}`}>
                        {sec.name}
                      </span>
                      
                      <div className="shrink-0 font-mono text-[10px]">
                        {isDone && <span className="text-brand-green font-bold">✓ LISTO</span>}
                        {isCurrent && (
                          <div className="flex items-center gap-1 text-brand-gold font-bold animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold inline-block animate-bounce" />
                            PROCESANDO...
                          </div>
                        )}
                        {isFailed && <span className="text-red-500 font-bold">⚠️ FALLÓ</span>}
                        {!isDone && !isCurrent && <span className="text-brand-cream/35">PENDIENTE</span>}
                      </div>
                    </div>
                  );
                })}

                {/* Summary Step */}
                <div className="flex items-center justify-between gap-3 pt-2 border-t border-brand-green/10">
                  <span className={`font-medium ${resumen ? "text-brand-green" : currentSectionIndex === SECTIONS_CONFIG.length ? "text-brand-gold font-bold" : "text-brand-cream/50"}`}>
                    ★ Redacción de Resumen Ejecutivo
                  </span>
                  <div className="shrink-0 font-mono text-[10px]">
                    {resumen && <span className="text-brand-green font-bold">✓ LISTO</span>}
                    {!resumen && currentSectionIndex === SECTIONS_CONFIG.length && (
                      <span className="text-brand-gold font-bold animate-pulse">GENERANDO...</span>
                    )}
                    {!resumen && currentSectionIndex < SECTIONS_CONFIG.length && <span className="text-brand-cream/35">PENDIENTE</span>}
                  </div>
                </div>
              </div>

              {/* Exponential Backoff Retry Indicator */}
              {retryInfo && (
                <div className="mt-4 p-3 rounded bg-amber-950/40 border border-brand-gold/30 text-[11px] flex flex-col gap-1.5 text-amber-100">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-gold" />
                    <span className="font-bold">Congestión detectada (Intento {retryInfo.attempt}/5)</span>
                  </div>
                  <p className="text-brand-cream/80 text-[10px] leading-relaxed">
                    Reintentando en {retryInfo.delay / 1000}s. {retryInfo.errorMsg}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Persistent Error Message Board */}
          {generationStatus === "error" && errorMessage && (
            <div className="bg-red-950/25 border border-red-900 rounded-xl p-4 text-red-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-red-400">Error de Generación</h4>
                  <p className="text-xs text-red-200/80 mt-1 leading-relaxed">
                    Ocurrió un problema de cuotas o red al procesar el plan con Claude. Las secciones generadas se han preservado. Puede intentar reanudar el flujo sin perder los datos previos.
                  </p>
                  <p className="text-[10px] font-mono text-red-400/85 mt-2 bg-red-950/50 p-2 rounded border border-red-900/30 overflow-x-auto">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Right Side: Document Sheet Board (Dynamic Strategy Viewer) */}
        <section id="document-panel" className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Action Header Menu for Document */}
          <div className="bg-white rounded-lg p-3 shadow-sm border border-brand-green/10 flex items-center justify-between gap-4 print:hidden">
            <span className="text-xs font-mono font-bold tracking-wider text-brand-navy/60 uppercase">
              {generationStatus === "generating" ? (
                <span className="text-brand-green animate-pulse flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" /> Escribiendo reporte...
                </span>
              ) : selectedHistoryId ? (
                "Estrategia Histórica Cargada"
              ) : (
                "Documento Estratégico"
              )}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={copyToClipboard}
                disabled={!resumen && Object.keys(sections).length === 0}
                className="p-2 border border-brand-green/20 rounded hover:border-brand-green hover:bg-brand-cream/15 text-brand-navy/80 hover:text-brand-navy transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Copiar como Markdown"
              >
                <Copy className="w-4 h-4" />
              </button>
              
              <button
                onClick={handlePrint}
                disabled={!resumen && Object.keys(sections).length === 0}
                className="p-2 border border-brand-green/20 rounded hover:border-brand-green hover:bg-brand-cream/15 text-brand-navy/80 hover:text-brand-navy transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                title="Imprimir Estrategia"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={saveStrategyToDB}
                disabled={(generationStatus !== "finished" && !selectedHistoryId) || isSaving || saveSuccess}
                className={`flex items-center gap-2 text-xs font-bold py-1.5 px-4 rounded transition-all duration-150 ${
                  saveSuccess 
                    ? "bg-brand-green/20 text-brand-green border border-brand-green/30"
                    : "bg-brand-navy hover:bg-brand-green text-white cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Guardando...
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Guardada!
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-brand-gold" />
                    Guardar Reporte
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Physical Style Premium Report Document Cover Sheet */}
          <div
            id="printed-document-canvas"
            className="bg-brand-navy text-brand-cream rounded-2xl shadow-xl min-h-[650px] p-8 md:p-12 relative overflow-hidden flex flex-col gap-8 print:p-0 print:bg-white print:text-black print:shadow-none print:rounded-none"
          >
            {/* Artistic Watermark Accent Lines */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full blur-3xl pointer-events-none print:hidden" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none print:hidden" />

            {/* Document Header (Letterhead) */}
            <div className="border-b border-brand-green/30 pb-6 flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-brand-gold font-bold uppercase block mb-1">
                  PLAN ESTRATÉGICO DE CRECIMIENTO
                </span>
                <h1 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  {formData.nombreNegocio || "Nombre de la PyME"}
                </h1>
                <p className="text-xs text-brand-cream/60 mt-1.5 font-sans">
                  Rubro: <span className="text-brand-cream font-medium">{formData.rubro || "No especificado"}</span> | Plazo: <span className="text-brand-cream font-medium">{formData.plazoMeta}</span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-serif text-lg font-black tracking-wider text-white block">iGENIUS</span>
                <span className="text-[9px] font-mono tracking-widest text-brand-green block uppercase">Growth Partners</span>
                <span className="text-[10px] text-brand-cream/40 font-mono mt-2 block">
                  {new Date().toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric"
                  })}
                </span>
              </div>
            </div>

            {/* Document Body Area */}
            <div className="flex-1 space-y-8">
              
              {/* Empty State Instructions */}
              {!resumen && Object.keys(sections).length === 0 && (
                <div className="text-center py-20 px-6 flex flex-col items-center justify-center gap-4">
                  <div className="p-4 bg-brand-green/10 rounded-full">
                    <Sparkles className="w-10 h-10 text-brand-gold animate-pulse" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white">Consola de Diagnóstico iGenius</h3>
                  <p className="text-sm text-brand-cream/70 max-w-sm mx-auto leading-relaxed">
                    Ingrese el nombre, rubro y metas en el panel de control izquierdo para iniciar el motor de redacción secuencial y búsqueda web. Su reporte definitivo de marketing aparecerá aquí.
                  </p>
                </div>
              )}

              {/* SECTION: Resumen Ejecutivo (Rendered first, at the top) */}
              {resumen && (
                <div className="p-6 md:p-8 bg-brand-cream/5 border-l-4 border-brand-gold rounded-r-lg shadow-inner my-6 animate-fade-in relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 text-brand-gold/15 pointer-events-none font-serif text-4xl font-extrabold">
                    ★
                  </div>
                  <span className="text-[10px] font-mono text-brand-gold uppercase tracking-wider block mb-2 font-bold">
                    Resumen Ejecutivo
                  </span>
                  <p className="font-serif text-base md:text-lg text-white leading-relaxed font-light italic">
                    {resumen}
                  </p>
                </div>
              )}

              {/* RENDER THE 7 COMPLETED SECTIONS */}
              <div className="space-y-12">
                {SECTIONS_CONFIG.map((sec) => {
                  const content = sections[sec.id];
                  if (!content) return null;

                  return (
                    <div
                      key={sec.id}
                      className="animate-fade-in border-t border-brand-green/10 pt-6 mt-8"
                    >
                      <div className="prose prose-invert max-w-none">
                        {parseMarkdownToReact(content)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inline Progress Bar / Active Writing Sheet */}
              {generationStatus === "generating" && SECTIONS_CONFIG[currentSectionIndex] && (
                <div className="border-t border-brand-green/20 pt-8 mt-12 animate-pulse flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
                    <span className="font-serif text-lg font-bold text-brand-gold">
                      Redactando {SECTIONS_CONFIG[currentSectionIndex].name}...
                    </span>
                  </div>
                  
                  {/* Pseudo-writing blocks to show layout growth */}
                  <div className="space-y-3 pl-8">
                    <div className="h-4 bg-brand-cream/10 rounded w-11/12" />
                    <div className="h-4 bg-brand-cream/10 rounded w-5/6" />
                    <div className="h-4 bg-brand-cream/15 rounded w-4/5" />
                    <div className="h-4 bg-brand-cream/5 rounded w-2/3" />
                  </div>
                </div>
              )}

              {/* Anchor block for auto-scrolling */}
              <div ref={documentEndRef} />
            </div>

            {/* Document Footer */}
            <div className="border-t border-brand-green/20 pt-6 mt-12 text-center text-xs text-brand-cream/40 flex flex-wrap justify-between gap-4 font-mono">
              <span>REPORT-ID: {selectedHistoryId ? selectedHistoryId.slice(0, 8).toUpperCase() : "DRAFT-IGENIUS"}</span>
              <span>© iGenius Growth Partners. Confidencialidad y Uso Interno.</span>
              <span>PÁGINA 1 DE 1</span>
            </div>
          </div>

        </section>
      </main>
    </div>
  );
}
