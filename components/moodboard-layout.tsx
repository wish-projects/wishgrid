"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MoodboardImage, LayoutType } from "@/app/page"

interface MoodboardLayoutProps {
  images: MoodboardImage[]
  layout: LayoutType
  onRemoveImage: (imageId: number) => void
}

export function MoodboardLayout({ images, layout, onRemoveImage }: MoodboardLayoutProps) {
  const renderGridLayout = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 bg-white rounded-lg shadow-lg">
      {images.map((image) => (
        <div key={image.id} className="relative group aspect-square overflow-hidden rounded-lg">
          <img
            src={image.src.medium || "/placeholder.svg"}
            alt={image.alt}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            crossOrigin="anonymous"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=300&width=300"
            }}
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
            onClick={() => onRemoveImage(image.id)}
          >
            <X className="w-3 h-3" />
          </Button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            by {image.photographer}
          </div>
        </div>
      ))}
    </div>
  )

  const renderCollageLayout = () => (
    <div className="relative p-6 bg-white rounded-lg shadow-lg min-h-[600px]">
      {images.map((image, index) => {
        const positions = [
          { top: "10%", left: "5%", width: "200px", height: "150px", rotation: "-5deg" },
          { top: "15%", right: "10%", width: "180px", height: "240px", rotation: "8deg" },
          { top: "40%", left: "15%", width: "220px", height: "160px", rotation: "3deg" },
          { top: "35%", right: "20%", width: "160px", height: "200px", rotation: "-8deg" },
          { bottom: "20%", left: "10%", width: "190px", height: "140px", rotation: "6deg" },
          { bottom: "15%", right: "15%", width: "210px", height: "180px", rotation: "-3deg" },
          { top: "60%", left: "40%", width: "170px", height: "220px", rotation: "10deg" },
          { top: "25%", left: "45%", width: "150px", height: "150px", rotation: "-12deg" },
        ]

        const position = positions[index % positions.length]

        return (
          <div
            key={image.id}
            className="absolute group shadow-lg"
            style={{
              ...position,
              transform: `rotate(${position.rotation})`,
              zIndex: index + 1,
            }}
          >
            <div className="relative w-full h-full">
              <img
                src={image.src.medium || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover rounded-lg"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=300&width=300"
                }}
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0 z-10"
                onClick={() => onRemoveImage(image.id)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderPolaroidLayout = () => (
    <div className="flex flex-wrap gap-6 justify-center p-6 bg-white rounded-lg shadow-lg">
      {images.map((image, index) => {
        const rotations = ["-8deg", "5deg", "-3deg", "7deg", "-5deg", "4deg", "-6deg", "8deg"]
        const rotation = rotations[index % rotations.length]

        return (
          <div
            key={image.id}
            className="relative group bg-white p-4 shadow-lg"
            style={{
              transform: `rotate(${rotation})`,
              width: "200px",
            }}
          >
            <div className="aspect-square overflow-hidden mb-3">
              <img
                src={image.src.medium || "/placeholder.svg"}
                alt={image.alt}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=300&width=300"
                }}
              />
            </div>
            <div className="text-center text-sm text-gray-600 font-handwriting">
              {image.alt.split(" ").slice(0, 2).join(" ")}
            </div>
            <Button
              size="sm"
              variant="destructive"
              className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0"
              onClick={() => onRemoveImage(image.id)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        )
      })}
    </div>
  )

  switch (layout) {
    case "collage":
      return renderCollageLayout()
    case "polaroid":
      return renderPolaroidLayout()
    default:
      return renderGridLayout()
  }
}
