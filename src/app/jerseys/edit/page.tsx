'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@/types"

type Jersey = {
  id: string
  name: string
  holder_id: string
}

export default function EditJerseys() {
  const [jerseys, setJerseys] = useState<Jersey[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      // 1. Check current session
      const { data: sessionData } = await supabase.auth.getSession()
      const sessionUser = sessionData.session?.user

      if (!sessionUser) {
        router.push("/")
        return
      }

      // 2. Check if the user is admin
      const { data: userData, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", sessionUser.id)
        .single()

      if (error || !userData?.is_admin) {
        router.push("/")
        return
      }

      // 3. Load jerseys and users
      const { data: jerseysData } = await supabase.from("jerseys").select("*")
      const { data: usersData } = await supabase.from("users").select("*")

      if (jerseysData) setJerseys(jerseysData)
      if (usersData) setUsers(usersData)
      setAuthorized(true)
      setLoading(false)
    }

    checkAdminAndLoadData()
  }, [router])

  const handleUpdate = async (jerseyId: string, userId: string) => {
    setUpdating(true)
    const { error } = await supabase
      .from("jerseys")
      .update({ holder_id: userId, awarded_at: new Date().toISOString() })
      .eq("id", jerseyId)

    if (error) {
      alert("Failed to update jersey.")
      console.error(error)
    } else {
      alert("Jersey updated!")
    }
    setUpdating(false)
  }

  if (loading) return <p className="p-4">Checking admin access...</p>
  if (!authorized) return null

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛠️ Edit Jersey Holders</h1>
      {jerseys.map(jersey => (
        <div key={jersey.id} className="bg-white p-4 mb-4 rounded shadow">
          <h2 className="font-semibold mb-2">{jersey.name}</h2>
          <select
            className="w-full border p-2"
            value={jersey.holder_id || ""}
            onChange={(e) => handleUpdate(jersey.id, e.target.value)}
            disabled={updating}
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.emoji} {user.firstname}
              </option>
            ))}
          </select>
        </div>
      ))}
    </main>
  )
}
