import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  HelpCircle, 
  Terminal, 
  Cpu, 
  ArrowRight, 
  Info, 
  MessageSquareCode,
  Layers
} from "lucide-react";
import { FormData } from "../utils/prompts";

interface AnthropicPromptExporterProps {
  formData: FormData;
}

type PromptType = "full_strategy" | "copywriting" | "funnel_ads" | "bottleneck_audit";

export const AnthropicPromptExporter: React.FC<AnthropicPromptExporterProps> = ({ formData }) => {
  const [selectedType, setSelectedType] = useState<PromptType>("full_strategy");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Generate XML and Prompt based on business data and selected intent
  const generatedPrompt = useMemo(() => {
    // Sanitizers
    const cleanWeb = formData.sitioWeb || "No especificado";
    const cleanComp = formData.competidores || "No especificado";

    // Build structured XML payload containing all entered data
    const xmlBusinessData = `<business_context>
  <profile>
    <business_name>${formData.nombreNegocio}</business_name>
    <industry>${formData.rubro}</industry>
    <business_model>${formData.tipoModelo}</business_model>
    <target_location>${formData.ubicacion}</target_location>
    <web_presence>${cleanWeb}</web_presence>
  </profile>
  
  <offering_and_audience>
    <core_description>${formData.descripcion}</core_description>
    <star_product_service>${formData.productoEstrella}</star_product_service>
    <target_audience>${formData.publicoObjetivo}</target_audience>
    <key_competitors>${cleanComp}</key_competitors>
  </offering_and_audience>
  
  <financials_and_marketing>
    <monthly_billing>${formData.facturacion}</monthly_billing>
    <average_ticket>${formData.ticketPromedio}</average_ticket>
    <profit_margin>${formData.margenUtilidad}</profit_margin>
    <marketing_budget>${formData.presupuesto}</marketing_budget>
    <current_marketing_channels>${formData.canalesActuales}</current_marketing_channels>
  </financials_and_marketing>
  
  <operations_and_goals>
    <primary_goal>${formData.metaPrincipal}</primary_goal>
    <timeframe>${formData.plazoMeta}</timeframe>
    <main_bottleneck>${formData.obstaculo}</main_bottleneck>
    <team_size_capacity>${formData.tamanoEquipo}</team_size_capacity>
    <current_tech_stack_tools>${formData.herramientasActuales}</current_tech_stack_tools>
  </operations_and_goals>
</business_context>`;

    // Objective prompt customization
    let objectiveInstructions = "";
    if (selectedType === "full_strategy") {
      objectiveInstructions = `Actúa como un Consultor de Negocios y Growth Hacker Elite especializado en escalar empresas de tipo ${formData.tipoModelo}. Analiza exhaustivamente el contexto en <business_context> y elabora un Plan Táctico de Crecimiento a 3 fases para cumplir la meta: "${formData.metaPrincipal}" en el plazo especificado. 

Por favor, estructura tu respuesta detalladamente con los siguientes puntos:
1. Análisis Crítico de Unit Economics: Revisa si el ticket de ${formData.ticketPromedio} y presupuesto de ${formData.presupuesto} sustentan un embudo rentable.
2. Ángulo de Mensaje Imparable: Redacta 3 propuestas únicas de valor enfocadas en el público objetivo.
3. Plan Táctico de 3 Fases: Detalla acciones, responsables, KPIs de control y herramientas por fase.`;
    } else if (selectedType === "copywriting") {
      objectiveInstructions = `Actúa como un Copywriter de Respuesta Directa de nivel mundial (estilo Dan Kennedy y Eugene Schwartz). Tu misión es tomar los datos de <business_context> y escribir piezas de copywriting de alta conversión para promocionar el producto estrella: "${formData.productoEstrella}".

Por favor, redacta el siguiente material:
1. Secuencia de Email Marketing (3 correos de nutrición y venta corta usando el framework PAS).
2. Estructura de Landing Page: Secciones detalladas de héroe, dolor, testimoniales simulados y llamado a la acción.
3. 3 Anuncios de Redes Sociales: 1 anuncio de imagen (carrusel) y 2 guiones de video corto de 30 segundos con ganchos disruptivos.`;
    } else if (selectedType === "funnel_ads") {
      objectiveInstructions = `Actúa como un Media Buyer y Director de Tráfico Pago certificado. Utilizando la información en <business_context>, diseña una Estrategia Completa de Publicidad Paga para captar clientes en ${formData.ubicacion} con un presupuesto de ${formData.presupuesto}.

Por favor, estructura la estrategia de la siguiente manera:
1. Estructura de Campañas (Meta Ads o Google Ads): Distribución de presupuesto en TOFU (Atracción), MOFU (Nutrición) y BOFU (Conversión).
2. Configuración de Segmentación: Intereses exactos, públicos similares y exclusiones sugeridas.
3. Matriz de Creativos: Describe los elementos visuales, copies y llamados a la acción necesarios para cada etapa del embudo.`;
    } else if (selectedType === "bottleneck_audit") {
      objectiveInstructions = `Actúa como un Auditor de Operaciones y Especialista en Eficiencia Corporativa. El principal obstáculo reportado por la empresa es: "${formData.obstaculo}". Analiza los datos de <business_context> y diagnostica este cuello de botella.

Por favor, proporciona:
1. Análisis de Raíz de Causa (Root Cause Analysis): Explica por qué ocurre este obstáculo según el tamaño del equipo (${formData.tamanoEquipo}) y sus herramientas (${formData.herramientasActuales}).
2. Protocolo de Mitigación de Emergencia: 5 acciones inmediatas que el equipo puede realizar esta semana para desbloquear la operación.
3. Recomendación de Stack Tecnológico Alternativo: Herramientas clave para automatizar tareas repetitivas y acelerar la velocidad del negocio.`;
    }

    // Final consolidated prompt structured for Anthropic (highly semantic markdown)
    return `Tu rol es el siguiente:
<role_definition>
${objectiveInstructions}
</role_definition>

Aquí tienes la información estructurada y completa de mi negocio:
${xmlBusinessData}

Por favor, entrega una respuesta extremadamente detallada, profesional, sin rodeos corporativos vacíos. Ve directo a las tácticas aplicables y el valor de negocio.`;
  }, [formData, selectedType]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in text-slate-800">
      
      {/* Cabecera */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-6 text-white text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 backdrop-blur rounded-xl border border-blue-400/30">
            <Cpu className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold tracking-tight">
              Exportador de Prompt Optimizado (Anthropic Claude)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 font-light">
              Estructura toda la data de tu onboarding en etiquetas XML semánticas para alimentar a Claude sin perder contexto.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6 text-left">
        
        {/* Selector de objetivo del prompt */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150/80 space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Selecciona el objetivo de tu consulta en Claude
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            <button
              onClick={() => setSelectedType("full_strategy")}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-24 cursor-pointer ${
                selectedType === "full_strategy"
                  ? "border-blue-600 bg-blue-50/50 text-blue-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="text-xs font-extrabold block">Plan Estratégico</span>
              <span className="text-[10px] text-slate-500 leading-tight block">Fases, KPIs y viabilidad de crecimiento integral.</span>
            </button>

            <button
              onClick={() => setSelectedType("copywriting")}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-24 cursor-pointer ${
                selectedType === "copywriting"
                  ? "border-blue-600 bg-blue-50/50 text-blue-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="text-xs font-extrabold block">Copywriting Elite</span>
              <span className="text-[10px] text-slate-500 leading-tight block">Correos PAS, anuncios y copy de landing pages.</span>
            </button>

            <button
              onClick={() => setSelectedType("funnel_ads")}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-24 cursor-pointer ${
                selectedType === "funnel_ads"
                  ? "border-blue-600 bg-blue-50/50 text-blue-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="text-xs font-extrabold block">Publicidad Paga</span>
              <span className="text-[10px] text-slate-500 leading-tight block">Meta & Google Ads, públicos y creativos.</span>
            </button>

            <button
              onClick={() => setSelectedType("bottleneck_audit")}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-24 cursor-pointer ${
                selectedType === "bottleneck_audit"
                  ? "border-blue-600 bg-blue-50/50 text-blue-900"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              <span className="text-xs font-extrabold block">Auditar Operaciones</span>
              <span className="text-[10px] text-slate-500 leading-tight block">Análisis de cuellos de botella y automatización.</span>
            </button>
          </div>
        </div>

        {/* Preview del Prompt XML */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. Vista Previa del Prompt Estructurado (XML)
              </span>
            </div>

            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer shadow-sm ${
                isCopied 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : "bg-blue-600 text-white border-blue-700 hover:bg-blue-700"
              }`}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  ¡Copiado Exitosamente!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-white/90" />
                  Copiar Prompt Completo
                </>
              )}
            </button>
          </div>

          <div className="relative rounded-2xl border border-slate-200 bg-slate-900 overflow-hidden">
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-850 flex justify-between items-center text-[10px] text-slate-400 font-mono">
              <span>ANTHROPIC_CLAUDE_PROMPT.md</span>
              <span>Optimizado para Claude 3.5 Sonnet</span>
            </div>
            
            <pre className="p-5 overflow-auto max-h-[320px] text-xs font-mono text-slate-300 leading-relaxed text-left whitespace-pre-wrap select-all">
              {generatedPrompt}
            </pre>
          </div>
          
          <p className="text-[10px] text-slate-400 italic font-light">
            * Haz un clic dentro de la caja de código o usa el botón de "Copiar" para llevarte todo el bloque formateado directamente a Claude u otro LLM.
          </p>
        </div>

        {/* Explicación Técnica de las etiquetas XML */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl flex gap-3 text-xs text-emerald-800">
            <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold mb-1">¿Por qué usar etiquetas XML con Anthropic?</h5>
              <p className="font-light leading-relaxed">
                Anthropic entrena sus modelos (Claude) específicamente para procesar bloques estructurados con etiquetas HTML/XML como <code className="bg-emerald-100/50 px-1 py-0.5 rounded font-mono font-bold text-[10px]">&lt;business_context&gt;</code>. Esto delimita la data y evita la alucinación de datos.
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50/40 border border-blue-100 rounded-2xl flex gap-3 text-xs text-blue-800">
            <MessageSquareCode className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h5 className="font-bold mb-1">Optimización de Tokens y Memoria</h5>
              <p className="font-light leading-relaxed">
                Al encapsular toda tu información una sola vez en este formato jerárquico, permites que el mecanismo de Prompt Caching de Anthropic recuerde tu negocio con mínimo consumo de tokens en conversaciones largas.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
