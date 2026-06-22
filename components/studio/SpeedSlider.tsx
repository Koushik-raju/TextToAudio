"use client";

import { Slider } from "@/components/ui/FormControls";
import { SPEED_MAX, SPEED_MIN, SPEED_STEP } from "@/lib/constants/voices";

interface SpeedSliderProps {
  value: number;
  onChange: (speed: number) => void;
}

export function SpeedSlider({ value, onChange }: SpeedSliderProps) {
  return (
    <Slider
      id="speed"
      label="Speech Speed"
      hint="Adjust narration pace"
      value={value}
      min={SPEED_MIN}
      max={SPEED_MAX}
      step={SPEED_STEP}
      onChange={onChange}
      formatValue={(v) => `${v.toFixed(1)}×`}
    />
  );
}
