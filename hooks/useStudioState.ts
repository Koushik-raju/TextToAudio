"use client";
 
import { useCallback, useReducer } from "react";
import {
  ACCEPTED_AUDIO_EXTENSIONS,
  ACCEPTED_AUDIO_TYPES,
} from "@/lib/constants/voices";
import { validateStudioInput } from "@/lib/audio";
import {
  initialStudioState,
  studioReducer,
} from "@/lib/state/studioReducer";
import type {
  BackgroundMusicFile,
  GenerateAudioResponse,
  PauseStrength,
} from "@/lib/types/studio.types";

function isAcceptedAudioFile(file: File): boolean {
  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();
  return (
    ACCEPTED_AUDIO_TYPES.includes(file.type) ||
    ACCEPTED_AUDIO_EXTENSIONS.includes(extension)
  );
}

export function useStudioState() {
  const [state, dispatch] = useReducer(studioReducer, initialStudioState);

  const setScript = useCallback((script: string) => {
    dispatch({ type: "SET_SCRIPT", payload: script });
  }, []);

  const setVoice = useCallback((voiceId: string) => {
    dispatch({ type: "SET_VOICE", payload: voiceId });
  }, []);

  const setSpeed = useCallback((speed: number) => {
    dispatch({ type: "SET_SPEED", payload: speed });
  }, []);

  const setPauseStrength = useCallback((strength: PauseStrength) => {
    dispatch({ type: "SET_PAUSE_STRENGTH", payload: strength });
  }, []);

  const setMusicVolume = useCallback((volume: number) => {
    dispatch({ type: "SET_MUSIC_VOLUME", payload: volume });
  }, []);

  const setBackgroundMusic = useCallback((file: File | null) => {
    if (!file) {
      dispatch({ type: "SET_BACKGROUND_MUSIC", payload: null });
      return;
    }

    if (!isAcceptedAudioFile(file)) {
      dispatch({
        type: "GENERATE_ERROR",
        payload: "Please upload an MP3 or WAV file.",
      });
      return;
    }

    const musicFile: BackgroundMusicFile = {
      file,
      name: file.name,
      size: file.size,
      type: file.type,
    };

    dispatch({ type: "SET_BACKGROUND_MUSIC", payload: musicFile });
    dispatch({ type: "RESET_GENERATION" });
  }, []);

  const clearBackgroundMusic = useCallback(() => {
    dispatch({ type: "SET_BACKGROUND_MUSIC", payload: null });
  }, []);

  const setMusicLibraryId = useCallback((trackId: string | null) => {
    dispatch({ type: "SET_MUSIC_LIBRARY_ID", payload: trackId });
    dispatch({ type: "RESET_GENERATION" });
  }, []);

  const generateAudio = useCallback(async () => {
    const validation = validateStudioInput(
      state.script,
      state.voiceId,
      state.speed
    );

    if (!validation.isValid) {
      dispatch({
        type: "GENERATE_ERROR",
        payload: validation.errors[0],
      });
      return;
    }

    dispatch({ type: "GENERATE_START" });

    try {
      const formData = new FormData();
      formData.append("text", state.script.trim());
      formData.append("voiceId", state.voiceId);
      formData.append("speed", String(state.speed));
      formData.append("pauseStrength", state.pauseStrength);
      formData.append("musicVolume", String(state.musicVolume));

      if (state.musicLibraryId) {
        formData.append("musicLibraryId", state.musicLibraryId);
      }

      if (state.backgroundMusic?.file) {
        formData.append("backgroundMusic", state.backgroundMusic.file);
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData, // Send as multi-part form data
      });

      const data = (await response.json()) as GenerateAudioResponse;

      if (!response.ok || !data.success || !data.audioUrl) {
        dispatch({
          type: "GENERATE_ERROR",
          payload: data.error ?? "Failed to generate audio.",
        });
        return;
      }

      dispatch({
        type: "GENERATE_SUCCESS",
        payload: {
          audioUrl: data.audioUrl,
          mp3Url: data.mp3Url ?? "",
          wavUrl: data.wavUrl ?? "",
          voiceMp3Url: data.voiceMp3Url ?? "",
          voiceWavUrl: data.voiceWavUrl ?? "",
          filename: data.filename ?? "meditation-audio.mp3",
        },
      });
    } catch {
      dispatch({
        type: "GENERATE_ERROR",
        payload: "Network error. Please check your connection and try again.",
      });
    }
  }, [state]);

  const canDownload =
    state.hasGeneratedAudio && !!state.audioUrl && !state.isGenerating;
  const canGenerate = !state.isGenerating;

  return {
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
    canDownload,
    canGenerate,
  };
}
