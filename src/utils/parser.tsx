import React from "react";

/**
 * Parses simple Markdown text into highly styled React JSX nodes.
 * Supports ## (h2), ### (h3), - or * (lists with items grouped together),
 * and **bold** formatting with beautiful colors and spacing for a premium light layout.
 */
export function parseMarkdownToReact(text: string): React.ReactNode {
  if (!text) return null;

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

  let inList = false;
  let listItems: React.ReactNode[] = [];

  const flushList = (key: number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul
          key={`list-${key}`}
          className="list-disc pl-6 my-5 space-y-2.5 text-slate-700 text-sm md:text-base leading-relaxed"
        >
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("## ")) {
      flushList(index);
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
      flushList(index);
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
      inList = true;
      const content = trimmedLine.slice(2);
      listItems.push(
        <li key={`li-${index}`} className="leading-relaxed text-slate-700 hover:text-slate-900 transition-colors duration-150">
          {parseInlineBold(content)}
        </li>
      );
    } else if (trimmedLine === "") {
      flushList(index);
    } else {
      flushList(index);
      elements.push(
        <p
          key={index}
          className="text-slate-600 text-sm md:text-base leading-relaxed mb-5 font-normal"
        >
          {parseInlineBold(trimmedLine)}
        </p>
      );
    }
  });

  // Flush any remaining list items at the end
  flushList(lines.length);

  return <div className="space-y-1.5">{elements}</div>;
}
