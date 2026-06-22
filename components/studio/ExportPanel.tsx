"use client";

import { Button } from "@/components/ui/FormControls";

interface ExportPanelProps {
  mp3Url: string | null;
  wavUrl: string | null;
  voiceMp3Url: string | null;
  voiceWavUrl: string | null;
}

export function ExportPanel({
  mp3Url,
  wavUrl,
  voiceMp3Url,
  voiceWavUrl,
}: ExportPanelProps) {
  const triggerDownload = (url: string | null, filename: string) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasTracks = mp3Url || wavUrl || voiceMp3Url || voiceWavUrl;

  if (!hasTracks) return null;

  return (
    <section className="rounded-2xl border border-studio-border bg-studio-surface/60 p-5 shadow-card backdrop-blur sm:p-6">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-studio-muted">
        Export & Download
      </h2>

      <div className="space-y-6">
        {/* Mixed Tracks Section */}
        {(mp3Url || wavUrl) && (
          <div>
            <h3 className="mb-1 text-sm font-medium text-white">Mixed Meditation Track</h3>
            <p className="mb-3 text-xs text-studio-muted">
              Fully mixed track containing both your voice narration and selected background music.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {mp3Url && (
                <Button
                  onClick={() => triggerDownload(mp3Url, "Meditation_Mixed.mp3")}
                  className="flex-1 text-xs"
                >
                  <DownloadIcon />
                  Download MP3 (320kbps)
                </Button>
              )}
              {wavUrl && (
                <Button
                  variant="secondary"
                  onClick={() => triggerDownload(wavUrl, "Meditation_Mixed.wav")}
                  className="flex-1 text-xs"
                >
                  <DownloadIcon />
                  Download WAV (Lossless)
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Separator line */}
        {(mp3Url || wavUrl) && (voiceMp3Url || voiceWavUrl) && (
          <div className="border-t border-studio-border/50" />
        )}

        {/* Voice-Only Section */}
        {(voiceMp3Url || voiceWavUrl) && (
          <div>
            <h3 className="mb-1 text-sm font-medium text-white">Voice Narration Only</h3>
            <p className="mb-3 text-xs text-studio-muted">
              Clean speech recording with your custom spacing and normalizations, without background music.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              {voiceMp3Url && (
                <Button
                  variant="secondary"
                  onClick={() => triggerDownload(voiceMp3Url, "Meditation_Voice_Only.mp3")}
                  className="flex-1 text-xs"
                >
                  <DownloadIcon />
                  Download MP3 (320kbps)
                </Button>
              )}
              {voiceWavUrl && (
                <Button
                  variant="secondary"
                  onClick={() => triggerDownload(voiceWavUrl, "Meditation_Voice_Only.wav")}
                  className="flex-1 text-xs"
                >
                  <DownloadIcon />
                  Download WAV (Lossless)
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function DownloadIcon() {
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
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}
