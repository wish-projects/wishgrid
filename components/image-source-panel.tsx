"use client";

import { useState, useRef } from "react";
import type { MoodboardImage } from "@/lib/types";
import { ImageImporters } from "./image-importers";

interface ImageSourcePanelProps {
  onImageSelect: (image: MoodboardImage) => void;
}

export function ImageSourcePanel({ onImageSelect }: ImageSourcePanelProps) {
  const [selectedVibe, setSelectedVibe] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>("");
  const [fetchedImages, setFetchedImages] = useState<MoodboardImage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchImages = async (page: number, vibe: string) => {
    if (!vibe) return;

    setIsGenerating(true);
    setError("");

    try {
      const response = await fetch("/api/generate-moodboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: vibe, page }),
      });

      if (!response.ok) throw new Error("Failed to fetch images");

      const data = await response.json();
      if (data.photos.length === 0) {
        setHasMore(false);
      }

      if (page === 1) {
        setFetchedImages(data.photos || []);
      } else {
        setFetchedImages((prev) => [...prev, ...data.photos]);
      }
      setCurrentPage(page);
    } catch (err) {
      setError("Failed to fetch images. Please try again.");
      console.error("Error fetching images:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSearch = () => {
    setFetchedImages([]);
    setCurrentPage(1);
    setHasMore(true);
    fetchImages(1, selectedVibe);
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container && hasMore && !isGenerating) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop < clientHeight + 100) {
        // Fetch more when 100px from bottom
        fetchImages(currentPage + 1, selectedVibe);
      }
    }
  };

  const addImportedImage = (image: MoodboardImage) => {
    setFetchedImages((prevImages) => [image, ...prevImages]);
    onImageSelect(image);
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
    <div>
      <h2 className="text-xl font-bold mb-4">Image Sources</h2>
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
            className={`px-4 py-2 rounded-md font-medium hover:bg-[#00CCEB] hover:text-black transition-colors border-2 border-[#00CCEB] ${
              selectedVibe === vibe
                ? "bg-[#00CCEB] text-black shadow-[0_0_8px_2px_#00CCEB] ring-2 ring-[#00CCEB]"
                : "bg-[#353535] text-gray-200"
            }`}
            onClick={() => setSelectedVibe(vibe)}
          >
            {vibe}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-[#353535] rounded-md px-3 py-2 mb-4">
        <input
          className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-400"
          placeholder="Search for a vibe..."
          value={selectedVibe}
          onChange={(e) => setSelectedVibe(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={!selectedVibe || isGenerating}
          className="ml-2 bg-[#00CCEB] text-black font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:bg-[#00bcd4] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isGenerating ? <LoadingSpinner /> : "🔍"}
        </button>
      </div>

      <ImageImporters onImageAdd={addImportedImage} />

      {error && (
        <div className="p-4 border border-red-400 bg-red-100 text-red-700 rounded-md mt-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Image List */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="grid grid-cols-2 gap-2 max-h-[calc(100vh-340px)] overflow-y-auto mt-4 pt-4 border-t border-gray-700"
      >
        {fetchedImages.map((image) => (
          <img
            key={image.id}
            src={image.src.medium}
            alt={image.alt}
            className="rounded-md cursor-pointer"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", JSON.stringify(image));
            }}
            onClick={() => onImageSelect(image)}
          />
        ))}
        {isGenerating && (
          <div className="col-span-2 text-center p-4">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}
