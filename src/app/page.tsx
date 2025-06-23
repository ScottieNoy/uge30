'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

type User = {
  id: string
  name: string
  emoji: string
}

type Point = {
  user_id: string
  value: number
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Jersey = {
  name: string
  holder_id: string
}

type Score = {
  user: User
  total: number
  jerseys: string[]
}

export default function Home() {
  const [scores, setScores] = useState<Score[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await supabase.from("users").select("*")
      const { data: points } = await supabase.from("points").select("*")
      const { data: jerseys } = await supabase.from("jerseys").select("*")

      if (!users || !points || !jerseys) return

      // Tally points per user
      const scoreMap: Record<string, number> = {}
      for (const p of points as Point[]) {
        scoreMap[p.user_id] = (scoreMap[p.user_id] || 0) + p.value
      }

      const results: Score[] = (users as User[]).map(u => ({
  user: u,
  total: scoreMap[u.id] || 0,
  jerseys: (jerseys || [])
    .filter(j => j.holder_id === u.id)
    .map(j => j.name),
}))

      results.sort((a, b) => b.total - a.total)
      setScores(results)
    }

    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const getBgColor = (index: number) => {
    if (index === 0) return "bg-yellow-100"
    if (index === 1) return "bg-gray-200"
    if (index === 2) return "bg-orange-100"
    return "bg-white"
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">
        🥇 UGE 30 Leaderboard
      </h1>
      <ul className="space-y-3">
        {scores.map((s, i) => (
          <li
            key={s.user.id}
            className={`flex justify-between items-center p-4 rounded shadow ${getBgColor(i)}`}
          >
            <div>
              <span className="font-semibold text-lg sm:text-xl">
                {i + 1}. {s.user.emoji} {s.user.name}
              </span>
              {s.jerseys.length > 0 && (
                <div className="text-sm text-yellow-600 mt-1">
                  👕 {s.jerseys.join(", ")}
                </div>
              )}
            </div>
            <div className="text-green-700 font-bold text-lg sm:text-xl">
              {s.total} pts
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
