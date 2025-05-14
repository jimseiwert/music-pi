"use client"

import { useAudio } from "./audio-provider"
import type { Category } from "@/lib/types"
import { Music, CheckCircle, Play } from "lucide-react"

interface SongGridProps {
  category: Category | null
}

export default function SongGrid({ category }: SongGridProps) {
  const { playSong, isPlaying, currentSong, playedSongs } = useAudio()

  if (!category) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-xl text-gray-400">Select a category to view songs</p>
      </div>
    )
  }

  return (
    <div className="song-grid">
      {category.songs.map((song) => {
        const isCurrentlyPlaying = isPlaying && currentSong?.id === song.id
        const hasBeenPlayed = playedSongs.has(song.id)

        return (
          <button
            key={song.id}
            onClick={() => playSong(song)}
            className={`song-card ${isCurrentlyPlaying ? "playing" : ""} ${hasBeenPlayed && !isCurrentlyPlaying ? "played" : ""}`}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 mr-3 flex items-center justify-center bg-gray-800 rounded-lg">
                {isCurrentlyPlaying ? (
                  <div className="equalizer">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="equalizer-bar" />
                    ))}
                  </div>
                ) : (
                  <Music className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div className="text-left">
                <div className="font-semibold">{song.title}</div>
                {song.artist && <div className="text-sm text-gray-400">{song.artist}</div>}
              </div>
            </div>

            <div className="flex items-center">
              {hasBeenPlayed && !isCurrentlyPlaying && <CheckCircle className="w-5 h-5 text-green-400 mr-2" />}
              {!isCurrentlyPlaying && (
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Play className="w-4 h-4 text-blue-400 ml-0.5" />
                </div>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
