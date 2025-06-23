'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

const ENFORCE_NO_SELF_LOGGING = true

const categoryOptions = [
  {
    group: "Drikke (Gyldne Blærer)",
    jersey: "gyldne_blaerer",
    options: [
      { label: "Øl (+1)", value: "beer", points: 1 },
      { label: "Vin (+2)", value: "wine", points: 2 },
      { label: "Vodka Drink (+2)", value: "vodka", points: 2 },
      { label: "Ølbong (+5)", value: "funnel", points: 5 },
      { label: "Shot (+1)", value: "shot", points: 1 },
    ]
  },
  {
    group: "Spil (Sprinter)",
    jersey: "sprinter",
    options: [
      { label: "Beer Pong (+3)", value: "beerpong", points: 3 },
      { label: "Cornhole (+3)", value: "cornhole", points: 3 },
      { label: "Dart (+2)", value: "dart", points: 2 },
      { label: "Billiard (+2)", value: "billiard", points: 2 },
      { label: "Stigegolf (+2)", value: "stigegolf", points: 2 },
    ]
  }
]

export default function LogForUser() {
  const { id } = useParams()
  const router = useRouter()
  const [targetUser, setTargetUser] = useState<any>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [canLog, setCanLog] = useState(false)
  const [cooldownLeft, setCooldownLeft] = useState<number | null>(null)
  const [subcategory, setSubcategory] = useState("beer")
  const [lastLogTime, setLastLogTime] = useState<string | null>(null)

  const fetchLogData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push("/login")
    setCurrentUserId(user.id)

    const { data: u } = await supabase.from("users").select("*").eq("id", id).single()
    setTargetUser(u)

    const { data: last } = await supabase
      .from("points")
      .select("*")
      .eq("user_id", id)
      .eq("subcategory", subcategory)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!last) {
      setCanLog(true)
    } else {
      const diff = (Date.now() - new Date(last.created_at).getTime()) / 60000
      if (diff >= 10) setCanLog(true)
      else setCooldownLeft(Math.ceil(10 - diff))

      const rawDate = new Date(last.created_at)
      const cphDate = new Date(rawDate.getTime() + 2 * 60 * 60 * 1000) // +2h offset
      const formatted = cphDate.toLocaleString("da-DK", {
        hour: "2-digit",
        minute: "2-digit",
        weekday: "short",
        day: "numeric",
        month: "short",
      })
      setLastLogTime(formatted)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchLogData()
  }, [id, subcategory])

  const handleLog = async () => {
  if (!currentUserId || !targetUser) return

  const entry = categoryOptions
    .flatMap(g => g.options.map(opt => ({ ...opt, jersey: g.jersey })))
    .find(opt => opt.value === subcategory)

  if (!entry) return alert("Ugyldig kategori")

  const inserts = [
    {
      user_id: targetUser.id,
      category: entry.jersey,
      subcategory: entry.value,
      value: entry.points,
      submitted_by: currentUserId,
    }
  ]

  // ✅ Only log Flydende Hånd point if:
  // - it's a drink (gyldne_blaerer)
  // - AND you're logging it for someone else (not yourself)
  if (
    entry.jersey === "gyldne_blaerer" &&
    targetUser.id !== currentUserId
  ) {
    inserts.push({
      user_id: currentUserId,
      category: "flydende_haand",
      subcategory: "other",
      value: 1,
      submitted_by: currentUserId,
    })
  }

  const { error } = await supabase.from("points").insert(inserts)

  if (error) {
    console.error("Insert error:", error)
    alert("Fejl: " + error.message)
  } else {
    alert(`✅ Du loggede ${entry.label} for ${targetUser.firstname}`)
    setLoading(true)
    setCanLog(false)
    setCooldownLeft(null)
    setLastLogTime(null)
    fetchLogData()
  }
}


  if (loading) return <p className="p-6">Loader...</p>

  if (ENFORCE_NO_SELF_LOGGING && currentUserId === id) {
    return (
      <main className="p-6 text-center">
        <h1 className="text-xl font-bold">⛔️ Ikke tilladt</h1>
        <p>Du kan ikke logge point for dig selv.</p>
      </main>
    )
  }

  return (
    <main className="p-6 text-center">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        🏅 Log en aktivitet for {targetUser.emoji} {targetUser.firstname}
      </h1>

      <select
        className="w-full p-2 border mb-4"
        value={subcategory}
        onChange={(e) => setSubcategory(e.target.value)}
      >
        {categoryOptions.map(group => (
          <optgroup key={group.group} label={group.group}>
            {group.options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {canLog ? (
        <button
          onClick={handleLog}
          className="bg-green-600 text-white px-6 py-3 rounded text-lg"
        >
          ✅ Log {categoryOptions.flatMap(g => g.options).find(c => c.value === subcategory)?.label}
        </button>
      ) : (
        <>
          <p className="text-red-600 font-semibold mb-2">
            ⏳ Vent {cooldownLeft} minut{cooldownLeft === 1 ? "" : "ter"} før du kan logge igen
          </p>
          {lastLogTime && (
            <p className="text-sm text-gray-600">Sidst logget: {lastLogTime}</p>
          )}
        </>
      )}
    </main>
  )
}
