import React from "react";

/**
 * Parses simple Markdown text into styled React JSX nodes.
 * Supports ## (h2), ### (h3), nested "- " lists (indentation-aware),
 * and **bold** formatting.
 */
export function parseMarkdownToReact(text: unknown): React.ReactNode {
  if (typeof text !== "string" || !text.trim()) return null;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  const parseInlineBold = (lineText: string): React.ReactNode[] => {
    const parts = lineText.split("**");
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <strong key={index} className="text-slate-900 font-extrabold bg-blue-50/50 px-1 py-0.5 rounded">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  type ListLine = { depth: number; content: string; key: string };
  let listBuffer: ListLine[] = [];

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
        const isParentLabel = depth === 0 && /\*\*[^*]+:?\*\*\s*$/.test(item.content.trim());
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
            className={
              depth === 0
                ? isParentLabel
                  ? "leading-relaxed text-slate-800 font-semibold mt-3 first:mt-0"
                  : "leading-relaxed text-slate-700"
                : "leading-relaxed text-slate-600 text-[0.95em]"
            }
          >
            {parseInlineBold(item.content)}
            {children.length > 0 && (
              <ul className="list-disc pl-5 mt-1.5 space-y-1.5 font-normal">{children}</ul>
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
      <ul key={`list-${key}`} className="list-disc pl-6 my-5 space-y-2.5 text-slate-700 text-sm md:text-base leading-relaxed">
        {topNodes}
      </ul>
    );
  };

  const flushList = (key: string) => {
    const rendered = renderListBuffer(key);
    if (rendered) elements.push(rendered);
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    const leadingSpaces = line.length - line.trimStart().length;

    if (trimmedLine.startsWith("## ")) {
      flushList(`${index}`);
      const content = trimmedLine.slice(3);
      elements.push(
        <h2
          key={index}
          className="font-display text-xl md:text-2xl font-bold mt-10 mb-5 text-slate-900 tracking-tight border-b border-slate-100 pb-2.5 flex items-center gap-2"
        >
          <span className="w-1.5 h-6 bg-blue-600 rounded-full inline-block shrink-0" />
          {parseInlineBold(content)}
        </h2>
      );
    } else if (trimmedLine.startsWith("### ")) {
      flushList(`${index}`);
      const content = trimmedLine.slice(4);
      elements.push(
        <h3
          key={index}
          className="font-display text-base md:text-lg font-bold mt-7 mb-3 text-blue-600 tracking-normal border-l-2 border-blue-500 pl-3.5"
        >
          {parseInlineBold(content)}
        </h3>
      );
    } else if (trimmedLine.startsWith("- ") || trimmedLine.startsWith("* ")) {
      const depth = Math.min(Math.floor(leadingSpaces / 2), 3);
      listBuffer.push({ depth, content: trimmedLine.slice(2), key: `li-${index}` });
    } else if (trimmedLine === "") {
      flushList(`${index}`);
    } else {
      flushList(`${index}`);
      elements.push(
        <p key={index} className="text-slate-600 text-sm md:text-base leading-relaxed mb-5 font-normal">
          {parseInlineBold(trimmedLine)}
        </p>
      );
    }
  });

  flushList("end");

  return <div className="space-y-1.5">{elements}</div>;
}
