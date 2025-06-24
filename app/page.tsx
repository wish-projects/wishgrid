"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [selectedVibe, setSelectedVibe] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-[#232323] flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full px-4">
        <header className="text-center py-6">
          <div className="bg-[#353535] rounded-b-lg py-2 flex justify-between items-center px-4">
            <h1 className="text-3xl font-jersey text-[#00CCEB] tracking-wide">
              Wish Grid
            </h1>
            <Link href="/editor">
              <button className="px-4 py-2 rounded-md font-medium bg-[#00CCEB] text-black hover:bg-opacity-80 transition-colors">
                Create Your Own Moodboard
              </button>
            </Link>
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
              className={`px-4 py-2 rounded-md font-medium hover:bg-[#00CCEB] hover:text-black transition-colors border-2 border-[#00CCEB] ${
                selectedVibe === vibe
                  ? "bg-[#00CCEB] text-black shadow-[0_0_8px_2px_#00CCEB] ring-2 ring-[#00CCEB]"
                  : "bg-[#353535] text-gray-200"
              }`}
              onClick={() => {
                setSelectedVibe(vibe);
                setSearchQuery(vibe);
              }}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSelectedVibe(searchQuery);
              }
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#353535] py-4 mt-8">
        <div className="text-center">
          <span className="text-[#00CCEB] font-jersey text-2xl">Wish Grid</span>
          <span className="text-[#00CCEB] font-jersey text-xl mx-2">aka</span>
          <span className="text-white text-xl font-semibold">
            Mood Board Generater
          </span>
        </div>
      </footer>
    </div>
  );
}
