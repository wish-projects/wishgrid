"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, RefreshCw } from "lucide-react"
import { MoodboardLayout } from "@/components/moodboard-layout"
import type { MoodboardImage, LayoutType } from "@/app/page"

interface MoodboardGeneratorProps {
  vibe: string
  layout: LayoutType
  images: MoodboardImage[]
  onImagesChange: (images: MoodboardImage[]) => void
  isGenerating: boolean
  onGeneratingChange: (generating: boolean) => void
}

export function MoodboardGenerator({
  vibe,
  layout,
  images,
  onImagesChange,
  isGenerating,
  onGeneratingChange,
}: MoodboardGeneratorProps) {
  const [error, setError] = useState<string>("")

  const generateMoodboard = async () => {
    if (!vibe) return

    onGeneratingChange(true)
    setError("")

    try {
      const response = await fetch("/api/generate-moodboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: vibe }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate moodboard")
      }

      const data = await response.json()
      onImagesChange(data.photos || [])
    } catch (err) {
      setError("Failed to generate moodboard. Please try again.")
      console.error("Error generating moodboard:", err)
    } finally {
      onGeneratingChange(false)
    }
  }

  const removeImage = (imageId: number) => {
    onImagesChange(images.filter((img) => img.id !== imageId))
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={generateMoodboard} disabled={!vibe || isGenerating} className="flex-1">
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              {images.length > 0 ? "Regenerate" : "Generate"} Moodboard
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <p className="text-red-600 text-sm">{error}</p>
        </Card>
      )}

      {!vibe && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">Choose a vibe to start generating your moodboard</p>
        </Card>
      )}

      {images.length > 0 && (
        <div id="moodboard-container">
          <MoodboardLayout images={images} layout={layout} onRemoveImage={removeImage} />
        </div>
      )}
    </div>
  )
}
