import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Users, 
  HelpCircle, 
  ArrowUpRight, 
  CheckCircle, 
  AlertTriangle, 
  Info 
} from "lucide-react";
import { FormData } from "../utils/prompts";

interface ROICalculatorProps {
  formData: FormData;
}

export const ROICalculator: React.FC<ROICalculatorProps> = ({ formData }) => {
  // Parse budget from form data if possible (e.g., "$1,500 USD" -> 1500)
  const initialBudget = useMemo(() => {
    if (!formData.presupuesto) return 1000;
    const num = parseInt(formData.presupuesto.replace(/[^0-9]/g, ""), 10);
    return isNaN(num) || num <= 0 ? 1000 : num;
  }, [formData.presupuesto]);

  // Inputs state
  const [ticket, setTicket] = useState<number>(150);
  const [margin, setMargin] = useState<number>(70); // % gross margin
  const [monthlyBudget, setMonthlyBudget] = useState<number>(initialBudget);
  const [cac, setCac] = useState<number>(50); // CAC in USD
  const [repurchaseRate, setRepurchaseRate] = useState<number>(3); // Purchases per year
  const [retentionYears, setRetentionYears] = useState<number>(2); // Customer lifespan in years

  // Interactive SVG chart hover index state
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Calculations
  const ltv = useMemo(() => {
    const grossLtv = ticket * repurchaseRate * retentionYears;
    return Math.round(grossLtv * (margin / 100));
  }, [ticket, repurchaseRate, retentionYears, margin]);

  const ltvCacRatio = useMemo(() => {
    if (cac <= 0) return 0;
    return parseFloat((ltv / cac).toFixed(2));
  }, [ltv, cac]);

  const monthlyAcquisitions = useMemo(() => {
    if (cac <= 0) return 0;
    return Math.floor(monthlyBudget / cac);
  }, [monthlyBudget, cac]);

  const paybackPeriodMonths = useMemo(() => {
    const marginPerPurchase = ticket * (margin / 100);
    if (marginPerPurchase <= 0) return 0;
    const purchasesToPayback = cac / marginPerPurchase;
    const purchasesPerMonth = repurchaseRate / 12;
    if (purchasesPerMonth <= 0) return 0;
    return parseFloat((purchasesToPayback / purchasesPerMonth).toFixed(1));
  }, [cac, ticket, margin, repurchaseRate]);

  // 12-Month Projections
  const chartData = useMemo(() => {
    const data = [];
    let cumulativeProfit = 0;
    const newCustomersPerMonth = monthlyAcquisitions;
    const monthlyRetentionRate = 1 - (1 / (retentionYears * 12));

    let activeCustomers = 0;

    for (let month = 1; month <= 12; month++) {
      activeCustomers = (activeCustomers * monthlyRetentionRate) + newCustomersPerMonth;
      const purchasesThisMonth = activeCustomers * (repurchaseRate / 12);
      const revenue = purchasesThisMonth * ticket;
      const grossProfit = revenue * (margin / 100);
      const netProfit = grossProfit - monthlyBudget;
      cumulativeProfit += netProfit;

      data.push({
        label: `Mes ${month}`,
        ingresos: Math.round(revenue),
        beneficioNeto: Math.round(cumulativeProfit),
      });
    }
    return data;
  }, [monthlyAcquisitions, ticket, margin, repurchaseRate, retentionYears, monthlyBudget]);

  const ratioStatus = useMemo(() => {
    if (ltvCacRatio >= 3) {
      return {
        label: "Excelente (Saludable)",
        color: "text-emerald-700 bg-emerald-50 border-emerald-200",
        icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
        desc: "Tu modelo de negocio es altamente rentable. Cada cliente captado genera al menos 3 veces lo que cuesta adquirirlo."
      };
    } else if (ltvCacRatio >= 1.5) {
      return {
        label: "Intermedio (Por Optimizar)",
        color: "text-amber-700 bg-amber-50 border-amber-200",
        icon: <Info className="w-5 h-5 text-amber-500" />,
        desc: "Tu negocio es viable, pero tienes márgenes ajustados o un CAC elevado. Intenta aumentar el valor del ticket medio o la frecuencia de recompra."
      };
    } else {
      return {
        label: "Crítico (Peligro)",
        color: "text-red-700 bg-red-50 border-red-200",
        icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
        desc: "Alerta de rentabilidad. Estás gastando casi lo mismo o más en captar al cliente de lo que este te devuelve a largo plazo."
      };
    }
  }, [ltvCacRatio]);

  // Generates native SVG points coordinates for the custom Area Chart
  const svgMetrics = useMemo(() => {
    const width = 500;
    const height = 180;
    const paddingLeft = 10;
    const paddingRight = 10;
    const paddingTop = 15;
    const paddingBottom = 15;

    const netProfits = chartData.map(d => d.beneficioNeto);
    const minVal = Math.min(0, ...netProfits);
    const maxVal = Math.max(100, ...netProfits);
    const range = maxVal - minVal || 100;

    const points = chartData.map((d, index) => {
      const x = paddingLeft + (index / 11) * (width - paddingLeft - paddingRight);
      const y = height - paddingBottom - ((d.beneficioNeto - minVal) / range) * (height - paddingTop - paddingBottom);
      return { x, y, ...d };
    });

    // Build SVG Path strings
    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    
    // Bottom line coordinate
    const zeroY = height - paddingBottom - ((0 - minVal) / range) * (height - paddingTop - paddingBottom);
    const areaPath = `${linePath} L${points[11].x},${zeroY} L${points[0].x},${zeroY} Z`;

    return { points, linePath, areaPath, zeroY, width, height };
  }, [chartData]);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-fade-in text-slate-800">
      
      {/* Banner de Cabecera */}
      <div className="bg-slate-50/90 border-b border-slate-100 p-5 md:p-6 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 shrink-0">
            <Calculator className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-display text-sm md:text-base font-bold text-slate-900 tracking-tight">
              Simulador ROI & LTV Corporativo
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              Proyecta el impacto financiero y la viabilidad comercial de tus campañas de escalado.
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        
        {/* PANEL IZQUIERDO: INPUTS */}
        <div className="lg:col-span-5 space-y-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
            Variables de Negocio (Simulación)
          </h4>

          {/* Ticket Promedio */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                Ticket Promedio ($)
                <span className="cursor-help text-slate-400" title="Monto promedio que gasta un cliente en cada compra.">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </label>
              <span className="font-mono text-blue-600 font-bold">${ticket} USD</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="2000" 
              step="10"
              value={ticket} 
              onChange={(e) => setTicket(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
          </div>

          {/* Margen Bruto */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                Margen Bruto (%)
                <span className="cursor-help text-slate-400" title="Margen de ganancia después de restar costos directos de entrega.">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </label>
              <span className="font-mono text-blue-600 font-bold">{margin}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="95" 
              step="5"
              value={margin} 
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
          </div>

          {/* Presupuesto de Marketing Mensual */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                Inversión Mensual ($)
                <span className="cursor-help text-slate-400" title="Presupuesto asignado mensualmente a publicidad y captación de clientes.">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </label>
              <span className="font-mono text-blue-600 font-bold">${monthlyBudget} USD</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="15000" 
              step="100"
              value={monthlyBudget} 
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
          </div>

          {/* CAC */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                Costo Adquisición (CAC)
                <span className="cursor-help text-slate-400" title="¿Cuánto te cuesta en publicidad conseguir exactamente un cliente de pago nuevo?">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </label>
              <span className="font-mono text-blue-600 font-bold">${cac} USD</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="1000" 
              step="5"
              value={cac} 
              onChange={(e) => setCac(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
          </div>

          {/* Frecuencia de Compra Anual */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                Frecuencia Anual
                <span className="cursor-help text-slate-400" title="Número de veces promedio que un mismo cliente te compra al año.">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </label>
              <span className="font-mono text-blue-600 font-bold">{repurchaseRate} veces/año</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="24" 
              step="1"
              value={repurchaseRate} 
              onChange={(e) => setRepurchaseRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
          </div>

          {/* Retención en Años */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 flex items-center gap-1">
                Ciclo de Vida (Años)
                <span className="cursor-help text-slate-400" title="Años promedio que dura la relación activa con el cliente antes de que deje de comprar.">
                  <HelpCircle className="w-3.5 h-3.5" />
                </span>
              </label>
              <span className="font-mono text-blue-600 font-bold">{retentionYears} años</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="1"
              value={retentionYears} 
              onChange={(e) => setRetentionYears(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
          </div>
        </div>

        {/* PANEL DERECHO: METRICAS Y GRAPH */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          
          {/* Tarjetas de Métricas Clave */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* LTV */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">LTV Neto</span>
              <div className="my-2">
                <span className="text-xl md:text-2xl font-extrabold text-slate-900">${ltv}</span>
                <span className="text-[9px] text-slate-500 block mt-0.5 font-medium">Valor Neto del Cliente</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                Margen Bruto de ${Math.round(ticket * repurchaseRate * retentionYears)} bruto
              </div>
            </div>

            {/* Relación LTV:CAC */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Relación LTV : CAC</span>
              <div className="my-2">
                <span className="text-xl md:text-2xl font-extrabold text-slate-900">{ltvCacRatio}x</span>
                <span className="text-[9px] text-slate-500 block mt-0.5 font-medium">Multiplicador Comercial</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                Saludable cuando es &gt; 3x
              </div>
            </div>

            {/* Payback period */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recuperación CAC</span>
              <div className="my-2">
                <span className="text-xl md:text-2xl font-extrabold text-slate-900">
                  {paybackPeriodMonths <= 0 ? "Inmediato" : `${paybackPeriodMonths} m`}
                </span>
                <span className="text-[9px] text-slate-500 block mt-0.5 font-medium">Payback del Cliente</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">
                Tiempo en recuperar el costo CAC
              </div>
            </div>
          </div>

          {/* Caja Informativa de Semáforo */}
          <div className={`p-4 rounded-2xl border ${ratioStatus.color} flex items-start gap-3 text-xs leading-relaxed transition`}>
            <div className="shrink-0 mt-0.5">{ratioStatus.icon}</div>
            <div>
              <p className="font-bold uppercase tracking-wider text-[11px] mb-1">
                Estado LTV / CAC: {ratioStatus.label}
              </p>
              <p className="font-light">{ratioStatus.desc}</p>
            </div>
          </div>

          {/* Gráfico SVG de Proyección Acumulada */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">Proyección de Crecimiento Neto (12 Meses)</span>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                Clientes mensuales: +{monthlyAcquisitions}
              </span>
            </div>
            
            <div className="relative border border-slate-150 rounded-2xl bg-slate-50/50 p-4">
              
              {/* Native responsive SVG container */}
              <svg 
                viewBox={`0 0 ${svgMetrics.width} ${svgMetrics.height}`} 
                className="w-full h-auto overflow-visible"
              >
                {/* Horizontal grid lines */}
                <line x1="10" y1={svgMetrics.height / 4} x2="490" y2={svgMetrics.height / 4} stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="10" y1={svgMetrics.height / 2} x2="490" y2={svgMetrics.height / 2} stroke="#e2e8f0" strokeDasharray="3 3" />
                <line x1="10" y1={(svgMetrics.height * 3) / 4} x2="490" y2={(svgMetrics.height * 3) / 4} stroke="#e2e8f0" strokeDasharray="3 3" />
                
                {/* Zero profit line */}
                <line x1="10" y1={svgMetrics.zeroY} x2="490" y2={svgMetrics.zeroY} stroke="#cbd5e1" strokeWidth={1.5} />
                <text x="15" y={svgMetrics.zeroY - 4} fontSize={8} fill="#94a3b8" fontWeight="bold">LÍNEA DE EQUILIBRIO ($0)</text>

                {/* Gradient area */}
                <path d={svgMetrics.areaPath} fill="url(#blueGlow)" opacity={0.15} />

                {/* Line Path */}
                <path 
                  d={svgMetrics.linePath} 
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />

                {/* Circles and hover detection zones */}
                {svgMetrics.points.map((pt, i) => (
                  <g key={i}>
                    {/* Visual node */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={hoveredIndex === i ? 6 : 4} 
                      fill={hoveredIndex === i ? "#1d4ed8" : "#2563eb"} 
                      stroke="#ffffff" 
                      strokeWidth={2} 
                      className="transition-all duration-150 cursor-pointer"
                    />
                    
                    {/* Invisible larger hover zone for easier touch and click */}
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={15} 
                      fill="transparent" 
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="cursor-pointer"
                    />
                  </g>
                ))}

                {/* Gradients declaration */}
                <defs>
                  <linearGradient id="blueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>

              {/* Floating Tooltip details */}
              <div className="absolute top-2 right-2 bg-slate-900 text-white rounded-xl p-2.5 shadow-xl text-[10px] min-w-[120px] pointer-events-none transition-all duration-200">
                {hoveredIndex !== null ? (
                  <>
                    <p className="font-bold text-blue-400 uppercase tracking-wider">{chartData[hoveredIndex].label}</p>
                    <p className="font-mono mt-0.5">Beneficio: <b>${chartData[hoveredIndex].beneficioNeto.toLocaleString()} USD</b></p>
                    <p className="text-slate-400 mt-0.5">Ingresos: ${chartData[hoveredIndex].ingresos.toLocaleString()}</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-slate-400 uppercase">Detalle del Mes</p>
                    <p className="text-slate-300 mt-0.5">Pasa el cursor por los nodos del gráfico.</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex justify-between text-[9px] text-slate-400 font-mono">
              <span>Mes 1: Retorno incipiente</span>
              <span>Mes 12: Retorno acumulado neto proyectado de <b className="text-blue-600">${chartData[11]?.beneficioNeto.toLocaleString()} USD</b></span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
