"use client";

import { Type, Trash2, Brush, Eraser } from "lucide-react";

interface CanvasToolbarProps {
  canvas: any | null;
}

export function CanvasToolbar({ canvas }: CanvasToolbarProps) {
  const addText = () => {
    if (!canvas) return;
    const text = new fabric.Textbox("Hello world", {
      left: 50,
      top: 50,
      width: 150,
      fontSize: 20,
      fill: "#ffffff",
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  };

  const toggleDrawingMode = () => {
    if (!canvas) return;
    canvas.isDrawingMode = !canvas.isDrawingMode;
  };

  const deleteSelected = () => {
    if (!canvas) return;
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };

  const clearCanvas = () => {
    if (!canvas) return;
    canvas.clear();
  };

  return (
    <div className="flex gap-2 bg-[#353535] p-2 rounded-md mb-2">
      <button
        onClick={addText}
        className="p-2 bg-[#4f4f4f] rounded-md hover:bg-[#5f5f5f]"
      >
        <Type size={20} />
      </button>
      <button
        onClick={toggleDrawingMode}
        className="p-2 bg-[#4f4f4f] rounded-md hover:bg-[#5f5f5f]"
      >
        <Brush size={20} />
      </button>
      <button
        onClick={deleteSelected}
        className="p-2 bg-[#4f4f4f] rounded-md hover:bg-[#5f5f5f]"
      >
        <Trash2 size={20} />
      </button>
      <button
        onClick={clearCanvas}
        className="p-2 bg-[#ef4444] rounded-md hover:bg-[#dc2626]"
      >
        <Eraser size={20} />
      </button>
    </div>
  );
}
