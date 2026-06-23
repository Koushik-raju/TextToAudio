"use client";

import { useState, useRef, useEffect } from "react";
import { ActionButtons } from "@/components/studio/ActionButtons";
import { BackgroundMusicUpload } from "@/components/studio/BackgroundMusicUpload";
import { MusicVolumeSlider } from "@/components/studio/MusicVolumeSlider";
import { ScriptEditor } from "@/components/studio/ScriptEditor";
import { SpeedSlider } from "@/components/studio/SpeedSlider";
import { VoiceSelector } from "@/components/studio/VoiceSelector";
import { ExportPanel } from "@/components/studio/ExportPanel";
import { Select } from "@/components/ui/FormControls";
import { useStudioState } from "@/hooks/useStudioState";
import type { PauseStrength } from "@/lib/types/studio.types";

export function StudioPanel() {
  const {
    state,
    setScript,
    setVoice,
    setSpeed,
    setPauseStrength,
    setMusicVolume,
    setBackgroundMusic,
    clearBackgroundMusic,
    setMusicLibraryId,
    generateAudio,
    canGenerate,
  } = useStudioState();

  // Local state for music tracks and preview
  const [musicTracks, setMusicTracks] = useState<any[]>([]);
  const [musicMode, setMusicMode] = useState<"library" | "upload">("library");
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/music-tracks")
      .then((res) => res.json())
      .then((data) => setMusicTracks(data))
      .catch((err) => console.error("Failed to load tracks", err));
  }, []);

  const activeTrack = musicTracks.find(
    (t) => t.id === state.musicLibraryId
  );

  const togglePreview = () => {
    if (!previewAudioRef.current) return;
    if (previewPlaying) {
      previewAudioRef.current.pause();
    } else {
      previewAudioRef.current.play();
    }
  };

  // Sync state if tabs are toggled
  useEffect(() => {
    if (musicMode === "library" && !state.musicLibraryId && musicTracks.length > 0) {
      setMusicLibraryId(musicTracks[0]?.id || null);
      setBackgroundMusic(null);
    } else if (musicMode === "upload") {
      if (state.musicLibraryId !== null) {
        setMusicLibraryId(null);
      }
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        setPreviewPlaying(false);
      }
    }
  }, [musicMode, state.musicLibraryId, setMusicLibraryId, setBackgroundMusic, musicTracks]);

  // Load preview source on change
  useEffect(() => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
      setPreviewPlaying(false);
      if (activeTrack) {
        previewAudioRef.current.src = activeTrack.src;
        previewAudioRef.current.load();
      }
    }
  }, [state.musicLibraryId, activeTrack]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <header className="mb-8 text-center lg:mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-studio-border bg-studio-surface px-3 py-1 text-xs font-medium text-studio-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-studio-success" />
          Powered by Microsoft Neural voices via edge-tts
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Meditation Audio Studio
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-studio-muted sm:text-base">
          Craft guided meditation sessions with custom narration, pacing, and
          ambient background music.
        </p>
      </header>

      {/* Hidden audio element for built-in track previews */}
      <audio
        ref={previewAudioRef}
        onPlay={() => setPreviewPlaying(true)}
        onPause={() => setPreviewPlaying(false)}
        onEnded={() => setPreviewPlaying(false)}
        loop
      />

      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <section className="rounded-2xl border border-studio-border bg-studio-surface/60 p-5 shadow-card backdrop-blur sm:p-6 lg:col-span-3">
          <ScriptEditor value={state.script} onChange={setScript} />
        </section>

        <aside className="flex flex-col gap-5 lg:col-span-2">
          {/* Voice & Narration Settings */}
          <section className="rounded-2xl border border-studio-border bg-studio-surface/60 p-5 shadow-card backdrop-blur sm:p-6">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-studio-muted">
              Voice Settings
            </h2>
            <div className="space-y-5">
              <VoiceSelector value={state.voiceId} onChange={setVoice} />
              <SpeedSlider value={state.speed} onChange={setSpeed} />

              <Select
                id="pause-strength"
                label="Meditation Pause Pacing"
                value={state.pauseStrength}
                onChange={(val) => setPauseStrength(val as PauseStrength)}
                hint="Set the silent pause strength between sentences and paragraphs."
              >
                <option value="none">None (Standard spacing)</option>
                <option value="light">Light (Brief breaks)</option>
                <option value="medium">Medium (Relaxed meditation spacing)</option>
                <option value="deep">Deep Meditation (Long reflection pauses)</option>
              </Select>
            </div>
          </section>

          {/* Background Music Settings */}
          <section className="rounded-2xl border border-studio-border bg-studio-surface/60 p-5 shadow-card backdrop-blur sm:p-6">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-studio-muted">
              Background Music
            </h2>

            <div className="space-y-5">
              {/* Music Mode Switcher */}
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-studio-surface p-1 border border-studio-border/50">
                <button
                  type="button"
                  onClick={() => setMusicMode("library")}
                  className={`rounded-lg py-1.5 text-xs font-medium transition-colors ${
                    musicMode === "library"
                      ? "bg-studio-accent text-white"
                      : "text-studio-muted hover:text-white"
                  }`}
                >
                  Built-in Library
                </button>
                <button
                  type="button"
                  onClick={() => setMusicMode("upload")}
                  className={`rounded-lg py-1.5 text-xs font-medium transition-colors ${
                    musicMode === "upload"
                      ? "bg-studio-accent text-white"
                      : "text-studio-muted hover:text-white"
                  }`}
                >
                  Upload Custom
                </button>
              </div>

              {musicMode === "library" ? (
                <div className="space-y-3">
                  <div className="relative">
                    {musicTracks.length > 0 && (
                      <Select
  id="music-track"
  label="Music Track"
  value={state.musicLibraryId || ""}
  onChange={setMusicLibraryId}
>
                        {musicTracks.map((track) => (
                          <option key={track.id} value={track.id}>
                            {track.name}
                          </option>
                        ))}
                      </Select>
                    )}

                    {/* Preview Play/Pause button */}
                    {activeTrack && (
                      <button
                        type="button"
                        onClick={togglePreview}
                        className="absolute right-8 top-8 rounded-lg bg-studio-surface-hover hover:bg-studio-border border border-studio-border p-1.5 text-studio-accent transition-colors focus:outline-none"
                        title={previewPlaying ? "Pause preview" : "Play preview"}
                      >
                        {previewPlaying ? (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                  {activeTrack && (
                    <p className="text-xs text-studio-muted italic">
                      {activeTrack.description}
                    </p>
                  )}
                </div>
              ) : (
                <BackgroundMusicUpload
                  file={state.backgroundMusic}
                  onUpload={setBackgroundMusic}
                  onClear={clearBackgroundMusic}
                />
              )}

              <MusicVolumeSlider
                value={state.musicVolume}
                onChange={setMusicVolume}
                disabled={!state.backgroundMusic && !state.musicLibraryId}
              />
            </div>
          </section>

          {/* Generator Preview Panel */}
          <section className="rounded-2xl border border-studio-border bg-studio-surface/60 p-5 shadow-card backdrop-blur sm:p-6">
            {state.generationError && (
              <div
                role="alert"
                className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2.5 text-sm text-red-300"
              >
                {state.generationError}
              </div>
            )}

            {state.hasGeneratedAudio && !state.isGenerating && (
              <div className="mb-4 rounded-lg border border-studio-success/30 bg-studio-success/10 px-3 py-2.5 text-sm text-studio-success">
                Audio generated successfully. Listen to the preview below or
                download from the Export panel.
              </div>
            )}

            {state.audioUrl && !state.isGenerating && (
              <div className="mb-4">
                <audio
                  controls
                  src={state.audioUrl}
                  className="w-full rounded-lg"
                  preload="metadata"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <ActionButtons
              onGenerate={generateAudio}
              isGenerating={state.isGenerating}
              canGenerate={canGenerate}
            />
          </section>

          {/* Dedicated Export & Download Panel */}
          {state.hasGeneratedAudio && !state.isGenerating && (
            <ExportPanel
              mp3Url={state.mp3Url}
              wavUrl={state.wavUrl}
              voiceMp3Url={state.voiceMp3Url}
              voiceWavUrl={state.voiceWavUrl}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
