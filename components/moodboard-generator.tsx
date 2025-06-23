"use client";

import { useState } from "react";
import type { MoodboardImage, LayoutType } from "@/app/page";
import { MoodboardLayout } from "@/components/moodboard-layout";

interface MoodboardGeneratorProps {
  vibe: string;
  layout: LayoutType;
  images: MoodboardImage[];
  onImagesChange: (images: MoodboardImage[]) => void;
  isGenerating: boolean;
  onGeneratingChange: (generating: boolean) => void;
}

export function MoodboardGenerator({
  vibe,
  layout,
  images,
  onImagesChange,
  isGenerating,
  onGeneratingChange,
}: MoodboardGeneratorProps) {
  const [error, setError] = useState<string>("");

  const generateMoodboard = async () => {
    if (!vibe) return;
    onGeneratingChange(true);
    setError("");
    try {
      const response = await fetch("/api/generate-moodboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: vibe }),
      });
      if (!response.ok) throw new Error("Failed to generate moodboard");
      const data = await response.json();
      onImagesChange(data.photos || []);
    } catch (err) {
      setError("Failed to generate moodboard. Please try again.");
      console.error("Error generating moodboard:", err);
    } finally {
      onGeneratingChange(false);
    }
  };

  const removeImage = (imageId: number) => {
    onImagesChange(images.filter((img) => img.id !== imageId));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={generateMoodboard}
          disabled={!vibe || isGenerating}
          className="flex-1 bg-yellow-400 text-black font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-yellow-300 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <svg
                className="w-4 h-4 mr-2 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              Generating...
            </>
          ) : (
            <>
              <span className="mr-2">↻</span>
              {images.length > 0 ? "Regenerate" : "Generate"} Moodboard
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 border border-red-400 bg-red-100 text-red-700 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!vibe && (
        <div className="p-8 text-center bg-[#353535] text-gray-400 rounded-lg">
          <p>Choose a vibe to start generating your moodboard</p>
        </div>
      )}

      {images.length > 0 && (
        <div id="moodboard-container">
          <MoodboardLayout
            images={images}
            layout={layout}
            onRemoveImage={removeImage}
          />
        </div>
      )}
    </div>
  );
}
