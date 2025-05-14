"use client"

import { useAudio } from "./audio-provider"
import { X, Music, Pause } from 'lucide-react'
import { useState } from "react"

export default function SongPlayingOverlay() {
  const { currentSong, isPlaying, stopSong } = useAudio()
  const [minimized, setMinimized] = useState(false)

  if (!currentSong || !isPlaying) return null

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-20 right-4 z-30 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all"
      >
        <Music className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed inset-x-0 top-20 mx-auto z-30 max-w-lg">
      <div className="playing-overlay mx-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
              <div className="equalizer">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="equalizer-bar" />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-bold text-xl">{currentSong.title}</h3>
              {currentSong.artist && <p className="text-gray-300">{currentSong.artist}</p>}
            </div>
          </div>
          <button
            onClick={() => setMinimized(true)}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-4 flex justify-center">
          <button
            onClick={stopSong}
            className="stop-button"
            aria-label="Stop music"
          >
            <Pause className="w-10 h-10" />
            <span className="ml-2">STOP MUSIC</span>
          </button>
        </div>
      </div>
    </div>
  )
}
