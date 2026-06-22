export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  language: string;
  neuralVoice: string;
}

export interface BackgroundMusicFile {
  file: File;
  name: string;
  size: number;
  type: string;
}

export type PauseStrength = "none" | "light" | "medium" | "deep";

export interface StudioState {
  script: string;
  voiceId: string;
  speed: number;
  pauseStrength: PauseStrength;
  backgroundMusic: BackgroundMusicFile | null;
  musicLibraryId: string | null; // ID of built-in track if selected
  musicVolume: number;
  isGenerating: boolean;
  hasGeneratedAudio: boolean;
  generationError: string | null;
  audioUrl: string | null; // Main mixed preview MP3 url
  mp3Url: string | null; // Mixed MP3 download url
  wavUrl: string | null; // Mixed WAV download url
  voiceMp3Url: string | null; // Voice-only MP3 download url
  voiceWavUrl: string | null; // Voice-only WAV download url
  audioFilename: string | null;
}

export type StudioAction =
  | { type: "SET_SCRIPT"; payload: string }
  | { type: "SET_VOICE"; payload: string }
  | { type: "SET_SPEED"; payload: number }
  | { type: "SET_PAUSE_STRENGTH"; payload: PauseStrength }
  | { type: "SET_BACKGROUND_MUSIC"; payload: BackgroundMusicFile | null }
  | { type: "SET_MUSIC_LIBRARY_ID"; payload: string | null }
  | { type: "SET_MUSIC_VOLUME"; payload: number }
  | { type: "GENERATE_START" }
  | {
      type: "GENERATE_SUCCESS";
      payload: {
        audioUrl: string;
        mp3Url: string;
        wavUrl: string;
        voiceMp3Url: string;
        voiceWavUrl: string;
        filename: string;
      };
    }
  | { type: "GENERATE_ERROR"; payload: string }
  | { type: "RESET_GENERATION" };

export interface StudioValidation {
  isValid: boolean;
  errors: string[];
}

export interface GenerateAudioRequest {
  text: string;
  voiceId: string;
  speed: number;
  pauseStrength: PauseStrength;
  musicLibraryId: string | null;
  musicVolume: number;
}

export interface GenerateAudioResponse {
  success: boolean;
  audioUrl?: string;
  mp3Url?: string;
  wavUrl?: string;
  voiceMp3Url?: string;
  voiceWavUrl?: string;
  filename?: string;
  error?: string;
}

export interface TtsGenerationOptions {
  text: string;
  neuralVoice: string;
  speed: number;
}

export interface SavedAudioFile {
  id: string;
  filename: string;
  filepath: string;
  audioUrl: string;
  createdAt: number;
}
