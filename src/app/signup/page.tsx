'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [emoji, setEmoji] = useState("🍻")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!email || !password || !firstname || !lastname) {
      return alert("Alle felter skal udfyldes")
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
        firstname,
        lastname,
        emoji,
      },
    ])

    setLoading(false)

    if (profileError) {
      alert("Bruger oprettet, men profil kunne ikke gemmes.")
      console.error(profileError)
    } else {
      alert("Tilmelding gennemført! Du kan nu logge ind.")
      setEmail("")
      setFirstname("")
      setLastname("")
      setEmoji("🍻")
      setPassword("")
    }
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🎉 Opret Bruger</h1>

      <input
        className="w-full border p-2 mb-4"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4"
        placeholder="Fornavn"
        value={firstname}
        onChange={e => setFirstname(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4"
        placeholder="Efternavn"
        value={lastname}
        onChange={e => setLastname(e.target.value)}
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
        placeholder="Adgangskode"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        disabled={loading}
        className="w-full bg-green-600 text-white p-2 rounded"
      >
        {loading ? "Opretter..." : "Opret Bruger"}
      </button>
    </main>
  )
}
