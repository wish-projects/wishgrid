"use client";

import type React from "react";
import { useState } from "react";

const PRESET_VIBES = [
  "Minimalism",
  "Cottagecore",
  "Earthy Tones",
  "Polaroid Picnic",
  "Vintage Film",
];

interface VibePickerProps {
  selectedVibe: string;
  onVibeChange: (vibe: string) => void;
}

export function VibePicker({ selectedVibe, onVibeChange }: VibePickerProps) {
  const [customVibe, setCustomVibe] = useState("");

  const handlePresetClick = (vibe: string) => {
    onVibeChange(vibe);
    setCustomVibe("");
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customVibe.trim()) {
      onVibeChange(customVibe.trim());
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap gap-2 justify-center">
          {PRESET_VIBES.map((vibe) => (
            <button
              key={vibe}
              className={`px-4 py-2 rounded-full font-medium text-gray-200 bg-[#353535] hover:bg-yellow-400 hover:text-black transition-colors ${
                selectedVibe === vibe ? "bg-yellow-400 text-black" : ""
              }`}
              onClick={() => handlePresetClick(vibe)}
            >
              {vibe}
            </button>
          ))}
        </div>
      </div>

      <div>
        <form
          onSubmit={handleCustomSubmit}
          className="flex gap-2 justify-center"
        >
          <input
            className="flex-1 max-w-xs bg-[#353535] text-gray-200 placeholder-gray-400 rounded-md px-3 py-2 outline-none"
            placeholder="Custom vibe..."
            value={customVibe}
            onChange={(e) => setCustomVibe(e.target.value)}
          />
          <button
            type="submit"
            className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-300 transition-colors"
          >
            Set
          </button>
        </form>
      </div>

      {selectedVibe && (
        <div className="p-3 bg-yellow-400 text-black rounded-lg text-center font-semibold">
          <span>Current vibe: {selectedVibe}</span>
        </div>
      )}
    </div>
  );
}
