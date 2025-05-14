"use client"

import type React from "react"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { Song, Category, QuickAction } from "@/lib/types"
import { fetchData, getLocalData } from "@/lib/data-service"
import GoalAnimation from "@/components/goal-animation"

type AudioContextType = {
  currentSong: Song | null
  playSong: (song: Song) => void
  stopSong: () => void
  playQuickAction: (action: QuickAction) => void
  isPlaying: boolean
  categories: Category[]
  quickActions: QuickAction[]
  playedSongs: Set<string>
  clearPlayedSongs: () => void
  markSongAsPlayed: (songId: string) => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [quickActions, setQuickActions] = useState<QuickAction[]>([])
  const [playedSongs, setPlayedSongs] = useState<Set<string>>(new Set())
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [showGoalAnimation, setShowGoalAnimation] = useState(false)

  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio()

    // Try to fetch data from server, fallback to local data
    const loadData = async () => {
      try {
        const data = await fetchData()
        setCategories(data.categories)
        setQuickActions(data.quickActions)
      } catch (error) {
        console.error("Failed to fetch data from server, using local data", error)
        const localData = getLocalData()
        setCategories(localData.categories)
        setQuickActions(localData.quickActions)
      }

      // Load played songs from localStorage
      const storedPlayedSongs = localStorage.getItem("playedSongs")
      if (storedPlayedSongs) {
        setPlayedSongs(new Set(JSON.parse(storedPlayedSongs)))
      }
    }

    loadData()

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Update localStorage when played songs change
  useEffect(() => {
    localStorage.setItem("playedSongs", JSON.stringify([...playedSongs]))
  }, [playedSongs])

  const playSong = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.src = song.audioUrl
      audioRef.current.play()
      setCurrentSong(song)
      setIsPlaying(true)
      markSongAsPlayed(song.id)
    }
  }

  const stopSong = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  const playQuickAction = (action: QuickAction) => {
    if (audioRef.current) {
      // Stop current song if playing
      audioRef.current.pause()

      // Play quick action sound
      audioRef.current.src = action.audioUrl
      audioRef.current.play()
      setCurrentSong(null)
      setIsPlaying(true)

      // Show goal animation if it's the goal action
      if (action.id === "goal") {
        setShowGoalAnimation(true)
      }

      // Set up event listener to know when quick action is done
      audioRef.current.onended = () => {
        setIsPlaying(false)
        // If we had a song playing before, resume it
        if (currentSong) {
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.src = currentSong.audioUrl
              audioRef.current.play()
              setIsPlaying(true)
            }
          }, 500)
        }
      }
    }
  }

  const markSongAsPlayed = (songId: string) => {
    setPlayedSongs((prev) => new Set([...prev, songId]))
  }

  const clearPlayedSongs = () => {
    setPlayedSongs(new Set())
  }

  return (
    <AudioContext.Provider
      value={{
        currentSong,
        playSong,
        stopSong,
        playQuickAction,
        isPlaying,
        categories,
        quickActions,
        playedSongs,
        clearPlayedSongs,
        markSongAsPlayed,
      }}
    >
      <GoalAnimation show={showGoalAnimation} onComplete={() => setShowGoalAnimation(false)} />
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider")
  }
  return context
}
