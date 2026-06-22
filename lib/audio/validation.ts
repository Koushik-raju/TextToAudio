import type { StudioValidation } from "@/lib/types/studio.types";
import {
  MAX_SCRIPT_LENGTH,
  SPEED_MAX,
  SPEED_MIN,
  VOICE_MAP,
} from "@/lib/constants/voices";

export function resolveNeuralVoice(voiceId: string): string | null {
  return VOICE_MAP[voiceId] ?? null;
}

export function validateTtsInput(
  text: string,
  voiceId: string,
  speed: number
): StudioValidation {
  const errors: string[] = [];

  if (!text.trim()) {
    errors.push("Please enter a meditation script.");
  } else if (text.trim().length < 10) {
    errors.push("Script must be at least 10 characters long.");
  } else if (text.length > MAX_SCRIPT_LENGTH) {
    errors.push(
      `Script must be under ${MAX_SCRIPT_LENGTH.toLocaleString()} characters.`
    );
  }

  if (!voiceId) {
    errors.push("Please select a voice.");
  } else if (!resolveNeuralVoice(voiceId)) {
    errors.push("Selected voice is not supported.");
  }

  if (speed < SPEED_MIN || speed > SPEED_MAX) {
    errors.push(`Speed must be between ${SPEED_MIN}× and ${SPEED_MAX}×.`);
  }

  return { isValid: errors.length === 0, errors };
}

export function validateStudioInput(
  script: string,
  voiceId: string,
  speed?: number
): StudioValidation {
  return validateTtsInput(script, voiceId, speed ?? 1);
}
