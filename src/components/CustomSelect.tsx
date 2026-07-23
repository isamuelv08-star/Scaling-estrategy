import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name: string;
  value: string;
  options: (SelectOption | string)[];
  onChange: (e: { target: { name: string; value: string } }) => void;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  name,
  value,
  options,
  onChange,
  placeholder = "Seleccione una opción",
  className = "",
  icon
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedOptions: SelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = parsedOptions.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-xs bg-white border ${
          isOpen ? "border-blue-500 ring-2 ring-blue-500/10 shadow-xs" : "border-slate-200 hover:border-slate-300"
        } rounded-xl py-2.5 px-3.5 text-slate-900 transition-all cursor-pointer select-none ${className}`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <span className={`truncate font-medium ${selectedOption ? "text-slate-900" : "text-slate-400"}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200/90 rounded-2xl shadow-xl py-1.5 max-h-60 overflow-y-auto animate-in fade-in-50 zoom-in-95 scroll-smooth">
          {parsedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center justify-between px-3.5 py-2 text-xs cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="truncate pr-2">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
