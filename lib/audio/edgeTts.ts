import { Communicate, NoAudioReceived } from "edge-tts-universal";
import type { TtsGenerationOptions } from "@/lib/types/studio.types";
import { splitTextIntoChunks, speedToRate } from "@/lib/audio/utils";

export class TtsGenerationError extends Error {
  constructor(
    message: string,
    public readonly code: "NO_AUDIO" | "SYNTHESIS_FAILED" | "INVALID_INPUT"
  ) {
    super(message);
    this.name = "TtsGenerationError";
  }
}

async function synthesizeChunk(
  text: string,
  neuralVoice: string,
  rate: string
): Promise<Buffer> {
  const communicate = new Communicate(text, {
    voice: neuralVoice,
    rate,
    volume: "+0%",
    pitch: "+0Hz",
  });

  const buffers: Buffer[] = [];

  for await (const chunk of communicate.stream()) {
    if (chunk.type === "audio" && chunk.data) {
      buffers.push(chunk.data);
    }
  }

  if (buffers.length === 0) {
    throw new TtsGenerationError(
      "No audio was received from the TTS service.",
      "NO_AUDIO"
    );
  }

  return Buffer.concat(buffers);
}

/**
 * Generates high-quality speech audio using Microsoft Neural voices via edge-tts.
 * Output is MP3 at 24 kHz (edge-tts default high-quality format).
 */
export async function generateSpeechAudio(
  options: TtsGenerationOptions
): Promise<Buffer> {
  const { text, neuralVoice, speed } = options;

  if (!text.trim()) {
    throw new TtsGenerationError("Text is required.", "INVALID_INPUT");
  }

  if (!neuralVoice.endsWith("Neural")) {
    throw new TtsGenerationError(
      "Voice must be a Microsoft Neural voice.",
      "INVALID_INPUT"
    );
  }

  const rate = speedToRate(speed);
  const chunks = splitTextIntoChunks(text);
  const audioParts: Buffer[] = [];

  try {
    for (const chunk of chunks) {
      const audio = await synthesizeChunk(chunk, neuralVoice, rate);
      audioParts.push(audio);
    }
  } catch (error) {
    if (error instanceof TtsGenerationError) throw error;
    if (error instanceof NoAudioReceived) {
      throw new TtsGenerationError(
        "The TTS service returned no audio. Please try again.",
        "NO_AUDIO"
      );
    }

    const message =
      error instanceof Error ? error.message : "Speech synthesis failed.";
    throw new TtsGenerationError(message, "SYNTHESIS_FAILED");
  }

  return Buffer.concat(audioParts);
}
