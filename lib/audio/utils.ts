import { SPEED_MAX, SPEED_MIN } from "@/lib/constants/voices";

/**
 * Converts a playback speed multiplier (0.5–2.0) to edge-tts rate string.
 * 1.0 → "+0%", 0.5 → "-50%", 2.0 → "+100%"
 */
export function speedToRate(speed: number): string {
  const clamped = Math.min(SPEED_MAX, Math.max(SPEED_MIN, speed));
  const percent = Math.round((clamped - 1) * 100);
  return `${percent >= 0 ? "+" : ""}${percent}%`;
}

/**
 * Splits long scripts into chunks at paragraph boundaries for reliable synthesis.
 */
export function splitTextIntoChunks(text: string, maxChunkSize = 2800): string[] {
  const trimmed = text.trim();
  if (trimmed.length <= maxChunkSize) return [trimmed];

  const paragraphs = trimmed.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;

    if (candidate.length <= maxChunkSize) {
      current = candidate;
      continue;
    }

    if (current) chunks.push(current);

    if (paragraph.length <= maxChunkSize) {
      current = paragraph;
      continue;
    }

    const sentences = paragraph.match(/[^.!?]+[.!?]+\s*/g) ?? [paragraph];
    current = "";

    for (const sentence of sentences) {
      const next = current ? current + sentence : sentence;
      if (next.length <= maxChunkSize) {
        current = next;
      } else {
        if (current) chunks.push(current.trim());
        current = sentence.trim();
      }
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks.filter(Boolean);
}
