"use client";

import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import type { MoodboardImage, LayoutType } from "@/lib/types";

interface MoodboardCanvasProps {
  onCanvasReady: (canvas: fabric.Canvas) => void;
}

export function MoodboardCanvas({ onCanvasReady }: MoodboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !canvasContainerRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: "#232323",
    });

    const setCanvasSize = () => {
      if (canvasContainerRef.current) {
        canvas.setWidth(canvasContainerRef.current.offsetWidth);
        canvas.setHeight(canvasContainerRef.current.offsetHeight);
        canvas.renderAll();
      }
    };

    setCanvasSize();
    onCanvasReady(canvas);

    window.addEventListener("resize", setCanvasSize);

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      canvas.dispose();
    };
  }, [onCanvasReady]);

  return (
    <div ref={canvasContainerRef} className="w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  );
} 