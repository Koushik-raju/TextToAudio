import type { CSSProperties, ReactNode } from "react";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  hint?: string;
}

export function Label({ htmlFor, children, hint }: LabelProps) {
  return (
    <div className="mb-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-white/90"
      >
        {children}
      </label>
      {hint && <p className="mt-0.5 text-xs text-studio-muted">{hint}</p>}
    </div>
  );
}

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue: (value: number) => string;
  hint?: string;
}

export function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  hint,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <Label htmlFor={id} hint={hint}>
          {label}
        </Label>
        <span className="shrink-0 rounded-md bg-studio-surface-hover px-2.5 py-1 text-sm font-medium tabular-nums text-studio-accent">
          {formatValue(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="slider-input w-full"
        style={
          {
            "--slider-progress": `${percentage}%`,
          } as CSSProperties
        }
      />
    </div>
  );
}

interface SelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  children: ReactNode;
}

export function Select({
  id,
  label,
  value,
  onChange,
  hint,
  children,
}: SelectProps) {
  return (
    <div>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-studio-border bg-studio-surface px-4 py-3 pr-10 text-sm text-white transition-colors hover:border-studio-accent/40 focus:border-studio-accent focus:outline-none focus:ring-2 focus:ring-studio-accent/20"
        >
          {children}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-studio-muted">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  className?: string;
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  type = "button",
  className = "",
}: ButtonProps) {
  const variants = {
    primary:
      "bg-studio-accent text-white hover:bg-studio-accent-soft shadow-glow disabled:shadow-none",
    secondary:
      "border border-studio-border bg-studio-surface text-white hover:bg-studio-surface-hover",
    ghost: "text-studio-muted hover:bg-studio-surface-hover hover:text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
