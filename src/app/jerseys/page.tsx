'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@/types"

type Jersey = {
  id: string
  name: string
  awarded_at: string
  holder_id: string
  holder?: User
}

export default function JerseyPage() {
  const [jerseys, setJerseys] = useState<Jersey[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: jData } = await supabase.from("jerseys").select("*")
      const { data: users } = await supabase.from("users").select("*")

      if (!jData || !users) return

      const enriched = jData.map(j => ({
        ...j,
        holder: users.find(u => u.id === j.holder_id),
      }))

      setJerseys(enriched)
    }

    fetchData()
  }, [])

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🚴 Jersey Holders</h1>
      <ul className="space-y-2">
        {jerseys.map(j => (
          <li key={j.id} className="bg-white p-4 rounded shadow">
            <div className="font-bold">{j.name}</div>
            <div>{j.holder?.emoji} {j.holder?.name || "Unknown"}</div>
            <div className="text-sm text-gray-500">Since: {new Date(j.awarded_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </main>
  )
}
