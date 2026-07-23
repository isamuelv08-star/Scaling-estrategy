/**
 * Clean text utilities to strip Markdown characters and format content 
 * elegantly for copy-paste or clean file exports.
 */

interface SectionConfig {
  id: string;
  name: string;
}

const SECTIONS_METADATA: SectionConfig[] = [
  // Completa
  { id: "diagnostico", name: "Auditoría de Modelo de Negocio & Viabilidad" },
  { id: "comparativa", name: "Análisis Competitivo & Posicionamiento" },
  { id: "objetivos", name: "Objetivos de Crecimiento & Metas Tácticas" },
  { id: "plan", name: "Plan de Distribución & Asignación Presupuestaria" },
  { id: "campanas", name: "Estrategias de Adquisición Digital" },
  { id: "calendario", name: "Calendario Editorial de Contenido Táctico" },
  { id: "sistema", name: "Protocolo de Conversión, CRM & KPIs Clave" },
  // Contenido
  { id: "diagnostico_org", name: "Diagnóstico Inbound y Pilares de Mensaje" },
  { id: "matriz_org", name: "Matriz de Distribución de Contenido" },
  { id: "calendario_org", name: "Parrilla de Contenido Crítica" },
  // Pago
  { id: "diagnostico_pago", name: "Diagnóstico de Presupuesto y Canales de Pauta" },
  { id: "estructura_campanas", name: "Estructura de Campañas de Alto Impacto" },
  { id: "optimizacion_pago", name: "Matriz de Métricas y Escalado de Pauta" },
  // Escalabilidad
  { id: "auditoria_finance", name: "Auditoría de Unit Economics y Escalabilidad" },
  { id: "metas_smart", name: "Objetivos SMART y Metas de Crecimiento" },
  { id: "plan_fases", name: "Plan de Acción Operativo por Fases" },
  // Comercial
  { id: "diagnostico_comercial", name: "Diagnóstico de Fricción Comercial y CRM" },
  { id: "protocolo_ventas", name: "Protocolo de Ventas CRM y Velocidad de Respuesta" },
  { id: "guion_ventas", name: "Guión Táctico y Manejo de Objeciones" },
  // Copywriting
  { id: "diagnostico_copy", name: "Diagnóstico Psicológico de Dolor y Deseo" },
  { id: "emails_pas", name: "Secuencia de Emails de Conversión (Framework PAS)" },
  { id: "wireframe_landing", name: "Estructura y Copys para Landing Page" }
];

/**
 * Parses and reformats raw markdown tables into beautifully space-aligned text tables.
 * Removes all vertical bars (|) and divider lines, replacing them with neat columnar layout.
 */
function formatMarkdownTablesToPlainText(text: string): string {
  const lines = text.split("\n");
  const processedLines: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    const isTableLine = (l: string): boolean => {
      const t = l.trim();
      const hasPipes = (t.match(/\|/g) || []).length >= 2;
      const isDiv = /^[|:\-\s]+$/.test(t) && t.includes("-") && t.includes("|");
      return hasPipes || isDiv;
    };

    if (isTableLine(line)) {
      // Collect the entire table block
      const tableRows: string[] = [];
      while (i < lines.length && isTableLine(lines[i])) {
        tableRows.push(lines[i]);
        i++;
      }

      // Filter rows and parse into cells
      const parsedRows = tableRows
        .map(row => {
          let cells = row.split("|").map(c => c.trim());
          if (cells.length > 0 && cells[0] === "") cells.shift();
          if (cells.length > 0 && cells[cells.length - 1] === "") cells.pop();
          return cells;
        })
        .filter(cells => {
          // Filter out divider rows (rows containing only dashes, colons, or pipes)
          if (cells.length === 0) return false;
          const joined = cells.join("");
          return joined.replace(/[-:\s]/g, "").length > 0;
        });

      if (parsedRows.length > 0) {
        // Find max widths for each column
        const colWidths: number[] = [];
        parsedRows.forEach(row => {
          row.forEach((cell, colIdx) => {
            const cleanCell = cell.replace(/\*\*|\*|`/g, ""); // strip inline markdown before measuring
            colWidths[colIdx] = Math.max(colWidths[colIdx] || 0, cleanCell.length);
          });
        });

        // Format rows with space alignment
        parsedRows.forEach((row, rowIdx) => {
          const formattedCells = row.map((cell, colIdx) => {
            const cleanCell = cell.replace(/\*\*|\*|`/g, "");
            const width = colWidths[colIdx] || 0;
            return cleanCell.padEnd(width + 4); // add 4 spaces of padding
          });
          
          processedLines.push(formattedCells.join("").trimEnd());
          
          // Add a elegant underline under the header row
          if (rowIdx === 0) {
            const totalWidth = colWidths.reduce((sum, w) => sum + w + 4, 0) - 4;
            processedLines.push("-".repeat(Math.max(totalWidth, 20)));
          }
        });
        processedLines.push(""); // Add an empty line after the table
      }
    } else {
      processedLines.push(line);
      i++;
    }
  }

  return processedLines.join("\n");
}

/**
 * Strips all markdown syntax (##, ###, **, *, `, etc.) and outputs human-grade, clean plain text.
 */
export function stripMarkdown(markdownText: string): string {
  if (!markdownText) return "";

  // 1. Format tables to clean columnar text tables
  let text = formatMarkdownTablesToPlainText(markdownText);

  // 2. Clean up headings: replace with clean uppercase sections with spacing
  text = text.replace(/^##\s+(.*)$/gm, (match, title) => {
    const cleanTitle = title.replace(/\*\*|\*|`/g, "").trim().toUpperCase();
    return `\n==================================================\n${cleanTitle}\n==================================================`;
  });

  text = text.replace(/^###\s+(.*)$/gm, (match, title) => {
    const cleanTitle = title.replace(/\*\*|\*|`/g, "").trim();
    return `\n>>> ${cleanTitle}\n` + "-".repeat(cleanTitle.length + 4);
  });

  // 3. Blockquotes: remove leading >
  text = text.replace(/^\s*>\s+(.*)$/gm, "$1");

  // 4. Bold and Italic: remove **, *, and _
  text = text.replace(/\*\*([\s\S]*?)\*\*/g, "$1");
  text = text.replace(/\*([\s\S]*?)\*/g, "$1");
  text = text.replace(/_([\s\S]*?)_/g, "$1");

  // 5. Inline Code: remove backticks
  text = text.replace(/`([\s\S]*?)`/g, "$1");

  // 6. Fix bullet points: replace raw markdown dashes with clean bullet characters
  text = text.replace(/^\s*[-*+]\s+/gm, "  • ");

  // 7. Remove any multiple consecutive empty lines to keep it compact and professional
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}

/**
 * Generates an ultra-premium self-contained HTML report with a gorgeous corporate layout,
 * clean typography, proper HTML tables, custom styles, and a clean print button.
 */
export function generatePremiumHTMLReport(
  businessName: string,
  meta: { tipoModelo: string; rubro: string; plazoMeta: string; ubicacion?: string },
  sections: Record<string, string>,
  resumen: string,
  consultorNombre: string = "SCALING STRATEGY",
  primaryColorHex: string = "#2563eb",
  primaryDarkColorHex: string = "#1d4ed8"
): string {
  const dateStr = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  // Helper to parse individual markdown paragraphs inside HTML
  const formatTextForHTML = (md: string): string => {
    if (!md) return "";
    
    // Split into lines
    const lines = md.split("\n");
    const htmlBlocks: string[] = [];
    
    let inList = false;
    let inTable = false;
    let tableRows: string[] = [];

    const flushList = () => {
      if (inList) {
        htmlBlocks.push("</ul>");
        inList = false;
      }
    };

    const flushTable = () => {
      if (inTable && tableRows.length > 0) {
        // Parse rows
        const parsedRows = tableRows.map(row => {
          let cells = row.split("|").map(c => c.trim());
          if (cells.length > 0 && cells[0] === "") cells.shift();
          if (cells.length > 0 && cells[cells.length - 1] === "") cells.pop();
          return cells;
        }).filter(cells => {
          if (cells.length === 0) return false;
          const joined = cells.join("");
          return joined.replace(/[-:\s]/g, "").length > 0;
        });

        if (parsedRows.length > 0) {
          let tableHtml = `<div class="table-container"><table>`;
          
          // Header
          tableHtml += "<thead><tr>";
          parsedRows[0].forEach(cell => {
            tableHtml += `<th>${applyInlineFormatting(cell)}</th>`;
          });
          tableHtml += "</tr></thead><tbody>";

          // Body
          parsedRows.slice(1).forEach(row => {
            tableHtml += "<tr>";
            row.forEach(cell => {
              tableHtml += `<td>${applyInlineFormatting(cell)}</td>`;
            });
            tableHtml += "</tr>";
          });

          tableHtml += "</tbody></table></div>";
          htmlBlocks.push(tableHtml);
        }
        tableRows = [];
        inTable = false;
      }
    };

    const applyInlineFormatting = (text: string): string => {
      return text
        .replace(/\*\*([\s\S]*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([\s\S]*?)\*/g, "<em>$1</em>")
        .replace(/`([\s\S]*?)`/g, "<code>$1</code>");
    };

    lines.forEach(line => {
      const trimmed = line.trim();

      // Check table
      const hasPipes = (trimmed.match(/\|/g) || []).length >= 2;
      const isDiv = /^[|:\-\s]+$/.test(trimmed) && trimmed.includes("-") && trimmed.includes("|");
      const isTable = hasPipes || isDiv;

      if (isTable) {
        flushList();
        inTable = true;
        tableRows.push(line);
        return;
      } else {
        flushTable();
      }

      if (trimmed.startsWith("## ")) {
        flushList();
        const content = trimmed.substring(3).trim();
        htmlBlocks.push(`<h2>${applyInlineFormatting(content)}</h2>`);
      } else if (trimmed.startsWith("### ")) {
        flushList();
        const content = trimmed.substring(4).trim();
        htmlBlocks.push(`<h3>${applyInlineFormatting(content)}</h3>`);
      } else if (trimmed.startsWith("> ")) {
        flushList();
        const content = trimmed.substring(2).trim();
        htmlBlocks.push(`<blockquote>${applyInlineFormatting(content)}</blockquote>`);
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        if (!inList) {
          htmlBlocks.push("<ul>");
          inList = true;
        }
        const content = trimmed.substring(2).trim();
        htmlBlocks.push(`<li>${applyInlineFormatting(content)}</li>`);
      } else if (trimmed === "") {
        flushList();
      } else {
        flushList();
        // Check if numbered list
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          htmlBlocks.push(`
            <div class="numbered-step">
              <span class="step-num">${numMatch[1]}</span>
              <div class="step-content">${applyInlineFormatting(numMatch[2])}</div>
            </div>
          `);
        } else {
          htmlBlocks.push(`<p>${applyInlineFormatting(trimmed)}</p>`);
        }
      }
    });

    flushList();
    flushTable();

    return htmlBlocks.join("\n");
  };

  // Build HTML document
  let sectionsHTML = "";
  const renderList: SectionConfig[] = [];

  SECTIONS_METADATA.forEach(sec => {
    if (sections[sec.id]) {
      renderList.push(sec);
    }
  });

  Object.keys(sections).forEach(key => {
    if (sections[key] && !renderList.some(item => item.id === key)) {
      renderList.push({
        id: key,
        name: key.replace(/_/g, " ").toUpperCase()
      });
    }
  });

  renderList.forEach(sec => {
    const content = sections[sec.id];
    if (content) {
      // Strip initial title from content if it repeats section name
      const lines = content.split("\n");
      let cleanedContent = content;
      if (lines.length > 0 && lines[0].trim().startsWith("## ")) {
        cleanedContent = lines.slice(1).join("\n").trim();
      }
      
      sectionsHTML += `
        <section class="strategy-card">
          <div class="section-title-wrapper">
            <div class="section-badge">SECCIÓN ESTRATÉGICA</div>
            <h2 class="section-main-title">${sec.name}</h2>
          </div>
          <div class="section-body">
            ${formatTextForHTML(cleanedContent)}
          </div>
        </section>
      `;
    }
  });

  const cleanResumen = resumen
    .replace(/#{1,6}\s?/g, "")
    .replace(/\*\*/g, "")
    .trim();

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Estrategia de Escalado - ${businessName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: ${primaryColorHex};
      --primary-dark: ${primaryDarkColorHex};
      --secondary: ${primaryColorHex};
      --slate-50: #f8fafc;
      --slate-100: #f1f5f9;
      --slate-200: #e2e8f0;
      --slate-300: #cbd5e1;
      --slate-600: #475569;
      --slate-700: #334155;
      --slate-800: #1e293b;
      --slate-900: #0f172a;
      --text: #334155;
      --text-dark: #0f172a;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: var(--text);
      background-color: #f6f8fb;
      line-height: 1.6;
      padding: 40px 20px;
    }

    .container {
      max-width: 900px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 24px;
      border: 1px solid var(--slate-200);
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
      overflow: hidden;
      padding: 50px;
    }

    /* Header & Letterhead */
    .header {
      border-b: 1px solid var(--slate-200);
      padding-bottom: 30px;
      margin-bottom: 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid var(--slate-100);
    }

    .title-area h1 {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      color: var(--slate-900);
      font-weight: 700;
      margin-top: 5px;
      margin-bottom: 15px;
    }

    .eyebrow {
      font-size: 10px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--primary);
      font-weight: 800;
    }

    .meta-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .chip {
      background-color: var(--slate-50);
      border: 1px solid var(--slate-200);
      color: var(--slate-700);
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
    }

    .brand-area {
      text-align: right;
    }

    .brand-title {
      font-weight: 800;
      font-size: 13px;
      letter-spacing: 0.05em;
      color: var(--slate-900);
    }

    .brand-sub {
      font-size: 8px;
      color: var(--primary);
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 0.15em;
      margin-top: 2px;
    }

    .date {
      font-size: 11px;
      color: var(--slate-600);
      margin-top: 15px;
    }

    /* Executive Summary */
    .summary-card {
      background-color: var(--slate-900);
      color: #ffffff;
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 45px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
    }

    .summary-card::after {
      content: "";
      position: absolute;
      top: -30px;
      right: -30px;
      width: 120px;
      height: 120px;
      background: radial-gradient(circle, rgba(37, 99, 253, 0.15) 0%, rgba(255,255,255,0) 70%);
      border-radius: 50%;
    }

    .summary-badge {
      font-size: 9px;
      letter-spacing: 0.25em;
      color: #3b82f6;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .summary-text {
      font-family: 'Playfair Display', serif;
      font-size: 16px;
      line-height: 1.7;
      font-weight: 400;
      font-style: italic;
      color: #f1f5f9;
    }

    .summary-footer {
      border-top: 1px solid rgba(255,255,255,0.1);
      margin-top: 20px;
      padding-top: 12px;
      font-size: 11px;
      color: #94a3b8;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .dot {
      width: 6px;
      height: 6px;
      background-color: #10b981;
      border-radius: 50%;
    }

    /* Strategy Cards */
    .strategy-card {
      background-color: #ffffff;
      border: 1px solid var(--slate-200);
      border-radius: 20px;
      padding: 35px;
      margin-bottom: 35px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.01);
      transition: all 0.3s ease;
    }

    .strategy-card:hover {
      box-shadow: 0 8px 25px rgba(15, 23, 42, 0.04);
      border-color: #cbd5e1;
    }

    .section-title-wrapper {
      border-bottom: 1px solid var(--slate-100);
      padding-bottom: 15px;
      margin-bottom: 25px;
    }

    .section-badge {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 0.15em;
      color: var(--slate-600);
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .section-main-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--slate-900);
    }

    /* Content Typography */
    .section-body p {
      font-size: 14px;
      color: var(--slate-700);
      margin-bottom: 18px;
      line-height: 1.65;
    }

    .section-body h2 {
      font-size: 15px;
      font-weight: 700;
      color: var(--slate-900);
      margin-top: 30px;
      margin-bottom: 12px;
      border-bottom: 1px solid var(--slate-100);
      padding-bottom: 6px;
    }

    .section-body h3 {
      font-size: 13px;
      font-weight: 700;
      color: var(--primary);
      margin-top: 22px;
      margin-bottom: 10px;
    }

    .section-body blockquote {
      background-color: var(--slate-50);
      border-left: 4px solid var(--secondary);
      padding: 15px 20px;
      border-radius: 0 12px 12px 0;
      font-size: 13.5px;
      color: var(--slate-700);
      margin: 20px 0;
    }

    .section-body ul {
      margin-bottom: 20px;
      padding-left: 20px;
    }

    .section-body li {
      font-size: 13.5px;
      color: var(--slate-700);
      margin-bottom: 8px;
      line-height: 1.6;
    }

    .section-body strong {
      color: var(--slate-900);
      font-weight: 600;
    }

    .section-body code {
      font-family: monospace;
      background-color: var(--slate-100);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      color: #e11d48;
    }

    /* Numbered Steps */
    .numbered-step {
      display: flex;
      gap: 15px;
      margin: 18px 0;
      background-color: var(--slate-50);
      padding: 16px;
      border-radius: 12px;
      border: 1px solid var(--slate-100);
    }

    .step-num {
      width: 24px;
      height: 24px;
      background-color: var(--primary);
      color: #ffffff;
      font-weight: 700;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .step-content {
      font-size: 13.5px;
      color: var(--slate-700);
      line-height: 1.5;
    }

    /* Tables */
    .table-container {
      overflow-x: auto;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      margin: 25px 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      text-align: left;
    }

    th {
      background-color: var(--slate-50);
      color: var(--slate-800);
      font-weight: 700;
      padding: 12px 16px;
      border-bottom: 1px solid var(--slate-200);
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    td {
      padding: 12px 16px;
      border-bottom: 1px solid var(--slate-100);
      color: var(--slate-600);
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background-color: rgba(37, 99, 253, 0.01);
    }

    /* Actions and Print button */
    .action-panel {
      position: fixed;
      bottom: 30px;
      right: 30px;
      display: flex;
      gap: 10px;
      z-index: 100;
    }

    .btn {
      background-color: var(--slate-900);
      color: #ffffff;
      border: none;
      border-radius: 50px;
      padding: 12px 24px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
      transition: all 0.2s ease;
      font-family: inherit;
    }

    .btn:hover {
      background-color: #000000;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background-color: #ffffff;
      color: var(--slate-800);
      border: 1px solid var(--slate-200);
    }

    .btn-secondary:hover {
      background-color: var(--slate-50);
    }

    /* Print Stylesheet overrides */
    @media print {
      body {
        background-color: #ffffff;
        padding: 0;
        color: #000000;
      }

      .container {
        border: none;
        box-shadow: none;
        padding: 0;
        border-radius: 0;
      }

      .action-panel {
        display: none !important;
      }

      .strategy-card {
        page-break-inside: avoid;
        border: none;
        box-shadow: none;
        padding: 20px 0;
        margin-bottom: 20px;
        border-bottom: 1px dashed var(--slate-300);
      }

      .summary-card {
        background-color: #ffffff !important;
        border: 2px solid #000000 !important;
        color: #000000 !important;
        box-shadow: none !important;
      }

      .summary-text {
        color: #000000 !important;
      }

      .summary-footer {
        border-top: 1px solid #000000 !important;
        color: #000000 !important;
      }

      .numbered-step {
        background-color: #ffffff;
        border: 1px solid #000000;
        page-break-inside: avoid;
      }

      .step-num {
        border: 1.5px solid #000000;
        color: #000000;
        background-color: transparent;
      }
    }
  </style>
</head>
<body>

  <div class="container">
    
    <!-- Corporate Letterhead -->
    <header class="header">
      <div class="title-area">
        <span class="eyebrow">Plan Estratégico Corporativo de Crecimiento</span>
        <h1>${businessName}</h1>
        <div class="meta-chips">
          <span class="chip">Modelo: ${meta.tipoModelo}</span>
          <span class="chip">Rubro: ${meta.rubro}</span>
          <span class="chip">Horizonte: ${meta.plazoMeta}</span>
          ${meta.ubicacion ? `<span class="chip">Operación: ${meta.ubicacion}</span>` : ""}
        </div>
      </div>
      <div class="brand-area">
        <span class="brand-title">${consultorNombre.toUpperCase()}</span>
        <span class="brand-sub">GROWTH CONSOLE</span>
        <div class="date">${dateStr}</div>
      </div>
    </header>

    <!-- Executive Summary Card -->
    <div class="summary-card">
      <div class="summary-badge">Síntesis Estratégica Ejecutiva</div>
      <div class="summary-text">
        "${cleanResumen}"
      </div>
      <div class="summary-footer">
        <span class="dot"></span>
        <span>Estrategia optimizada lista para ejecución corporativa</span>
      </div>
    </div>

    <!-- Strategy content sections -->
    ${sectionsHTML}

  </div>

  <!-- Interactive buttons floating in bottom right -->
  <div class="action-panel">
    <button class="btn btn-secondary" onclick="window.close();">Cerrar Reporte</button>
    <button class="btn" onclick="window.print();">Imprimir Reporte Completo</button>
  </div>

</body>
</html>
`;
}
