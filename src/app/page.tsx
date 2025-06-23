'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type User = {
  id: string
  name: string
  emoji: string
}

type Point = {
  id: string
  user_id: string
  category: string
  value: number
  submitted_by: string
  created_at: string
}

type FeedItem = {
  message: string
  timestamp: string
}

function formatCopenhagenTime(dateString: string) {
  const utcDate = new Date(dateString)
  const offsetMs = 2 * 60 * 60 * 1000 // +2 hours
  const localTime = new Date(utcDate.getTime() + offsetMs)
  return localTime.toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function Home() {
  const [scores, setScores] = useState<any[]>([])
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await supabase.from("users").select("*")
      const { data: points } = await supabase.from("points").select("*").order("created_at", { ascending: false }).limit(30)

      if (!users || !points) return

      const userMap = Object.fromEntries(users.map(u => [u.id, u]))

      const scoreMap: Record<string, number> = {}
      for (const p of points) {
        scoreMap[p.user_id] = (scoreMap[p.user_id] || 0) + p.value
      }
      const sortedScores = users.map(u => ({
        user: u,
        total: scoreMap[u.id] || 0,
      })).sort((a, b) => b.total - a.total)

      setScores(sortedScores)

      const activityFeed = points.map((p) => {
        const target = userMap[p.user_id]
        const by = userMap[p.submitted_by]
        return {
          message: `${by?.emoji || "👤"} ${by?.name || "Ukendt"} loggede ${p.category} for ${target?.emoji || "👤"} ${target?.name || "Ukendt"} (+${p.value})`,
          timestamp: formatCopenhagenTime(p.created_at),
        }
      })

      setFeed(activityFeed)
    }

    fetchData()
  }, [])

  const visibleFeed = showAll ? feed : feed.slice(0, 5)

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">🥇 UGE 30 Classement</h1>
      <ul className="space-y-2 mb-8">
        {scores.map((s, i) => (
          <li key={i} className="flex justify-between bg-white p-3 rounded shadow">
            <span>{i + 1}. {s.user.emoji} {s.user.name}</span>
            <span className="font-bold">{s.total} pts</span>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mb-3">🍻 Seneste Aktiviteter</h2>
      <ul className="space-y-1 mb-3">
        {visibleFeed.map((item, i) => (
          <li key={i} className="text-sm bg-gray-50 px-3 py-2 rounded shadow-sm">
            <span className="text-gray-700">{item.message}</span>
            <span className="block text-gray-400 text-xs">{item.timestamp}</span>
          </li>
        ))}
      </ul>

      {feed.length > 5 && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-block px-4 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition"
          >
            {showAll ? "Skjul igen" : "Se mere"}
          </button>
        </div>
      )}
    </main>
  )
}
