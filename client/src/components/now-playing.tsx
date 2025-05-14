"use client"

import { useAudio } from "./audio-provider"
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from "lucide-react"
import { useEffect, useState } from "react"

export default function NowPlaying() {
  const { currentSong, isPlaying, stopSong, playSong } = useAudio()
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)

  // Simulate progress for demo
  useEffect(() => {
    if (!isPlaying) return
    setVolume(80)
    const totalDuration = 180 // 3 minutes in seconds
    setDuration(totalDuration)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= totalDuration) return 0
        return prev + 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="now-playing-bar fixed bottom-0 left-0 right-0 z-20">
      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-800">
        <div className="progress-bar h-full" style={{ width: `${(progress / duration) * 100}%` }} />
      </div>

      <div className="p-4 flex items-center">
        {/* Album art and song info */}
        <div className="flex items-center mr-6">
          <div className="w-16 h-16 rounded-lg overflow-hidden mr-4 relative">
            {currentSong ? (
              <img
                src={`/generic-album-cover.png?key=z1u98&height=200&width=200&query=album%20cover%20for%20${encodeURIComponent(currentSong.title)}`}
                alt="Album art"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <Music className="w-8 h-8 text-gray-600" />
              </div>
            )}

            {isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-green-500 opacity-70" />
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-bold">{currentSong ? currentSong.title : "No song playing"}</h2>
            {currentSong && <p className="text-gray-400">{currentSong.artist || "Unknown Artist"}</p>}
          </div>
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-4 mx-auto">
          <button className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center">
            <SkipBack className="w-5 h-5" />
          </button>

          {currentSong && (
            <button
              onClick={() => (isPlaying ? stopSong() : playSong(currentSong))}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex items-center justify-center transition-all hover-scale shadow-lg"
            >
              {isPlaying ? <Pause className="w-7 h-7 text-white" /> : <Play className="w-7 h-7 text-white ml-1" />}
            </button>
          )}

          <button className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center">
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Time and volume */}
        <div className="flex items-center gap-4">
          {currentSong && (
            <div className="text-sm text-gray-400">
              {formatTime(progress)} / {formatTime(duration)}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${isMuted ? 0 : volume}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
