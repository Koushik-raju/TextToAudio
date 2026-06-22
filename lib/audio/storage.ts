import { mkdir, readdir, unlink } from "fs/promises";
import path from "path";

export const TEMP_DIR = path.join(process.cwd(), ".tmp", "audio");
const FILE_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function ensureTempDir(): Promise<void> {
  await mkdir(TEMP_DIR, { recursive: true });
}

function buildFilename(id: string, type = "mixed", format = "mp3"): string {
  return `meditation-${id}-${type}.${format}`;
}

export function getAudioFilePath(
  id: string,
  type = "mixed",
  format = "mp3"
): string | null {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  return path.join(TEMP_DIR, buildFilename(id, type, format));
}

export async function cleanupExpiredFiles(): Promise<void> {
  try {
    await ensureTempDir();
    const files = await readdir(TEMP_DIR);
    const now = Date.now();

    await Promise.all(
      files.map(async (file) => {
        // Clean up any temp meditation output files
        if (
          !file.startsWith("meditation-") ||
          (!file.endsWith(".mp3") && !file.endsWith(".wav"))
        ) {
          return;
        }

        const filepath = path.join(TEMP_DIR, file);
        try {
          const { stat } = await import("fs/promises");
          const stats = await stat(filepath);
          if (now - stats.mtimeMs > FILE_TTL_MS) {
            await unlink(filepath);
          }
        } catch {
          // Ignore missing or locked files during cleanup.
        }
      })
    );
  } catch {
    // Temp directory may not exist yet on first run.
  }
}
