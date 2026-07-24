import React, { useState } from "react";
import { Sparkles, Lock, KeyRound, MessageCircle, X, CheckCircle2, Loader2 } from "lucide-react";

interface UpgradeModalProps {
  onClose: () => void;
  onCodeRedeemed: () => void;
  userId: string;
  invokeEdgeFunction: (payload: any) => Promise<any>;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  onClose, 
  onCodeRedeemed, 
  userId, 
  invokeEdgeFunction 
}) => {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const WHATSAPP_LINK = "https://wa.me/593987254256?text=Hola%2C%20quiero%20agendar%20mi%20diagn%C3%B3stico%20gratis%20de%20iGenius";

  const handleRedeem = async () => {
    if (!codigo.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await invokeEdgeFunction({ action: "redeem_code", user_id: userId, codigo });
      if (res?.exito) {
        setSuccess(true);
        setTimeout(() => {
          onCodeRedeemed();
        }, 1200);
      } else {
        setError(res?.error || "Código inválido o ya usado.");
      }
    } catch (err: any) {
      setError(err?.message || "Hubo un error validando el código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 relative border border-slate-200/80 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-left">
        
        {/* Subtle decorative background glow */}
        <div className="absolute -right-12 -top-12 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-amber-600 uppercase block">
              Acceso Restringido
            </span>
            <h2 className="text-lg font-display font-black text-slate-900 tracking-tight leading-none">
              Acceso Privilegiado
            </h2>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-5 font-normal">
          Esta estrategia requiere acceso privilegiado. Contacta a soporte de iGenius Growth Partners para desbloquearla — ahí vemos si Sistema Prime o Partner Prime es lo que tu negocio necesita.
        </p>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-4 text-center space-y-1.5 animate-fade-in my-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <p className="text-xs font-bold text-emerald-900">¡Acceso ilimitado activado con éxito!</p>
            <p className="text-[11px] text-emerald-700">Desbloqueando todas las estrategias...</p>
          </div>
        ) : (
          <>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl mb-3 flex items-center justify-center gap-2 text-xs transition shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Contactar a soporte en WhatsApp</span>
            </a>

            {!showCodeInput ? (
              <button
                onClick={() => setShowCodeInput(true)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-semibold py-2 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>¿Ya eres socio de iGenius? Ingresa tu código de acceso</span>
              </button>
            ) : (
              <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 animate-fade-in">
                <label className="text-[10px] font-mono font-bold uppercase text-slate-500 block">
                  Código de activación
                </label>
                <input
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
                  placeholder="Ej: IGENIUS-SOCIOPRIME-2026"
                  className="w-full text-xs font-mono uppercase px-3 py-2.5 rounded-lg bg-white border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 text-slate-900 placeholder-slate-400"
                />
                {error && <p className="text-[11px] font-semibold text-rose-600 leading-tight">{error}</p>}
                <button
                  onClick={handleRedeem}
                  disabled={loading || !codigo.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-lg disabled:opacity-40 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Verificando...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Desbloquear acceso</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
