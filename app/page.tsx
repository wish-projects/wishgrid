"use client"

import { useState } from "react"
import { VibePicker } from "@/components/vibe-picker"
import { MoodboardGenerator } from "@/components/moodboard-generator"
import { LayoutSelector } from "@/components/layout-selector"
import { ExportControls } from "@/components/export-controls"
import { Card } from "@/components/ui/card"

export type LayoutType = "grid" | "collage" | "polaroid"

export interface MoodboardImage {
  id: number
  src: {
    large: string
    medium: string
    small: string
  }
  photographer: string
  alt: string
}

export default function Home() {
  const [selectedVibe, setSelectedVibe] = useState<string>("")
  const [images, setImages] = useState<MoodboardImage[]>([])
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>("grid")
  const [isGenerating, setIsGenerating] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">✨ Moodboard Generator</h1>
          <p className="text-gray-600">Create beautiful, aesthetic moodboards for your creative inspiration</p>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h2 className="font-semibold mb-4">Choose Your Vibe</h2>
              <VibePicker selectedVibe={selectedVibe} onVibeChange={setSelectedVibe} />
            </Card>

            {images.length > 0 && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">Layout</h3>
                    <LayoutSelector selectedLayout={selectedLayout} onLayoutChange={setSelectedLayout} />
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Export</h3>
                    <ExportControls images={images} layout={selectedLayout} />
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Moodboard Display */}
          <div className="lg:col-span-3">
            <MoodboardGenerator
              vibe={selectedVibe}
              layout={selectedLayout}
              images={images}
              onImagesChange={setImages}
              isGenerating={isGenerating}
              onGeneratingChange={setIsGenerating}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
