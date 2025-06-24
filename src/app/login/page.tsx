'use client'

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)

    if (error) {
      setMessage("Login failed: " + error.message)
    } else {
      router.push("/my")
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Please enter your email first.")
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://klassement.uge30.dk/update-password", // <- adjust to match your app
      // redirectTo: "http://localhost:3000/update-password", // <- adjust to match your app
    })

    if (error) {
      setMessage("Reset failed: " + error.message)
    } else {
      setMessage("Check your email for a reset link.")
    }
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔐 Log In</h1>

      <input
        className="w-full border p-2 mb-4"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-2"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="text-sm text-right mb-4">
        <button
          type="button"
          className="text-blue-600 underline"
          onClick={handleForgotPassword}
        >
          Forgot password?
        </button>
      </div>

      {message && (
        <p className="text-sm text-center text-red-600 mb-4">{message}</p>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
    </main>
  )
}
