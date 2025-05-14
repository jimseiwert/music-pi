"use client"

import { useEffect, useState } from "react"

interface GoalAnimationProps {
  show: boolean
  onComplete: () => void
}

export default function GoalAnimation({ show, onComplete }: GoalAnimationProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        onComplete()
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!visible) return null

  return (
    <div className="goal-animation">
      <div className="goal-text">GOAL!</div>
    </div>
  )
}
