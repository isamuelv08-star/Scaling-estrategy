import React from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Building2,
  Briefcase,
  MapPin,
  Globe,
  Award,
  Database,
  DollarSign,
  Coins,
  Users,
  AlertTriangle,
  Search,
  Target,
} from "lucide-react";
import { FormData } from "../utils/prompts";
import { CustomSelect } from "./CustomSelect";

interface OnboardingWizardProps {
  formData: FormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleRedesUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeRedesImagen: (index: number) => void;
  wizardStep: number;
  setWizardStep: React.Dispatch<React.SetStateAction<number>>;
  onGenerate: () => void;
  isGenerating: boolean;
  triggerToast: (msg: string, type: "success" | "error" | "info") => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  formData,
  onChange,
  handleRedesUpload,
  removeRedesImagen,
  wizardStep,
  setWizardStep,
  onGenerate,
  isGenerating,
  triggerToast,
}) => {
  const isStepValid = (step: number): boolean => {
    if (step === 1) {
      return !!(formData.nombreNegocio?.trim() && formData.rubro?.trim() && formData.ubicacion?.trim());
    }
    if (step === 2) {
      return !!(formData.descripcion?.trim() && formData.productoEstrella?.trim());
    }
    if (step === 3) {
      const baseValid = !!(formData.facturacion?.trim() && formData.ticketPromedio?.trim() && formData.margenUtilidad?.trim() && formData.presupuesto?.trim());
      if (formData.invertidoEnAds === "Sí") {
        return baseValid && !!(formData.montoInvertidoEnAds?.trim() && formData.plataformasAds?.trim());
      }
      return baseValid;
    }
    if (step === 4) {
      return !!(formData.metaPrincipal?.trim() && formData.publicoObjetivo?.trim() && formData.obstaculo?.trim());
    }
    return false;
  };

  const isFormValid = (): boolean => {
    return isStepValid(1) && isStepValid(2) && isStepValid(3) && isStepValid(4);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Step Header */}
      <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-[9px] font-mono tracking-widest text-slate-400 font-bold uppercase">
              ONBOARDING EMPRESARIAL • PASO {wizardStep} DE 4
            </span>
          </div>

          <h3 className="text-base md:text-lg font-display font-bold text-slate-900 leading-tight">
            {wizardStep === 1 && "Perfil e Identidad Corporativa"}
            {wizardStep === 2 && "Estructura Operativa y Oferta"}
            {wizardStep === 3 && "Unit Economics y Finanzas"}
            {wizardStep === 4 && "Metas, Retos y Competitividad"}
          </h3>

          {/* Mini step dots progress */}
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden flex gap-0.5">
            <div className={`h-full transition-all duration-300 ${wizardStep >= 1 ? "bg-blue-600" : "bg-slate-200"} flex-1`} />
            <div className={`h-full transition-all duration-300 ${wizardStep >= 2 ? "bg-blue-600" : "bg-slate-200"} flex-1`} />
            <div className={`h-full transition-all duration-300 ${wizardStep >= 3 ? "bg-blue-600" : "bg-slate-200"} flex-1`} />
            <div className={`h-full transition-all duration-300 ${wizardStep >= 4 ? "bg-blue-600" : "bg-slate-200"} flex-1`} />
          </div>
        </div>
      </div>

      {/* Form Content Scrollable container */}
      <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
        
        {/* STEP 1 */}
        {wizardStep === 1 && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-xs text-slate-500 leading-relaxed bg-blue-50/20 p-4 rounded-2xl border border-blue-100/30">
              Comencemos identificando la naturaleza y el mercado de su marca. Esto guiará el análisis sectorial y contextualizará la propuesta.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Nombre de la Empresa / Negocio *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="nombreNegocio"
                    value={formData.nombreNegocio}
                    onChange={onChange}
                    placeholder="Ej. Boutique La Petite, Acme Consulting"
                    className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  * Usamos el nombre para firmar legalmente su reporte y realizar consultas focalizadas de posicionamiento de marca.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Rubro / Sector Industrial *
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="rubro"
                    value={formData.rubro}
                    onChange={onChange}
                    placeholder="Ej. Restauración Gourmet, Moda Femenina, Consultoría TI"
                    className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  * Sirve para contrastar su oferta con los estándares industriales, márgenes típicos de ganancia y canales de venta dominantes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Modelo de Operación Comercial *
                </label>
                <CustomSelect
                  name="tipoModelo"
                  value={formData.tipoModelo}
                  onChange={onChange as any}
                  options={[
                    { value: "Servicios B2B", label: "Servicios B2B (Corporativo / Consultas)" },
                    { value: "Servicios B2C", label: "Servicios B2C (Consumo Masivo / Particular)" },
                    { value: "Comercio Local / Retail", label: "Comercio Local / Tienda Física / Restaurante" },
                    { value: "E-commerce / Venta Online", label: "E-commerce / Venta Online" },
                    { value: "SaaS / Tecnología", label: "SaaS / Suscripción Tecnológica" },
                    { value: "Creador / Infoproductos", label: "Creador / Infoproductos / Formación" }
                  ]}
                />
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  * Define si la estrategia óptima de captación se basará en prospección consultiva de alta gama o pauta digital transaccional.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Ubicación Operativa *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={onChange}
                      placeholder="Ej. Bogotá, Madrid, Global"
                      className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    * El punto de anclaje para rastrear y comparar competidores geográficos reales en la web.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Capturas de tus redes sociales (opcional, hasta 3)
                  </label>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    Sube capturas de tu Instagram, TikTok o Facebook — bio, publicaciones recientes, lo que muestre cómo luce tu presencia hoy. Si no tienes redes activas, déjalo vacío.
                  </p>
                  <div className="flex gap-2 flex-wrap pt-1">
                    {(formData.redesImagenes || []).map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={`data:${img.mediaType};base64,${img.base64}`}
                          alt={img.name}
                          className="w-16 h-16 object-cover rounded-xl border border-slate-200 shadow-xs"
                        />
                        <button
                          type="button"
                          onClick={() => removeRedesImagen(i)}
                          className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center cursor-pointer shadow-sm hover:bg-slate-800 transition"
                          title="Eliminar captura"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    {(formData.redesImagenes || []).length < 3 && (
                      <label className="w-16 h-16 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer text-slate-400 text-xl hover:border-slate-400 hover:bg-slate-100/50 transition">
                        +
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleRedesUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {wizardStep === 2 && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-xs text-slate-500 leading-relaxed bg-blue-50/20 p-4 rounded-2xl border border-blue-100/30">
              Definamos cómo opera su negocio y qué vende exactamente. Esto ayudará a estructurar workflows óptimos de entrega y embudos de alta conversión.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Descripción y Propuesta de Valor única *
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={onChange}
                  rows={3}
                  placeholder="Describa el problema clave que soluciona y por qué es mejor que la competencia..."
                  className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 px-3 text-slate-900 outline-none transition resize-none"
                />
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  * Es el núcleo argumental para redactar su Elevator Pitch ejecutivo y calibrar el ángulo diferencial ante competidores.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Producto o Servicio Estrella *
                </label>
                <div className="relative">
                  <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="productoEstrella"
                    value={formData.productoEstrella}
                    onChange={onChange}
                    placeholder="Ej. Consultoría Elite, Vestido Novia a Medida"
                    className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  * Concentraremos toda la fuerza comercial y el diseño de fases tácticas exclusivamente en acelerar las ventas de esta oferta de alta rentabilidad.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Tamaño de Equipo / Capacidad
                  </label>
                  <CustomSelect
                    name="tamanoEquipo"
                    value={formData.tamanoEquipo}
                    onChange={onChange as any}
                    options={[
                      { value: "Solo yo (Autoempleado)", label: "Solo yo (Autoempleado)" },
                      { value: "Pequeño (2-5 personas)", label: "Pequeño (2-5 personas)" },
                      { value: "Mediano (6-15 personas)", label: "Mediano (6-15 personas)" },
                      { value: "Estructurado (+15 personas)", label: "Estructurado (+15 personas)" }
                    ]}
                  />
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    * Permite adaptar la carga operativa sugerida para que los protocolos de venta y CRM no desborden la capacidad de su equipo real.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Herramientas Tecnológicas / CRM
                  </label>
                  <div className="relative">
                    <Database className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="herramientasActuales"
                      value={formData.herramientasActuales}
                      onChange={onChange}
                      placeholder="Ej. HubSpot, WhatsApp, Excel, etc."
                      className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    * Ayuda a identificar integraciones y vacíos tecnológicos de automatización de speed-to-lead y nutrición de prospectos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {wizardStep === 3 && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-xs text-slate-500 leading-relaxed bg-blue-50/20 p-4 rounded-2xl border border-blue-100/30">
              Los números mandan. Al ingresar los unit economics reales de su operación, estructuraremos la viabilidad de su CAC y el margen de retorno mínimo aceptable.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Facturación Promedio Mensual *
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="facturacion"
                      value={formData.facturacion}
                      onChange={onChange}
                      placeholder="Ej. 10,000 USD"
                      className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    * Establece la línea base financiera para contrastar de manera realista con sus objetivos de crecimiento comercial.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Ticket Promedio por Venta *
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="ticketPromedio"
                      value={formData.ticketPromedio}
                      onChange={onChange}
                      placeholder="Ej. 500 USD"
                      className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    * Determina de manera matemática los límites del Costo de Adquisición de Leads (CAC) y el Retorno de Pauta Publicitaria (ROAS) sugerido.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Margen de Utilidad Neto (%) *
                  </label>
                  <div className="relative">
                    <Coins className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="margenUtilidad"
                      value={formData.margenUtilidad}
                      onChange={onChange}
                      placeholder="Ej. 35%"
                      className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    * Permite calibrar la rentabilidad neta real de las operaciones y asegurar fondos suficientes para reinversión sin poner en riesgo la caja.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Presupuesto Mensual de Marketing *
                  </label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="presupuesto"
                      value={formData.presupuesto}
                      onChange={onChange}
                      placeholder="Ej. 1,000 USD"
                      className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    * Claude distribuirá exactamente este presupuesto en campañas específicas de captación, retargeting y remarketing.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Canales de Tráfico Actuales
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="canalesActuales"
                    value={formData.canalesActuales}
                    onChange={onChange}
                    placeholder="Ej. Boca a boca, Instagram orgánico, Meta Ads"
                    className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  * Identifica qué canales ya están validados para enfocar las optimizaciones orgánicas o de pauta sin empezar de cero.
                </p>
              </div>

              {/* ¿Inversión previa en Ads? */}
              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-3">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  ¿Ha invertido en Publicidad Paga (Ads) anteriormente? *
                </label>
                <div className="flex gap-6 pt-1">
                  <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="invertidoEnAds"
                      value="Sí"
                      checked={formData.invertidoEnAds === "Sí"}
                      onChange={onChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    Sí, he invertido antes
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                    <input
                      type="radio"
                      name="invertidoEnAds"
                      value="No"
                      checked={formData.invertidoEnAds !== "Sí"}
                      onChange={onChange}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    No, nunca he invertido
                  </label>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  * Nos ayuda a diagnosticar su nivel de madurez publicitaria y adaptar las recomendaciones estratégicas de pauta.
                </p>
              </div>

              {formData.invertidoEnAds === "Sí" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-blue-50/25 border border-blue-100/40 space-y-2">
                    <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                      ¿Cuánto ha invertido (Monto / Mensual aproximado)? *
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-blue-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="montoInvertidoEnAds"
                        value={formData.montoInvertidoEnAds || ""}
                        onChange={onChange}
                        placeholder="Ej. 500 USD/mes o 3,000 USD total"
                        className="w-full text-xs bg-white border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                      />
                    </div>
                    <p className="text-[9px] text-blue-600 leading-relaxed italic">
                      * El presupuesto estimativo que ha invertido anteriormente en Ads.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/25 border border-blue-100/40 space-y-2">
                    <label className="block text-[10px] font-bold text-blue-800 uppercase tracking-wider">
                      ¿En qué plataformas publicitarias? *
                    </label>
                    <div className="relative">
                      <Globe className="w-4 h-4 text-blue-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="plataformasAds"
                        value={formData.plataformasAds || ""}
                        onChange={onChange}
                        placeholder="Ej. Meta Ads (FB/IG), Google Search, TikTok Ads"
                        className="w-full text-xs bg-white border border-blue-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                      />
                    </div>
                    <p className="text-[9px] text-blue-600 leading-relaxed italic">
                      * Canales publicitarios digitales en los que ha corrido pauta.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {wizardStep === 4 && (
          <div className="space-y-5 animate-fade-in">
            <p className="text-xs text-slate-500 leading-relaxed bg-blue-50/20 p-4 rounded-2xl border border-blue-100/30">
              Establezcamos la brújula táctica. Al definir qué obstaculiza su crecimiento y cuál es la meta, Claude construirá las palancas de acción prioritarias.
            </p>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Meta de Crecimiento Principal *
                </label>
                <div className="relative">
                  <Target className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="metaPrincipal"
                    value={formData.metaPrincipal}
                    onChange={onChange}
                    placeholder="Ej. Duplicar facturación de servicios consultivos"
                    className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  * La estrella del norte de su plan estratégico: toda fase táctica y campaña se diseñará para alcanzar esta meta.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Plazo Requerido Plan
                  </label>
                  <CustomSelect
                    name="plazoMeta"
                    value={formData.plazoMeta}
                    onChange={onChange as any}
                    options={[
                      { value: "3 meses", label: "3 meses (Táctico / Corto Plazo)" },
                      { value: "6 meses", label: "6 meses (Alineación Comercial)" },
                      { value: "12 meses", label: "12 meses (Escalado de Operaciones)" }
                    ]}
                  />
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    * Define el ritmo del cronograma de metas SMART mensuales y el plan de acción táctico.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                    Público Objetivo Detallado *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="publicoObjetivo"
                      value={formData.publicoObjetivo}
                      onChange={onChange}
                      placeholder="Ej. Dueños de marcas ecommerce en Latam"
                      className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    * Permite redactar copys de alta relevancia adaptados al perfil del avatar y estructurar el embudo orgánico TOFU/MOFU/BOFU.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Cuello de Botella o Freno Actual *
                </label>
                <div className="relative">
                  <AlertTriangle className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="obstaculo"
                    value={formData.obstaculo}
                    onChange={onChange}
                    placeholder="Ej. Falta de tráfico cualificado, no sé vender high ticket"
                    className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  * El obstáculo de crecimiento que el plan de contingencia corporativo y los protocolos CRM disolverán activamente.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-2">
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Competidores Conocidos (Opcional)
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    name="competidores"
                    value={formData.competidores}
                    onChange={onChange}
                    placeholder="Ej. MarcaLocalX.com, Acme S.A."
                    className="w-full text-xs bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 outline-none transition"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">
                  * Realizaremos búsquedas web activas en tiempo real de estos rivales para mapear su estrategia, precios y vulnerabilidades digitales.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Footer Navigation Actions */}
      <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
        {wizardStep > 1 ? (
          <button
            type="button"
            onClick={() => setWizardStep(prev => prev - 1)}
            className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </button>
        ) : (
          <div />
        )}

        {wizardStep < 4 ? (
          <button
            type="button"
            onClick={() => {
              if (isStepValid(wizardStep)) {
                setWizardStep(prev => prev + 1);
              } else {
                triggerToast("Por favor complete los campos obligatorios (*) para continuar.", "error");
              }
            }}
            className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/10 ml-auto cursor-pointer"
          >
            Siguiente
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onGenerate}
            disabled={!isFormValid() || isGenerating}
            className={`flex items-center gap-2.5 py-3 px-6 rounded-xl font-display text-xs font-bold uppercase tracking-wide transition shadow-lg ${
              !isFormValid() || isGenerating
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            Iniciar Redacción Estratégica
          </button>
        )}
      </div>
    </div>
  );
};
