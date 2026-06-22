import type {
  GenerateAudioRequest,
  StudioAction,
  StudioState,
} from "@/lib/types/studio.types";
import {
  DEFAULT_VOICE_ID,
  MUSIC_VOLUME_DEFAULT,
  SPEED_DEFAULT,
} from "@/lib/constants/voices";

export const initialStudioState: StudioState = {
  script: "",
  voiceId: DEFAULT_VOICE_ID,
  speed: SPEED_DEFAULT,
  pauseStrength: "medium", // Default to medium meditation pacing
  backgroundMusic: null,
  musicLibraryId: null,
  musicVolume: MUSIC_VOLUME_DEFAULT,
  isGenerating: false,
  hasGeneratedAudio: false,
  generationError: null,
  audioUrl: null,
  mp3Url: null,
  wavUrl: null,
  voiceMp3Url: null,
  voiceWavUrl: null,
  audioFilename: null,
};

export function studioReducer(
  state: StudioState,
  action: StudioAction
): StudioState {
  switch (action.type) {
    case "SET_SCRIPT":
      return {
        ...state,
        script: action.payload,
        generationError: null,
      };
    case "SET_VOICE":
      return { ...state, voiceId: action.payload };
    case "SET_SPEED":
      return { ...state, speed: action.payload };
    case "SET_PAUSE_STRENGTH":
      return { ...state, pauseStrength: action.payload };
    case "SET_BACKGROUND_MUSIC":
      if (state.backgroundMusic === action.payload) return state;
      return {
        ...state,
        backgroundMusic: action.payload,
        // Disable library track if a custom track is uploaded
        musicLibraryId: action.payload ? null : state.musicLibraryId,
      };
    case "SET_MUSIC_LIBRARY_ID":
      if (state.musicLibraryId === action.payload) return state;
      return {
        ...state,
        musicLibraryId: action.payload,
        // Clear uploaded track if a library track is selected
        backgroundMusic: action.payload ? null : state.backgroundMusic,
      };
    case "SET_MUSIC_VOLUME":
      return { ...state, musicVolume: action.payload };
    case "GENERATE_START":
      return {
        ...state,
        isGenerating: true,
        generationError: null,
        hasGeneratedAudio: false,
        audioUrl: null,
        mp3Url: null,
        wavUrl: null,
        voiceMp3Url: null,
        voiceWavUrl: null,
        audioFilename: null,
      };
    case "GENERATE_SUCCESS":
      return {
        ...state,
        isGenerating: false,
        hasGeneratedAudio: true,
        generationError: null,
        audioUrl: action.payload.audioUrl,
        mp3Url: action.payload.mp3Url,
        wavUrl: action.payload.wavUrl,
        voiceMp3Url: action.payload.voiceMp3Url,
        voiceWavUrl: action.payload.voiceWavUrl,
        audioFilename: action.payload.filename,
      };
    case "GENERATE_ERROR":
      return {
        ...state,
        isGenerating: false,
        hasGeneratedAudio: false,
        generationError: action.payload,
        audioUrl: null,
        mp3Url: null,
        wavUrl: null,
        voiceMp3Url: null,
        voiceWavUrl: null,
        audioFilename: null,
      };
    case "RESET_GENERATION":
      return {
        ...state,
        hasGeneratedAudio: false,
        generationError: null,
        audioUrl: null,
        mp3Url: null,
        wavUrl: null,
        voiceMp3Url: null,
        voiceWavUrl: null,
        audioFilename: null,
      };
    default:
      return state;
  }
}

export function buildGenerateRequest(
  state: StudioState
): GenerateAudioRequest {
  return {
    text: state.script.trim(),
    voiceId: state.voiceId,
    speed: state.speed,
    pauseStrength: state.pauseStrength,
    musicLibraryId: state.musicLibraryId,
    musicVolume: state.musicVolume,
  };
}
