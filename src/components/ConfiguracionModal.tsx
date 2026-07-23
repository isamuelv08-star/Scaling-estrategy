import React, { useState } from "react";
import {
  X,
  User,
  Lock,
  Globe,
  DollarSign,
  Check,
  Loader2,
  Sliders,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface ConfiguracionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  supabaseClient: any;
  consultorNombre: string;
  setConsultorNombre: (name: string) => void;
  triggerToast?: (message: string, type?: "success" | "error" | "info") => void;
}

export const ConfiguracionModal: React.FC<ConfiguracionModalProps> = ({
  isOpen,
  onClose,
  user,
  supabaseClient,
  consultorNombre,
  setConsultorNombre,
  triggerToast,
}) => {
  const [nombre, setNombre] = useState(
    user?.user_metadata?.display_name || consultorNombre || ""
  );
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [language, setLanguage] = useState(
    () => localStorage.getItem("app_language") || "es"
  );
  const [currency, setCurrency] = useState(
    () => localStorage.getItem("app_currency") || "USD"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"cuenta" | "seguridad" | "preferencias">("cuenta");

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Update local name state
      if (nombre.trim()) {
        setConsultorNombre(nombre.trim());
      }

      // Save language and currency preferences
      localStorage.setItem("app_language", language);
      localStorage.setItem("app_currency", currency);

      // If Supabase client exists and user is logged in, update metadata
      if (supabaseClient && user) {
        const { error } = await supabaseClient.auth.updateUser({
          data: {
            display_name: nombre.trim(),
            preferred_language: language,
            preferred_currency: currency,
          },
        });

        if (error) throw error;
      }

      triggerToast?.("Configuración y perfil actualizados con éxito", "success");
      onClose();
    } catch (err: any) {
      console.error("Error updating profile:", err);
      triggerToast?.(err.message || "Error al actualizar perfil", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      triggerToast?.("Por favor ingrese una nueva contraseña", "error");
      return;
    }
    if (newPassword.length < 6) {
      triggerToast?.("La contraseña debe tener al menos 6 caracteres", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast?.("Las contraseñas no coinciden", "error");
      return;
    }

    if (!supabaseClient) {
      triggerToast?.("Cliente de autenticación no disponible", "error");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      triggerToast?.("Contraseña modificada correctamente", "success");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error updating password:", err);
      triggerToast?.(err.message || "Error al actualizar la contraseña", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col my-auto text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-slate-900 leading-tight">
                Configuración del Sistema
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Gestione sus accesos, perfil de cuenta e idioma de la consola
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-white px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab("cuenta")}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs transition cursor-pointer ${
              activeTab === "cuenta"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Perfil y Nombre</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("seguridad")}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs transition cursor-pointer ${
              activeTab === "seguridad"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Seguridad y Accesos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preferencias")}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-bold text-xs transition cursor-pointer ${
              activeTab === "preferencias"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Idioma y Región</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {activeTab === "cuenta" && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Nombre del Usuario o Agencia
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Samuel Valencia"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Este nombre se mostrará en los informes ejecutivos y encabezados de la aplicación.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Correo Electrónico Vinculado
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || "usuario@ejemplo.com"}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-mono"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-600/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Guardar Datos de Cuenta</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === "seguridad" && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-start gap-3 text-amber-900">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <p className="font-bold">Actualización de Clave</p>
                  <p className="text-[11px] text-amber-800 font-light">
                    Modifique su contraseña de acceso a la plataforma. Su nueva clave tomará efecto inmediatamente.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita la nueva contraseña"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-600/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  <span>Cambiar Contraseña</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === "preferencias" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  Idioma de la Plataforma
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "es", name: "Español", flag: "🇲🇽" },
                    { id: "en", name: "English", flag: "🇺🇸" },
                    { id: "pt", name: "Português", flag: "🇧🇷" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLanguage(item.id)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                        language === item.id
                          ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span>{item.flag}</span>
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Moneda para Proyecciones y ROI
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "USD", symbol: "$ USD" },
                    { id: "EUR", symbol: "€ EUR" },
                    { id: "COP", symbol: "$ COP" },
                    { id: "MXN", symbol: "$ MXN" },
                    { id: "CLP", symbol: "$ CLP" },
                    { id: "ARS", symbol: "$ ARS" },
                    { id: "PEN", symbol: "S/ PEN" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrency(item.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        currency === item.id
                          ? "bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      <span>{item.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-md shadow-blue-600/10 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Preferencias</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
