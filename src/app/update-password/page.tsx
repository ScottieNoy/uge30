'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const hash = window.location.hash.substring(1) // remove #
    const params = new URLSearchParams(hash)
    const token = params.get('access_token')
    setAccessToken(token)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (!accessToken) {
      setMessage('No recovery token found.')
      setLoading(false)
      return
    }

    if (!password || password.length < 6) {
      setMessage('Password must be at least 6 characters long.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage('Error: ' + error.message)
    } else {
      setMessage('Password updated! Redirecting...')
      setTimeout(() => router.push('/'), 3000)
    }

    setLoading(false)
  }

  return (
    <main className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>

      {message && <p className="text-sm mb-4 text-red-600">{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="w-full border p-2 mb-4"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading || !accessToken}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </main>
  )
}
