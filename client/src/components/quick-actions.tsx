"use client"

import type React from "react"

import { useAudio } from "./audio-provider"
import { Volume2, Zap, Shield, Flag, ChevronRight } from "lucide-react"

// Map action IDs to icons
const actionIcons: Record<string, React.ReactNode> = {
  goal: <Zap className="w-6 h-6" />,
  defense: <Shield className="w-6 h-6" />,
  charge: <ChevronRight className="w-6 h-6" />,
  "lets-go": <Flag className="w-6 h-6" />,
}

export default function QuickActions() {
  const { quickActions, playQuickAction } = useAudio()

  return (
    <div className="quick-actions">
      {quickActions.map((action) => (
        <button
          key={action.id}
          onClick={() => playQuickAction(action)}
          className={`action-button ${action.id === "goal" ? "goal" : ""}`}
        >
          <div className="p-1 rounded-full bg-white/10">
            {actionIcons[action.id] || <Volume2 className="w-6 h-6" />}
          </div>
          <span>{action.name}</span>
        </button>
      ))}
    </div>
  )
}
