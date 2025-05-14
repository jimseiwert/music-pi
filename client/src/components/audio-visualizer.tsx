"use client"

import { useEffect, useRef } from "react"

interface AudioVisualizerProps {
  isPlaying: boolean
  className?: string
}

export default function AudioVisualizer({ isPlaying, className = "" }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Function to draw visualizer
    const draw = () => {
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isPlaying) {
        // Number of bars
        const barCount = 20
        const barWidth = canvas.width / barCount
        const barMargin = 2

        // Draw bars
        for (let i = 0; i < barCount; i++) {
          // Random height for demo (would use audio data in real implementation)
          const height = Math.random() * canvas.height * 0.8

          // Create gradient
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, canvas.height - height)
          gradient.addColorStop(0, "#3b82f6")
          gradient.addColorStop(1, "#60a5fa")

          ctx.fillStyle = gradient
          ctx.fillRect(i * barWidth + barMargin, canvas.height - height, barWidth - barMargin * 2, height)
        }
      } else {
        // Draw flat line when not playing
        ctx.beginPath()
        ctx.moveTo(0, canvas.height / 2)
        ctx.lineTo(canvas.width, canvas.height / 2)
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Request next frame
      animationRef.current = requestAnimationFrame(draw)
    }

    // Start animation
    draw()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />
}
