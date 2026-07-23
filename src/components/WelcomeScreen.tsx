import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Coins, 
  Search, 
  Target, 
  Award, 
  Mail, 
  Lock, 
  Loader2, 
  User, 
  KeyRound, 
  CheckCircle, 
  History, 
  LogOut
} from "lucide-react";
import { FormData } from "../utils/prompts";

interface WelcomeScreenProps {
  onStart: (initialData: FormData) => void;
  onOpenHistory: () => void;
  historyCount: number;
  user: any;
  onLoginClick: () => void;
  supabaseClient?: any;
  triggerToast?: (msg: string, type: "success" | "error" | "info") => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onOpenHistory,
  historyCount,
  user,
  onLoginClick,
  supabaseClient,
  triggerToast,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const features = [
    {
      icon: <Coins className="w-5 h-5 text-blue-400" />,
      title: "Unit Economics Perfectos",
      desc: "Cálculo matemático de CAC, LTV y márgenes óptimos adaptados automáticamente a su ticket de venta para asegurar la máxima rentabilidad de sus campañas.",
    },
    {
      icon: <Search className="w-5 h-5 text-indigo-400" />,
      title: "Auditoría Competitiva Activa",
      desc: "Análisis inteligente de competidores directos en su región geográfica para capturar vacíos de mercado e identificar ventajas competitivas inmediatas.",
    },
    {
      icon: <Target className="w-5 h-5 text-sky-400" />,
      title: "Funnels de Alta Conversión",
      desc: "Ingeniería de ofertas irresistibles personalizadas y distribución óptima de presupuesto publicitario guiada por modelos predictivos.",
    },
    {
      icon: <Award className="w-5 h-5 text-purple-400" />,
      title: "Planificación CRM & Nutrición",
      desc: "Nutrición automática de prospectos, secuencias de seguimiento estructuradas y control integral de embudos comerciales de alta gama.",
    },
  ];

  // Auto-play feature sliding animation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeatureIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [features.length]);

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

  const handleInlineAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseClient) {
      triggerToast?.("El cliente de base de datos no está disponible actualmente.", "error");
      return;
    }
    if (!email.trim() || !password.trim()) {
      triggerToast?.("Por favor rellene todos los campos requeridos.", "error");
      return;
    }

    if (isSignUp && password.length < 6) {
      triggerToast?.("La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabaseClient.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              display_name: nombre.trim() || "Consultor",
            },
          },
        });

        if (error) throw error;

        if (data?.user) {
          triggerToast?.(
            `¡Cuenta creada exitosamente! Bienvenido ${data.user.user_metadata?.display_name || email}`,
            "success"
          );
        }
      } else {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        if (data?.user) {
          triggerToast?.(
            `¡Acceso exitoso! Bienvenido ${data.user.user_metadata?.display_name || email}`,
            "success"
          );
        }
      }
    } catch (err: any) {
      console.error("Inline auth error:", err);
      triggerToast?.(err.message || "Error al autenticar o credenciales incorrectas.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
      triggerToast?.("Sesión cerrada correctamente", "info");
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 items-stretch bg-slate-50 relative z-10">
      
      {/* LEFT COLUMN: SOLID TOP-TO-BOTTOM BRAND PANEL */}
      <div className="lg:col-span-7 bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 text-white p-8 md:p-16 lg:p-20 flex flex-col justify-between relative overflow-hidden">
        
        {/* Subtle grid background mask for modern aesthetic */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-60" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none -ml-32 -mb-32" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-[100px] pointer-events-none" />

        {/* Top Content Area */}
        <div className="space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-blue-300 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-blue-200 font-bold uppercase">
              {user ? `CONSULTOR EN LÍNEA` : "SISTEMA DE ACELERACIÓN IA"}
            </span>
          </div>

          <div className="space-y-5">
            <h1 className="font-display text-4xl md:text-5.5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white">
              Acelere el Crecimiento de su Negocio
            </h1>
            <p className="text-sm md:text-base text-indigo-200/90 leading-relaxed font-light max-w-xl">
              Alinee sus unit economics, audite su competencia local y cree embudos comerciales de alta conversión en minutos con precisión algorítmica premium.
            </p>
          </div>
        </div>

        {/* Sliding modules slider at the bottom */}
        <div className="mt-16 pt-10 border-t border-white/10 relative z-10">
          <span className="text-[10px] font-mono tracking-widest text-blue-300 font-bold uppercase block mb-4">
            Módulos de Precisión Incorporados
          </span>
          
          <div className="relative min-h-[140px] bg-white/[0.03] backdrop-blur-sm rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
            
            {/* Feature Slide Loop */}
            <div className="relative w-full h-[90px] overflow-hidden">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-500 absolute inset-0 flex gap-4 ${
                    idx === activeFeatureIndex 
                      ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                      : "opacity-0 -translate-y-4 scale-95 pointer-events-none"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/5">
                    {feat.icon}
                  </div>
                  <div className="space-y-1 pr-2">
                    <h4 className="text-xs font-bold text-white tracking-wide uppercase">
                      {feat.title}
                    </h4>
                    <p className="text-[11px] md:text-xs text-indigo-150/80 leading-normal font-light">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Dots */}
            <div className="flex items-center gap-1.5 mt-2 self-end">
              {features.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFeatureIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-350 cursor-pointer ${
                    idx === activeFeatureIndex ? "w-6 bg-blue-400" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: FLOATING CLEAN ENTRY CARD CENTERED */}
      <div className="lg:col-span-5 bg-slate-50 flex flex-col items-center justify-center p-8 md:p-16 relative">
        {/* Subtle lighting overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-100/50 to-white/40 pointer-events-none" />

        {/* Floating Entry Box */}
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200/80 border border-slate-100 p-8 md:p-10 relative z-10">
          
          {!user ? (
            // PREMIUM CLEAN LOGIN / REGISTER FORM INLINE IN THE CARD
            <form onSubmit={handleInlineAuth} className="space-y-5">
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="font-display text-2xl font-black text-slate-900 tracking-tight">
                  {isSignUp ? "Crear Cuenta" : "Bienvenido"}
                </h3>
                <p className="text-xs text-slate-500 font-light leading-relaxed max-w-[280px] mx-auto">
                  {isSignUp
                    ? "Regístrese para guardar sus estrategias en la nube, personalice su marca y sincronice sus datos."
                    : "Inicie sesión de manera directa para guardar sus planes de escalado, configuraciones de negocio y marcas."}
                </p>
              </div>

              <div className="space-y-3">
                {isSignUp && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                      Nombre o Agencia
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej. Samuel Valencia"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="socio@suagencia.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                      Contraseña
                    </label>
                    {!isSignUp && (
                      <button
                        type="button"
                        onClick={() => {
                          triggerToast?.("Puede solicitar cambio de contraseña en su correo de registro.", "info");
                        }}
                        className="text-[10px] text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        ¿Olvidó contraseña?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isSignUp ? "Mínimo 6 caracteres" : "••••••••"}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/10 cursor-pointer disabled:opacity-75 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{isSignUp ? "Creando cuenta..." : "Verificando ingreso..."}</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>{isSignUp ? "Registrarse Gratis" : "Ingresar con Acceso Seguro"}</span>
                  </>
                )}
              </button>

              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                {isSignUp ? "¿Ya tiene una cuenta?" : "¿Aún no tiene cuenta?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-600 hover:underline font-bold cursor-pointer ml-1"
                >
                  {isSignUp ? "Inicie sesión aquí" : "Regístrese gratis aquí"}
                </button>
              </div>
            </form>
          ) : (
            // LOGGED IN ACTIONS
            <div className="space-y-6">
              <div className="space-y-3 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                  <CheckCircle className="w-6 h-6 animate-pulse" />
                </div>
                <span className="text-[9px] font-mono tracking-[0.2em] text-emerald-600 font-bold uppercase block">
                  CONSOLA ACTIVA
                </span>
                <h3 className="font-display text-xl font-black text-slate-900 tracking-tight truncate max-w-[280px] mx-auto">
                  {user.user_metadata?.display_name || user.email?.split("@")[0]}
                </h3>
                <p className="text-xs text-slate-400 truncate max-w-[280px] mx-auto font-light">{user.email}</p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handleGenerate}
                  className="w-full group bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3.5 px-4 text-xs font-bold transition-all duration-200 flex items-center justify-between shadow-md shadow-blue-600/10 cursor-pointer hover:-translate-y-0.5"
                >
                  <span>Comenzar Nueva Estrategia</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                <button
                  onClick={onOpenHistory}
                  className="w-full border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl py-3 px-4 text-xs font-bold transition flex items-center justify-between cursor-pointer"
                >
                  <span>Historial Guardado ({historyCount})</span>
                  <History className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-400 text-[10px] font-mono">Consola lista</span>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
