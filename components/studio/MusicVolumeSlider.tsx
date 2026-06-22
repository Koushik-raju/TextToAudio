"use client";

import { Slider } from "@/components/ui/FormControls";
import {
  MUSIC_VOLUME_MAX,
  MUSIC_VOLUME_MIN,
} from "@/lib/constants/voices";

interface MusicVolumeSliderProps {
  value: number;
  onChange: (volume: number) => void;
  disabled?: boolean;
}

export function MusicVolumeSlider({
  value,
  onChange,
  disabled = false,
}: MusicVolumeSliderProps) {
  return (
    <div className={disabled ? "pointer-events-none opacity-45" : undefined}>
      <Slider
        id="music-volume"
        label="Music Volume"
        hint="Background music level relative to voice"
        value={value}
        min={MUSIC_VOLUME_MIN}
        max={MUSIC_VOLUME_MAX}
        step={1}
        onChange={onChange}
        formatValue={(v) => `${Math.round(v)}%`}
      />
    </div>
  );
}
