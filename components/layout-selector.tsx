"use client"

import { Button } from "@/components/ui/button"
import { Grid3X3, Layers, ImageIcon } from "lucide-react"
import type { LayoutType } from "@/app/page"

interface LayoutSelectorProps {
  selectedLayout: LayoutType
  onLayoutChange: (layout: LayoutType) => void
}

const LAYOUTS = [
  {
    id: "grid" as LayoutType,
    icon: Grid3X3,
  },
  {
    id: "collage" as LayoutType,
    icon: Layers,
  },
  {
    id: "polaroid" as LayoutType,
    icon: ImageIcon,
  },
]

export function LayoutSelector({ selectedLayout, onLayoutChange }: LayoutSelectorProps) {
  return (
    <div className="flex gap-1">
      {LAYOUTS.map((layout) => {
        const Icon = layout.icon
        return (
          <Button
            key={layout.id}
            variant={selectedLayout === layout.id ? "default" : "outline"}
            size="sm"
            className="w-10 h-10 p-0"
            onClick={() => onLayoutChange(layout.id)}
          >
            <Icon className="w-4 h-4" />
          </Button>
        )
      })}
    </div>
  )
}
