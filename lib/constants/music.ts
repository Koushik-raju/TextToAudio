export interface MusicTrackOption {
  id: string;
  name: string;
  description: string;
  filename: string;
  src: string;
}

export const MUSIC_TRACK_OPTIONS: MusicTrackOption[] = [
  {
    id: "ocean",
    name: "Ocean Breeze",
    description: "Serene wave sounds for breathing and grounding",
    filename: "ocean.mp3",
    src: "/music/ocean.mp3",
  },
  {
    id: "bowls",
    name: "Tibetan Bowls",
    description: "Harmonic singing bowls for deep focus and meditation",
    filename: "bowls.mp3",
    src: "/music/bowls.mp3",
  },
  {
    id: "cosmos",
    name: "Deep Space Drone",
    description: "Atmospheric cosmic background for deep relaxation",
    filename: "cosmos.mp3",
    src: "/music/cosmos.mp3",
  },
];
