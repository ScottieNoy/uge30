'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@/types"

const jerseyCategories = [
  { value: "gyldne_blaerer", label: "🥤 Gyldne Blærer" },
  { value: "sprinter", label: "⚡ Sprinter" },
  { value: "flydende_haand", label: "🤝 Flydende Hånd" },
  { value: "førertroje", label: "🚴‍♂️ Førertrøje" },
  { value: "maane", label: "🌙 Månetrøje" },
  { value: "prikket", label: "🔴 Prikket Trøje" },
  { value: "paedofil", label: "👶 Mest Pædofil" },
  { value: "ungdom", label: "🧑‍🍼 Ungdomstrøje" },
]

export default function AdminLogPage() {
  const [users, setUsers] = useState<User[]>([])
  const [category, setCategory] = useState("gyldne_blaerer")
  const [userId, setUserId] = useState("")
  const [value, setValue] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const sessionUser = sessionData.session?.user
      if (!sessionUser) return router.push("/")

      const { data: userData, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", sessionUser.id)
        .single()

      if (error || !userData?.is_admin) return router.push("/")

      const { data: usersData } = await supabase.from("users").select("*")
      if (usersData) setUsers(usersData)

      setAuthorized(true)
      setLoading(false)
    }

    checkAdminAndFetch()
  }, [router])

  const handleSubmit = async () => {
  if (!userId || !category || !value) return alert("Udfyld alle felter")

  setSubmitting(true)

  const { data: session, error: sessionError } = await supabase.auth.getSession()
  const adminId = session.session?.user.id

  if (!adminId || sessionError) {
    console.error("Missing session or admin ID", sessionError)
    alert("Sessionen kunne ikke findes.")
    setSubmitting(false)
    return
  }

  const payload = {
    user_id: userId,
    category,
    subcategory: "other",
    value,
    submitted_by: adminId,
  }

  console.log("Inserting point payload:", payload)

  const { error } = await supabase.from("points").insert(payload)

  if (error) {
    console.error("Insert error:", error)
    alert("Fejl ved indsendelse")
  } else {
    alert("✅ Point logget!")
  }

  setSubmitting(false)
}


  if (loading) return <p className="p-4">Loader...</p>
  if (!authorized) return null

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔒 Admin Log</h1>

      <label className="block mb-2 font-semibold">👤 Vælg deltager</label>
      <select
        className="w-full border p-2 mb-4"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      >
        <option value="">-- Vælg deltager --</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.emoji} {u.firstname}</option>
        ))}
      </select>

      <label className="block mb-2 font-semibold">🏆 Vælg kategori</label>
      <select
        className="w-full border p-2 mb-4"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        {jerseyCategories.map(c => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <label className="block mb-2 font-semibold">➕ Point</label>
      <input
        type="number"
        className="w-full border p-2 mb-4"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />

      <button
        className="bg-blue-600 text-white px-6 py-2 rounded"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {submitting ? "Logger..." : "Log point"}
      </button>
    </main>
  )
}
