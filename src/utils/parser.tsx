import React from "react";
import { Sparkles, Check, CheckCircle2 } from "lucide-react";

/**
 * Parses simple Markdown text into styled, ultra-premium React JSX nodes.
 * Supports headings (##, ###), blockquotes (>), lists (- or *), numbered steps,
 * inline styles (bold **, italic *, inline code `), and markdown tables with a gorgeous UI.
 */
export function parseMarkdownToReact(text: unknown): React.ReactNode {
  if (typeof text !== "string" || !text.trim()) return null;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  // 1. Robust Inline Tokenizer/Parser (Non-regex robust implementation)
  const parseInlineFormatting = (lineText: string): React.ReactNode => {
    if (!lineText) return "";

    const parts: React.ReactNode[] = [];
    let remaining = lineText;
    let keyIdx = 0;

    while (remaining) {
      const boldIdx = remaining.indexOf("**");
      const codeIdx = remaining.indexOf("`");
      
      // Find first single asterisk not part of double asterisks
      let italicIdx = -1;
      for (let i = 0; i < remaining.length; i++) {
        if (remaining[i] === "*") {
          const isDoubleBefore = i > 0 && remaining[i-1] === "*";
          const isDoubleAfter = i < remaining.length - 1 && remaining[i+1] === "*";
          if (!isDoubleBefore && !isDoubleAfter) {
            italicIdx = i;
            break;
          }
        }
      }

      // Determine first token
      let minIdx = Infinity;
      let tokenType: "bold" | "italic" | "code" | null = null;

      if (boldIdx !== -1 && boldIdx < minIdx) {
        minIdx = boldIdx;
        tokenType = "bold";
      }
      if (italicIdx !== -1 && italicIdx < minIdx) {
        minIdx = italicIdx;
        tokenType = "italic";
      }
      if (codeIdx !== -1 && codeIdx < minIdx) {
        minIdx = codeIdx;
        tokenType = "code";
      }

      if (tokenType === null) {
        parts.push(remaining);
        break;
      }

      // Text before token
      if (minIdx > 0) {
        parts.push(remaining.substring(0, minIdx));
      }

      const postToken = remaining.substring(minIdx + (tokenType === "bold" ? 2 : 1));
      
      if (tokenType === "bold") {
        const endIdx = postToken.indexOf("**");
        if (endIdx !== -1) {
          const content = postToken.substring(0, endIdx);
          parts.push(
            <strong key={`b-${keyIdx++}`} className="font-bold text-slate-900 bg-slate-50 border border-slate-200/50 px-1.5 py-0.5 rounded-md shadow-sm">
              {content}
            </strong>
          );
          remaining = postToken.substring(endIdx + 2);
        } else {
          parts.push("**");
          remaining = postToken;
        }
      } else if (tokenType === "italic") {
        const endIdx = postToken.indexOf("*");
        if (endIdx !== -1) {
          const content = postToken.substring(0, endIdx);
          parts.push(
            <span key={`i-${keyIdx++}`} className="italic text-slate-800 font-medium bg-indigo-50/30 px-1 rounded-md">
              {content}
            </span>
          );
          remaining = postToken.substring(endIdx + 1);
        } else {
          parts.push("*");
          remaining = postToken;
        }
      } else if (tokenType === "code") {
        const endIdx = postToken.indexOf("`");
        if (endIdx !== -1) {
          const content = postToken.substring(0, endIdx);
          parts.push(
            <code key={`c-${keyIdx++}`} className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">
              {content}
            </code>
          );
          remaining = postToken.substring(endIdx + 1);
        } else {
          parts.push("`");
          remaining = postToken;
        }
      }
    }

    return <>{parts}</>;
  };

  // Buffers for lists and tables
  type ListLine = { depth: number; content: string; key: string };
  let listBuffer: ListLine[] = [];
  let tableBuffer: string[] = [];

  // Render lists buffered so far
  const renderListBuffer = (key: string) => {
    if (listBuffer.length === 0) return null;

    const buildTree = (items: ListLine[], depth: number, startIdx: number): [React.ReactNode[], number] => {
      const nodes: React.ReactNode[] = [];
      let i = startIdx;
      while (i < items.length && items[i].depth >= depth) {
        if (items[i].depth > depth) {
          i++;
          continue;
        }
        const item = items[i];
        let children: React.ReactNode[] = [];
        let next = i + 1;
        if (next < items.length && items[next].depth > depth) {
          const [childNodes, newNext] = buildTree(items, depth + 1, next);
          children = childNodes;
          next = newNext;
        }

        nodes.push(
          <li
            key={item.key}
            className="relative pl-6 leading-relaxed text-slate-700 text-xs md:text-sm font-normal py-1"
          >
            {/* Custom refined bullet point */}
            <span className="absolute left-1 top-[10px] w-1.5 h-1.5 rounded-full bg-indigo-500/80" />
            <div>
              {parseInlineFormatting(item.content)}
            </div>
            {children.length > 0 && (
              <ul className="mt-2 pl-4 space-y-2 border-l border-slate-100">{children}</ul>
            )}
          </li>
        );
        i = next;
      }
      return [nodes, i];
    };

    const [topNodes] = buildTree(listBuffer, 0, 0);
    listBuffer = [];
    return (
      <ul key={`list-${key}`} className="my-5 space-y-3">
        {topNodes}
      </ul>
    );
  };

  // Render tables buffered so far
  const renderTableBuffer = (key: string) => {
    if (tableBuffer.length === 0) return null;

    // Filter out standard markdown divider lines (e.g. |---|)
    const activeRows = tableBuffer.filter(row => {
      const cleaned = row.trim().replace(/[\s|:-]/g, "");
      return cleaned.length > 0;
    });

    if (activeRows.length === 0) {
      tableBuffer = [];
      return null;
    }

    const parseCells = (rowText: string): string[] => {
      let cells = rowText.split("|").map(c => c.trim());
      if (cells[0] === "") cells.shift();
      if (cells[cells.length - 1] === "") cells.pop();
      return cells;
    };

    const headers = parseCells(activeRows[0]);
    const bodyRows = activeRows.slice(1).map(parseCells);

    tableBuffer = [];

    return (
      <div key={`table-${key}`} className="overflow-x-auto my-6 rounded-2xl border border-slate-200/80 shadow-sm bg-white">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="py-3 px-4 font-semibold text-slate-700">
                  {parseInlineFormatting(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600">
            {bodyRows.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/40 transition">
                {row.map((cell, j) => (
                  <td key={j} className="py-3 px-4 font-normal">
                    {parseInlineFormatting(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const flushList = (key: string) => {
    const rendered = renderListBuffer(key);
    if (rendered) elements.push(rendered);
  };

  const flushTable = (key: string) => {
    const rendered = renderTableBuffer(key);
    if (rendered) elements.push(rendered);
  };

  const isTableLine = (line: string): boolean => {
    const trimmed = line.trim();
    const hasMultiplePipes = (trimmed.match(/\|/g) || []).length >= 2;
    const isDivider = /^[|:\-\s]+$/.test(trimmed) && trimmed.includes("-") && trimmed.includes("|");
    return hasMultiplePipes || isDivider;
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const leadingSpaces = line.length - line.trimStart().length;

    // A. If table line, start buffering
    if (isTableLine(line)) {
      flushList(`${index}`);
      tableBuffer.push(line);
      return;
    } else {
      // Flush table first when table blocks end
      flushTable(`${index}`);
    }

    // B. Check different block structures
    if (trimmedLine.startsWith("## ")) {
      flushList(`${index}`);
      const content = trimmedLine.slice(3).replace(/#+$/, "").trim();
      elements.push(
        <h2
          key={index}
          className="font-display text-base md:text-lg font-bold mt-8 mb-4 text-slate-900 tracking-tight border-b border-slate-100 pb-2.5 flex items-center gap-2"
        >
          <span className="w-1.5 h-5 bg-indigo-600 rounded-full inline-block shrink-0" />
          {parseInlineFormatting(content)}
        </h2>
      );
    } else if (trimmedLine.startsWith("### ")) {
      flushList(`${index}`);
      const content = trimmedLine.slice(4).replace(/#+$/, "").trim();
      elements.push(
        <h3
          key={index}
          className="font-display text-sm md:text-base font-bold mt-6 mb-3 text-indigo-600 tracking-normal border-l-2 border-indigo-500 pl-3"
        >
          {parseInlineFormatting(content)}
        </h3>
      );
    } else if (trimmedLine.startsWith("> ")) {
      flushList(`${index}`);
      const content = trimmedLine.slice(2);
      elements.push(
        <div key={index} className="p-4 bg-amber-50/60 border-l-4 border-amber-500 rounded-r-2xl text-slate-700 text-xs md:text-sm leading-relaxed my-5">
          {parseInlineFormatting(content)}
        </div>
      );
    } else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      const depth = Math.min(Math.floor(leadingSpaces / 2), 3);
      listBuffer.push({ depth, content: trimmedLine.slice(2), key: `li-${index}` });
    } else if (/^\d+\.\s+/.test(trimmedLine)) {
      flushList(`${index}`);
      const match = trimmedLine.match(/^(\d+)\.\s+(.*)/);
      if (match) {
        const num = match[1];
        const content = match[2];
        elements.push(
          <div key={index} className="flex gap-4 items-start my-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition">
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-mono text-xs font-bold flex items-center justify-center shrink-0 shadow-sm">
              {num}
            </div>
            <div className="text-slate-700 text-xs md:text-sm leading-relaxed flex-1 pt-0.5">
              {parseInlineFormatting(content)}
            </div>
          </div>
        );
      } else {
        elements.push(
          <p key={index} className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4 font-normal">
            {parseInlineFormatting(trimmedLine)}
          </p>
        );
      }
    } else if (trimmedLine === "") {
      flushList(`${index}`);
    } else {
      flushList(`${index}`);
      elements.push(
        <p key={index} className="text-slate-600 text-xs md:text-sm leading-relaxed mb-4 font-normal">
          {parseInlineFormatting(trimmedLine)}
        </p>
      );
    }
  });

  // Flush remaining elements
  flushList("end");
  flushTable("end");

  return <div className="space-y-1.5">{elements}</div>;
}
