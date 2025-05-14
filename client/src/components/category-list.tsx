"use client"

import type React from "react"

import { useAudio } from "./audio-provider"
import type { Category } from "@/lib/types"
import { Music, Disc, Clock, Trophy, Zap } from "lucide-react"

interface CategoryListProps {
  selectedCategory: Category | null
  onSelectCategory: (category: Category) => void
}

// Map category IDs to icons
const categoryIcons: Record<string, React.ReactNode> = {
  warmup: <Zap className="w-6 h-6" />,
  "period-breaks": <Clock className="w-6 h-6" />,
  "power-play": <Disc className="w-6 h-6" />,
  victory: <Trophy className="w-6 h-6" />,
}

export default function CategoryList({ selectedCategory, onSelectCategory }: CategoryListProps) {
  const { categories } = useAudio()

  return (
    <div className="glass-card rounded-2xl p-4 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
        Categories
      </h2>
      <div className="grid gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategory?.id === category.id

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category)}
              className={`p-4 rounded-xl text-xl font-semibold flex items-center gap-3 transition-all hover-scale ${
                isSelected
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white glow"
                  : "glass-card hover:border-blue-500/50"
              }`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500/30" : "bg-blue-500/10"}`}>
                {categoryIcons[category.id] || <Music className="w-6 h-6" />}
              </div>
              <span>{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
