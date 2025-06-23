'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

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

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setLoggedIn(!!session)
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setLoggedIn(false)
    router.push("/")
  }

  return (
    <nav className="bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Slot */}
        <div className="flex items-center space-x-2">
          {/* Replace with: <img src="/logo.png" alt="UGE 30" className="h-8" /> if available */}
          <Link href="/" className="text-lg font-semibold tracking-tight text-gray-800 hover:text-black">
            <img src="/uge30-logo.png" alt="UGE 30 Logo" className="h-8" />
          </Link>
        </div>

        {/* Navigation links */}
        <div className="flex items-center space-x-2 flex-wrap">
          <NavItem href="/" label="Leaderboard" />
          <NavItem href="/log" label="Log" />
          <NavItem href="/jerseys" label="Jerseys" />
          <NavItem href="/my" label="Min side" />
          {isAdmin && (
            <>
              <NavItem href="/users/add" label="Tilføj" subtle />
              <NavItem href="/jerseys/edit" label="Rediger Jerseys" subtle />
            </>
          )}
          {loggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm px-4 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
            >
              Log ud
            </button>
          ) : (
            <NavItem href="/login" label="Login" />
          )}
        </div>
      </div>
    </nav>
  )
}

function NavItem({
  href,
  label,
  subtle = false,
}: {
  href: string
  label: string
  subtle?: boolean
}) {
  return (
    <Link
      href={href}
      className={`text-sm px-4 py-1 rounded-full transition ${
        subtle
          ? 'text-gray-400 hover:text-gray-600'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  )
}
