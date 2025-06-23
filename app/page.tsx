"use client";

import { useState } from "react";
import { VibePicker } from "@/components/vibe-picker";
import { MoodboardGenerator } from "@/components/moodboard-generator";
import { LayoutSelector } from "@/components/layout-selector";
import { ExportControls } from "@/components/export-controls";

export type LayoutType = "grid" | "collage" | "polaroid";

export interface MoodboardImage {
  id: number;
  src: {
    large: string;
    medium: string;
    small: string;
  };
  photographer: string;
  alt: string;
}

export default function Home() {
  const [selectedVibe, setSelectedVibe] = useState<string>("");
  const [images, setImages] = useState<MoodboardImage[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>("grid");
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="min-h-screen bg-[#232323] flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full px-4">
        <header className="text-center py-6">
          <div className="bg-[#353535] rounded-b-lg py-2">
            <h1 className="text-3xl font-bold text-yellow-400 tracking-wide">
              Wish Grid
            </h1>
          </div>
        </header>

        {/* Vibe Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          {[
            "Minimalism",
            "Cottagecore",
            "Earthy Tones",
            "Polaroid Picnic",
            "Vintage Film",
          ].map((vibe) => (
            <button
              key={vibe}
              className={`px-4 py-2 rounded-md font-medium text-gray-200 bg-[#353535] hover:bg-yellow-400 hover:text-black transition-colors ${
                selectedVibe === vibe ? "bg-yellow-400 text-black" : ""
              }`}
              onClick={() => setSelectedVibe(vibe)}
            >
              {vibe}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center bg-[#353535] rounded-md px-3 py-2 mb-4">
          <span className="text-yellow-400 mr-2">🔍</span>
          <input
            className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-400"
            placeholder="Search for a vibe..."
            value={selectedVibe}
            onChange={(e) => setSelectedVibe(e.target.value)}
          />
        </div>

        {/* Layout Selector and Controls */}
        <div className="flex items-center justify-between mb-4">
          <LayoutSelector
            selectedLayout={selectedLayout}
            onLayoutChange={setSelectedLayout}
          />
          <div className="flex gap-2">
            <ExportControls images={images} layout={selectedLayout} />
          </div>
        </div>

        {/* Moodboard Display */}
        <div className="bg-[#232323] border border-[#353535] rounded-lg min-h-[250px] mb-8">
          <MoodboardGenerator
            vibe={selectedVibe}
            layout={selectedLayout}
            images={images}
            onImagesChange={setImages}
            isGenerating={isGenerating}
            onGeneratingChange={setIsGenerating}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#353535] py-4 mt-8">
        <div className="text-center">
          <span className="text-yellow-400 font-handwriting text-2xl">
            Wish Grid
          </span>
          <span className="text-yellow-400 font-handwriting text-xl mx-2">
            aka
          </span>
          <span className="text-white text-xl font-semibold">
            Mood Board Generater
          </span>
        </div>
      </footer>
    </div>
  );
}
