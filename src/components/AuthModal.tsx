import React, { useState } from "react";
import { X, Mail, Lock, User, Sparkles, Loader2, KeyRound } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  supabaseClient: any;
  onAuthSuccess: (user: any) => void;
  triggerToast: (msg: string, type: "success" | "error" | "info") => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  supabaseClient,
  onAuthSuccess,
  triggerToast,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      triggerToast("Por favor complete todos los campos requeridos.", "error");
      return;
    }
    if (password.length < 6) {
      triggerToast("La contraseña debe tener al menos 6 caracteres.", "error");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign Up
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
          triggerToast(
            "¡Registro exitoso! Verifique su correo si la confirmación está activa, o inicie sesión directamente.",
            "success"
          );
          onAuthSuccess(data.user);
          onClose();
        }
      } else {
        // Sign In
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        if (data?.user) {
          triggerToast(`¡Bienvenido de nuevo, ${data.user.user_metadata?.display_name || email}!`, "success");
          onAuthSuccess(data.user);
          onClose();
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      triggerToast(err.message || "Error en el proceso de autenticación.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative flex flex-col">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-[9px] font-mono tracking-widest text-indigo-300 font-bold uppercase">
              GROWTH CONSOLE MEMBERS
            </span>
          </div>
          <h2 className="font-display text-lg font-bold tracking-tight">
            {isSignUp ? "Crear cuenta profesional" : "Acceso Corporativo"}
          </h2>
          <p className="text-xs text-indigo-200/80 mt-1 font-light">
            {isSignUp
              ? "Guarde estrategias en la nube, personalice su marca y acceda desde cualquier dispositivo."
              : "Inicie sesión para acceder a su panel exclusivo, historial y configuraciones."}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 text-left">
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Nombre o Agencia
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Alpha Consulting"
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="socio@suagencia.com"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Contraseña
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  onClick={() => {
                    triggerToast("Restablecimiento de contraseña disponible a través de Supabase Dashboard.", "info");
                  }}
                  className="text-[10px] text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  ¿Olvidó contraseña?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 placeholder-slate-400 focus:outline-none focus:border-indigo-600 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-indigo-950 text-white rounded-xl py-2.5 text-xs font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>{isSignUp ? "Registrarse" : "Iniciar Sesión"}</span>
              </>
            )}
          </button>

          {/* Toggle mode */}
          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            {isSignUp ? "¿Ya tiene cuenta?" : "¿No tiene cuenta en la nube?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-indigo-600 hover:underline font-bold cursor-pointer ml-1"
            >
              {isSignUp ? "Inicie sesión aquí" : "Regístrese gratis aquí"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
