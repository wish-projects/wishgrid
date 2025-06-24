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
  const [lastUsedVibe, setLastUsedVibe] = useState<string>("");

  const generateMoodboard = async (isRegenerating: boolean = false) => {
    // Don't allow generation without a vibe
    if (!vibe && !isRegenerating) return;
    // Don't allow regeneration without a previous vibe
    if (isRegenerating && !lastUsedVibe) return;

    onGeneratingChange(true);
    setError("");

    try {
      const response = await fetch("/api/generate-moodboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: isRegenerating ? lastUsedVibe : vibe }),
      });

      if (!response.ok) throw new Error("Failed to generate moodboard");

      const data = await response.json();
      onImagesChange(data.photos || []);

      // Save the vibe for regeneration only when creating new
      if (!isRegenerating) {
        setLastUsedVibe(vibe);
      }
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

  const LoadingSpinner = () => (
    <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
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
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {/* Create Button */}
        <button
          onClick={() => generateMoodboard(false)}
          disabled={!vibe || isGenerating}
          className="flex-1 bg-[#00CCEB] text-black font-bold py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-[#00b2d3] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGenerating && !images.length ? (
            <>
              <LoadingSpinner />
              Creating...
            </>
          ) : (
            "Create"
          )}
        </button>

        {/* Regenerate Button */}
        <button
          onClick={() => generateMoodboard(true)}
          disabled={!lastUsedVibe || isGenerating}
          className="flex-1 bg-[#353535] text-gray-200 font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed border-2 border-[#00CCEB] hover:bg-[#00CCEB] hover:text-black focus:shadow-[0_0_4px_1px_#00CCEB] hover:shadow-[0_0_4px_1px_#00CCEB]"
        >
          {isGenerating && images.length ? (
            <>
              <LoadingSpinner />
              Regenerating...
            </>
          ) : (
            <>
              <span className="mr-2">↻</span>
              Regenerate
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 border border-red-400 bg-red-100 text-red-700 rounded-md">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!vibe && !isGenerating && images.length === 0 && (
        <div className="flex flex-col items-center justify-center p-4 text-center bg-[#353535] text-gray-400 rounded-lg min-h-[400px]">
          <video
            loop
            autoPlay
            muted
            style={{
              maxWidth: "600px",
              width: "100%",
              margin: "0 auto",
              borderRadius: "16px",
            }}
          >
            <source src="/videos/vid1.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p className="mt-8 text-2xl font-semibold">
            Choose a vibe to start creating your moodboard
          </p>
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
