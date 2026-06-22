"use client";

import { useRef } from "react";
import { Button, Label } from "@/components/ui/FormControls";
import { ACCEPTED_AUDIO_EXTENSIONS } from "@/lib/constants/voices";
import type { BackgroundMusicFile } from "@/lib/types/studio.types";

interface BackgroundMusicUploadProps {
  file: BackgroundMusicFile | null;
  onUpload: (file: File | null) => void;
  onClear: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function BackgroundMusicUpload({
  file,
  onUpload,
  onClear,
}: BackgroundMusicUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const accept = ACCEPTED_AUDIO_EXTENSIONS.join(",");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onUpload(selected);
  };

  return (
    <div>
      <Label
        htmlFor="background-music"
        hint="Optional ambient track (MP3 or WAV)"
      >
        Background Music
      </Label>

      <input
        ref={inputRef}
        id="background-music"
        type="file"
        accept={accept}
        onChange={handleChange}
        className="sr-only"
      />

      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-studio-border bg-studio-surface/50 px-4 py-8 text-center transition-colors hover:border-studio-accent/50 hover:bg-studio-surface"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-studio-surface-hover text-studio-accent">
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          </span>
          <span className="text-sm font-medium text-white">
            Click to upload music
          </span>
          <span className="text-xs text-studio-muted">MP3 or WAV up to 50 MB</span>
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-xl border border-studio-border bg-studio-surface px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-studio-accent/15 text-studio-accent">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"
              />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{file.name}</p>
            <p className="text-xs text-studio-muted">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button variant="ghost" onClick={onClear} className="px-3 py-2">
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
