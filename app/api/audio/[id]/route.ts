import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { getAudioFilePath } from "@/lib/audio/storage";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    
    // Parse query parameters
    const url = new URL(request.url);
    const type = url.searchParams.get("type") === "voice" ? "voice" : "mixed";
    const format = url.searchParams.get("format") === "wav" ? "wav" : "mp3";

    const filepath = getAudioFilePath(id, type, format);

    if (!filepath) {
      return NextResponse.json(
        { success: false, error: "Invalid audio ID." },
        { status: 400 }
      );
    }

    const audio = await readFile(filepath);

    // Build a descriptive, user-friendly download filename
    const cleanTypeLabel = type === "voice" ? "Voice_Only" : "Mixed";
    const extension = format === "wav" ? "wav" : "mp3";
    const friendlyFilename = `Meditation_Session_${cleanTypeLabel}.${extension}`;
    const contentType = format === "wav" ? "audio/wav" : "audio/mpeg";

    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(audio.byteLength),
        "Content-Disposition": `attachment; filename="${friendlyFilename}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    const isNotFound =
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT";

    if (isNotFound) {
      return NextResponse.json(
        { success: false, error: "Audio file not found or has expired." },
        { status: 404 }
      );
    }

    console.error("[GET /api/audio/:id]", error);

    return NextResponse.json(
      { success: false, error: "Failed to retrieve audio file." },
      { status: 500 }
    );
  }
}
