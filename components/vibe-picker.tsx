"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const PRESET_VIBES = [
  "Minimal",
  "Retro",
  "Dark Academia",
  "Techy",
  "Coquette",
  "Cottagecore",
  "Y2K",
  "Grunge",
  "Pastel",
  "Neon",
  "Vintage",
  "Boho",
]

interface VibePickerProps {
  selectedVibe: string
  onVibeChange: (vibe: string) => void
}

export function VibePicker({ selectedVibe, onVibeChange }: VibePickerProps) {
  const [customVibe, setCustomVibe] = useState("")

  const handlePresetClick = (vibe: string) => {
    onVibeChange(vibe)
    setCustomVibe("")
  }

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customVibe.trim()) {
      onVibeChange(customVibe.trim())
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Preset Vibes</h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_VIBES.map((vibe) => (
            <Badge
              key={vibe}
              variant={selectedVibe === vibe ? "default" : "outline"}
              className="cursor-pointer hover:bg-purple-100"
              onClick={() => handlePresetClick(vibe)}
            >
              {vibe}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-2">Custom Vibe</h3>
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <Input
            placeholder="e.g. Japanese summer, pastel horror"
            value={customVibe}
            onChange={(e) => setCustomVibe(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="sm">
            Set
          </Button>
        </form>
      </div>

      {selectedVibe && (
        <div className="p-3 bg-purple-50 rounded-lg">
          <p className="text-sm">
            <span className="font-medium">Current vibe:</span> {selectedVibe}
          </p>
        </div>
      )}
    </div>
  )
}
