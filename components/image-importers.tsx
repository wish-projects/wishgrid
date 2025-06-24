"use client";

import { useRef } from "react";
import type { MoodboardImage } from "@/lib/types";

interface ImageImportersProps {
  onImageAdd: (image: MoodboardImage) => void;
}

export function ImageImporters({ onImageAdd }: ImageImportersProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage: MoodboardImage = {
          id: Date.now(),
          src: {
            large: e.target?.result as string,
            medium: e.target?.result as string,
            small: e.target?.result as string,
          },
          photographer: "local",
          alt: file.name,
        };
        onImageAdd(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Upload Button */}
      <div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <button
          onClick={handleUploadClick}
          className="w-full bg-[#353535] text-gray-200 font-bold py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-[#454545] transition-colors border-2 border-dashed border-gray-500"
        >
          <span>📤</span>
          Upload from device
        </button>
      </div>
    </div>
  );
}
