'use client'

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { User, PointCategory } from "@/types"

const categoryPoints: Record<PointCategory, number> = {
  beer: 1,
  shot: 1,
  cocktail: 2,
  funnel: 5,
  game: 5,
  latenight: 3,
  chaos: 3,
  bonus: 2,
}

export default function LogPointsPage() {
  const [users, setUsers] = useState<User[]>([])
  const [userId, setUserId] = useState("")
  const [category, setCategory] = useState<PointCategory>("beer")
  const [submittedBy, setSubmittedBy] = useState("")

  useEffect(() => {
    supabase.from("users").select("*").then(({ data }) => {
      if (data) setUsers(data)
    })
  }, [])

  const handleSubmit = async () => {
    if (!userId) return alert("Please select a user")

    const { error } = await supabase.from("points").insert([
      {
        user_id: userId,
        category,
        value: categoryPoints[category],
        submitted_by: submittedBy || null,
      },
    ])

    if (error) {
      console.error(error)
      alert("Error submitting points.")
    } else {
      alert("Point added!")
      setUserId("")
      setSubmittedBy("")
    }
  }

  return (
    <main className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">➕ Add Points</h1>

      <select className="w-full p-2 border mb-4" value={userId} onChange={(e) => setUserId(e.target.value)}>
        <option value="">Select user</option>
        {users.map(u => (
          <option key={u.id} value={u.id}>{u.emoji} {u.name}</option>
        ))}
      </select>

      <select className="w-full p-2 border mb-4" value={category} onChange={(e) => setCategory(e.target.value as PointCategory)}>
        {Object.entries(categoryPoints).map(([cat, val]) => (
          <option key={cat} value={cat}>{cat} (+{val} pts)</option>
        ))}
      </select>

      <input
        className="w-full p-2 border mb-4"
        type="text"
        placeholder="Submitted by (optional)"
        value={submittedBy}
        onChange={(e) => setSubmittedBy(e.target.value)}
      />

      <button onClick={handleSubmit} className="w-full p-2 bg-blue-600 text-white rounded">Submit</button>
    </main>
  )
}
