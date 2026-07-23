// Prompts for Scaling Strategy Generator

export interface RedesImagen {
  name: string;
  base64: string;
  mediaType: string;
}

export interface FormData {
  nombreNegocio: string;
  rubro: string;
  tipoModelo: string; // B2B, B2C, Ecommerce, Local, SaaS, etc.
  descripcion: string;
  productoEstrella: string; // Main high-margin or star product/service
  ubicacion: string;
  publicoObjetivo: string;
  sitioWeb?: string;
  redesImagenes?: RedesImagen[];
  facturacion: string;
  ticketPromedio: string;
  margenUtilidad: string; // Profit margin percentage (e.g. 30%)
  presupuesto: string;
  canalesActuales: string;
  metaPrincipal: string;
  plazoMeta: string;
  competidores?: string;
  obstaculo: string;
  tamanoEquipo: string; // Team size and capacity
  herramientasActuales: string; // CRM, Email marketing tools, etc.
  invertidoEnAds?: string; // "Sí" | "No"
  montoInvertidoEnAds?: string;
  plataformasAds?: string;
}

export const SECTIONS_CONFIG = [
  {
    id: "diagnostico",
    name: "1. Diagnóstico y Ángulo Estratégico",
    prompt: (data: FormData): string => `
Eres el Consultor Principal de Crecimiento de Scaling Strategy. Tu misión es diseñar la primera sección de una estrategia de negocios y marketing altamente personalizada y profesional para el siguiente negocio:

**Información del Negocio:**
- Nombre: ${data.nombreNegocio}
- Rubro/Industria: ${data.rubro}
- Modelo de Negocio: ${data.tipoModelo}
- Descripción y Propuesta de Valor: ${data.descripcion}
- Producto/Servicio Estrella (Alto Margen): ${data.productoEstrella}
- Ubicación/Mercado Objetivo: ${data.ubicacion}
- Público Objetivo Detallado: ${data.publicoObjetivo}
${data.sitioWeb ? `- Presencia Digital Base: ${data.sitioWeb}` : ""}

**Datos Financieros, Operativos y Canales:**
- Facturación Mensual Promedio: ${data.facturacion}
- Ticket Promedio: ${data.ticketPromedio}
- Margen de Utilidad Estimado: ${data.margenUtilidad}
- Presupuesto Mensual para Crecimiento: ${data.presupuesto}
- Canales de Marketing y Venta Actuales: ${data.canalesActuales}
- Capacidad de Operación / Equipo: ${data.tamanoEquipo}
- Herramientas Tecnológicas / CRM Actuales: ${data.herramientasActuales}
- ¿Inversión previa en publicidad paga (Ads)?: ${data.invertidoEnAds || "No declarado"}
${data.invertidoEnAds === "Sí" ? `- Presupuesto invertido anteriormente en Ads: ${data.montoInvertidoEnAds || "No especificado"}\n- Plataformas de Ads utilizadas: ${data.plataformasAds || "No especificado"}` : ""}

**Objetivos y Desafíos:**
- Meta Principal a alcanzar: ${data.metaPrincipal}
- Plazo de la Meta: ${data.plazoMeta}
- Mayor Obstáculo Percibido: ${data.obstaculo}

---

**TAREA:**
Redacta la sección **1. Diagnóstico y Ángulo Estratégico**.
Debe ser un análisis corporativo profundo, perspicaz, consultivo y con rigor analítico. Evita generalidades y usa jerga de consultoría premium (growth loops, LTV, CAC, fricción en conversión, unit economics, etc.).

Estructura tu respuesta exactamente con los siguientes títulos usando markdown:

## 1. Diagnóstico y Ángulo Estratégico

### 1.1. Diagnóstico de la Situación Actual y Unit Economics
(Analiza críticamente su situación actual, la viabilidad de sus números basándote en su facturación [${data.facturacion}], ticket promedio [${data.ticketPromedio}] y margen de utilidad de [${data.margenUtilidad}]. Explica detalladamente cómo su mayor obstáculo [${data.obstaculo}] está frenando el escalado).

### 1.2. Cuello de Botella en el Embudo de Ventas
(Identifica el punto exacto de fricción en su embudo operativo, comercial o de marketing con base en su capacidad de equipo [${data.tamanoEquipo}] y su ecosistema tecnológico [${data.herramientasActuales}]: ¿es captación de tráfico, tasa de cierre comercial, retención, recurrencia, o velocidad de venta?).

### 1.3. El Ángulo Estratégico de Escalado
(Presenta una "hipótesis de escalado" o palanca de crecimiento única para ${data.nombreNegocio}. No hables de cosas genéricas como "hacer redes sociales". Diseña una táctica o enfoque específico disruptivo que potencie su producto estrella [${data.productoEstrella}] y deba guiar todo el plan estratégico).

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
  },
  {
    id: "comparativa",
    name: "2. Comparativa de Mercado (Búsqueda Web)",
    prompt: (data: FormData, previousContent: string): string => `
Eres el Consultor de Inteligencia Competitiva de Scaling Strategy. Tu misión es redactar la sección **2. Comparativa de Mercado** para el negocio **${data.nombreNegocio}** en el rubro **${data.rubro}**, ubicado en **${data.ubicacion}**.

Usa la herramienta "web_search" para buscar 3 competidores reales del mismo rubro en la misma zona geográfica o mercado (si el usuario ingresó competidores en la lista: [${data.competidores || "Ninguno proveído, busca competidores locales o globales de la industria"}], prioriza buscar y analizar esos).

**Presencia Digital del Negocio:**
${data.sitioWeb ? `- Sitio Web / Red Social: ${data.sitioWeb}` : "No proveído."}
- Propuesta de Valor: ${data.descripcion}
- Producto Estrella: ${data.productoEstrella}

**Contexto del Diagnóstico Anterior:**
${previousContent}

---

**TAREA:**
Realiza una búsqueda real en internet de los competidores o de la industria en la zona/mercado objetivo.
Genera la sección utilizando markdown. Si no encuentras presencia digital real de competidores específicos en la zona, analiza el estándar competitivo de la industria y descríbelo con rigor (no inventes URLs ni datos ficticios).

Si se te adjuntaron una o más imágenes de capturas de redes sociales del propio negocio, analízalas directamente: describe qué comunican (bio, tipo de contenido, frecuencia aparente, estética, seguidores si son visibles) y úsalas como "### Nuestra presencia actual" antes de listar los competidores encontrados. NO inventes datos que no se vean en la imagen — si algo no es visible o legible, dilo. Si no se adjuntó ninguna imagen, omite ese sub-bloque por completo.

Estructura tu respuesta exactamente con los siguientes títulos usando markdown:

## 2. Comparativa de Mercado

### Nuestra presencia actual
(Solo si se adjuntaron capturas de redes sociales del negocio: describe qué comunican [bio, tipo de contenido, frecuencia aparente, estética, seguidores si son visibles]. NO inventes datos que no se vean en la imagen — si algo no es visible o legible, dilo. Si no se adjuntó ninguna imagen, OMITE esta sub-sección por completo).

### 2.1. Análisis del Entorno Competitivo Real
(Lista 3 competidores reales identificados en la búsqueda con sus nombres comerciales y presencia en internet. Describe brevemente el panorama general).

### 2.2. Desglose de Competidores (Benchmarking Directo)
Para cada uno de los 3 competidores encontrados:
- **Competidor [Nombre]:**
  - **Qué hace bien:** (Estrategia digital, servicio, propuesta, canales de venta, precios).
  - **Qué hace mal o carece:** (Falta de optimización, lentitud de respuesta, debilidades en su propuesta de valor en comparación con el producto estrella de nuestro cliente [${data.productoEstrella}]).
  - **Recomendación de Diferenciación:** (Indica "Estrategia de Emulación" para lo que funciona o "Estrategia de Disrupción" para atacar sus debilidades, detallando el qué y cómo).

### 2.3. Comparación y Ventaja Competitiva de ${data.nombreNegocio}
(Compara la presencia de ${data.nombreNegocio} [${data.sitioWeb || "sin canal web declarado"}] con el estándar de estos competidores y define el diferencial insuperable del producto estrella [${data.productoEstrella}]).

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
  },
  {
    id: "objetivos",
    name: "3. Objetivos y Posicionamiento",
    prompt: (data: FormData, previousContent: string): string => `
Eres el Director de Estrategia de Scaling Strategy. Tu misión es redactar la sección **3. Objetivos y Posicionamiento** para **${data.nombreNegocio}**, basándote en el diagnóstico de crecimiento y la comparativa de mercado previa.

**Meta Principal del Cliente:** ${data.metaPrincipal} (Plazo: ${data.plazoMeta})
- Producto Estrella: ${data.productoEstrella}
- Modelo de Negocio: ${data.tipoModelo}

**Historial de la Estrategia:**
${previousContent}

---

**TAREA:**
Genera objetivos SMART de nivel corporativo sumamente precisos y el posicionamiento de mercado único que asumirá la marca para lograr la meta en el plazo de ${data.plazoMeta}.

Estructura tu respuesta exactamente con los siguientes títulos usando markdown:

## 3. Objetivos y Posicionamiento

### 3.1. Objetivos SMART Corporativos (Específicos, Medibles, Alcanzables, Relevantes y con Plazo)
(Establece exactamente 3 objetivos numéricos específicos basados en su meta principal [${data.metaPrincipal}]. Cada objetivo debe detallar: Métrica clave de negocio, número a lograr, frecuencia de revisión y plazo. Vincula esto directamente con su facturación mensual [${data.facturacion}], presupuesto [${data.presupuesto}], y margen de utilidad [${data.margenUtilidad}]).

### 3.2. Declaración de Posicionamiento Competitivo Invicto
(Redacta una declaración formal de posicionamiento en el mercado usando la fórmula: "Para [Público Objetivo: ${data.publicoObjetivo}], ${data.nombreNegocio} es el [Categoría de Rubro: ${data.rubro}] que [Propuesta Única de Valor centrada en ${data.productoEstrella}], porque a diferencia de [Competidores de la industria], nosotros [Factor de Diferenciación Radical]").

### 3.3. Pilares de Comunicación y Conversión
(Define 3 pilares temáticos de comunicación sumamente persuasivos sobre los que se construirá toda la estrategia de contenido, pauta publicitaria y guiones de venta).

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
  },
  {
    id: "plan",
    name: "4. Plan de Acción por Fases",
    prompt: (data: FormData, previousContent: string): string => `
Eres el Director de Operaciones de Scaling Strategy. Tu misión es redactar la sección **4. Plan de Acción por Fases** para **${data.nombreNegocio}** en un plazo de ${data.plazoMeta}.

**Capacidad del Equipo:** ${data.tamanoEquipo}
**Herramientas Tecnológicas a Utilizar:** ${data.herramientasActuales}

**Historial de la Estrategia:**
${previousContent}

---

**TAREA:**
Crea un plan táctico de ejecución adaptado a la capacidad del equipo [${data.tamanoEquipo}] y dividido en 3 fases temporales concretas:
- **Fase 1: Mes 1 (Cimientos, Automatización y Configuración Tecnológica)**
- **Fase 2: Meses 2-3 (Tracción, Lanzamiento de Embudos e Inyección de Leads)**
- **Fase 3: Meses 4-6 (Escalamiento, Retención y Optimización de Márgenes)**

*Nota: Ajusta los meses si el plazo del cliente [${data.plazoMeta}] es más corto o específico, pero mantén las 3 fases bien estructuradas.*

Cada fase debe contener acciones **numeradas**. Cada acción debe ser ultra-accionable y responder strictly a:
1. **QUÉ HACER** (En imperativo directo, ej: "Implementar", "Configurar", "Automatizar").
2. **CÓMO HACERLO** (Especificando canales, automatizaciones de CRM, herramientas [${data.herramientasActuales}] o asignación del equipo [${data.tamanoEquipo}]).
3. **CÓMO SE MIDE** (KPI específico, meta numérica del KPI, frecuencia de control).

Estructura tu respuesta exactamente con los siguientes títulos usando markdown:

## 4. Plan de Acción por Fases

### 4.1. Fase 1: Cimientos y Configuración Crítica (Mes 1)
(Acciones numeradas con QUÉ, CÓMO y CÓMO SE MIDE).

### 4.2. Fase 2: Tracción, Captación y Embudo Activo (Meses 2-3)
(Acciones numeradas con QUÉ, CÓMO y CÓMO SE MIDE).

### 4.3. Fase 3: Escalamiento y Optimización del Retorno (Meses 4-6)
(Acciones numeradas con QUÉ, CÓMO y CÓMO SE MIDE).

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
  },
  {
    id: "campanas",
    name: "5. Campañas Recomendadas",
    prompt: (data: FormData, previousContent: string): string => `
Eres el Growth Hacker y Media Buyer Principal de Scaling Strategy. Tu misión es diseñar la sección **5. Campañas Recomendadas** para **${data.nombreNegocio}** con un presupuesto de marketing disponible de **${data.presupuesto}**.

**Modelo de Negocio:** ${data.tipoModelo}
**Producto Estrella a Promover:** ${data.productoEstrella}
**Historial de Inversión en Publicidad (Ads):**
- ¿Ha invertido en Ads antes?: ${data.invertidoEnAds || "No declarado"}
${data.invertidoEnAds === "Sí" ? `- Presupuesto mensual de Ads anterior: ${data.montoInvertidoEnAds || "No especificado"}\n- Plataformas de Ads previas: ${data.plataformasAds || "No especificado"}` : ""}

**Historial de la Estrategia:**
${previousContent}

---

**TAREA:**
Propón exactamente 2 o 3 campañas hiper-específicas de adquisición pagada u orgánica. Cada campaña debe encajar estrictamente dentro de la siguiente taxonomía fija:
- **Captación** (Adquisición de leads o tráfico frío)
- **Conversión/Remarketing** (Cierre de ventas o leads de alta intención)
- **Autoridad/Posicionamiento** (Generación de marca y educación de mercado)
- **Reactivación** (Venta cruzada o reactivación de clientes antiguos)
- **Lanzamiento** (Para un nuevo producto o promoción estacional)

Para cada campaña propuesta, debes estructurar los detalles de forma exhaustiva y corporativa, usando la terminología REAL de Meta Ads Manager (no la generalices ni la traduzcas):

- **Nombre de Campaña e Industria:** (ej. Captación de Leads para ${data.nombreNegocio})
- **Taxonomía:** (Debe ser una de las 5 opciones de arriba)
- **Objetivo de campaña (Meta Ads Manager):** uno exacto de estos — Reconocimiento / Tráfico / Interacción / Clientes potenciales / Ventas / Promoción de la app. No uses "marketing digital" genérico, elige el objetivo real que se selecciona en la plataforma.
- **Plataformas de Distribución:** (Meta Ads, Google Search, LinkedIn Ads, TikTok, etc. — si es Meta Ads, sé específico en el siguiente punto)
- **Ubicaciones (si es Meta Ads):** recomienda "Ubicaciones Advantage+ (automáticas)" si el negocio es pequeño o nuevo en pauta — es lo más eficiente hoy para la mayoría. Si hay una razón concreta para restringir, especifica cuáles (Feed de Instagram, Stories, Reels, Facebook Feed).
- **Público / Segmentación:** si el negocio tiene poca data histórica de píxel o de clientes (revisa el historial de inversión en Ads ya declarado), recomienda "Audiencia Advantage+ (amplia, que Meta optimice)". Si hay razón para segmentar manualmente, especifica edad, género, ubicación geográfica e intereses/comportamientos concretos y específicos a ${data.publicoObjetivo} — nunca "personas interesadas en marketing" genérico.
- **Formato del anuncio:** uno de — Imagen única / Carrusel / Video o Reel / Colección. Justifica la elección según el objetivo y ${data.productoEstrella}.
- **Dirección creativa (qué grabar o fotografiar):** descripción concreta y específica a este negocio — no "una foto del producto". Ejemplo del nivel de detalle esperado: "video de 15 segundos mostrando [proceso específico del negocio], grabado desde [ángulo], con [detalle que genere confianza]".
- **Ángulo del Mensaje y Copys sugeridos:** (qué duda, dolor, deseo u objeción ataca — enfoque de dolor y ganchos persuasivos para vender ${data.productoEstrella}, con una línea de ejemplo de gancho real, no una plantilla vacía)
- **Botón de CTA:** uno real de Meta Ads Manager — Enviar mensaje / Comprar ahora / Más información / Registrarte / Contactarnos / Llamar ahora. Elige el más natural para este negocio y este objetivo.
- **Presupuesto Asignado:** (Distribución exacta del presupuesto mensual de ${data.presupuesto})
- **Duración Estimada:**
- **KPI Primario de Campaña:**
- **Regla de Decisión Operativa:** (ej. "Si el Costo por Lead supera los X USD, reasignar 20% del presupuesto al Ad Set B")

Estructura tu respuesta exactamente con los siguientes títulos usando markdown:

## 5. Campañas Recomendadas

### 5.1. Campaña 1: [Nombre de Campaña]
(Ficha técnica completa y detallada usando viñetas).

### 5.2. Campaña 2: [Nombre de Campaña]
(Ficha técnica completa y detallada usando viñetas).

### 5.3. Campaña 3 (Opcional): [Nombre de Campaña]
(Ficha técnica completa o justificación de por qué concentrar todo el presupuesto [${data.presupuesto}] en solo 2 campañas para evitar la dispersión de recursos y optimizar el Retorno de Inversión).

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
  },
  {
    id: "calendario",
    name: "6. Calendario de Contenido y Estructuras",
    prompt: (data: FormData, previousContent: string): string => `
Eres el Director Creativo y Copywriter de Scaling Strategy. Tu misión es redactar la sección **6. Calendario de Contenido y Estructuras** para la marca **${data.nombreNegocio}**.

**Público Objetivo:** ${data.publicoObjetivo}
**Producto Estrella:** ${data.productoEstrella}

**Historial de la Estrategia:**
${previousContent}

---

**TAREA:**
Diseña la estrategia de contenidos orgánicos para redes sociales o canales propios. Debes basarte en una distribución estratégica de contenidos por embudo de marketing (TOFU / MOFU / BOFU) con una proporción base de **60% TOFU, 25% MOFU y 15% BOFU**.

Además, debes formular exactamente **6 piezas de contenido concretas** para las primeras 2 semanas de ejecución del plan, detallando formato, gancho (hook), estructura del desarrollo, llamado a la acción (CTA) y pilar de comunicación al que responde.

Estructura tu respuesta exactamente con los siguientes títulos usando markdown:

## 6. Calendario de Contenido y Estructuras

### 6.1. Matriz de Distribución de Contenido (Embudo Orgánico)
(Explica la estrategia de embudo orgánico para ${data.nombreNegocio} con la distribución 60% TOFU [Atracción masiva], 25% MOFU [Nutrición y autoridad], y 15% BOFU [Conversión directa sobre ${data.productoEstrella}]).

### 6.2. Parrilla de 6 Piezas de Contenido Críticas (Primeras 2 Semanas)
Detalla exactamente 6 piezas reales de contenido. Indenta cada sub-punto con 2 espacios antes del guion, para mantener la jerarquía visual:
- **Pieza 1 (TOFU - Atracción):**
  - **Canal/Plataforma:**
  - **Formato:** (ej. Video corto/Reel, carrusel, newsletter, etc.)
  - **Gancho (Hook):** (La frase o visual exacto de los primeros 3 segundos)
  - **Estructura/Desarrollo:** (Paso a paso del cuerpo de la pieza)
  - **Llamado a la Acción (CTA):**
  - **Pilar Temático:**
- (Repite esta estructura exacta para las Piezas 2 a 6, asegurándote de indentar cada sub-punto con 2 espacios antes del guion. Incluye 3 piezas TOFU, 2 MOFU y 1 BOFU para respetar los porcentajes).

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
  },
  {
    id: "sistema",
    name: "7. Sistema Comercial, KPIs y Riesgos",
    prompt: (data: FormData, previousContent: string): string => `
Eres el Director Comercial e Ingeniero de Procesos de Scaling Strategy. Tu misión es redactar la sección final: **7. Sistema Comercial, KPIs y Riesgos** para **${data.nombreNegocio}**.

**Capacidad del Equipo:** ${data.tamanoEquipo}
**Herramientas / CRM:** ${data.herramientasActuales}

**Historial de la Estrategia:**
${previousContent}

---

**TAREA:**
Define cómo el negocio procesará las oportunidades generadas en marketing, cómo medirá el éxito de manera integral y cómo mitigará los riesgos principales identificados (especialmente su obstáculo clave: [${data.obstaculo}]).

Estructura tu respuesta exactamente con los siguientes títulos usando markdown:

## 7. Sistema Comercial, KPIs y Riesgos

### 7.1. Sistema Comercial y Protocolo de Ventas
(Diseña el proceso de ventas posterior a la captación: velocidad de respuesta de leads, automatización de CRM [${data.herramientasActuales}], script inicial de contacto, seguimiento de cotizaciones y flujo de cierre adaptado al tamaño de equipo [${data.tamanoEquipo}]).

### 7.2. Cuadro de Mando de KPIs Integrales
(Establece un cuadro de métricas clave con metas exactas para medir el éxito del plan. Incluye: Clics/Tráfico, Leads generados, Clientes nuevos, Costo de Adquisición [CAC] esperado, Valor de Vida de Cliente [LTV] proyectado, y Retorno de Inversión publicitaria [ROAS]).

### 7.3. Gestión de Riesgos y Mitigación del Mayor Obstáculo [${data.obstaculo}]
(Presenta un plan de contingencia de 2 puntos para el mayor obstáculo del cliente: [${data.obstaculo}]. Agrega una regla de contingencia financiera en caso de que las campañas tarden en traccionar para proteger el flujo de caja del negocio).

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
  }
];

export const SUMMARY_PROMPT = (data: FormData, allSectionsText: string): string => `
Eres el Socio Director de Scaling Strategy. Has revisado la estrategia de negocios y marketing completa generada para **${data.nombreNegocio}** en el rubro **${data.rubro}**.

**Estrategia Completa Generada:**
${allSectionsText}

---

**TAREA:**
Redacta un **Resumen Ejecutivo** estratégico, inspirador, sumamente profesional y denso en valor de exactamente **4 a 6 líneas de texto**.
Debe capturar la esencia del diagnóstico estratégico, la gran palanca de crecimiento identificada para potenciar su producto estrella [${data.productoEstrella}], el canal clave que traerá retorno rápido y el impacto financiero esperado en el negocio.

**REGLAS:**
- Debe ser un solo párrafo de entre 4 y 6 líneas.
- Comienza directamente con el texto del resumen, sin preámbulos como "Aquí está el resumen..." o títulos adicionales.
- Usa markdown para destacar conceptos en **negrita**.
- Escríbelo con un tono de consultoría premium de Scaling Strategy.

Antes de responder, verifica: ¿este resumen menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbelo para que sí.
`;

export interface StrategySection {
  id: string;
  name: string;
  prompt: (data: FormData, previousContent: string) => string;
}

export const getSectionsForStrategy = (strategyId: string, data: FormData): StrategySection[] => {
  switch (strategyId) {
    case "contenido":
      return [
        {
          id: "diagnostico_org",
          name: "1. Diagnóstico Inbound y Pilares de Mensaje",
          prompt: (data: FormData): string => `
Eres el Director de Estrategia de Contenidos de Scaling Strategy.
Analiza el posicionamiento orgánico actual de **${data.nombreNegocio}** en el rubro de **${data.rubro}**.
Describe 3 pilares de comunicación estratégicos dirigidos a **${data.publicoObjetivo}** para potenciar el producto estrella **${data.productoEstrella}**.
Estructura tu respuesta con títulos markdown:
## 1. Diagnóstico Inbound y Pilares de Mensaje
### 1.1. Análisis de Visibilidad Orgánica Actual
### 1.2. Tres Pilares de Contenido Estratégicos
### 1.3. Conexión de Mensaje con el Dolor del Cliente ideal (${data.publicoObjetivo})

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        },
        {
          id: "matriz_org",
          name: "2. Matriz de Distribución de Contenido (TOFU, MOFU, BOFU)",
          prompt: (data: FormData, previousContent: string): string => `
Eres el Director Creativo de Scaling Strategy.
Diseña la matriz de distribución con la proporción estratégica: 60% TOFU (Atracción Masiva), 25% MOFU (Nutrición y Autoridad) y 15% BOFU (Conversión sobre ${data.productoEstrella}).
Basado en el diagnóstico previo:
${previousContent}

Estructura tu respuesta con títulos markdown:
## 2. Matriz de Distribución de Contenido
### 2.1. Estrategia de Embudo Orgánico (60/25/15)
### 2.2. Flujo de Nutrición Inbound
### 2.3. Acciones de Conversión Orgánica

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        },
        {
          id: "calendario_org",
          name: "3. Parrilla de 6 Piezas de Contenido Críticas (Primeras 2 Semanas)",
          prompt: (data: FormData, previousContent: string): string => `
Eres el Copywriter Principal de Scaling Strategy.
Crea exactamente 6 piezas reales de contenido detallando canal, formato (Video/Carrusel/Post), gancho (Hook) persuasivo de 3 segundos, desarrollo y CTA fuerte para vender ${data.productoEstrella}.
Basado en el diagnóstico previo:
${previousContent}

Estructura tu respuesta con títulos markdown:
## 3. Parrilla de Contenido Práctica
### 3.1. 6 Piezas de Alto Rendimiento para ${data.nombreNegocio}
(Detalla cada una de las 6 piezas utilizando un formato de lista ordenado con sub-puntos indentados: Canal, Formato, Gancho, Estructura y CTA).

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        }
      ];

    case "pago":
      return [
        {
          id: "diagnostico_pago",
          name: "1. Diagnóstico de Presupuesto y Canales de Pauta",
          prompt: (data: FormData): string => `
Eres el Growth Hacker Principal de Scaling Strategy.
Analiza cómo distribuir óptimamente el presupuesto mensual de **${data.presupuesto}** para **${data.nombreNegocio}** en el rubro **${data.rubro}**.
Determina los canales clave (Meta Ads, Google Search, etc.) basándote en su público objetivo: **${data.publicoObjetivo}**.
Historial de Inversión en Publicidad (Ads):
- ¿Ha invertido en Ads antes?: ${data.invertidoEnAds || "No" }
${data.invertidoEnAds === "Sí" ? `- Presupuesto mensual invertido anteriormente: ${data.montoInvertidoEnAds || "No especificado"}\n- Plataformas de Ads utilizadas anteriormente: ${data.plataformasAds || "No especificado"}` : ""}

Estructura tu respuesta con títulos markdown:
## 1. Diagnóstico de Presupuesto y Canales
### 1.1. Análisis Financiero de Inversión de Pauta (${data.presupuesto})
### 1.2. Selección Crítica de Canales de Adquisición
### 1.3. Estimación de Costo por Lead (CPL) y CAC viable

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        },
        {
          id: "estructura_campanas",
          name: "2. Estructura de Campañas de Alto Impacto",
          prompt: (data: FormData, previousContent: string): string => `
Eres el Media Buyer de Scaling Strategy.
Diseña exactamente 2 campañas detalladas: una de Captación de Leads/Tráfico frío y otra de Conversión/Remarketing para promover el producto estrella **${data.productoEstrella}**.
Contexto previo:
${previousContent}

Estructura tu respuesta con títulos markdown:
## 2. Estructura de Campañas de Alto Impacto
### 2.1. Campaña de Captación de Leads (Tráfico Frío)
### 2.2. Campaña de Remarketing y Cierre (Conversión)

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        },
        {
          id: "matriz_creativos",
          name: "3. Directrices Creativas y Reglas de Optimización",
          prompt: (data: FormData, previousContent: string): string => `
Eres el Director de Optimización de Scaling Strategy.
Desarrolla las directrices de los anuncios (copys, ganchos visuales) y establece 2 reglas operativas específicas para detener anuncios o reasignar presupuesto mensual si el costo supera los límites.
Contexto previo:
${previousContent}

Estructura tu respuesta con títulos markdown:
## 3. Directrices Creativas y Reglas de Optimización
### 3.1. Ángulo Creativo y Ganchos de Copywriting
### 3.2. Reglas de Decisión Operativa (Optimización de Presupuesto)

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        }
      ];

    case "escalabilidad":
      return [
        {
          id: "auditoria_finance",
          name: "1. Auditoría de Unit Economics y Escalabilidad",
          prompt: (data: FormData): string => `
Eres el Consultor Financiero de Scaling Strategy.
Diagnostica críticamente la viabilidad de escalado de **${data.nombreNegocio}** basándote en la facturación de **${data.facturacion}**, ticket promedio de **${data.ticketPromedio}** y margen de utilidad estimado del **${data.margenUtilidad}**.
Explica cómo mitigar su mayor obstáculo: **${data.obstaculo}**.
Estructura tu respuesta con títulos markdown:
## 1. Auditoría Financiera y Unit Economics
### 1.1. Análisis Crítico de Rentabilidad y Escalado
### 1.2. Mapeo del Ratio LTV / CAC Proyectado
### 1.3. Erradicación del Cuello de Botella Financiero (${data.obstaculo})

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        },
        {
          id: "metas_smart",
          name: "2. Objetivos SMART y Metas de Crecimiento",
          prompt: (data: FormData, previousContent: string): string => `
Eres el Socio Director de Scaling Strategy.
Establece exactamente 3 objetivos numéricos SMART corporativos específicos orientados a lograr su meta principal: **${data.metaPrincipal}** en un plazo de **${data.plazoMeta}**.
Contexto previo:
${previousContent}

Estructura tu respuesta con títulos markdown:
## 2. Objetivos SMART y Metas de Crecimiento
### 2.1. Objetivos Financieros SMART Corporativos
### 2.2. Métricas Clave de Negocio (KPMs)

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        },
        {
          id: "plan_fases",
          name: "3. Plan de Acción Operativo por Fases",
          prompt: (data: FormData, previousContent: string): string => `
Eres el Director de Operaciones de Scaling Strategy.
Crea un plan táctico adaptado a un tamaño de equipo de **${data.tamanoEquipo}** dividido en 3 fases de tiempo concretas para liberar capacidad y automatizar operaciones en **${data.plazoMeta}**.
Contexto previo:
${previousContent}

Estructura tu respuesta con títulos markdown:
## 3. Plan de Acción Operativo por Fases
### 3.1. Fase 1: Cimientos y Optimización de Capacidad (Mes 1)
### 3.2. Fase 2: Automatización y Flujo Comercial Activo (Meses 2-3)
### 3.3. Fase 3: Escalamiento Rentable y Monitoreo (Meses 4-6)

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        }
      ];

    case "comercial":
      return [
        {
          id: "diagnostico_comercial",
          name: "1. Diagnóstico de Fricción Comercial y CRM",
          prompt: (data: FormData): string => `
Eres el Director de Operaciones Comerciales de Scaling Strategy.
Analiza la fricción en el proceso de ventas actual de **${data.nombreNegocio}** considerando el tamaño de su equipo (**${data.tamanoEquipo}**), herramientas actuales (**${data.herramientasActuales}**) y su mayor obstáculo (**${data.obstaculo}**).
Estructura tu respuesta con títulos markdown:
## 1. Diagnóstico de Fricción Comercial
### 1.1. Auditoría del Flujo Comercial y Fricciones
### 1.2. Evaluación de las Herramientas Actuales (${data.herramientasActuales})

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        },
        {
          id: "protocolo_ventas",
          name: "2. Protocolo de Ventas CRM y Velocidad de Respuesta",
          prompt: (data: FormData, previousContent: string): string => `
Eres el Consultor CRM de Scaling Strategy.
Diseña el protocolo comercial ideal para **${data.nombreNegocio}**: tiempos máximos de respuesta de leads, automatizaciones del CRM, flujos de nutrición y secuencia óptima de seguimiento de presupuestos.
Contexto previo:
${previousContent}

Estructura tu respuesta con títulos markdown:
## 2. Protocolo de Ventas y CRM
### 2.1. Reglas de Velocidad de Respuesta Comercial (Speed-to-Lead)
### 2.2. Secuencia Táctica de Seguimiento de Leads (Contacto 1 al 5)

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        },
        {
          id: "guion_ventas",
          name: "3. Guión Táctico y Manejo de Objeciones",
          prompt: (data: FormData, previousContent: string): string => `
Eres el Líder de Ventas de Scaling Strategy.
Redacta un script de contacto rápido y un protocolo para derribar las 3 objeciones principales que enfrentarán al vender el producto estrella: **${data.productoEstrella}**.
Contexto previo:
${previousContent}

Estructura tu respuesta con títulos markdown:
## 3. Guión Táctico y Manejo de Objeciones
### 3.1. Guión de Primer Contacto Telefónico / WhatsApp
### 3.2. Manual de Respuestas para derribar Objeciones Comunes

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        }
      ];

    case "copywriting":
      return [
        {
          id: "diagnostico_copy",
          name: "1. Diagnóstico Psicológico de Dolor y Deseo",
          prompt: (data: FormData): string => `
Eres el Copywriter Persuasivo Principal de Scaling Strategy.
Mapea el dolor más profundo, temores latentes y deseos de compra del público objetivo (**${data.publicoObjetivo}**) de **${data.nombreNegocio}** para posicionar el producto estrella **${data.productoEstrella}**.
Estructura tu respuesta con títulos markdown:
## 1. Diagnóstico Psicológico de Dolor y Deseo
### 1.1. El Dolor Primordial del Cliente Ideal (${data.publicoObjetivo})
### 1.2. Ángulos de Atracción y Deseos Latentes

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        },
        {
          id: "emails_pas",
          name: "2. Secuencia de Emails de Conversión (Framework PAS)",
          prompt: (data: FormData, previousContent: string): string => `
Eres el Copywriter de Respuesta Directa de Scaling Strategy.
Redacta una secuencia de exactamente 3 emails automatizados utilizando el framework PAS (Problema, Agitación, Solución) diseñada para captar el interés sobre **${data.productoEstrella}**.
Contexto previo:
${previousContent}

Estructura tu respuesta con títulos markdown:
## 2. Secuencia de Emails de Conversión PAS
### 2.1. Email 1: El Espejo del Dolor (Problema)
### 2.2. Email 2: La Consecuencia de la Inacción (Agitación)
### 2.3. Email 3: El Puente hacia la Libertad (Solución - ${data.productoEstrella})

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        },
        {
          id: "wireframe_landing",
          name: "3. Estructura y Copys para Landing Page de Alta Conversión",
          prompt: (data: FormData, previousContent: string): string => `
Eres el Conversion Rate Optimizer (CRO) de Scaling Strategy.
Diseña el wireframe de contenido para una Landing Page de alta conversión para **${data.nombreNegocio}**. Detalla títulos, subtítulos, beneficios, prueba social y el CTA idóneo.
Contexto previo:
${previousContent}

Estructura tu respuesta con títulos markdown:
## 3. Arquitectura de Landing Page
### 3.1. Estructura de Secciones Paso a Paso (CRO-friendly)
### 3.2. Copys Principales (Titular H1, Subtítulo H2 y Botón CTA)

Antes de responder, verifica: ¿esta sección menciona explícitamente el nombre del negocio, su rubro o una cifra que el usuario dio? Si no, reescríbela para que sí.
`
        }
      ];

    default: // "completa"
      return SECTIONS_CONFIG.map(sec => ({
        id: sec.id,
        name: sec.name,
        prompt: (d: FormData, prev: string) => sec.prompt(d, prev)
      }));
  }
};
