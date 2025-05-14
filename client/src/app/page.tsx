import { Suspense } from "react"
import LoadingScreen from "@/components/loading-screen"
import MusicPlayer from "@/components/music-player"

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <MusicPlayer />
      </Suspense>
    </main>
  )
}
