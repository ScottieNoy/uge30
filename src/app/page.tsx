'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-date-fns'

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Tooltip, Legend, TimeScale)

const jerseyNames: Record<string, string> = {
  gyldne_blaerer: "🥤 Gyldne Blærer",
  sprinter: "⚡ Sprinter",
  flydende_haand: "🤝 Flydende Hånd",
  førertroje: "🚴‍♂️ Førertrøje",
  maane: "🌙 Månetrøje",
  prikket: "🔴 Prikket Trøje",
  paedofil: "👶 Mest Pædofil",
  ungdom: "🧑‍🍼 Ungdomstrøje",
}

type FeedItem = {
  message: string
  timestamp: string
}

function formatCopenhagenTime(dateString: string) {
  const utcDate = new Date(dateString)
  const offsetMs = 2 * 60 * 60 * 1000
  const localTime = new Date(utcDate.getTime() + offsetMs)
  return localTime.toLocaleTimeString("da-DK", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function Home() {
  const [jerseyBoards, setJerseyBoards] = useState<Record<string, any[]>>({})
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [showAll, setShowAll] = useState(false)
  const [drinkPaceData, setDrinkPaceData] = useState<Record<string, any>>({})

  useEffect(() => {
    const fetchData = async () => {
      const { data: users } = await supabase.from("users").select("*")
      const { data: points } = await supabase.from("points").select("*").order("created_at", { ascending: true })
      if (!users || !points) return
      const nonAdmins = users.filter(u => !u.is_admin)


      const userMap = Object.fromEntries(users.map(u => [u.id, u]))

      const jerseyScores: Record<string, Record<string, number>> = {}
      for (const u of nonAdmins) {
        jerseyScores[u.id] = {
          gyldne_blaerer: 0,
          sprinter: 0,
          flydende_haand: 0,
          førertroje: 0,
          ungdom: 0,
        }
      }

      for (const p of points) {
        if (jerseyScores[p.user_id]) {
          jerseyScores[p.user_id][p.category] = (jerseyScores[p.user_id][p.category] || 0) + p.value
          jerseyScores[p.user_id].førertroje += p.value
        }

        if (p.submitted_by && p.user_id !== p.submitted_by && jerseyScores[p.submitted_by]) {
          jerseyScores[p.submitted_by].flydende_haand += p.value
        }
      }

      const boards: Record<string, any[]> = {}
      Object.keys(jerseyNames).forEach(category => {
        boards[category] = nonAdmins.map(u => ({
          user: u,
          total: jerseyScores[u.id]?.[category] || 0,
        })).sort((a, b) => b.total - a.total)
      })

      setJerseyBoards(boards)
      // Auto-update jersey holders if they changed
const { data: existingJerseys } = await supabase.from("jerseys").select("*")
if (existingJerseys) {
  for (const category of Object.keys(boards)) {
    const top = boards[category][0]
    if (!top || top.total === 0) continue

    const current = existingJerseys.find(j => j.name === category)
    if (!current) continue

    if (current.holder_id !== top.user.id) {
      await supabase.from("jerseys").update({
        holder_id: top.user.id,
        awarded_at: new Date().toISOString(),
      }).eq("name", category)
    }
  }
}


      // 🔄 Auto-assign jerseys to top scorers
      const categoriesToAssign = ["gyldne_blaerer", "sprinter", "flydende_haand", "førertroje", "ungdom"]
      for (const category of categoriesToAssign) {
        const top = boards[category]?.[0]
        if (top?.user?.id) {
          await supabase
            .from("jerseys")
            .update({ holder_id: top.user.id, awarded_at: new Date().toISOString() })
            .eq("id", category)
        }
      }

      const buildChartData = (category: string | null) => {
        const intervalMs = 5 * 60 * 1000
        const now = new Date()
        const today8am = new Date(now)
        today8am.setUTCHours(6, 0, 0, 0)
        const copenhagenOffset = 2 * 60 * 60 * 1000

        const todayPoints = points.filter(p => {
          const localTime = new Date(p.created_at).getTime() + copenhagenOffset
          return (category === null || p.category === category) && localTime >= today8am.getTime()
        })

        const userBuckets: Record<string, number[]> = {}
        const labels: string[] = []
        const bucketTimes: number[] = []
        for (let t = today8am.getTime(); t <= now.getTime(); t += intervalMs) {
          bucketTimes.push(t)
          labels.push(new Date(t).toISOString())
        }

        for (const u of nonAdmins) {
          let cumulative = 0
          const data: number[] = []
          for (const bucketStart of bucketTimes) {
            const bucketEnd = bucketStart + intervalMs
            const pointsInBucket = todayPoints.filter(p => {
              const localTime = new Date(p.created_at).getTime() + copenhagenOffset
              return p.user_id === u.id && localTime >= bucketStart && localTime < bucketEnd
            })
            cumulative += pointsInBucket.reduce((sum, p) => sum + p.value, 0)
            data.push(cumulative)
          }
          userBuckets[u.id] = data
        }

        const colors = ['hsl(327, 67%, 40%)', 'hsl(140, 75%, 47%)', 'hsl(71, 66%, 57%)', 'hsl(44, 97%, 53%)', 'hsl(16, 61%, 42%)', 'hsl(111, 74%, 56%)']
        const datasets = nonAdmins.map((u, i) => ({
          label: `${u.emoji || "👤"} ${u.firstname}`,
          data: userBuckets[u.id],
          borderColor: colors[i % colors.length],
          backgroundColor: colors[i % colors.length] + "33",
          fill: false,
          tension: 0.3,
        }))
        return { labels, datasets }
      }

      setDrinkPaceData({
        førertroje: buildChartData(null),
        gyldne_blaerer: buildChartData("gyldne_blaerer"),
        sprinter: buildChartData("sprinter"),
      })

      const activityFeed = [...points].reverse().map((p) => {
        const target = userMap[p.user_id]
        const by = userMap[p.submitted_by]
        return {
          message: `${by?.emoji || "👤"} ${by?.firstname || "Ukendt"} loggede ${p.subcategory} for ${target?.emoji || "👤"} ${target?.firstname || "Ukendt"} (+${p.value})`,
          timestamp: formatCopenhagenTime(p.created_at),
        }
      })

      setFeed(activityFeed)
    }

    fetchData()
  }, [])

  const visibleFeed = showAll ? feed : feed.slice(0, 5)

  return (
    <main className="p-4 max-w-5xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold">🚴‍♂️ UGE 30 Klassement</h1>

      {["førertroje", "gyldne_blaerer", "sprinter", ...Object.keys(jerseyBoards).filter(k => !["førertroje", "gyldne_blaerer", "sprinter"].includes(k))].map(key => (
        <section key={key} className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-3">{jerseyNames[key] || key}</h2>
          <ul className="space-y-2 mb-4">
            {jerseyBoards[key]?.map((entry, i) => (
              <li key={entry.user.id} className="flex justify-between">
                <span>{i + 1}. {entry.user.emoji} {entry.user.firstname}</span>
                <span className="font-bold">{entry.total} pts</span>
              </li>
            ))}
          </ul>

          {drinkPaceData?.[key] && (
            <div className="mt-4">
              <Line
                data={drinkPaceData[key]}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: true, position: 'bottom' },
                    tooltip: { mode: 'index', intersect: false },
                  },
                  scales: {
                    x: {
                      type: 'time',
                      time: {
                        unit: 'minute',
                        tooltipFormat: 'HH:mm',
                        displayFormats: { minute: 'HH:mm' },
                      },
                      title: { display: true, text: "Tid" },
                    },
                    y: {
                      beginAtZero: true,
                      title: { display: true, text: "Akkumulerede point" },
                    },
                  },
                }}
              />
            </div>
          )}
        </section>
      ))}

      <section>
        <h2 className="text-xl font-bold mb-3">📜 Seneste Aktiviteter</h2>
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
      </section>
    </main>
  )
}
