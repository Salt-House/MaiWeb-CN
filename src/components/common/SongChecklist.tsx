"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { FaCheckCircle, FaRegCircle, FaChevronRight } from "react-icons/fa"
import { getSongDetail } from "@/services/music"
import { CONFIG } from "@/config/api"
import { Song } from "@/types/music"

const songIds = [
  1009, 1008, 1100, 1097, 1098, 1099, 1164, 1163, 1162, 1161, 1228, 1229, 1230, 1231, 1463, 1464,
  1465, 1466, 1538, 1539, 1540, 1541, 1620, 1622, 1623, 1621, 1737, 1738, 1739,
]

let cachedSongs: Song[] | null = null
let fetchPromise: Promise<Song[]> | null = null

export const preloadSongs = () => {
  if (cachedSongs) return Promise.resolve(cachedSongs)
  if (fetchPromise) return fetchPromise

  fetchPromise = (async () => {
    try {
      const promises = songIds.map(id => getSongDetail(id.toString(), false))
      const results = await Promise.all(promises)
      // Extract song data from results. Assuming getSongDetail returns an array with one item when searching by ID
      const fetchedSongs = results
        .map(res => (Array.isArray(res) && res.length > 0 ? res[0] : null))
        .filter(Boolean) as Song[]
      cachedSongs = fetchedSongs
      return fetchedSongs
    } catch (error) {
      console.error("Failed to fetch songs", error)
      return []
    }
  })()
  return fetchPromise
}

export default function SongChecklist() {
  const [songs, setSongs] = useState<Song[]>(cachedSongs || [])
  const [checkedSongs, setCheckedSongs] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(!cachedSongs)

  useEffect(() => {
    // Load checked state from localStorage
    const savedChecked = localStorage.getItem("kaleidoscope_blue_gate_checked")
    if (savedChecked) {
      setCheckedSongs(new Set(JSON.parse(savedChecked)))
    }

    if (cachedSongs) {
      setSongs(cachedSongs)
      setLoading(false)
      return
    }

    preloadSongs().then(data => {
      setSongs(data)
      setLoading(false)
    })
  }, [])

  const toggleCheck = (id: number) => {
    const newChecked = new Set(checkedSongs)
    if (newChecked.has(id)) {
      newChecked.delete(id)
    } else {
      newChecked.add(id)
    }
    setCheckedSongs(newChecked)
    localStorage.setItem("kaleidoscope_blue_gate_checked", JSON.stringify(Array.from(newChecked)))
  }

  if (loading) {
    return <div className="text-center py-4 text-gray-500">加载歌曲列表中...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {songs.map(song => {
        const isChecked = checkedSongs.has(Number(song.id))
        return (
          <div
            key={song.id}
            className={`flex items-center p-3 rounded-xl border transition-all duration-200 ${
              isChecked ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
            }`}
          >
            <button
              onClick={() => toggleCheck(Number(song.id))}
              className="mr-3 text-2xl focus:outline-none transition-transform active:scale-90"
            >
              {isChecked ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaRegCircle className="text-gray-300 hover:text-gray-400" />
              )}
            </button>

            <Link
              href={`${CONFIG.API.WEB.MUSIC}/${song.id}`}
              target="_blank"
              className="flex items-center flex-1 min-w-0 group"
            >
              <div className="relative w-12 h-12 flex-shrink-0 mr-3 rounded-md overflow-hidden border border-gray-100">
                <Image
                  src={`${CONFIG.ASSETS.MAIMAI.JACKET}/${song.id}.png`}
                  alt={song.title}
                  fill
                  className="object-cover transition-transform duration-300"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`font-bold text-sm truncate ${
                    isChecked ? "text-green-800" : "text-gray-800 group-hover:text-pink-500"
                  }`}
                >
                  {song.title}
                </h4>
                <p className="text-xs text-gray-500 truncate">{song.artist}</p>
              </div>
              <FaChevronRight className="ml-3 text-gray-300 group-hover:text-pink-500 transition-colors text-sm" />
            </Link>
          </div>
        )
      })}
    </div>
  )
}
