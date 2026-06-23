export interface MusicTrackOption {
  id: string;
  name: string;
  description: string;
  filename: string;
  src: string;
}

import type { MusicTrackOption } from "@/lib/types/studio.types";

// Export a default empty list for the client bundle.
export const MUSIC_TRACK_OPTIONS: MusicTrackOption[] = [];

// Server‑only loading of actual tracks from the public/music folder.
if (typeof window === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require("fs");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require("path");
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
