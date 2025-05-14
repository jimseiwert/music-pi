"use client"

import { useEffect, useState } from "react"
import { Loader2 } from "lucide-react"

export default function LoadingScreen() {
  const [status, setStatus] = useState("Connecting to server...")
  const [dots, setDots] = useState("")

  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""))
    }, 500)

    const statusTimeout = setTimeout(() => {
      setStatus("Using offline mode")
    }, 5000)

    return () => {
      clearInterval(dotsInterval)
      clearTimeout(statusTimeout)
    }
  }, [])

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage: "url('/placeholder.svg?key=ymdsj')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
        }}
      />

      {/* Ice texture overlay */}
      <div className="absolute inset-0 z-0 ice-texture opacity-30" />

      {/* Content */}
      <div className="z-10 flex flex-col items-center">
        <div className="w-32 h-32 mb-8 relative">
          <div className="absolute inset-0 rounded-full bg-blue-500 opacity-20 animate-ping" />
          <Loader2 className="w-full h-full animate-spin text-blue-500" />
        </div>

        <div className="glass-card p-8 rounded-2xl mb-8 text-center">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-red-500 bg-clip-text text-transparent">
            Hockey Music Player
          </h1>
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-red-500 rounded-full mb-6" />
          <p className="text-2xl">
            {status}
            {dots}
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0s" }} />
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  )
}
