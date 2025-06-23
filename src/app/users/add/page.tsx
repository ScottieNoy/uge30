'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

export default function AddUserPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [emoji, setEmoji] = useState("🍻")
  const [password, setPassword] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const sessionUser = sessionData.session?.user

      if (!sessionUser) {
        router.push("/")
        return
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", sessionUser.id)
        .single()

      if (error || !userData?.is_admin) {
        router.push("/")
        return
      }

      setAuthorized(true)
      setLoading(false)
    }

    checkAdmin()
  }, [router])

  const handleAddUser = async () => {
    if (!email || !name || !password) {
      alert("All fields are required")
      return
    }

    // 1. Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error || !data.user) {
      console.error("Signup error:", error)
      alert("Signup failed: " + error?.message)
      return
    }

    const userId = data.user.id

    // 2. Insert into custom users table
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: userId,
        name,
        emoji,
        is_admin: isAdmin,
      },
    ])

    if (profileError) {
      console.error("Profile creation error:", profileError)
      alert("User created, but profile insert failed.")
    } else {
      alert("User successfully created!")
      setEmail("")
      setName("")
      setEmoji("🍻")
      setPassword("")
      setIsAdmin(false)
    }
  }

  if (loading) return <p className="p-4">Checking admin access...</p>
  if (!authorized) return null

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🙋 Admin: Add New User</h1>

      <input
        className="w-full border p-2 mb-4"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4"
        placeholder="Emoji (🍻, 🦩, 😎)"
        value={emoji}
        onChange={(e) => setEmoji(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          className="mr-2"
          checked={isAdmin}
          onChange={(e) => setIsAdmin(e.target.checked)}
        />
        Make admin
      </label>

      <button
        onClick={handleAddUser}
        className="w-full bg-green-600 text-white p-2 rounded"
      >
        Add User
      </button>
    </main>
  )
}
