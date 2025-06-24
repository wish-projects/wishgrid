"use client";

import { useEffect, useRef } from "react";
import type { MoodboardImage, LayoutType } from "@/lib/types";

interface CanvasProps {
  images: MoodboardImage[];
  layout: LayoutType;
  onCanvasReady: (canvas: any) => void;
}

// Layout functions
const applyGridLayout = (canvas: any, fabricImages: any[]) => {
  let x = 10;
  let y = 10;
  let maxHeightInRow = 0;

  fabricImages.forEach((img: any) => {
    img.scaleToWidth(150);

    if (x + img.getScaledWidth() > canvas.getWidth()) {
      x = 10;
      y += maxHeightInRow + 10;
      maxHeightInRow = 0;
    }

    img.set({ left: x, top: y });
    canvas.add(img);

    x += img.getScaledWidth() + 10;
    if (img.getScaledHeight() > maxHeightInRow) {
      maxHeightInRow = img.getScaledHeight();
    }
  });
};

const applyCollageLayout = (canvas: any, fabricImages: any[]) => {
  fabricImages.forEach((img: any, index: number) => {
    img.scaleToWidth(canvas.getWidth() / 4);
    const angle = Math.random() * 40 - 20; // -20 to 20 degrees
    const x = Math.random() * (canvas.getWidth() - img.getScaledWidth());
    const y = Math.random() * (canvas.getHeight() - img.getScaledHeight());

    img.set({ left: x, top: y, angle: angle });
    canvas.add(img);
  });
};

const applyPolaroidLayout = (canvas: any, fabricImages: any[]) => {
  fabricImages.forEach((img: any, index: number) => {
    img.scaleToWidth(150);

    const container = new fabric.Group([img], {
      left: Math.random() * (canvas.getWidth() - 200),
      top: Math.random() * (canvas.getHeight() - 200),
      angle: Math.random() * 30 - 15,
    });

    // Create a white background for the polaroid
    const background = new fabric.Rect({
      width: img.width + 20,
      height: img.height + 60,
      fill: "white",
      originX: "center",
      originY: "center",
    });

    img.set({
      originX: "center",
      originY: "center",
      top: -15,
    });

    const text = new fabric.Text(img.alt || "Polaroid", {
      top: img.height / 2 + 10,
      fontSize: 14,
      fontFamily: "Helvetica",
      originX: "center",
      originY: "center",
    });

    const polaroid = new fabric.Group([background, img, text], {
      left: Math.random() * (canvas.getWidth() - 200),
      top: Math.random() * (canvas.getHeight() - 200),
      angle: Math.random() * 20 - 10,
      shadow: "rgba(0,0,0,0.2) 5px 5px 10px",
    });

    canvas.add(polaroid);
  });
};

export function Canvas({ images, layout, onCanvasReady }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#232323",
    });
    fabricCanvasRef.current = canvas;
    onCanvasReady(canvas);

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [onCanvasReady]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !images) return;

    canvas.clear();

    const imagePromises = images.map((image) => {
      return new Promise<any>((resolve) => {
        fabric.Image.fromURL(
          image.src.large,
          (img: any) => {
            img.alt = image.alt; // Preserve alt text
            resolve(img);
          },
          { crossOrigin: "anonymous" }
        );
      });
    });

    Promise.all(imagePromises).then((fabricImages) => {
      switch (layout) {
        case "grid":
          applyGridLayout(canvas, fabricImages);
          break;
        case "collage":
          applyCollageLayout(canvas, fabricImages);
          break;
        case "polaroid":
          applyPolaroidLayout(canvas, fabricImages);
          break;
        default:
          applyGridLayout(canvas, fabricImages);
      }
      canvas.renderAll();
    });
  }, [images, layout]);

  return <canvas ref={canvasRef} />;
}
