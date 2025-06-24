"use client";

import { useState, useEffect, useRef } from "react";
import fabric from "fabric";
import { LayoutSelector } from "@/components/layout-selector";
import { ExportControls } from "@/components/export-controls";
import { ImageSourcePanel } from "@/components/image-source-panel";
import { CanvasToolbar } from "@/components/canvas-toolbar";
import type { MoodboardImage, LayoutType } from "@/lib/types";
import { MoodboardCanvas } from "@/components/moodboard-canvas";
import Link from "next/link";

export default function EditorPage() {
  const [images, setImages] = useState<MoodboardImage[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>("grid");
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  const addImageToCanvas = (image: MoodboardImage) => {
    if (!canvas) return;

    fabric.Image.fromURL(
      image.src.large,
      { crossOrigin: "anonymous" },
      (img: fabric.Image) => {
        img.scaleToWidth(200);
        canvas.add(img);
        canvas.renderAll();
      }
    );
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const imageData = e.dataTransfer.getData("text/plain");
    if (!imageData || !canvas) return;

    try {
      const image: MoodboardImage = JSON.parse(imageData);
      addImageToCanvas(image);
    } catch (error) {
      console.error("Failed to parse image data on drop", error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      if (!canvas) return;
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (e) => {
            fabric.Image.fromURL(
              e.target?.result as string,
              { crossOrigin: "anonymous" },
              (img: fabric.Image) => {
                canvas.add(img);
                canvas.renderAll();
              }
            );
          };
          reader.readAsDataURL(file);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [canvas]);

  return (
    <div className="min-h-screen bg-[#232323] text-white">
      <header className="bg-[#353535] py-2 flex justify-between items-center px-4">
        <h1 className="text-3xl font-jersey text-[#00CCEB] tracking-wide">
          Wish Grid Editor
        </h1>
        <Link href="/">
          <button className="px-4 py-2 rounded-md font-medium bg-[#00CCEB] text-black hover:bg-opacity-80 transition-colors">
            Back to Home
          </button>
        </Link>
        <Link href="/editor">
          <button className="px-4 py-2 rounded-md font-medium bg-[#00CCEB] text-black hover:bg-opacity-80 transition-colors">
            Create Your Own Moodboard
          </button>
        </Link>
      </header>

      <div className="flex flex-1 h-[calc(100vh-52px)]">
        <div className="w-1/3 bg-[#2d2d2d] p-4 overflow-y-auto">
          <ImageSourcePanel onImageSelect={addImageToCanvas} />
        </div>

        <div
          className="w-2/3 bg-[#232323] p-4 flex flex-col"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex items-center justify-between mb-4">
            <LayoutSelector
              selectedLayout={selectedLayout}
              onLayoutChange={setSelectedLayout}
            />
            <div className="flex gap-2">
              <ExportControls images={images} layout={selectedLayout} />
            </div>
          </div>

          <CanvasToolbar canvas={canvas} />

          <div className="flex-1 bg-[#232323] border border-[#353535] rounded-lg min-h-[250px]">
            <MoodboardCanvas onCanvasReady={setCanvas} />
          </div>
        </div>
      </div>
    </div>
  );
}
