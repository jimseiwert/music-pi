"use client"

import { useAudio } from "./audio-provider"
import type { Category } from "@/lib/types"
import { Music, CheckCircle, Play } from "lucide-react"
import { useState, useEffect } from "react"

interface SongListProps {
  category: Category | null
}

export default function SongList({ category }: SongListProps) {
  const { playSong, isPlaying, currentSong, playedSongs } = useAudio()
  const [animatedIndex, setAnimatedIndex] = useState<number | null>(null)

  // Create hover animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      if (category?.songs.length) {
        setAnimatedIndex(Math.floor(Math.random() * category.songs.length))
        setTimeout(() => setAnimatedIndex(null), 2000)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [category])

  if (!category) {
    return (
      <div className="glass-card rounded-[96px] flex items-center justify-center h-full">
        <p className="text-2xl text-gray-400">Select a category to view songs</p>
      </div>
    )
  }

  return (
    <div className="glass-card rounded-[96px] p-6 overflow-y-auto h-full">
      <div className="grid grid-cols-2 gap-4">
        {category.songs.map((song, index) => {
          const isCurrentlyPlaying = isPlaying && currentSong?.id === song.id
          const hasBeenPlayed = playedSongs.has(song.id)
          const isAnimated = animatedIndex === index && !isCurrentlyPlaying

          return (
            <button
              key={song.id}
              onClick={() => playSong(song)}
              className={`song-card p-4 rounded-xl text-xl font-semibold flex items-center justify-between transition-all ${
                isCurrentlyPlaying
                  ? "playing bg-gradient-to-r from-green-500/20 to-green-600/20"
                  : hasBeenPlayed
                    ? "played bg-gray-800/50"
                    : "bg-gray-800/30 hover:bg-gray-800/50"
              } ${isAnimated ? "glow" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl ${
                    isCurrentlyPlaying ? "bg-green-500/20" : hasBeenPlayed ? "bg-gray-700/50" : "bg-blue-500/20"
                  }`}
                >
                  {isCurrentlyPlaying ? (
                    <div className="equalizer">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="equalizer-bar"
                          style={{
                            height: `${Math.floor(Math.random() * 30) + 10}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Music className="w-6 h-6" />
                  )}
                </div>
                <div className="text-left">
                  <div className={isCurrentlyPlaying ? "text-green-400" : ""}>{song.title}</div>
                  {song.artist && <div className="text-sm text-gray-400">{song.artist}</div>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasBeenPlayed && !isCurrentlyPlaying && (
                  <div className="bg-gray-700/50 p-1 rounded-full">
                    <CheckCircle className="text-green-400 w-5 h-5" />
                  </div>
                )}
                {!isCurrentlyPlaying && (
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Play className="w-5 h-5 text-blue-400 ml-1" />
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
