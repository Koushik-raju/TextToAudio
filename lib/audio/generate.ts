import { randomUUID } from "crypto";
import { unlink, writeFile } from "fs/promises";
import path from "path";
import { generateSpeechAudio } from "@/lib/audio/edgeTts";
import { mixAudioTracks } from "@/lib/audio/mixing";
import { getAudioFilePath, ensureTempDir, TEMP_DIR } from "@/lib/audio/storage";
import {
  resolveNeuralVoice,
  validateTtsInput,
} from "@/lib/audio/validation";
import { MUSIC_TRACK_OPTIONS } from "@/lib/constants/music";
import type { PauseStrength } from "@/lib/types/studio.types";

interface ExtendedGenerateRequest {
  text: string;
  voiceId: string;
  speed: number;
  pauseStrength: PauseStrength;
  musicLibraryId: string | null;
  musicVolume: number;
  backgroundMusicFile?: File | null;
}

interface ExtendedGenerateResponse {
  success: boolean;
  audioUrl?: string;
  mp3Url?: string;
  wavUrl?: string;
  voiceMp3Url?: string;
  voiceWavUrl?: string;
  filename?: string;
  error?: string;
}

/**
 * Splits a paragraph block into individual clean sentences.
 */
function splitIntoSentences(paragraph: string): string[] {
  const sentences = paragraph
    .split(/([.!?]+(?:\s+|$))/)
    .map((s) => s.trim())
    .filter(Boolean);

  const result: string[] = [];
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    if (/^[.!?]+$/.test(s) && result.length > 0) {
      result[result.length - 1] += s;
    } else {
      result.push(s);
    }
  }
  return result.filter((s) => s.length >= 2);
}

export async function generateMeditationAudio(
  request: ExtendedGenerateRequest
): Promise<ExtendedGenerateResponse> {
  const validation = validateTtsInput(
    request.text,
    request.voiceId,
    request.speed
  );

  if (!validation.isValid) {
    return { success: false, error: validation.errors[0] };
  }

  const id = randomUUID();
  const neuralVoice = resolveNeuralVoice(request.voiceId)!;

  // Prepare directories
  await ensureTempDir();

  // Split text into paragraphs and sentences
  const paragraphs = request.text
    .trim()
    .split(/\n{2,}/)
    .filter(Boolean);

  const voiceTextChunks: string[] = [];
  const silenceDurations: number[] = [];

    // If background music is enabled, use a lighter pause to speed up generation
  if (request.musicVolume > 0 && request.pauseStrength !== "none") {
    request.pauseStrength = "light";
  }

  // Silence durations (seconds) – will be set by the pause strength switch
  let sentenceSilence = 0;
  let paragraphSilence = 0;

  switch (request.pauseStrength) {
    case "none":
      sentenceSilence = 0.2;
      paragraphSilence = 0.5;
      break;
    case "light":
      sentenceSilence = 0.6;
      paragraphSilence = 1.5;
      break;
    case "medium":
      sentenceSilence = 1.2;
      paragraphSilence = 3.0;
      break;
    case "deep":
      sentenceSilence = 2.5;
      paragraphSilence = 6.0;
      break;
  }

  for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
    const paragraph = paragraphs[pIdx];
    const sentences = splitIntoSentences(paragraph);

    for (let sIdx = 0; sIdx < sentences.length; sIdx++) {
      voiceTextChunks.push(sentences[sIdx]);

      if (sIdx < sentences.length - 1) {
        silenceDurations.push(sentenceSilence);
      }
    }

    if (pIdx < paragraphs.length - 1) {
      silenceDurations.push(paragraphSilence);
    }
  }

  // Fallback if no chunks were parsed
  if (voiceTextChunks.length === 0) {
    voiceTextChunks.push(request.text.trim());
  }

  const chunkFiles: string[] = [];
  let tempBgPath: string | null = null;

  try {
    // Generate voice speech MP3 for each individual sentence/chunk
    console.log(`Generating ${voiceTextChunks.length} speech chunks...`);
    for (let i = 0; i < voiceTextChunks.length; i++) {
      const chunkText = voiceTextChunks[i];
      const audioBuffer = await generateSpeechAudio({
        text: chunkText,
        neuralVoice,
        speed: request.speed,
      });

      const chunkFilepath = path.join(TEMP_DIR, `temp-chunk-${id}-${i}.mp3`);
      await writeFile(chunkFilepath, audioBuffer);
      chunkFiles.push(chunkFilepath);
    }

    // Resolve background music source path
    let resolvedBgPath: string | null = null;

    if (request.backgroundMusicFile) {
      // Save uploaded file to local temp directory
      const ext = path.extname(request.backgroundMusicFile.name) || ".mp3";
      tempBgPath = path.join(TEMP_DIR, `temp-bg-${id}${ext}`);
      
      const arrayBuf = await request.backgroundMusicFile.arrayBuffer();
      await writeFile(tempBgPath, Buffer.from(arrayBuf));
      resolvedBgPath = tempBgPath;
    } else if (request.musicLibraryId) {
      // Resolve built-in track from static public/music folder
      const track = MUSIC_TRACK_OPTIONS.find((t) => t.id === request.musicLibraryId);
      if (track) {
        resolvedBgPath = path.join(process.cwd(), "public", "music", track.filename);
      }
    }

    // Resolve final output file paths
    const voiceWavPath = getAudioFilePath(id, "voice", "wav")!;
    const voiceMp3Path = getAudioFilePath(id, "voice", "mp3")!;
    const mixedWavPath = getAudioFilePath(id, "mixed", "wav")!;
    const mixedMp3Path = getAudioFilePath(id, "mixed", "mp3")!;

    // Perform mixing & encoding via FFmpeg pipeline
    await mixAudioTracks({
      voiceChunks: chunkFiles,
      silenceDurations,
      backgroundMusicPath: resolvedBgPath,
      musicVolume: request.musicVolume,
      voiceWavPath,
      voiceMp3Path,
      mixedWavPath,
      mixedMp3Path,
    });

    return {
      success: true,
      audioUrl: `/api/audio/${id}?type=mixed&format=mp3`,
      mp3Url: `/api/audio/${id}?type=mixed&format=mp3`,
      wavUrl: `/api/audio/${id}?type=mixed&format=wav`,
      voiceMp3Url: `/api/audio/${id}?type=voice&format=mp3`,
      voiceWavUrl: `/api/audio/${id}?type=voice&format=wav`,
      filename: `meditation-${id}.mp3`,
    };
  } catch (error) {
    console.error("[generateMeditationAudio] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to process audio tracks.",
    };
  } finally {
    // Always clean up temporary sentence chunks
    for (const chunkFile of chunkFiles) {
      try {
        await unlink(chunkFile);
      } catch {
        // ignore
      }
    }

    // Clean up temporary background music file
    if (tempBgPath) {
      try {
        await unlink(tempBgPath);
      } catch {
        // ignore
      }
    }
  }
}
