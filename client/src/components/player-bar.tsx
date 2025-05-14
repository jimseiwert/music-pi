"use client"

import type React from "react"

import { useAudio } from "./audio-provider"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from "lucide-react"
import { useState, useEffect } from "react"

export default function PlayerBar() {
  const { currentSong, isPlaying, stopSong, playSong } = useAudio()
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(100)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)

  // Simulate progress for demo
  useEffect(() => {
    if (!isPlaying) return
    setDuration(100)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= duration) return 0
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, duration])

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseInt(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  return (
    <div className="player-bar relative">
      {/* Progress bar */}
      <div className="progress-bar" style={{ width: `${(progress / duration) * 100}%` }} />

      <div className="flex items-center">
        <div className="w-8 h-8 mr-3 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
          </div>
        </div>

        <div className="mr-6">
          <div className="font-semibold">{currentSong ? currentSong.title : "No song playing"}</div>
          {currentSong && <div className="text-sm text-gray-400">{currentSong.artist || "Unknown Artist"}</div>}
        </div>
      </div>

      <div className="flex items-center gap-3 mx-auto">
        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white">
          <SkipBack className="w-5 h-5" />
        </button>

        {currentSong && (
          <button
            onClick={() => (isPlaying ? stopSong() : playSong(currentSong))}
            className="w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center transition-all"
          >
            {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
          </button>
        )}

        <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {currentSong && isPlaying && (
          <div className="text-sm text-gray-400 mr-2">
            {formatTime(progress)} / {formatTime(duration)}
          </div>
        )}

        <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-white">
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>

        <input
          type="range"
          min="0"
          max="100"
          value={isMuted ? 0 : volume}
          onChange={handleVolumeChange}
          className="volume-slider w-24"
        />
      </div>
    </div>
  )
}
