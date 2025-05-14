"use client"

import { useAudio } from "./audio-provider"
import { Trash2, Settings } from "lucide-react"

export default function Header() {
  const { clearPlayedSongs } = useAudio()

  return (
    <header className="header flex items-center justify-between">
      <div className="flex items-center">
        <div className="w-12 h-12 mr-3 flex items-center justify-center">
          <img src="/hockey-puck.png" alt="Hockey puck logo" className="w-10 h-10 object-contain" />
        </div>
        <h1 className="text-3xl font-bold logo-gradient">HOCKEY DJ</h1>
      </div>

      <div className="scoreboard">
        <div className="score-display">
          <div className="score-label text-blue-400">HOME</div>
          <div className="score-value">3</div>
        </div>
        <div className="score-display">
          <div className="score-label text-red-400">AWAY</div>
          <div className="score-value">2</div>
        </div>
        <div className="score-display">
          <div className="score-label">PERIOD</div>
          <div className="score-value">3</div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={clearPlayedSongs}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
        >
          <Trash2 className="w-5 h-5" />
          <span>Clear Played</span>
        </button>

        <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-all">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
      </div>
    </header>
  )
}
