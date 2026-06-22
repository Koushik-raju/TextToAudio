import { NextResponse } from "next/server";
import { generateMeditationAudio } from "@/lib/audio/generate";
import { validateTtsInput } from "@/lib/audio/validation";
import { TtsGenerationError } from "@/lib/audio/edgeTts";
import type { PauseStrength } from "@/lib/types/studio.types";

export const runtime = "nodejs";
export const maxDuration = 120; // Allow 2 minutes for processing

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const text = formData.get("text")?.toString().trim() ?? "";
    const voiceId = formData.get("voiceId")?.toString() ?? "";
    const speed = parseFloat(formData.get("speed")?.toString() ?? "1");
    const pauseStrength = (formData.get("pauseStrength")?.toString() ?? "medium") as PauseStrength;
    const musicVolume = parseFloat(formData.get("musicVolume")?.toString() ?? "30");
    const musicLibraryId = formData.get("musicLibraryId")?.toString() || null;
    const backgroundMusicFile = formData.get("backgroundMusic") as File | null;

    // Validate inputs
    const validation = validateTtsInput(text, voiceId, speed);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.errors[0] },
        { status: 400 }
      );
    }

    // Process audio generation
    const result = await generateMeditationAudio({
      text,
      voiceId,
      speed,
      pauseStrength,
      musicLibraryId,
      musicVolume,
      backgroundMusicFile,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof TtsGenerationError) {
      const status = error.code === "INVALID_INPUT" ? 400 : 502;
      return NextResponse.json(
        { success: false, error: error.message },
        { status }
      );
    }

    console.error("[POST /api/generate]", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate audio. Please try again shortly.",
      },
      { status: 500 }
    );
  }
}
