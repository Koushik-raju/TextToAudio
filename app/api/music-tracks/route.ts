import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const musicDir = path.join(process.cwd(), 'public', 'music');
  if (!fs.existsSync(musicDir)) {
    return NextResponse.json([]);
  }
  const files = fs.readdirSync(musicDir).filter((f) => f.endsWith('.mp3'));
  const tracks = files.map((filename, idx) => ({
    id: `track-${idx}`,
    name: filename.replace(/[-_\.mp3]+/g, ' ').trim(),
    description: 'User-provided track',
    filename,
    src: `/music/${filename}`,
  }));
  return NextResponse.json(tracks);
}
