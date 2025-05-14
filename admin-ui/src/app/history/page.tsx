'use client'

import { useState } from 'react'

interface PlayHistory {
  id: number
  song_id: number
  played_at: string
  song?: {
    title: string
    artist: string
  }
}

export default function HistoryPage() {
  const [history, setHistory] = useState<PlayHistory[]>([])

  const fetchHistory = async () => {
    const response = await fetch('/api/history')
    const data = await response.json()
    setHistory(data)
  }

  // Load initial data
  useState(() => {
    fetchHistory()
  })

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Play History</h3>
        <div className="mt-4 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Song</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Artist</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Played At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {history.map((entry) => (
                      <tr key={entry.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                          {entry.song?.title}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {entry.song?.artist}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(entry.played_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 