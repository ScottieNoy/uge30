'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()

  const [isAdmin, setIsAdmin] = useState(false)

useEffect(() => {
  supabase.auth.getSession().then(async ({ data }) => {
    const sessionUser = data.session?.user
    setLoggedIn(!!sessionUser)

    if (sessionUser) {
      const { data: userProfile } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", sessionUser.id)
        .single()

      setIsAdmin(userProfile?.is_admin || false)
    }
  })


    // Subscribe to session changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setLoggedIn(!!session)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setLoggedIn(false)
    router.push("/") // Redirect to homepage
  }

  return (
    <nav className="bg-black text-white p-4 mb-4">
      <div className="max-w-4xl mx-auto flex gap-4 items-center justify-between">
        <div className="flex gap-4">
          <Link href="/" className="hover:underline">🏆 Leaderboard</Link>
          <Link href="/log" className="hover:underline">➕ Log Points</Link>
          <Link href="/jerseys" className="hover:underline">👕 Jerseys</Link>
          {isAdmin && (
            <>
                <Link href="/users/add" className="hover:underline">🙋 Add User</Link>
                <Link href="/jerseys/edit" className="hover:underline">⚙️ Edit Jerseys</Link>
            </>
            )}
            <a href="/my/qr" className="hover:underline">
  QR kode
</a>

          <Link href="/my" className="hover:underline">👤 My Page</Link>
          
        </div>

        {loggedIn ? (
          <button onClick={handleLogout} className="hover:underline text-red-300">🚪 Logout</button>
        ) : (
          <Link href="/login" className="hover:underline">🔐 Login</Link>
        )}
      </div>
    </nav>
  )
}
