"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { PlusIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline'

interface Song {
  id: number
  title: string
  artist: string
  category_id: number
  file_path: string
  is_played: boolean
}

interface Category {
  id: number
  name: string
}

export default function SongsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', file.name.replace(/\.[^/.]+$/, ''))
        formData.append('category_id', selectedCategory)

        const response = await fetch('/api/songs', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Failed to upload song')
        }
      }
      // Refresh songs list
      fetchSongs()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload songs')
    } finally {
      setIsUploading(false)
    }
  }, [selectedCategory])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg']
    }
  })

  const fetchSongs = async () => {
    const response = await fetch('/api/songs')
    const data = await response.json()
    setSongs(data)
  }

  const fetchCategories = async () => {
    const response = await fetch('/api/categories')
    const data = await response.json()
    setCategories(data)
  }

  const deleteSong = async (id: number) => {
    if (!confirm('Are you sure you want to delete this song?')) return

    try {
      const response = await fetch(`/api/songs/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete song')
      }

      setSongs(songs.filter(song => song.id !== id))
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete song')
    }
  }

  const resetSong = async (id: number) => {
    try {
      const response = await fetch(`/api/songs/${id}/reset`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to reset song')
      }

      setSongs(songs.map(song => 
        song.id === id ? { ...song, is_played: false } : song
      ))
    } catch (error) {
      console.error('Reset error:', error)
      alert('Failed to reset song')
    }
  }

  // Load initial data
  useState(() => {
    fetchSongs()
    fetchCategories()
  })

  return (
    <div className="space-y-6">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Upload Songs</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Upload MP3, WAV, or OGG files to add them to your music library.</p>
          </div>
          <div className="mt-5">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div
              {...getRootProps()}
              className={`mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
                isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
              }`}
            >
              <div className="space-y-1 text-center">
                <input {...getInputProps()} />
                <PlusIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <p className="pl-1">Drag and drop files here, or click to select files</p>
                </div>
                <p className="text-xs text-gray-500">MP3, WAV, or OGG up to 10MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Songs</h3>
          <div className="mt-4 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Title</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Artist</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {songs.map((song) => (
                        <tr key={song.id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                            {song.title}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{song.artist}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {categories.find(c => c.id === song.category_id)?.name}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {song.is_played ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Played
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Not Played
                              </span>
                            )}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => resetSong(song.id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              <ArrowPathIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => deleteSong(song.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
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
    </div>
  )
} 