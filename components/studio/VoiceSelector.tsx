"use client";

import { Select } from "@/components/ui/FormControls";
import { VOICE_OPTIONS } from "@/lib/constants/voices";

interface VoiceSelectorProps {
  value: string;
  onChange: (voiceId: string) => void;
}

export function VoiceSelector({ value, onChange }: VoiceSelectorProps) {
  return (
    <Select
      id="voice"
      label="Voice"
      hint="Choose a narrator for your meditation"
      value={value}
      onChange={onChange}
    >
      {VOICE_OPTIONS.map((voice) => (
        <option key={voice.id} value={voice.id}>
          {voice.name} — {voice.language}
        </option>
      ))}
    </Select>
  );
}
