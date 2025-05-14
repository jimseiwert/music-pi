import type { AppData } from "./types"

// Function to fetch data from server
export async function fetchData(): Promise<AppData> {
  // In a real app, this would be a fetch to your API
  // For example: const response = await fetch('/api/music-data')

  // For now, we'll simulate a network request
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a 50% chance of failure to test offline mode
      if (Math.random() > 0.5) {
        resolve(getMockData())
      } else {
        reject(new Error("Failed to connect to server"))
      }
    }, 2000)
  })
}

// Function to get local data (fallback)
export function getLocalData(): AppData {
  // In a real app, you might check localStorage first
  // const cachedData = localStorage.getItem('musicData')
  // if (cachedData) return JSON.parse(cachedData)

  // Fallback to hardcoded data
  return getMockData()
}

// Mock data for development
function getMockData(): AppData {
  return {
    categories: [
      {
        id: "warmup",
        name: "Warm Up",
        songs: [
          {
            id: "warmup-1",
            title: "Eye of the Tiger",
            artist: "Survivor",
            audioUrl: "/audio/eye-of-the-tiger.mp3",
            categoryId: "warmup",
          },
          {
            id: "warmup-2",
            title: "Welcome to the Jungle",
            artist: "Guns N' Roses",
            audioUrl: "/audio/welcome-to-the-jungle.mp3",
            categoryId: "warmup",
          },
          {
            id: "warmup-3",
            title: "Thunderstruck",
            artist: "AC/DC",
            audioUrl: "/audio/thunderstruck.mp3",
            categoryId: "warmup",
          },
          {
            id: "warmup-4",
            title: "Rock and Roll All Nite",
            artist: "KISS",
            audioUrl: "/audio/rock-and-roll-all-nite.mp3",
            categoryId: "warmup",
          },
        ],
      },
      {
        id: "period-breaks",
        name: "Period Breaks",
        songs: [
          {
            id: "break-1",
            title: "We Will Rock You",
            artist: "Queen",
            audioUrl: "/audio/we-will-rock-you.mp3",
            categoryId: "period-breaks",
          },
          {
            id: "break-2",
            title: "Rock and Roll (Part 2)",
            artist: "Gary Glitter",
            audioUrl: "/audio/rock-and-roll-part-2.mp3",
            categoryId: "period-breaks",
          },
          {
            id: "break-3",
            title: "Song 2",
            artist: "Blur",
            audioUrl: "/audio/song-2.mp3",
            categoryId: "period-breaks",
          },
        ],
      },
      {
        id: "power-play",
        name: "Power Play",
        songs: [
          {
            id: "pp-1",
            title: "Seven Nation Army",
            artist: "The White Stripes",
            audioUrl: "/audio/seven-nation-army.mp3",
            categoryId: "power-play",
          },
          {
            id: "pp-2",
            title: "Enter Sandman",
            artist: "Metallica",
            audioUrl: "/audio/enter-sandman.mp3",
            categoryId: "power-play",
          },
          {
            id: "pp-3",
            title: "Uprising",
            artist: "Muse",
            audioUrl: "/audio/uprising.mp3",
            categoryId: "power-play",
          },
        ],
      },
      {
        id: "victory",
        name: "Victory",
        songs: [
          {
            id: "victory-1",
            title: "We Are The Champions",
            artist: "Queen",
            audioUrl: "/audio/we-are-the-champions.mp3",
            categoryId: "victory",
          },
          {
            id: "victory-2",
            title: "Celebration",
            artist: "Kool & The Gang",
            audioUrl: "/audio/celebration.mp3",
            categoryId: "victory",
          },
          {
            id: "victory-3",
            title: "All I Do Is Win",
            artist: "DJ Khaled",
            audioUrl: "/audio/all-i-do-is-win.mp3",
            categoryId: "victory",
          },
        ],
      },
      {
        id: "penalty-kill",
        name: "Penalty Kill",
        songs: [
          {
            id: "pk-1",
            title: "Back in Black",
            artist: "AC/DC",
            audioUrl: "/audio/back-in-black.mp3",
            categoryId: "penalty-kill",
          },
          {
            id: "pk-2",
            title: "Iron Man",
            artist: "Black Sabbath",
            audioUrl: "/audio/iron-man.mp3",
            categoryId: "penalty-kill",
          },
        ],
      },
      {
        id: "timeout",
        name: "Timeout",
        songs: [
          {
            id: "timeout-1",
            title: "The Final Countdown",
            artist: "Europe",
            audioUrl: "/audio/the-final-countdown.mp3",
            categoryId: "timeout",
          },
          {
            id: "timeout-2",
            title: "Jump Around",
            artist: "House of Pain",
            audioUrl: "/audio/jump-around.mp3",
            categoryId: "timeout",
          },
        ],
      },
    ],
    quickActions: [
      {
        id: "goal",
        name: "GOAL!",
        audioUrl: "/audio/goal-horn.mp3",
      },
      {
        id: "defense",
        name: "DE-FENSE!",
        audioUrl: "/audio/defense-chant.mp3",
      },
      {
        id: "charge",
        name: "CHARGE!",
        audioUrl: "/audio/charge.mp3",
      },
      {
        id: "lets-go",
        name: "LET'S GO!",
        audioUrl: "/audio/lets-go.mp3",
      },
    ],
  }
}
