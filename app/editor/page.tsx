"use client";

import { useState, useEffect } from "react";
import { LayoutSelector } from "@/components/layout-selector";
import { ExportControls } from "@/components/export-controls";
import { MoodboardGenerator } from "@/components/moodboard-generator";
import { ImageSourcePanel } from "@/components/image-source-panel";
import { CanvasToolbar } from "@/components/canvas-toolbar";
import type { MoodboardImage, LayoutType } from "@/lib/types";

export default function EditorPage() {
  const [images, setImages] = useState<MoodboardImage[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>("grid");
  const [canvas, setCanvas] = useState<any | null>(null);

  const addImageToBoard = (image: MoodboardImage) => {
    // Avoid adding duplicate images
    if (!images.find((img) => img.id === image.id)) {
      setImages((prevImages) => [...prevImages, image]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const imageData = e.dataTransfer.getData("text/plain");
    try {
      const image = JSON.parse(imageData);
      addImageToBoard(image);
    } catch (error) {
      console.error("Failed to parse image data on drop", error);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (!file) return;

          const reader = new FileReader();
          reader.onload = (e) => {
            fabric.Image.fromURL(e.target?.result as string, (img: any) => {
              canvas?.add(img);
              canvas?.renderAll();
            });
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
      <header className="bg-[#353535] py-2 text-center">
        <h1 className="text-3xl font-jersey text-[#00CCEB] tracking-wide">
          Wish Grid Editor
        </h1>
      </header>

      <div className="flex flex-1 h-[calc(100vh-52px)]">
        {/* Left Panel: Image Sources */}
        <div className="w-1/3 bg-[#2d2d2d] p-4 overflow-y-auto">
          <ImageSourcePanel onImageSelect={addImageToBoard} />
        </div>

        {/* Right Panel: Canvas */}
        <div
          className="w-2/3 bg-[#232323] p-4 flex flex-col"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Controls */}
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

          {/* Moodboard Display */}
          <div className="flex-1 bg-[#232323] border border-[#353535] rounded-lg min-h-[250px]">
            <MoodboardGenerator
              layout={selectedLayout}
              images={images}
              onImagesChange={setImages}
              onCanvasReady={setCanvas}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
