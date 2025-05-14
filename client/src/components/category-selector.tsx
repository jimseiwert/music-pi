"use client"

import type React from "react"
import type { Category } from "@/lib/types"
import { Zap, Clock, Disc, Trophy, Music } from "lucide-react"

interface CategorySelectorProps {
  categories: Category[]
  selectedCategory: Category | null
  onSelectCategory: (category: Category) => void
}

// Map category IDs to icons
const categoryIcons: Record<string, React.ReactNode> = {
  warmup: <Zap className="w-5 h-5" />,
  "period-breaks": <Clock className="w-5 h-5" />,
  "power-play": <Disc className="w-5 h-5" />,
  victory: <Trophy className="w-5 h-5" />,
}

export default function CategorySelector({ categories, selectedCategory, onSelectCategory }: CategorySelectorProps) {
  return (
    <div className="category-drawer">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category)}
          className={`category-button ${selectedCategory?.id === category.id ? "active" : ""}`}
        >
          <span className="mr-2">{categoryIcons[category.id] || <Music className="w-5 h-5" />}</span>
          {category.name.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
