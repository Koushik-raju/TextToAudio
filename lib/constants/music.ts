export interface MusicTrackOption {
  id: string;
  name: string;
  description: string;
  filename: string;
  src: string;
}

// Import removed: MusicTrackOption defined locally
import fs from "fs";
import path from "path";

// Export a default empty list for the client bundle.
export const MUSIC_TRACK_OPTIONS: MusicTrackOption[] = [];

// Server‑only loading of actual tracks from the public/music folder.
if (typeof window === "undefined") {
  const musicDir = path.join(process.cwd(), "public", "music");
  if (fs.existsSync(musicDir)) {
    const files = fs.readdirSync(musicDir).filter((f: string) => f.endsWith('.mp3'));
    for (let idx = 0; idx < files.length; idx++) {
      const filename = files[idx];
      MUSIC_TRACK_OPTIONS.push({
        id: `track-${idx}`,
        name: filename.replace(/[-_\.mp3]+/g, " ").trim(),
        description: "User‑provided track",
        filename,
        src: `/music/${filename}`,
      });
    }
  }
}
