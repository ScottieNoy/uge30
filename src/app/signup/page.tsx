'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [emoji, setEmoji] = useState("🍻")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!email || !password || !name) {
      return alert("All fields are required")
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error || !data.user) {
      alert("Signup failed: " + error?.message)
      setLoading(false)
      return
    }

    const userId = data.user.id

    const { error: profileError } = await supabase.from("users").insert([
      {
        id: userId,
        name,
        emoji,
        is_admin: false, // new users are not admins by default
      },
    ])

    setLoading(false)

    if (profileError) {
      alert("User created, but profile failed to save.")
      console.error(profileError)
    } else {
      alert("Signup successful! You can now log in.")
      setEmail("")
      setName("")
      setEmoji("🍻")
      setPassword("")
    }
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎉 Sign Up</h1>

      <input
        className="w-full border p-2 mb-4"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4"
        placeholder="Your Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4"
        placeholder="Emoji (🍻, 🦩, 😎)"
        value={emoji}
        onChange={e => setEmoji(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full bg-green-600 text-white p-2 rounded"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </main>
  )
}
