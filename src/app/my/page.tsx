'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { QRCodeCanvas } from "qrcode.react"

type User = {
  id: string
  name: string
  emoji: string
}

export default function MyPage() {
  const [user, setUser] = useState<User | null>(null)
  const [points, setPoints] = useState<number>(0)
  const [jersey, setJersey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const sessionUser = sessionData.session?.user

      if (!sessionUser) {
        alert("You must be logged in to view this page.")
        return
      }

      const userId = sessionUser.id

      // 1. Fetch from users table
      const { data: users } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .limit(1)

      const currentUser = users?.[0] || null
      setUser(currentUser)

      // 2. Sum points
      const { data: pointLogs } = await supabase
        .from("points")
        .select("value")
        .eq("user_id", userId)

      const total = pointLogs?.reduce((acc, p) => acc + (p.value || 0), 0) || 0
      setPoints(total)

      // 3. Check if holding a jersey
      const { data: jerseys } = await supabase
        .from("jerseys")
        .select("name")
        .eq("holder_id", userId)

      if (jerseys && jerseys.length > 0) {
        const names = jerseys.map(j => j.name).join(", ")
        setJersey(names)
      }

      setLoading(false)
    }

    loadData()
  }, [])

  const origin = typeof window !== "undefined" ? window.location.origin : ""

  if (loading) return <p className="p-4">Loading your profile...</p>

  if (!user) return <p className="p-4 text-red-600">User not found.</p>

  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">👤 My Festival Stats</h1>
      <div className="bg-white shadow rounded p-4 mb-6">
        <p className="text-lg">{user.emoji} <strong>{user.name}</strong></p>
        <p>Total Points: <strong>{points}</strong></p>
        <p>Jersey: {jersey ? <strong>{jersey}</strong> : "None"}</p>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">🔗 Din personlige QR-kode</h2>
        <p className="text-gray-600 mb-3">Lad en ven scanne den for at logge en drik for dig</p>
        <div className="inline-block bg-white p-4 rounded shadow">
          <QRCodeCanvas value={`${origin}/drink/u/${user.id}`} size={200} />
          <p className="mt-2 font-semibold">{user.emoji} {user.name}</p>
        </div>
      </div>
    </main>
  )
}
