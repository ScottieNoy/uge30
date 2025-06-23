'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

const ENFORCE_NO_SELF_LOGGING = false

const categoryOptions = [
  { label: "Øl (+1)", value: "beer", points: 1 },
  { label: "Shot (+1)", value: "shot", points: 1 },
  { label: "Cocktail (+2)", value: "cocktail", points: 2 },
  { label: "Tragt (+5)", value: "funnel", points: 5 },
  { label: "Drukspil (+5)", value: "game", points: 5 },
  { label: "Natklub / Sent aften (+3)", value: "latenight", points: 3 },
  { label: "Kaos (+3)", value: "chaos", points: 3 },
  { label: "Bonus (+2)", value: "bonus", points: 2 },
]

export default function LogForUser() {
  const { id } = useParams()
  const router = useRouter()
  const [targetUser, setTargetUser] = useState<any>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [canLog, setCanLog] = useState(false)
  const [cooldownLeft, setCooldownLeft] = useState<number | null>(null)
  const [category, setCategory] = useState("beer")
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
    .eq("category", "beer")
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
}, [id, router])


  const handleLog = async () => {
  if (!currentUserId || !targetUser) return

  const entry = categoryOptions.find(opt => opt.value === category)
  if (!entry) return alert("Ugyldig kategori")

  const { error } = await supabase.from("points").insert({
    user_id: targetUser.id,
    category,
    value: entry.points,
    submitted_by: currentUserId,
  })

  if (error) {
    console.error("Insert error:", error)
    alert("Fejl: " + error.message)
  } else {
    alert(`✅ Du loggede ${entry.label} for ${targetUser.name}`)
    // 👇 trigger full refresh of log state
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
        <p>Du kan ikke logge drikke for dig selv.</p>
      </main>
    )
  }

  return (
    <main className="p-6 text-center">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">
        🍹 Log en drik for {targetUser.emoji} {targetUser.name}
      </h1>

      <select
        className="w-full p-2 border mb-4"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {categoryOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {canLog ? (
        <button
          onClick={handleLog}
          className="bg-green-600 text-white px-6 py-3 rounded text-lg"
        >
          ✅ Log {categoryOptions.find(c => c.value === category)?.label}
        </button>
      ) : (
        <>
          <p className="text-red-600 font-semibold mb-2">
            ⏳ Vent {cooldownLeft} minut{cooldownLeft === 1 ? "" : "ter"} før du kan logge en ny øl
          </p>
          {lastLogTime && (
            <p className="text-sm text-gray-600">Sidst logget: {lastLogTime}</p>
          )}
        </>
      )}
    </main>
  )
}
