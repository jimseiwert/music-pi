"use client"

import { useState, useEffect } from "react"
import { useAudio } from "./audio-provider"
import Header from "./header"
import CategorySelector from "./category-selector"
import SongGrid from "./song-grid"
import QuickActions from "./quick-actions"
import PlayerBar from "./player-bar"
import SongPlayingOverlay from "./song-playing-overlay"
import type { Category } from "@/lib/types"

export default function MusicPlayer() {
  const { categories } = useAudio()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Auto-select first category on load
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0])
    }
  }, [categories, selectedCategory])

  return (
    <div className="app-container">
      <Header />

      <div className="main-content">
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <SongGrid category={selectedCategory} />
      </div>

      <QuickActions />

      <PlayerBar />
      
      <SongPlayingOverlay />
    </div>
  )
}
