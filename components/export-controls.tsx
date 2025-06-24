"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, ChevronDown, Loader2 } from "lucide-react"
import type { MoodboardImage, LayoutType } from "@/app/page"

interface ExportControlsProps {
  images: MoodboardImage[]
  layout: LayoutType
}

export function ExportControls({ images, layout }: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false)

  const exportAsImage = async (format: "png" | "jpg") => {
    setIsExporting(true)
    try {
      const element = document.getElementById("moodboard-container")
      if (!element) {
        throw new Error("Moodboard container not found")
      }

      // Dynamic import for html2canvas
      const html2canvas = (await import("html2canvas")).default

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
      })

      const link = document.createElement("a")
      const mimeType = format === "png" ? "image/png" : "image/jpeg"
      const quality = format === "jpg" ? 0.9 : undefined

      link.download = `moodboard-${Date.now()}.${format}`
      link.href = canvas.toDataURL(mimeType, quality)

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Export failed:", error)
      alert(`Export failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsPDF = async () => {
    setIsExporting(true)
    try {
      const element = document.getElementById("moodboard-container")
      if (!element) {
        throw new Error("Moodboard container not found")
      }

      // Dynamic imports
      const [html2canvas, jsPDF] = await Promise.all([
        import("html2canvas").then((m) => m.default),
        import("jspdf").then((m) => m.jsPDF),
      ])

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: true,
      })

      const imgData = canvas.toDataURL("image/png")
      const imgWidth = canvas.width
      const imgHeight = canvas.height

      // Calculate PDF dimensions (convert px to mm, assuming 96 DPI)
      const pdfWidth = imgWidth * 0.264583
      const pdfHeight = imgHeight * 0.264583

      const pdf = new jsPDF({
        orientation: imgWidth > imgHeight ? "landscape" : "portrait",
        unit: "mm",
        format: [pdfWidth, pdfHeight],
      })

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save(`moodboard-${Date.now()}.pdf`)
    } catch (error) {
      console.error("PDF export failed:", error)
      alert(`PDF export failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setIsExporting(false)
    }
  }

  const exportAsPNG = () => exportAsImage("png")
  const exportAsJPG = () => exportAsImage("jpg")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={isExporting || images.length === 0} className="w-full bg-[#353535] border-2 border-[#00CCEB] text-white">
          {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
          Export
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem onClick={exportAsPNG} disabled={isExporting}>
          PNG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsJPG} disabled={isExporting}>
          JPG
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportAsPDF} disabled={isExporting}>
          PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
