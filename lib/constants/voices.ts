import type { VoiceOption } from "@/lib/types/studio.types";

/** Microsoft Neural voice mappings for meditation narration. */
export const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: "calm-female-1",
    name: "Serene — Female",
    description: "Soft, warm tone ideal for guided meditation",
    language: "English (US)",
    neuralVoice: "en-US-AriaNeural",
  },
  {
    id: "calm-male-1",
    name: "Grounded — Male",
    description: "Deep, steady voice for relaxation sessions",
    language: "English (US)",
    neuralVoice: "en-US-GuyNeural",
  },
  {
    id: "calm-female-2",
    name: "Gentle — Female",
    description: "Light and soothing for mindfulness practices",
    language: "English (UK)",
    neuralVoice: "en-GB-SoniaNeural",
  },
  {
    id: "calm-male-2",
    name: "Balanced — Male",
    description: "Neutral and calming for body scan meditations",
    language: "English (UK)",
    neuralVoice: "en-GB-RyanNeural",
  },
  {
    id: "calm-neutral",
    name: "Still — Neutral",
    description: "Even-paced voice for sleep and breathing exercises",
    language: "English (US)",
    neuralVoice: "en-US-JennyNeural",
  },
];

export const DEFAULT_VOICE_ID = VOICE_OPTIONS[0].id;

export const VOICE_MAP = Object.fromEntries(
  VOICE_OPTIONS.map((voice) => [voice.id, voice.neuralVoice])
) as Record<string, string>;

export const SPEED_MIN = 0.5;
export const SPEED_MAX = 2;
export const SPEED_DEFAULT = 1;
export const SPEED_STEP = 0.1;

export const MUSIC_VOLUME_MIN = 0;
export const MUSIC_VOLUME_MAX = 100;
export const MUSIC_VOLUME_DEFAULT = 30;

export const ACCEPTED_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
];

export const ACCEPTED_AUDIO_EXTENSIONS = [".mp3", ".wav"];

/** Maximum script length accepted by the TTS API (characters). */
export const MAX_SCRIPT_LENGTH = 50_000;
