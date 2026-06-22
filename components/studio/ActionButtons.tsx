"use client";

import { Button } from "@/components/ui/FormControls";

interface ActionButtonsProps {
  onGenerate: () => void;
  isGenerating: boolean;
  canGenerate: boolean;
}

export function ActionButtons({
  onGenerate,
  isGenerating,
  canGenerate,
}: ActionButtonsProps) {
  return (
    <div className="w-full">
      <Button
        onClick={onGenerate}
        disabled={!canGenerate}
        className="w-full py-3.5"
      >
        {isGenerating ? (
          <>
            <Spinner />
            Generating Meditation Track…
          </>
        ) : (
          <>
            <GenerateIcon />
            Generate Audio
          </>
        )}
      </Button>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

function GenerateIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.536 8.464a5 5 0 010 7.072M12 6v12m0 0l-3-3m3 3l3-3M6 10H4a2 2 0 00-2 2v6a2 2 0 002 2h2m8-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2"
      />
    </svg>
  );
}
