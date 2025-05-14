"use client"

import type React from "react"
import type { Category } from "@/lib/types"
import { Music, Disc, Clock, Trophy, Zap } from "lucide-react"

interface CategoryTabsProps {
  categories: Category[]
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

export default function CategoryTabs({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="px-4 mb-2">
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const isSelected = selectedCategory?.id === category.id

          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category)}
              className={`category-tab flex items-center gap-2 px-6 py-3 text-xl font-bold whitespace-nowrap ${
                isSelected ? "active text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <div className={`p-1 rounded-lg ${isSelected ? "bg-blue-500/30" : "bg-blue-500/10"}`}>
                {categoryIcons[category.id] || <Music className="w-5 h-5" />}
              </div>
              {category.name.toUpperCase()}
            </button>
          )
        })}
      </div>
      <div className="hockey-divider w-full" />
    </div>
  )
}
