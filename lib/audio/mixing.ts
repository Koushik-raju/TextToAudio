import { execFile } from "child_process";
import { promisify } from "util";
import { existsSync } from "fs";
import { open as openPromise, copyFile as copyFilePromise } from "fs/promises";
import path from "path";

const execFileAsync = promisify(execFile);

// Robustly resolve the static FFmpeg path in Next.js
const getFfmpegPath = (): string => {
  const localBin = path.join(
    process.cwd(),
    "node_modules",
    "ffmpeg-static",
    process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg"
  );
  if (existsSync(localBin)) {
    return localBin;
  }
  
  const ffmpegStatic = require("ffmpeg-static");
  return typeof ffmpegStatic === "string" ? ffmpegStatic : "";
};

const ffmpegPathResolved = getFfmpegPath();

/**
 * Runs the static FFmpeg binary with the specified arguments.
 */
async function runFfmpeg(args: string[]): Promise<void> {
  if (!ffmpegPathResolved) {
    throw new Error("FFmpeg binary path not found.");
  }
  try {
    await execFileAsync(ffmpegPathResolved, args);
  } catch (error) {
    console.error("FFmpeg execution failed. Args:", args, "Error:", error);
    throw new Error(
      error instanceof Error ? error.message : "FFmpeg execution failed"
    );
  }
}

/**
 * Helper to calculate the exact duration of a standard WAV file.
 */
async function getWavDuration(filepath: string): Promise<number> {
  const file = await openPromise(filepath, "r");
  try {
    const header = Buffer.alloc(200);
    await file.read(header, 0, 200, 0);

    let dataPos = -1;
    // Find the "data" subchunk header
    for (let i = 12; i < header.length - 8; i++) {
      if (header.toString("ascii", i, i + 4) === "data") {
        dataPos = i;
        break;
      }
    }

    const byteRate = header.readUInt32LE(28);
    if (byteRate <= 0) return 0;

    if (dataPos !== -1) {
      const dataSize = header.readUInt32LE(dataPos + 4);
      return dataSize / byteRate;
    }

    // Fallback using file size if data header not found in the first 200 bytes
    const stats = await file.stat();
    return Math.max(0, (stats.size - 44) / byteRate);
  } catch (error) {
    console.error("Failed to parse WAV duration:", error);
    return 0;
  } finally {
    await file.close();
  }
}

interface MixingOptions {
  voiceChunks: string[];        // Paths to sentence-level voice MP3s
  silenceDurations: number[];   // Durations of silences between chunks
  backgroundMusicPath: string | null;
  musicVolume: number;          // 0 to 100
  voiceWavPath: string;         // Outputs
  voiceMp3Path: string;
  mixedWavPath: string;
  mixedMp3Path: string;
}

/**
 * Compiles individual speech chunks and mixes them with background music.
 */
export async function mixAudioTracks(options: MixingOptions): Promise<void> {
  const {
    voiceChunks,
    silenceDurations,
    backgroundMusicPath,
    musicVolume,
    voiceWavPath,
    voiceMp3Path,
    mixedWavPath,
    mixedMp3Path,
  } = options;

  if (voiceChunks.length === 0) {
    throw new Error("No speech chunks provided for mixing.");
  }

  // --- Step 1: Compile Speech Track (Concatenate + Silence + Normalize) ---
  const compileArgs: string[] = ["-y"];

  // Add all voice chunks as inputs
  for (const chunk of voiceChunks) {
    compileArgs.push("-i", chunk);
  }

  let filterComplex = "";
  if (voiceChunks.length === 1) {
    // If only one chunk, apply EBU R128 loudness normalization directly
    filterComplex = "[0:a]loudnorm[out]";
  } else {
    // Generate silent clips in the filter graph and concatenate them
    const concatInputs: string[] = [];
    for (let i = 0; i < voiceChunks.length; i++) {
      concatInputs.push(`[${i}:a]`);
      if (i < voiceChunks.length - 1) {
        const silDuration = silenceDurations[i] ?? 1;
        // Use anullsrc filter to generate silence of given duration
        filterComplex += `anullsrc=r=24000:cl=mono:d=${silDuration.toFixed(2)}[sil${i}];`;
        concatInputs.push(`[sil${i}]`);
      }
    }
    // Concat all inputs and normalize
    filterComplex += `${concatInputs.join("")}concat=n=${concatInputs.length}:v=0:a=1[speech];[speech]loudnorm[out]`;
  }

  compileArgs.push("-filter_complex", filterComplex);
  compileArgs.push("-map", "[out]", voiceWavPath);

  console.log("Compiling voice-only WAV file...");
  await runFfmpeg(compileArgs);

  console.log("Encoding voice-only MP3 file (320kbps)...");
  await runFfmpeg([
    "-y",
    "-i", voiceWavPath,
    "-b:a", "320k",
    voiceMp3Path
  ]);

  // --- Step 2: Mix with Background Music ---
  if (backgroundMusicPath) {
    // Determine the exact duration of the voice file to apply the fade-out properly
    const voiceDuration = await getWavDuration(voiceWavPath);
    console.log(`Speech duration calculated: ${voiceDuration} seconds.`);

    const volumeScale = (musicVolume / 100).toFixed(2);
    const fadeOutStart = Math.max(0, voiceDuration - 3).toFixed(2);

    // Filter definition:
    // 1. Scale background track volume
    // 2. Apply 3-second fade-in at the start
    // 3. Apply 3-second fade-out at the end of the voice track duration
    // 4. Mix voice track (Input 0) and background track (Input 1)
    const mixFilter = `[1:a]volume=${volumeScale}[bg_vol];[bg_vol]afade=t=in:ss=0:d=3[bg_fadein];[bg_fadein]afade=t=out:st=${fadeOutStart}:d=3[bg_fade];[0:a][bg_fade]amix=inputs=2:duration=first:dropout_transition=0[out]`;

    const mixArgs = [
      "-y",
      "-i", voiceWavPath,
      "-stream_loop", "-1", // Loop the background track infinitely
      "-i", backgroundMusicPath,
      "-filter_complex", mixFilter,
      "-map", "[out]", mixedWavPath,
    ];

    console.log("Mixing voice and background tracks to WAV...");
    await runFfmpeg(mixArgs);

    console.log("Encoding mixed MP3 file (320kbps)...");
    await runFfmpeg([
      "-y",
      "-i", mixedWavPath,
      "-b:a", "320k",
      mixedMp3Path
    ]);
  } else {
    // If no background music is selected, simply copy the voice files to the mixed output destinations
    console.log("No background music. Copying voice-only files to mixed paths.");
    await copyFilePromise(voiceWavPath, mixedWavPath);
    await copyFilePromise(voiceMp3Path, mixedMp3Path);
  }
}
