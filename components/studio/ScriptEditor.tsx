"use client";

import { Label } from "@/components/ui/FormControls";

interface ScriptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ScriptEditor({ value, onChange }: ScriptEditorProps) {
  const charCount = value.length;

  return (
    <div className="flex h-full min-h-[280px] flex-col">
      <div className="mb-2 flex items-end justify-between gap-3">
        <Label
          htmlFor="script"
          hint="Write or paste your guided meditation script"
        >
          Meditation Script
        </Label>
        <span className="text-xs tabular-nums text-studio-muted">
          {charCount.toLocaleString()} characters
        </span>
      </div>
      <textarea
        id="script"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Begin by finding a comfortable position. Close your eyes gently and take a deep breath in..."
        className="min-h-[240px] flex-1 resize-y rounded-xl border border-studio-border bg-studio-surface px-4 py-3 text-sm leading-relaxed text-white placeholder:text-studio-muted/60 transition-colors hover:border-studio-accent/30 focus:border-studio-accent focus:outline-none focus:ring-2 focus:ring-studio-accent/20 lg:min-h-[360px]"
      />
    </div>
  );
}
